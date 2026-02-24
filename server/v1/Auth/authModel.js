const client = require('../utils/conn');
const jwt = require('jsonwebtoken');
const {comparePasswords} = require('../utils/hash');
const path = require('path');
const LoginAttemptModel = require('./LoginAttemptModel');
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

                try {
                    await LoginAttemptModel(user_mail); // Assuming user_id is the primary key
                } catch (attemptErr) {
                    console.error('Failed to log login attempt:', attemptErr);
                }
                let role = user.user_role;
                let people_id = user.people_id;
                // let token_data = role + '' + user_mail;
                const accessToken = jwt.sign({user_mail,role}, process.env.ACCESS_TOKEN_SECRET)
                const refreshToken = jwt.sign({ user_mail, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                resolve({ accessToken: accessToken, refreshToken: refreshToken, id: user_mail, role: role, people_id: people_id, status: 'Login Authenticated', name: user.user_name, code: 200});
            })
    })
}
module.exports = LoginModel;