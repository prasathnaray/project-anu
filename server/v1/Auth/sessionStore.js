const crypto = require('crypto');
const client = require('../utils/conn');

const REFRESH_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const createSession = async (user, deviceInfo = {}, ipAddress) => {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_LIFETIME_MS);
  await client.query(
    `INSERT INTO public.user_sessions
      (id, user_email, role, centre_id, device, os, login_source, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::inet, $9)`,
    [id, user.user_email, user.user_role, user.centre_id || null,
      String(deviceInfo.device || 'browser').slice(0, 40),
      String(deviceInfo.os || 'Unknown').slice(0, 40),
      deviceInfo.isVR ? 'VR Device' : 'Normal Browser',
      ipAddress || null, expiresAt]
  );
  return { id, expiresAt };
};

const getActiveSession = async (id, userEmail) => {
  if (!id) return null;
  const result = await client.query(
    `SELECT id, user_email, expires_at FROM public.user_sessions
     WHERE id = $1 AND user_email = $2 AND revoked_at IS NULL AND expires_at > now()`,
    [id, userEmail]
  );
  return result.rows[0] || null;
};

const touchSession = async (id) => {
  await client.query(
    `UPDATE public.user_sessions SET last_seen_at = now()
     WHERE id = $1 AND last_seen_at < now() - interval '1 minute'`,
    [id]
  );
};

const revokeSession = async (id, userEmail) => {
  const result = await client.query(
    `UPDATE public.user_sessions SET revoked_at = now()
     WHERE id = $1 AND user_email = $2 AND revoked_at IS NULL AND expires_at > now()
     RETURNING id`,
    [id, userEmail]
  );
  return result.rowCount > 0;
};

const revokeAllSessions = async (userEmail) => {
  const result = await client.query(
    `UPDATE public.user_sessions SET revoked_at = now()
     WHERE user_email = $1 AND revoked_at IS NULL AND expires_at > now()`,
    [userEmail]
  );
  return result.rowCount;
};

module.exports = { createSession, getActiveSession, touchSession, revokeSession, revokeAllSessions };
