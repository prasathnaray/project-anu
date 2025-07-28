//const express = require('express');
const forgotpcontroller = async(req, res) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const ipaddress = ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip;
        //res.send(userIp)
        const {reset_password_mail} = req.body;
        if(!reset_password_mail)
        {
            res.status(400).send({status: "Field should not be empty"})
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
}
module.exports = forgotpcontroller;