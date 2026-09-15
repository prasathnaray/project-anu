// const jwt = require('jsonwebtoken');
// const LoginModel = require('./authModel')
// const LoginRequest = async(req, res) => {
//     const {user_mail, user_password} = req.body;
//     try
//     {
//         if(!user_mail || !user_password)
//         {
//             res.status(400).json({
//                 statusDescrip: 'All fields are required',
//                 code: 400
//             })
//         }
//         else
//         {
//             const result = await LoginModel(user_mail, user_password);
//             if(result.code == 200)
//             {
//                 res.cookie('refreshToken', result.refreshToken, {
//                     httpOnly: true,
//                     secure: true,
//                     sameSite: 'None',
//                     maxAge: 7 * 24 * 60 * 60 * 1000,
//                 });
//                 return res.status(200).send(result)
//             }
//             else if(result.code == 401)
//             {
//                 res.status(401).send(result)
//             }
//             else if(result.code == 404)
//             {
//                 res.status(404).send(result)
//             }
//         }
//     }
//     catch(err)
//     {
//         res.status(500).json(err);
//     }
// }
// module.exports = LoginRequest;
const jwt = require("jsonwebtoken");
const LoginModel = require("./authModel");
const { revokeSession } = require('./sessionStore');

const LoginRequest = async (req, res) => {
  const { user_mail, user_password } = req.body;

  try {
    if (!user_mail || !user_password) {
      return res.status(400).json({
        statusDescrip: "All fields are required",
        code: 400,
      });
    }

    // Call your model
    const result = await LoginModel(user_mail, user_password, req.deviceInfo, req.ip);

    if (result.code === 200) {
      const previousToken = req.cookies?.refreshToken;
      if (previousToken) {
        try {
          const previous = jwt.verify(previousToken, process.env.REFRESH_TOKEN_SECRET);
          if (previous.sid && previous.user_mail) {
            await revokeSession(previous.sid, previous.user_mail);
          }
        } catch (_) {
          // An expired or legacy cookie does not identify an active session.
        }
      }
      // ✅ Device Info from Middleware
      const deviceInfo = req.deviceInfo;

      // Set Refresh Token Cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // ✅ Add login source details in response
      return res.status(200).json({
        ...result,
        isVr: deviceInfo.isVR,
        loginSource: deviceInfo.isVR ? "VR Device" : "Normal Browser",
        device: deviceInfo.device,
        os: deviceInfo.os,
      });
    }

    if (result.code === 401) {
      return res.status(401).send(result);
    }

    if (result.code === 404) {
      return res.status(404).send(result);
    }

    return res.status(500).send({
      code: 500,
      message: "Unexpected error",
    });
  } catch (err) {
    console.error('Login failed:', err);
    return res.status(500).json({ code: 500, message: 'Unable to complete login' });
  }
};

module.exports = LoginRequest;
