import { IvsClient, GetChannelCommand } from "@aws-sdk/client-ivs";

const ivsClient = new IvsClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_IVS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

module.exports = ivsClient;