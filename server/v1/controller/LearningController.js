const { Learningm, getLearningByidm } = require("../model/Learningm");

const createLearningController = async (req, res) => {
    const requester = req.user;
    const { certificate_id, course_name, module_name, unit_name } = req.body;
    if (!certificate_id || !course_name) {
        return res.status(400).json({
            code: 400,
            status: "Validation Error",
            message: "certificate_id, course_name, and module_name are required fields."
        });
    }
    try {
        await Learningm(certificate_id, course_name, module_name, unit_name, requester);
        res.status(200).json({
            code: 200,
            status: 'Created Successfully'
        });
    } 
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const getLearningByIdController = async (req, res) => { 
    const requester = req.user;
    const { certificate_id } = req.params;
    try {
        const result = await getLearningByidm(certificate_id, requester);
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
module.exports = { createLearningController, getLearningByIdController};