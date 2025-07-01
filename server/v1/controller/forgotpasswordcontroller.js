//const express = require('express');
const forgotpcontroller = async(req, res) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const ipaddress = ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip;
        //res.send(userIp)
        const {user_mail} = req.body;
        if(!user_mail || !ipaddress)
        {
            res.status(200).send({status: "aodk"})
        }
        else
        {
            try
            {
                    const result = await require('../model/forgotm')(user_mail, ipaddress);
                    res.send(result);
            }
            catch(err)
            {
                res.status(500).send({
                    status: 'Error',
                    code: 500,
                    message: err.message
                });
            }
        }
        //console.log(userIp)
}
module.exports = forgotpcontroller;