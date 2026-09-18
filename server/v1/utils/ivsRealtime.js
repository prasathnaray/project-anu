const { IVSRealTimeClient } = require('@aws-sdk/client-ivs-realtime');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const credentials = process.env.AWS_IVS_ACCESS_KEY && process.env.AWS_IVS_SECRET_KEY
  ? {
      accessKeyId: process.env.AWS_IVS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_IVS_SECRET_KEY
    }
  : undefined;

module.exports = new IVSRealTimeClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  ...(credentials ? { credentials } : {})
});
