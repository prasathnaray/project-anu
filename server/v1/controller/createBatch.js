const {generateBatchID} = require('../utils/idGenerator.js')
const {createBatchm, getBatchm, associateBatchm, deleteBatchm, createTargetedLearning, getTargetedLearningListModel, deleteTargetedLearningModel, IndividualtllList, filterBatchm, individualBatchStats} = require('../model/Batchm.js')
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        try 
        {
                const result = await getBatchm(requester, page, limit);
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
const deleteTargetedLearningC = async(req, res) => {
        const requester = req.user;
        const targeted_learning_id = req.params.targeted_learning_id
        try
        {
                const result = await deleteTargetedLearningModel(requester, targeted_learning_id)
                res.status(200).json({
                        code: 200,
                        status: result.rowCount == 1 ? 'Deleted Successfully' : 'No data available to delete'
                });
        }
        catch(err)
        {
                res.status(500).send(err)
        }
}
const InTLListC = async(req, res) => {
        const requester = req.user;
        try
        {
                const result = await IndividualtllList(requester)
                res.status(200).json({
                        code: '200',
                        status: 'data retrieved',
                        result: result.rows
                })
        }
        catch(err)
        {
                res.status(500).send(err);
                console.log(err);
        }
}
const filterBatchC = async(req, res) => {
        const requester = req.user;
        const {batch_name, instructor_name} = req.query;
        try
        {
                const result = await filterBatchm(requester, batch_name, instructor_name);
                res.status(200).send(result);
        }
        catch(err)
        {
                res.status(500).send(err);
        }
}
const individualBatchC = async(req, res) => {
        const requester = req.user;
        const {batch_id} = req.params;
        try
        {
                const response = await individualBatchStats(requester, batch_id)
                res.status(200).send(response.rows);
                //res.send(batch_id);
        }
        catch(err)
        {
                res.status(500).send(err)
        }
}
module.exports = {filterBatchC, individualBatchC, batchCreation, getBatchData, associateBatchc, deleteBatchc, createTargetedLearningC, getTargetedLearningC, deleteTargetedLearningC, InTLListC}