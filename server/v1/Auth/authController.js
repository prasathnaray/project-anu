const jwt = require('jsonwebtoken');
const LoginModel = require('./authModel')
const LoginRequest = async(req, res) => {
    const {user_mail, user_password} = req.body;
    try
    {
        if(!user_mail || !user_password)
        {
            res.status(400).json({
                statusDescrip: 'All fields are required',
                code: 400
            })
        }
        else
        {
            const result = await LoginModel(user_mail, user_password);
            if(result.code == 200)
            {
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(200).send(result)
            }
            else if(result.code == 401)
            {
                res.status(401).send(result)
            }
            else if(result.code == 404)
            {
                res.status(404).send(result)
            }
        }
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}
module.exports = LoginRequest;