const vrModel = require('../model/vrModel.js');
const getVrData = async(req, res) => {
    const requester = req.user;
    const data_check = req.params.data_check
    try
    {
        //const result = 
        res.status(200).send(await vrModel(requester, data_check));
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {getVrData};
