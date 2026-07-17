const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const client = require('../utils/conn');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Authenticate = (req, res, next) => {
    // const token = req.header('Authorization');

    // console.log("Unextracted Token: "+ token);
    // if(!token)
    // {
    //     return res.status(401).json({message: "Unauthorized"});
    // }
    // const extractedToken = token.split(' ')[1];
    // console.log('Actual Token' + ' ' + extractedToken);
    // try
    // {
    //     const decoded = jwt.verify(extractedToken, process.env.ACCESS_TOKEN_SECRET)
    //     req.user_mail = decoded.user_mail;
    //     next();
    // }
    // catch(err)
    // {
    //     res.status(200).json({message: "Invalid Token!"})
    // }
     const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ status: 'Unauthorized: No token' });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ status: 'Forbidden: Invalid token' });
            try {
                const result = await client.query(
                    'SELECT centre_id, center_name FROM public.user_data WHERE user_email = $1',
                    [user.user_mail]
                );
                const dbUser = result.rows[0] || {};
                req.user = {
                    ...user,
                    centre_id: user.centre_id || dbUser.centre_id || null,
                    center_name: user.center_name || dbUser.center_name || null
                };
                next();
            } catch (queryErr) {
                next(queryErr);
            }
        });
}
module.exports = Authenticate;
