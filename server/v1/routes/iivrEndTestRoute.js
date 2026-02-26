const express = require('express');
const iivrEndTestRouter = express.Router();
const { iivrEndTest } = require('../controller/iivrController.js');
iivrEndTestRouter.put('/end-ii-prac', iivrEndTest);
module.exports = iivrEndTestRouter;