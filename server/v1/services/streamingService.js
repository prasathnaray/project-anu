const { randomUUID } = require('crypto');
const {
  CreateParticipantTokenCommand,
  CreateStageCommand,
  DeleteStageCommand,
  DisconnectParticipantCommand,
  StartParticipantReplicationCommand,
  StopParticipantReplicationCommand
} = require('@aws-sdk/client-ivs-realtime');
const db = require('../utils/conn');
const ivs = require('../utils/ivsRealtime');
const { HttpError } = require('../Auth/authorization');
const { requirePublisher, requireViewer, traineeUserId } = require('./streamingPolicy');

const configuredTokenDuration = Number(process.env.AWS_IVS_TOKEN_DURATION_MINUTES || 720);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN_DURATION_MINUTES = Number.isInteger(configuredTokenDuration)
  && configuredTokenDuration >= 1
  && configuredTokenDuration <= 20160
  ? configuredTokenDuration
  : 720;

const isMissingIvsResource = (error) =>
  error?.name === 'ResourceNotFoundException' || error?.$metadata?.httpStatusCode === 404;

const isIvsConflict = (error) =>
  error?.name === 'ConflictException' || error?.$metadata?.httpStatusCode === 409;

const isIvsCapacityError = (error) =>
  error?.name === 'ServiceQuotaExceededException' || error?.$metadata?.httpStatusCode === 402;

const currentUser = async (requester) => {
  const result = await db.query(
    `SELECT user_email, user_name, people_id, user_role, centre_id
       FROM public.user_data
      WHERE user_email = $1 AND lower(status) = 'active'`,
    [requester.user_mail]
  );
  const user = result.rows[0];
  if (!user) throw new HttpError(401, 'Your account is not active.');
  if (String(user.centre_id || '') !== String(requester.centre_id || '')) {
    throw new HttpError(403, 'Your account is not linked to this institution.');
  }
  return user;
};

const createStage = async (name) => {
  const created = await ivs.send(new CreateStageCommand({ name }));
  const stageArn = created.stage?.arn;
  if (!stageArn) throw new Error('AWS IVS did not return a stage ARN.');
  return stageArn;
};

const ensureStageRecord = async ({
  lockKey,
  selectQuery,
  selectValues,
  insertQuery,
  insertValues,
  stageName,
  onExisting
}) => {
  const connection = await db.connect();
  let createdStageArn = null;
  try {
    await connection.query('BEGIN');
    await connection.query('SELECT pg_advisory_xact_lock(hashtext($1))', [lockKey]);
    const existing = await connection.query(selectQuery, selectValues);
    if (existing.rows[0]) {
      if (onExisting) await onExisting(connection, existing.rows[0]);
      await connection.query('COMMIT');
      return existing.rows[0].stage_arn;
    }

    createdStageArn = await createStage(stageName);
    await connection.query(insertQuery, insertValues(createdStageArn));
    await connection.query('COMMIT');
    return createdStageArn;
  } catch (error) {
    await connection.query('ROLLBACK').catch(() => {});
    if (createdStageArn) {
      await ivs.send(new DeleteStageCommand({ arn: createdStageArn })).catch(() => {});
    }
    throw error;
  } finally {
    connection.release();
  }
};

const ensureCentreStage = (centreId) => ensureStageRecord({
  lockKey: `stream-stage:${centreId}`,
  selectQuery: 'SELECT stage_arn FROM public.streaming_stages WHERE centre_id = $1',
  selectValues: [centreId],
  insertQuery: `INSERT INTO public.streaming_stages (centre_id, stage_arn)
                VALUES ($1, $2)`,
  insertValues: (stageArn) => [centreId, stageArn],
  stageName: `scan-center-${centreId}`
});

const ensureTraineeStage = (user) => ensureStageRecord({
  lockKey: `stream-trainee-stage:${user.user_email}`,
  selectQuery: 'SELECT stage_arn FROM public.streaming_trainee_stages WHERE user_email = $1',
  selectValues: [user.user_email],
  insertQuery: `INSERT INTO public.streaming_trainee_stages (user_email, centre_id, stage_arn)
                VALUES ($1, $2, $3)`,
  insertValues: (stageArn) => [user.user_email, user.centre_id, stageArn],
  stageName: `trainee-${user.people_id}`,
  onExisting: (connection) => connection.query(
    `UPDATE public.streaming_trainee_stages
        SET centre_id = $2, updated_at = now()
      WHERE user_email = $1 AND centre_id IS DISTINCT FROM $2`,
    [user.user_email, user.centre_id]
  )
});

