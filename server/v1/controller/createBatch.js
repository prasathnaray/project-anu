const {generateBatchID} = require('../utils/idGenerator.js')
const {createBatchm, getBatchm, associateBatchm} = require('../model/Batchm.js')
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
            res.status(500).send(err)
    }
}
const getBatchData= async(req,res) => {
        const requester = req.user;
        try 
        {
                const result = await getBatchm(requester);
                res.status(200).send(result);
        }
        catch(err)
        {
                 res.status(500).send(err)      
        }
}
const associateBatchc = async(req, res) => {
        const requester = req.user;
        const {batch_id, user_id} = req.body;
        try
        {
                const result = await associateBatchm(requester, batch_id, user_id);
                res.status(200).send(result);
        }
        catch(err)
        {
                res.status(500).send(err.message)
        }
}
module.exports = {batchCreation, getBatchData, associateBatchc}