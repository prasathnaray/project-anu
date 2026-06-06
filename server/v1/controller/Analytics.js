const { GenderRatio, UserStats, InteractionsAttemptStatsM, ActivityLastScoresM, SkillCompetencyM, PerformanceMetricsM } = require("../model/AnalyticsModel")

const GenderRatioC = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await GenderRatio(requester);
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
const UserStatsC = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await UserStats(requester);
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).json(err)
        console.log(err)
    }
}
const InteractionsAttemptStats = async(req, res) => {
        const requester = req.user;
        try
        {
            const result = await InteractionsAttemptStatsM(requester);
            res.status(200).send(result);
        }
        catch(err)
        {
            res.status(500).json(err)
        }
}
const ActivityLastScores = async(req, res) => {
    const requester = req.user;
    try {
        const result = await ActivityLastScoresM(requester);
        res.status(200).send(result);
    } catch(err) {
        res.status(500).json(err);
    }
}
const SkillCompetency = async(req, res) => {
    const requester = req.user;
    try {
        const result = await SkillCompetencyM(requester);
        res.status(200).send(result);
    } catch(err) {
        res.status(500).json(err);
    }
}
const PerformanceMetrics = async(req, res) => {
    const requester = req.user;
    try {
        const result = await PerformanceMetricsM(requester);
        res.status(200).send(result);
    } catch(err) {
        res.status(500).json(err);
    }
}
module.exports = {GenderRatioC, UserStatsC, InteractionsAttemptStats, ActivityLastScores, SkillCompetency, PerformanceMetrics}
