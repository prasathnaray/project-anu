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
const disableTraineeRoute = require('./routes/disableTraineeRoute');
const batchCreationRouter = require('./routes/createBatchRoute.js');
const getBatchesRouter = require('./routes/getBatchesRoute.js');
const associateBatchRouter = require('./routes/associateBatchRoute.js');
const getInstructorRouter = require('./routes/getInstructorRoute.js');
const dashboardRouter = require('./routes/dashboardRoute.js');
const deleteBatchRouter = require('./routes/deleteBatchRoute.js');
const deleteTraineeRouter = require('./routes/deleteTraineeRoute.js')
const deleteInstructorRouter = require('./routes/deleteInstructorRoute.js')
const Authenticate = require('./Auth/Authenticate');
//enabling cors
const cors = require('cors');
const createTraineeRouter = require('./routes/createtraineeRoute');



//multer 
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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
app.use('/api/v1', Authenticate, deleteBatchRouter);
// batch

app.use('/api/v1', Authenticate, ProfileRouter);
app.use('/api/v1', Authenticate, getTraineeRouter);
app.use('/api/v1/', Authenticate, disableTraineeRoute)
app.use('/api/v1/', Authenticate, batchCreationRouter);
app.use('/api/v1/', Authenticate, getBatchesRouter);
app.use('/api/v1/', Authenticate, associateBatchRouter);
app.use('/api/v1/', Authenticate, getInstructorRouter);
app.use('/api/v1/', Authenticate, dashboardRouter)
app.get('/test', Authenticate, (req, res) => {
    const requester = req.user;
    res.status(200).json({
        status: 'Test Route',
        code: 200,
        user: req.user
    });
});
app.use('/api/v1', Authenticate, createTraineeRouter);
app.use('/api/v1', Authenticate, deleteTraineeRouter);
app.use('/api/v1', Authenticate, deleteInstructorRouter);
