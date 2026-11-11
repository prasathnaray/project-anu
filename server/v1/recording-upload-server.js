// Run as a long-lived container, with its HTTPS ingress bypassing API Gateway.
async function start() {
    if (process.env.LAMBDA_SECRET_ID) {
        const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
        const result = await new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-south-1' })
            .send(new GetSecretValueCommand({ SecretId: process.env.LAMBDA_SECRET_ID }));
        for (const [key, value] of Object.entries(JSON.parse(result.SecretString))) {
            if (value != null && process.env[key] === undefined) process.env[key] = String(value);
        }
    }
    const express = require('express');
    const app = express();
    app.disable('x-powered-by');
    app.get(['/health', '/upload-health'], (_req, res) => res.json({ status: 'ok', service: 'recording-upload' }));
    app.use('/api/v1', require('./Auth/authenticate'), require('./routes/singleRecordingUpload').createRouter());
    app.use((error, _req, res, _next) => res.status(500).json({ message: 'Upload service unavailable. Please retry.' }));
    const server = app.listen(Number(process.env.PORT || 4004));
    server.requestTimeout = 30 * 60 * 1000;
    server.timeout = 30 * 60 * 1000;
    process.on('SIGTERM', () => server.close(() => process.exit(0)));
    return server;
}
if (require.main === module) start().catch(error => { console.error('Upload server startup failed:', error.name); process.exit(1); });
module.exports = { start };
