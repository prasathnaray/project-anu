const express = require('express');
const {InteractionsAttemptStats} = require("../controller/Analytics.js");
const InteractionsAttemptStatsRouter = express.Router();

InteractionsAttemptStatsRouter.get('/interactions-attempt-stats', InteractionsAttemptStats);

module.exports = InteractionsAttemptStatsRouter;