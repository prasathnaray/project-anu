const { GenderRatio, UserStats, InteractionsAttemptStatsM } = require("../model/AnalyticsModel")

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
module.exports = {GenderRatioC, UserStatsC, InteractionsAttemptStats}