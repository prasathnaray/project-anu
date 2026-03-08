const express = require('express');
const irobRouter  = express.Router();

// const {
//     submit,
//     start,
//     end,
//     complete,
// } = require('../controllers/learningResourceController');
const { irobsubmit } = require('../controller/irobController');
// ─── MIND SPARKS & OB BOOSTERS ───────────────────────────────────────────────
// Same Submit / Start / End APIs for all resources under these categories

irobRouter.post('/submit', irobsubmit);
module.exports = irobRouter;