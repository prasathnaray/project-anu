const {generateBatchID} = require('../utils/idGenerator.js')
const {createBatchm, getBatchm} = require('../model/Batchm.js')
const batchCreation = async(req, res) =>{
    const requester = req.user;
    const {batch_name, batch_start_date, batch_end_date} = req.body;
    try
    {
            const result = await createBatchm(generateBatchID(), batch_name, batch_start_date, batch_end_date, requester);
            res.status(200).send(result);
    }
    catch(err)
    {
            console.log(err)
            res.status(500).send(err)
    }
}
module.exports = {batchCreation}