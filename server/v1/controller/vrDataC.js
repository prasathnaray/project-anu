const vrModel = require('../model/vrModel.js')
const getVrData = async(req, res) => {
    const requester = req.user;
    const data_check = req.params.data_check
    try
    {
        const result = await vrModel(requester, data_check)
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err)
        ContentVisibilityAutoStateChangeEvent.l
    }
}
module.exports = getVrData;