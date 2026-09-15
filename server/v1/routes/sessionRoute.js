const express = require('express');
const client = require('../utils/conn');
const { canManageSessions } = require('../Auth/sessionAuthorization');
const { revokeSession, revokeAllSessions } = require('../Auth/sessionStore');

const router = express.Router();
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const clearRefreshCookie = (res) => res.clearCookie('refreshToken', {
  httpOnly: true, secure: true, sameSite: 'None', path: '/'
});

const targetFor = async (req, res) => {
  const result = await client.query(
    `SELECT user_email, user_name, user_role, centre_id FROM public.user_data
     WHERE user_email = $1`,
    [req.params.email]
  );
  const target = result.rows[0];
  if (!target) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  if (!canManageSessions(req.user, target)) {
    res.status(403).json({ message: 'You cannot manage this user’s sessions' });
    return null;
  }
  return target;
};

const handler = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

router.get('/me', handler(async (req, res) => {
  req.params.email = req.user.user_mail;
  const target = await targetFor(req, res);
  if (!target) return;
  const result = await client.query(
    `SELECT id, device, os, login_source, logged_in_at, last_seen_at,
            expires_at, revoked_at,
            CASE WHEN revoked_at IS NOT NULL THEN 'ended'
                 WHEN expires_at <= now() THEN 'expired' ELSE 'active' END AS status
     FROM public.user_sessions
     WHERE user_email = $1 AND (revoked_at IS NULL AND expires_at > now()
       OR logged_in_at > now() - interval '30 days')
     ORDER BY CASE WHEN revoked_at IS NULL AND expires_at > now() THEN 0 ELSE 1 END,
              logged_in_at DESC LIMIT 200`,
    [target.user_email]
  );
  res.json({ user: target, currentSessionId: req.user.sid, sessions: result.rows });
}));

router.get('/users', handler(async (req, res) => {
  const role = Number(req.user.role);
  if (![99, 101].includes(role)) return res.status(403).json({ message: 'Not permitted' });
  const search = String(req.query.search || '').trim().slice(0, 100);
  const escaped = search.replace(/[\\%_]/g, '\\$&');
  const result = await client.query(
    `SELECT user_email, user_name, user_role, centre_id FROM public.user_data
     WHERE ($1::int = 99 OR centre_id = $2::uuid)
       AND (user_email ILIKE $3 ESCAPE '\\' OR user_name ILIKE $3 ESCAPE '\\')
     ORDER BY user_name, user_email LIMIT 50`,
    [role, req.user.centre_id || null, `%${escaped}%`]
  );
  res.json({ users: result.rows });
}));

router.get('/users/:email', handler(async (req, res) => {
  const target = await targetFor(req, res);
  if (!target) return;
  const result = await client.query(
    `SELECT id, device, os, login_source, logged_in_at, last_seen_at,
            expires_at, revoked_at,
            CASE WHEN revoked_at IS NOT NULL THEN 'ended'
                 WHEN expires_at <= now() THEN 'expired' ELSE 'active' END AS status
     FROM public.user_sessions
     WHERE user_email = $1 AND (revoked_at IS NULL AND expires_at > now()
       OR logged_in_at > now() - interval '30 days')
     ORDER BY CASE WHEN revoked_at IS NULL AND expires_at > now() THEN 0 ELSE 1 END,
              logged_in_at DESC LIMIT 200`,
    [target.user_email]
  );
  res.json({ user: target, currentSessionId: req.user.sid, sessions: result.rows });
}));

router.delete('/users/:email/:id', handler(async (req, res) => {
  if (!isUuid(req.params.id)) return res.status(400).json({ message: 'Invalid session ID' });
  const target = await targetFor(req, res);
  if (!target) return;
  const ended = await revokeSession(req.params.id, target.user_email);
  if (!ended) return res.status(404).json({ message: 'Active session not found' });
  const currentSessionEnded = req.user.sid === req.params.id;
  if (currentSessionEnded) clearRefreshCookie(res);
  res.json({ ended: true, currentSessionEnded });
}));

router.post('/users/:email/logout-all', handler(async (req, res) => {
  const target = await targetFor(req, res);
  if (!target) return;
  const ended = await revokeAllSessions(target.user_email);
  const currentSessionEnded = req.user.user_mail === target.user_email;
  if (currentSessionEnded) clearRefreshCookie(res);
  res.json({ ended, currentSessionEnded });
}));

router.post('/logout', handler(async (req, res) => {
  await revokeSession(req.user.sid, req.user.user_mail);
  clearRefreshCookie(res);
  res.json({ ended: true, currentSessionEnded: true });
}));

module.exports = router;
