const { GenderRatio } = require("../model/AnalyticsModel")

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
module.exports = {GenderRatioC}