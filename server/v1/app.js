const express = require('express');
const app = express();
//db
const client = require('./utils/conn');
//Auth
const LoginRouter = require('./routes/Auth')
const ProfileRouter = require('./routes/profileRoute');
const ForgotPRouter = require('./routes/forgotpRoute');
const getTraineeRouter = require('./routes/getTraineesRoute')
const refreshTokenRouter = require('./routes/refreshTokenRouter');
const Authenticate = require('./Auth/Authenticate');
//enabling cors
const cors = require('cors');
const createTraineeRouter = require('./routes/createtraineeRoute');
app.use(cors());
app.listen('4004', (err) => {
    if(err)
    {
        console.log(err)
    }
    else
    {
        console.log(`Working`)
    }
})
//enables
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Auth route
app.use('/api/v1', LoginRouter);
app.use('/api/v1', ForgotPRouter)
app.use('/api/v1', refreshTokenRouter)
app.use('/api/v1', Authenticate, ProfileRouter);
app.use('/api/v1', Authenticate, getTraineeRouter);
app.get('/test', Authenticate, (req, res) => {
    const requester = req.user;
    res.status(200).json({
        status: 'Test Route',
        code: 200,
        user: req.user
    });
});
app.use('/api/v1', Authenticate, createTraineeRouter);
