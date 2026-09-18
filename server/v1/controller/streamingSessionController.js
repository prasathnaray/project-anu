const streaming = require('../services/streamingService');
const { HttpError } = require('../Auth/authorization');

const sendError = (res, error) => {
  const status = error instanceof HttpError ? error.statusCode : 500;
  if (status === 500) console.error('Streaming request failed', error);
  return res.status(status).json({ message: status === 500 ? 'Streaming service is temporarily unavailable.' : error.message });
};

const createLegacyPublisherSession = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const session = await streaming.createPublisherSession(req.user);
    return res.status(200).json({
      result: {
        data: {
          token: session.token,
          participantId: session.participantId,
          expirationTime: session.expiresAt
        },
        sessionId: session.sessionId
      }
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const activatePublisherSession = async (req, res) => {
  try {
    await streaming.activatePublisherSession(req.user, req.params.sessionId);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
};

const stopPublisherSession = async (req, res) => {
  try {
    await streaming.stopPublisherSession(req.user, req.params.sessionId);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
};

const createViewerSession = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    return res.status(201).json(await streaming.createViewerSession(req.user));
  } catch (error) {
    return sendError(res, error);
  }
};

const createSelfViewerSession = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    return res.status(201).json(await streaming.createSelfViewerSession(req.user));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createLegacyPublisherSession,
  activatePublisherSession,
  stopPublisherSession,
  createSelfViewerSession,
  createViewerSession
};
