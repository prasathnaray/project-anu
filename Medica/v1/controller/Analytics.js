const { GenderRatio, UserStats } = require("../model/AnalyticsModel")

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
module.exports = {GenderRatioC, UserStatsC}