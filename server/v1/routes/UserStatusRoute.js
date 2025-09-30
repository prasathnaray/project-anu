const express = require("express");
const UserStatsRouter = express.Router();
const { UserStatsC } = require("../controller/Analytics");
UserStatsRouter.get('/user-stats', UserStatsC);
module.exports = UserStatsRouter;