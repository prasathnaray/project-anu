const express = require('express');
const iivrStartTestRouter = express.Router();
const { iivrStartTest } = require('../controller/iivrController.js');
iivrStartTestRouter.post('/start-ii-prac', iivrStartTest);
module.exports = iivrStartTestRouter;