const {getDashboardDatam} = require('../model/dashboardm')
const getDashboardC = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await getDashboardDatam(requester);
        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}
module.exports = {getDashboardC}