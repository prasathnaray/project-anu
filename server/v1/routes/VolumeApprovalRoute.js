const express = require('express');
const VolumeApprovalRouter = express.Router();
const {volumeApprovalC} = require('../controller/VolumeController')
VolumeApprovalRouter.patch('/approve-volume/:status_approval/:volume_id', volumeApprovalC)
module.exports = VolumeApprovalRouter;
