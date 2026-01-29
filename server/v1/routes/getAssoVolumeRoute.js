const express = require('express');
const getAssocVolumeRouter = express.Router();
const {getAssociatedVolumeController} = require("../controller/VolumeController.js");
getAssocVolumeRouter.get('/get-assovol',getAssociatedVolumeController);
module.exports = getAssocVolumeRouter;