const createParticipantToken = async ({ stageArn, userId, capabilities, attributes }) => {
  const response = await ivs.send(new CreateParticipantTokenCommand({
    stageArn,
    userId,
    capabilities,
    attributes,
    duration: TOKEN_DURATION_MINUTES
  }));
  const participant = response.participantToken;
  if (!participant?.token || !participant?.participantId) {
    throw new Error('AWS IVS did not return a participant token.');
  }
  return participant;
};

const createCentreParticipantToken = async (centreId, tokenOptions) => {
  let stageArn = await ensureCentreStage(centreId);
  try {
    return { stageArn, participant: await createParticipantToken({ stageArn, ...tokenOptions }) };
  } catch (error) {
    if (!isMissingIvsResource(error)) throw error;
    await db.query(
      'DELETE FROM public.streaming_stages WHERE centre_id = $1 AND stage_arn = $2',
      [centreId, stageArn]
    );
    stageArn = await ensureCentreStage(centreId);
    return { stageArn, participant: await createParticipantToken({ stageArn, ...tokenOptions }) };
  }
};

const createTraineeParticipantToken = async (user, tokenOptions) => {
  let stageArn = await ensureTraineeStage(user);
  try {
    return { stageArn, participant: await createParticipantToken({ stageArn, ...tokenOptions }) };
  } catch (error) {
    if (!isMissingIvsResource(error)) throw error;
    await db.query(
      'DELETE FROM public.streaming_trainee_stages WHERE user_email = $1 AND stage_arn = $2',
      [user.user_email, stageArn]
    );
    stageArn = await ensureTraineeStage(user);
    return { stageArn, participant: await createParticipantToken({ stageArn, ...tokenOptions }) };
  }
};

const disconnect = async (stageArn, participantId, reason) => {
  if (!stageArn || !participantId) return;
  try {
    await ivs.send(new DisconnectParticipantCommand({ stageArn, participantId, reason }));
  } catch (error) {
    if (!isMissingIvsResource(error)) throw error;
  }
};

const stopReplication = async (sourceStageArn, destinationStageArn, participantId) => {
  if (!sourceStageArn || !destinationStageArn || !participantId) return;
  try {
    await ivs.send(new StopParticipantReplicationCommand({
      sourceStageArn,
      destinationStageArn,
      participantId
    }));
  } catch (error) {
    if (!isMissingIvsResource(error) && !isIvsConflict(error)) throw error;
  }
};

const cleanUpPublisher = async (publisher, destinationStageArn, reason) => {
  if (!publisher) return;
  if (publisher.activated_at) {
    await stopReplication(publisher.source_stage_arn, destinationStageArn, publisher.participant_id);
  }
  await disconnect(publisher.source_stage_arn || destinationStageArn, publisher.participant_id, reason);
};

const createPublisherSession = async (requester) => {
  const centreId = requirePublisher(requester);
  const user = await currentUser(requester);
  const destinationStageArn = await ensureCentreStage(centreId);
  const { stageArn: sourceStageArn, participant } = await createTraineeParticipantToken(user, {
    userId: traineeUserId(user.people_id),
    capabilities: ['PUBLISH'],
    attributes: { role: 'trainee' }
  });
  const sessionId = randomUUID();
  const connection = await db.connect();

  try {
    await connection.query('BEGIN');
    await connection.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`stream-publisher:${user.user_email}`]);
    const existing = await connection.query(
      `SELECT participant_id, source_stage_arn, activated_at
         FROM public.streaming_publishers
        WHERE user_email = $1
        FOR UPDATE`,
      [user.user_email]
    );
    await cleanUpPublisher(existing.rows[0], destinationStageArn, 'Replaced by a newer trainee session');
    await connection.query(
      `INSERT INTO public.streaming_publishers
         (user_email, centre_id, session_id, participant_id, source_stage_arn, activated_at, started_at)
       VALUES ($1, $2, $3, $4, $5, NULL, now())
       ON CONFLICT (user_email) DO UPDATE SET
         centre_id = EXCLUDED.centre_id,
         session_id = EXCLUDED.session_id,
         participant_id = EXCLUDED.participant_id,
         source_stage_arn = EXCLUDED.source_stage_arn,
         activated_at = NULL,
         started_at = now()`,
      [user.user_email, centreId, sessionId, participant.participantId, sourceStageArn]
    );
    await connection.query('COMMIT');
  } catch (error) {
    await connection.query('ROLLBACK').catch(() => {});
    await disconnect(sourceStageArn, participant.participantId, 'Publisher session setup failed').catch(() => {});
    throw error;
  } finally {
    connection.release();
  }

  return {
    sessionId,
    token: participant.token,
    participantId: participant.participantId,
    expiresAt: participant.expirationTime
  };
};

