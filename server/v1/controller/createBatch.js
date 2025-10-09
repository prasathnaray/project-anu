const {generateBatchID} = require('../utils/idGenerator.js')
const {createBatchm, getBatchm, associateBatchm, deleteBatchm, createTargetedLearning, getTargetedLearningListModel} = require('../model/Batchm.js')
const batchCreation = async(req, res) =>{
    const requester = req.user;
    const {batch_name, batch_start_date, batch_end_date, course_data, curiculum_name} = req.body;
    try
    {
            const result = await createBatchm(batch_name, batch_start_date, batch_end_date, JSON.stringify(course_data), curiculum_name, requester);
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
const deleteBatchc = async(req, res) => {
        const requester = req.user;
        const batch_id = req.params.batch_id;
        try
        {
                const result = await deleteBatchm(requester, batch_id);
                res.status(200).send(result);
        }
        catch(err)
        {
                res.status(500).send(err)
                console.log(err.message)
        }

}
const createTargetedLearningC = async(req, res) => {
        const {tar_name, course_id, trainee_id, curiculum_id, chapter_id, module_id, resources_id, start_date, end_date} = req.body;
        const requester = req.user;
        try
        {
                if(!tar_name || !curiculum_id || !chapter_id || !module_id || !resources_id || !start_date || !end_date || !course_id || !trainee_id)
                {
                        res.status(400).json({
                                code:400,
                                status: 'Field should not be empty'
                        })
                }
                else
                {
                        const result = await createTargetedLearning(requester, tar_name, curiculum_id, chapter_id, module_id, resources_id, start_date, end_date, course_id, trainee_id)
                        res.status(200).json({
                                code: 200,
                                status: "Targeted learning created successfully"
                        })
                }
        }
        catch(err)
        {
                res.status(500).send(err)
                console.error(err);
        }
}
const getTargetedLearningC = async(req, res) => {
        const requester = req.user;
        try
        {
                const result = await getTargetedLearningListModel(requester);
                res.status(200).send(result.rows);
        }       
        catch(err)
        {
                res.status(500).send(err);
        }
}
module.exports = {batchCreation, getBatchData, associateBatchc, deleteBatchc, createTargetedLearningC, getTargetedLearningC}