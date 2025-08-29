const { IvsClient, GetChannelCommand } = require("@aws-sdk/client-ivs");
require('dotenv').config();
const ivsClient = new IvsClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_IVS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_IVS_SECRET_KEY
    }
})
module.exports = ivsClient;