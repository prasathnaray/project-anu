const express = require('express');
const { fromIni } = require('@aws-sdk/credential-providers');
const { CreateParticipantTokenCommand, IVSRealTimeClient } = require('@aws-sdk/client-ivs-realtime');
require("dotenv").config();
const ivsClientt = new IVSRealTimeClient({ 
  region: 'ap-south-1',
  //credentials: fromIni({ profile: 'default' })
  credentials: {
    accessKeyId: process.env.AWS_IVS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IVS_SECRET_KEY,
  },
});
const generateToken = async(stageArn, userId, capabilities, attributes, duration) => {
  const command = new CreateParticipantTokenCommand({
    stageArn,
    userId,
    capabilities,
    attributes,
    duration
  });
  return await ivsClientt.send(command);
};
module.exports = generateToken;

// POST /token route
// app.post('/token', async (req, res) => {
//   try {
//     const { stageArn, userId, capabilities, attributes, duration } = req.body;

//     const tokenResponse = await generateToken(
//       stageArn,
//       userId || "user-" + Math.random().toString(36).substring(2, 8),
//       capabilities || ["PUBLISH", "SUBSCRIBE"],
//       attributes || {},
//       duration || 720
//     );

//     res.status(200).json(tokenResponse);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });