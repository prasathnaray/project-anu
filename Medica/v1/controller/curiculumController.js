const {curiculumm, getCurriculumm, deleteCuriculum} = require('../model/curiculumm');
const createCur = async(req, res) => {
        const requester = req.user;
        const {curiculum_name} = req.body;
        try
        {
            const result = await curiculumm(curiculum_name, requester);
            res.status(200).json({
                code: 200,
                status: 'Success',
                result: result
            })
        }
        catch(err)
        {
            res.status(500).send(err)
        }
}
const getCur = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await getCurriculumm(requester);
        res.status(200).json({
                code: 200,
                status: 'Success',
                result: result.rows
        })
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
const deleteCur = async(req, res) => {
    const requester = req.user;
    const curiculum_id = req.params.curiculum_id;
    try
    {
        const result = await deleteCuriculum(curiculum_id, requester);
        res.status(200).json({
            code: 200,
            status: 'Success',
            result: 'Deleted successfully'
        })
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {createCur, getCur, deleteCur}