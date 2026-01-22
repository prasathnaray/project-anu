const express = require('express');
const volumePlacementRouter = express.Router();
const { volumePlacementController} = require('../controller/VolumeController');
const multer = require('multer');
const upload = multer();    
volumePlacementRouter.post('/volume-placement', upload.single('placed_file'), volumePlacementController);
module.exports = volumePlacementRouter;