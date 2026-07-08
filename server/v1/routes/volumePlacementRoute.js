const express = require('express');
const volumePlacementRouter = express.Router();
const { volumePlacementController, getVolumePlacementsController} = require('../controller/VolumeController');
const multer = require('multer');
const upload = multer();    
volumePlacementRouter.get('/volume-placements', getVolumePlacementsController);
volumePlacementRouter.post('/volume-placement', upload.single('placed_file'), volumePlacementController);
module.exports = volumePlacementRouter;
