const express = require('express')
const {getCur} = require('../controller/curiculumController')
const getCuriculumRouter = express.Router();
getCuriculumRouter.get('/get-curiculum', getCur);
module.exports = getCuriculumRouter;