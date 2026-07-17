const {getDashboardDatam} = require('../model/dashboardm')
const getDashboardC = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await getDashboardDatam(requester);
        if (result.code) {
            return res.status(result.code).json(result);
        }
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}
module.exports = {getDashboardC}
