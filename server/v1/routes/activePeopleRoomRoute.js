const express = require('express');
const {getActivePeopleC} = require('../controller/vrDataC')
const activePeopleRoomRouter = express.Router();
activePeopleRoomRouter.post('/get-active-people-room', getActivePeopleC)
module.exports = activePeopleRoomRouter;