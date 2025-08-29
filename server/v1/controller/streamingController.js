const ivsClient = require('../utils/ivssetup');
const { GetChannelCommand, GetStreamCommand} = require("@aws-sdk/client-ivs");
const generateToken = require('../utils/generateIvsToken');
const getIndividualStreamingData = async(req, res) => {
    // try
    // {
    //             const result = await ivsClient.send(new GetChannelCommand({arn: process.env.AWS_IVS_CHANNEL_ARN}));
    //             res.status(200).json({ 
    //                url: result?.channel?.playbackUrl,
    //                //data: result
    //             });
    // }
    // catch(err)
    // {
    //         console.error("Error fetching playback URL:", err);
    //         res.status(500).send(err)  
    // }

//state
     try {
    const result = await ivsClient.send(
      new GetStreamCommand({ channelArn: process.env.AWS_IVS_CHANNEL_ARN })
    );

    // If stream exists
    if (result.stream) {
      res.status(200).json({ 
        state: "LIVE",
        playbackUrl: result.stream.playbackUrl,
        data: result
      });
    }
  } catch (err) {
    // AWS throws ChannelNotBroadcasting when no live stream
    if (err.Code === "ChannelNotBroadcasting") {
      res.status(200).json({ state: "OFFLINE", playbackUrl: null });
    } else {
      console.error("Error fetching playback URL:", err);
      res.status(500).send(err);
    }
  }
} 


const tokenIvs = async(req, res) => {
    const {stageArn, userId, capabilities, attributes, duration} = req.body;
    try
    {
         const tokenResponse = await generateToken(
            stageArn,
            userId || "user-" + Math.random().toString(36).substring(2, 8),
            capabilities || ["PUBLISH", "SUBSCRIBE"],
            attributes || {},
            duration || 720
        );
        res.status(200).json(tokenResponse);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {getIndividualStreamingData, tokenIvs}