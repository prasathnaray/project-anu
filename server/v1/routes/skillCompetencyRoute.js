const express = require('express');
const { SkillCompetency } = require('../controller/Analytics.js');

const skillCompetencyRouter = express.Router();

skillCompetencyRouter.get('/skill-competency', SkillCompetency);

module.exports = skillCompetencyRouter;
