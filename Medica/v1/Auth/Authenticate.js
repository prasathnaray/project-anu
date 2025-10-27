const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
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
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ status: 'Forbidden: Invalid token' });
            req.user = user;
            next();
        });
}
module.exports = Authenticate;