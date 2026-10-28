const express = require('express');
const getAssocVolumeRouter = express.Router();
const { getAssociatedVolumeController } = require("../controller/volumeController.js");
getAssocVolumeRouter.get('/get-assovol', getAssociatedVolumeController);
module.exports = getAssocVolumeRouter;