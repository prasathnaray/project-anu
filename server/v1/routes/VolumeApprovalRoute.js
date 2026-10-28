const express = require('express');
const VolumeApprovalRouter = express.Router();
const { volumeApprovalC } = require('../controller/volumeController')
VolumeApprovalRouter.patch('/approve-volume/:status_approval/:volume_id', volumeApprovalC)
module.exports = VolumeApprovalRouter;
