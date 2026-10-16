const crypto = require('node:crypto');
const path = require('node:path');
const client = require('./conn');
const { normalizeEmail, emailLookup, decryptPii } = require('./userEmailCrypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const OTP_TTL_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const hashOtp = (lookup, purpose, otp) => crypto
  .createHmac('sha256', process.env.OTP_SECRET || process.env.ACCESS_TOKEN_SECRET)
  .update(`${lookup}:${purpose}:${otp}`, 'utf8')
  .digest('hex');

const validPhoneNumber = (value) => {
  const phone = String(value || '').replace(/[\s()-]/g, '');
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
};

const sendOtpSms = async (phoneNumber, otp, purpose) => {
  const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
  const accessKeyId = process.env.AWS_SNS_ACCESS_KEY_ID
    || process.env.AWS_ACCESS_KEY_ID
    || process.env.AWS_IVS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SNS_SECRET_ACCESS_KEY
    || process.env.AWS_SECRET_ACCESS_KEY
    || process.env.AWS_IVS_SECRET_KEY;
  const snsConfig = {
    region: process.env.AWS_REGION || 'ap-south-1',
    maxAttempts: 1
  };
  if (accessKeyId && secretAccessKey) {
    snsConfig.credentials = { accessKeyId, secretAccessKey };
  }
  const sns = new SNSClient(snsConfig);
  const attributes = {
    'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Transactional' }
  };
  if (process.env.AWS_SNS_SENDER_ID) {
    attributes['AWS.SNS.SMS.SenderID'] = { DataType: 'String', StringValue: process.env.AWS_SNS_SENDER_ID };
  }
  if (process.env.AWS_SNS_ENTITY_ID) {
    attributes['AWS.MM.SMS.EntityId'] = { DataType: 'String', StringValue: process.env.AWS_SNS_ENTITY_ID };
  }
  if (process.env.AWS_SNS_TEMPLATE_ID) {
    attributes['AWS.MM.SMS.TemplateId'] = { DataType: 'String', StringValue: process.env.AWS_SNS_TEMPLATE_ID };
  }

  const action = purpose === 'reactivation' ? 'reactivate your account' : 'activate your account';
  const timeoutMs = Number(process.env.SNS_TIMEOUT_MS) || 2500;
  const publishPromise = sns.send(new PublishCommand({
    PhoneNumber: phoneNumber,
    Message: `Project Anu OTP: ${otp}. Use this code to ${action}. It expires in ${OTP_TTL_MINUTES} minutes.`,
    MessageAttributes: attributes
  }));

  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(`SNS SMS delivery timed out after ${timeoutMs}ms`);
      err.name = 'TimeoutError';
      reject(err);
    }, timeoutMs);
  });

  const result = await Promise.race([publishPromise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
  return result.MessageId;
};

const issueAccountVerificationOtp = async (email, purpose = 'activation') => {
  const normalizedEmail = normalizeEmail(email);
  const lookup = emailLookup(normalizedEmail);
  const userResult = await client.query(
    `SELECT user_email_lookup, user_contact_num, user_contact_num_enc, status
       FROM public.user_data
      WHERE user_email_lookup = $1
        AND status = $2`,
    [lookup, purpose === 'reactivation' ? 'pending_reverification' : 'pending_verification']
  );
  const user = userResult.rows[0];
  if (!user) return { sent: false, code: 202 };

  const rawPhone = user.user_contact_num || (user.user_contact_num_enc
    ? decryptPii(user.user_contact_num_enc, 'user_contact_num')
    : null);
  const phone = validPhoneNumber(rawPhone);
  if (!phone) {
    const error = new Error('The user phone number must be in E.164 format, for example +919876543210');
    error.code = 422;
    throw error;
  }

  const recent = await client.query(
    `SELECT challenge_id FROM public.account_verification_challenges
      WHERE user_email_lookup = $1 AND purpose = $2 AND consumed_at IS NULL
        AND created_at > now() - ($3 || ' seconds')::interval
      ORDER BY created_at DESC LIMIT 1`,
    [lookup, purpose, RESEND_COOLDOWN_SECONDS]
  );
  if (recent.rows.length) {
    const error = new Error('Please wait before requesting another OTP');
    error.code = 429;
    throw error;
  }

  await client.query(
    `UPDATE public.account_verification_challenges
        SET consumed_at = now()
      WHERE user_email_lookup = $1 AND purpose = $2 AND consumed_at IS NULL`,
    [lookup, purpose]
  );

  const otp = String(crypto.randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await client.query(
    `INSERT INTO public.account_verification_challenges
      (user_email_lookup, purpose, otp_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [lookup, purpose, hashOtp(lookup, purpose, otp), expiresAt]
  );

  try {
    const messageId = await sendOtpSms(phone, otp, purpose);
    return { sent: true, code: 200, messageId };
  } catch (error) {
    console.error('SNS OTP delivery failed:', {
      name: error.name,
      code: error.code,
      message: error.message,
      httpStatusCode: error.$metadata?.httpStatusCode
    });
    await client.query(
      `UPDATE public.account_verification_challenges
          SET consumed_at = now()
        WHERE user_email_lookup = $1 AND purpose = $2 AND otp_hash = $3 AND consumed_at IS NULL`,
      [lookup, purpose, hashOtp(lookup, purpose, otp)]
    );
    throw error;
  }
};

const verifyAccountOtp = async (email, otp, purpose = 'activation') => {
  const lookup = emailLookup(normalizeEmail(email));
  const normalizedOtp = String(otp || '').trim();
  if (!/^\d{6}$/.test(normalizedOtp)) return { verified: false, code: 400, message: 'Invalid OTP' };

  const db = await client.connect();
  try {
    await db.query('BEGIN');
    const challengeResult = await db.query(
      `SELECT challenge_id, otp_hash, attempt_count
         FROM public.account_verification_challenges
        WHERE user_email_lookup = $1 AND purpose = $2 AND consumed_at IS NULL
          AND expires_at > now()
        ORDER BY created_at DESC LIMIT 1
        FOR UPDATE`,
      [lookup, purpose]
    );
    const challenge = challengeResult.rows[0];
    if (!challenge || challenge.attempt_count >= OTP_MAX_ATTEMPTS) {
      await db.query('ROLLBACK');
      return { verified: false, code: 400, message: 'Invalid or expired OTP' };
    }

    const expected = Buffer.from(challenge.otp_hash, 'hex');
    const actual = Buffer.from(hashOtp(lookup, purpose, normalizedOtp), 'hex');
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      await db.query(
        `UPDATE public.account_verification_challenges SET attempt_count = attempt_count + 1 WHERE challenge_id = $1`,
        [challenge.challenge_id]
      );
      await db.query('COMMIT');
      return { verified: false, code: 400, message: 'Invalid or expired OTP' };
    }

    const updateResult = await db.query(
      `UPDATE public.user_data
          SET status = 'active', verification_required = false,
              phone_verified_at = COALESCE(phone_verified_at, now())
        WHERE user_email_lookup = $1 AND status IN ('pending_verification', 'pending_reverification')
        RETURNING people_id`,
      [lookup]
    );
    if (!updateResult.rowCount) {
      await db.query('ROLLBACK');
      return { verified: false, code: 409, message: 'Account is not awaiting verification' };
    }
    await db.query(
      `UPDATE public.account_verification_challenges SET consumed_at = now() WHERE challenge_id = $1`,
      [challenge.challenge_id]
    );
    await db.query('COMMIT');
    return { verified: true, code: 200, message: 'Account verified successfully' };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
};

module.exports = { issueAccountVerificationOtp, verifyAccountOtp, validPhoneNumber };
