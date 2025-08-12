const {adminm} = require('../model/adminm')
const getAdminC = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await adminm(requester)
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
module.exports = {getAdminC}