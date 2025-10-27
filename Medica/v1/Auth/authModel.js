const client = require('../utils/conn');
const jwt = require('jsonwebtoken');
const {comparePasswords} = require('../utils/hash');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const LoginModel = (user_mail, user_password) => {
    return new Promise((resolve, reject) => {
            client.query('SELECT * FROM public.user_data WHERE user_email=$1 and status=$2', [user_mail, 'active'], async(err, result) => {
                if(err)
                {
                    return reject(err)
                }
                if(!result  || result.rows.length === 0)
                {
                    return resolve({ status: 'User Not Found or Account Disabled', code: 404})
                }
                const user = result.rows[0];
                const isMatch = await comparePasswords(user_password, user.user_password);
                if(!isMatch)
                {
                    return resolve({status: "Invalid_Password", code: 401});
                }
                let role = user.user_role;
                let token_data = role + '' + user_mail;
                const accessToken = jwt.sign({user_mail,role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
                resolve({ accessToken: accessToken, id: user_mail, role: role, status: 'Login Authenticated', code: 200});
            })
    })
}
module.exports = LoginModel;