const activatePublisherSession = async (requester, sessionId) => {
  const centreId = requirePublisher(requester);
  if (!UUID_PATTERN.test(sessionId || '')) throw new HttpError(400, 'A valid publisher session ID is required.');
  await currentUser(requester);
  const destinationStageArn = await ensureCentreStage(centreId);
  const connection = await db.connect();

  try {
    await connection.query('BEGIN');
    await connection.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`stream-publisher:${requester.user_mail}`]);
    const current = await connection.query(
      `SELECT participant_id, source_stage_arn, activated_at
         FROM public.streaming_publishers
        WHERE user_email = $1 AND centre_id = $2 AND session_id = $3
        FOR UPDATE`,
      [requester.user_mail, centreId, sessionId]
    );
    const publisher = current.rows[0];
    if (!publisher) throw new HttpError(404, 'Publisher session was not found.');
    if (publisher.activated_at) {
      await connection.query('COMMIT');
      return;
    }

    try {
      await ivs.send(new StartParticipantReplicationCommand({
        sourceStageArn: publisher.source_stage_arn,
        destinationStageArn,
        participantId: publisher.participant_id,
        reconnectWindowSeconds: 30,
        attributes: { role: 'trainee' }
      }));
    } catch (error) {
      if (isIvsCapacityError(error)) {
        throw new HttpError(409, 'This scan center already has the maximum number of active trainee streams.');
      }
      if (isIvsConflict(error) || isMissingIvsResource(error)) {
        throw new HttpError(409, 'The VR stream is not publishing yet. Retry activation shortly.');
      }
      throw error;
    }

    await connection.query(
      `UPDATE public.streaming_publishers
          SET activated_at = now()
        WHERE user_email = $1 AND session_id = $2`,
      [requester.user_mail, sessionId]
    );
    await connection.query('COMMIT');
  } catch (error) {
    await connection.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    connection.release();
  }
};

const stopPublisherSession = async (requester, sessionId) => {
  const centreId = requirePublisher(requester);
  if (!UUID_PATTERN.test(sessionId || '')) throw new HttpError(400, 'A valid publisher session ID is required.');
  const destinationStageArn = await ensureCentreStage(centreId);
  const connection = await db.connect();
  try {
    await connection.query('BEGIN');
    await connection.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`stream-publisher:${requester.user_mail}`]);
    const current = await connection.query(
      `SELECT participant_id, source_stage_arn, activated_at
         FROM public.streaming_publishers
        WHERE user_email = $1 AND centre_id = $2 AND session_id = $3
        FOR UPDATE`,
      [requester.user_mail, centreId, sessionId]
    );
    if (!current.rows[0]) {
      await connection.query('COMMIT');
      return;
    }
    await cleanUpPublisher(current.rows[0], destinationStageArn, 'Trainee stopped streaming');
    await connection.query(
      'DELETE FROM public.streaming_publishers WHERE user_email = $1 AND session_id = $2',
      [requester.user_mail, sessionId]
    );
    await connection.query('COMMIT');
  } catch (error) {
    await connection.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    connection.release();
  }
};

const createSelfViewerSession = async (requester) => {
  requirePublisher(requester);
  const user = await currentUser(requester);
  const { participant } = await createTraineeParticipantToken(user, {
    userId: `self-viewer:${randomUUID()}`,
    capabilities: ['SUBSCRIBE'],
    attributes: { role: 'trainee-self-viewer' }
  });

  return {
    token: participant.token,
    expiresAt: participant.expirationTime,
    publisherUserId: traineeUserId(user.people_id)
  };
};

const createViewerSession = async (requester) => {
  const centreId = requireViewer(requester);
  await currentUser(requester);
  const [tokenResult, trainees] = await Promise.all([
    createCentreParticipantToken(centreId, {
      userId: `viewer:${randomUUID()}`,
      capabilities: ['SUBSCRIBE'],
      attributes: { role: 'institution-admin' }
    }),
    db.query(
      `SELECT people_id, user_name
         FROM public.user_data
        WHERE centre_id = $1 AND user_role = '103' AND lower(status) = 'active' AND people_id IS NOT NULL
        ORDER BY user_name`,
      [centreId]
    )
  ]);

  return {
    token: tokenResult.participant.token,
    expiresAt: tokenResult.participant.expirationTime,
    trainees: trainees.rows.map((trainee) => ({
      userId: traineeUserId(trainee.people_id),
      name: trainee.user_name
    }))
  };
};

module.exports = {
  createPublisherSession,
  activatePublisherSession,
  stopPublisherSession,
  createSelfViewerSession,
  createViewerSession
};
