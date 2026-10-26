const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const serverlessExpress = require('@codegenie/serverless-express');

let serverPromise;

const loadRuntimeSecrets = async () => {
    const secretId = process.env.LAMBDA_SECRET_ID;
    if (!secretId) return;

    const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-south-1' });
    const result = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
    if (!result.SecretString) throw new Error(`Secret ${secretId} has no SecretString value`);

    const values = JSON.parse(result.SecretString);
    for (const [key, value] of Object.entries(values)) {
        if (value !== undefined && value !== null) process.env[key] = String(value);
    }
};

const getServer = async () => {
    if (!serverPromise) {
        serverPromise = (async () => {
            await loadRuntimeSecrets();
            const app = require('./app');
            return serverlessExpress({ app });
        })();
    }
    return serverPromise;
};

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const server = await getServer();
    return server(event, context);
};
