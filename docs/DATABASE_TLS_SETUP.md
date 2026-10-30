# Database TLS verification

The v1 API and its two standalone database maintenance scripts now require certificate verification and hostname validation. DATABASE_URL is required; no embedded password fallback remains. URL SSL options cannot override the verification policy.

## Required certificate setup

The live connection test returned SELF_SIGNED_CERT_IN_CHAIN with Node's default trusted authorities. Before restarting the API, download the project's CA certificate from Supabase Dashboard > Database Settings > SSL Configuration. Obtain it from the authenticated provider dashboard, not from the unverified database connection.

Place the public CA certificate at server/v1/certs/supabase-ca.crt and set this in server/v1/.env:

```env
DATABASE_CA_FILE=certs/supabase-ca.crt
```

Alternatively set DATABASE_CA_CERT to the PEM certificate text. Do not set both variables. Literal escaped newline sequences are supported for secret storage. Do not include a private key.

For Lambda, add DATABASE_CA_CERT to the existing runtime secret, or bundle the certificate file and configure DATABASE_CA_FILE. Do this before deploying the updated code. No production configuration has been changed by this task.

## Verification

From server/v1 run:

```powershell
node scripts/verifyDatabaseTls.js
```

The check requires an encrypted, authorized TLS connection and runs only SELECT 1. It prints no credentials. A certificate verification failure is an intentional connection refusal; do not set rejectUnauthorized to false to work around it.

Official guidance: https://supabase.com/docs/guides/platform/ssl-enforcement

The previously embedded database credential has been removed from current source, but removal does not rotate it or erase Git history. Credential rotation remains a separate task.
