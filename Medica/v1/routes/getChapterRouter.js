const express = require('express');
const getChapterRouter = express.Router();
const {getChapters} = require('../controller/chapterController.js');
getChapterRouter.get('/get-chapter', getChapters);
module.exports = getChapterRouter;