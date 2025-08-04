const express = require('express');
const {createCur} = require('../controller/curiculumController');
const curiculumCreateRouter = express.Router();
curiculumCreateRouter.post('/create-curiculum', createCur);
module.exports = curiculumCreateRouter;