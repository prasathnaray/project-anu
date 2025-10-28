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
const deleteInstructorRouter = require('./routes/deleteInstructorRoute.js');
const curiculumCreateRouter = require('./routes/curiculamRoute.js');
const getCuriculumRouter = require('./routes/getCuriculumRoute.js');
const deleteCuriculumRouter = require('./routes/deleteCuriculumRoute.js');
const createCourseRouter = require('./routes/createCourseRoute.js');
const getCoursesRouter = require('./routes/GetCourseRoute.js');
const getCoursesByCuriculumRouter = require('./routes/getCoursesByCurRoute.js');
const deleteCourseRouter = require('./routes/deleteCourseRoute.js');
const getAdminRouter = require('./routes/getAdminsRoute.js');
const getVrDataRouter = require('./routes/getVrDataRoute.js');
const notifyRouter = require('./routes/notificationRoutes.js')
const tagCourseRouter = require('./routes/TagCourseRoute.js');
const getGendersRoute = require('./routes/getGendersRoutes.js');
const getIndividualIvsRouter = require('./routes/individualIvsRoute.js');
const tokenIvsRouter = require('./routes/tokenIvsRoute.js');
const requestCourseRouter = require('./routes/RequestCourseRoute.js');
const activePeopleRoomRouter = require('./routes/activePeopleRoomRoute.js');
const progressRouter = require('./routes/progressRoute');
const createModuleRouter = require('./routes/createModuleRoute.js');
const getModuleRouter = require('./routes/getModuleRoute.js');
const subModuleRouter = require('./routes/subModuleRoute.js');
const moduleCompleteUserRouter = require('./routes/moduleCompleteUserRoute.js');
const getChapterRouter = require('./routes/getChapterRouter.js');
const NewModuleRouter = require('./routes/newModuleRoute.js');
const createResourceRouter = require('./routes/createResourceRoute.js');
const getResourcesRouter = require('./routes/getResourcesRoute.js');
const UserStatsRouter = require('./routes/UserStatusRoute');
const createTargetedLearningRouter = require('./routes/CreateTargetedLearningRoute.js');
const getResourcesByModuleIdsRouter = require('./routes/getResourcesByModuleIdsRoute.js')
const getTargetedLearningRouter = require('./routes/getTargetedLearningRoute.js');
const deleteTargetedLearningRouter = require('./routes/deleteTargetedLearningRoute.js');
const getIndividualTLRouter = require('./routes/getIndividualTLRoute.js');
const filterBatchRouter = require('./routes/filterBatchRoute.js');
const induuidRouter = require('./routes/induuidRoute.js');
const IndBatchProfileRouter = require('./routes/IndBatchProfileRoute.js');
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
app.use('/api/v1', ForgotPRouter);
app.use('/api/v1', refreshTokenRouter);
app.use('/api/v1', getIndividualIvsRouter);
app.use('/api/v1', notifyRouter);
app.use('/api/v1', tokenIvsRouter);
app.use('/api/v1', activePeopleRoomRouter);
app.use('/api/v1', Authenticate, progressRouter);
app.use('/api/v1', Authenticate, getVrDataRouter);
app.use('/api/v1', Authenticate, deleteBatchRouter);
// batch
app.use('/api/v1', Authenticate, ProfileRouter);
app.use('/api/v1', Authenticate, getTraineeRouter);
app.use('/api/v1/', Authenticate, disableTraineeRoute)
app.use('/api/v1/', Authenticate, batchCreationRouter);
app.use('/api/v1/', Authenticate, getBatchesRouter);
app.use('/api/v1/', Authenticate, associateBatchRouter);
app.use('/api/v1/', Authenticate, filterBatchRouter);
app.use('/api/v1/', Authenticate, getInstructorRouter);
app.use('/api/v1/', Authenticate, dashboardRouter);
app.use('/api/v1/', Authenticate, deleteCuriculumRouter)
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
app.use('/api/v1', Authenticate, curiculumCreateRouter);
app.use('/api/v1', Authenticate, getCuriculumRouter);
app.use('/api/v1/', Authenticate, createCourseRouter);
app.use('/api/v1/', Authenticate, getCoursesRouter);
app.use('/api/v1', Authenticate, getCoursesByCuriculumRouter);
app.use('/api/v1', Authenticate, deleteCourseRouter);
app.use('/api/v1', Authenticate, getAdminRouter);
app.use('/api/v1', Authenticate, tagCourseRouter);
app.use('/api/v1', Authenticate, getGendersRoute);
app.use('/api/v1', Authenticate, requestCourseRouter);
//module creation

app.use('/api/v1', Authenticate, createModuleRouter);
app.use('/api/v1', Authenticate, getModuleRouter);
// new module creation
app.use('/api/v1', Authenticate, NewModuleRouter);
//sub-module
app.use('/api/v1', Authenticate, subModuleRouter);

//mark complete 
app.use('/api/v1', Authenticate, moduleCompleteUserRouter);

//chapter
app.use('/api/v1', Authenticate, getChapterRouter);

//resource 
app.use('/api/v1', Authenticate, createResourceRouter);
app.use('/api/v1', Authenticate, getResourcesRouter);

app.use('/api/v1', Authenticate, getResourcesByModuleIdsRouter)

//user stats
app.use('/api/v1', Authenticate, UserStatsRouter);

//targeted Learning 
app.use('/api/v1', Authenticate, createTargetedLearningRouter);
app.use('/api/v1', Authenticate, getTargetedLearningRouter);
app.use('/api/v1', Authenticate, deleteTargetedLearningRouter);
app.use('/api/v1', Authenticate, getIndividualTLRouter);

//trainee by people_id
app.use('/api/v1', Authenticate, induuidRouter);

//batch profile 
app.use('/api/v1', Authenticate, IndBatchProfileRouter);