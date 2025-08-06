const express = require('express');
const {deleteCur} = require('../controller/curiculumController');
const deleteCuriculumRouter = express.Router();
deleteCuriculumRouter.delete('/delete-cur/:curiculum_id', deleteCur);
module.exports = deleteCuriculumRouter;