const fs = require('node:fs');
const path = require('node:path');
const tls = require('node:tls');

function databaseConfig(env = process.env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  let url;
  try { url = new URL(env.DATABASE_URL); } catch { throw new Error('DATABASE_URL must be a valid PostgreSQL URL'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('DATABASE_URL must use PostgreSQL');
  // pg parses URL TLS options after the explicit config; do not let them
  // replace certificate verification or inject an alternative trust source.
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('ssl') || key.toLowerCase() === 'uselibpqcompat') url.searchParams.delete(key);
  }
  if (env.DATABASE_CA_CERT && env.DATABASE_CA_FILE) throw new Error('Set only DATABASE_CA_CERT or DATABASE_CA_FILE');
  const ca = env.DATABASE_CA_CERT?.replace(/\\n/g, '\n') ||
    (env.DATABASE_CA_FILE ? fs.readFileSync(path.resolve(__dirname, '..', env.DATABASE_CA_FILE), 'utf8') : undefined);
  if (ca) {
    if (!ca.includes('-----BEGIN CERTIFICATE-----')) throw new Error('Database CA must contain PEM certificates');
    tls.createSecureContext({ ca });
  }
  return { connectionString: url.toString(), ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) } };
}

module.exports = { databaseConfig };
