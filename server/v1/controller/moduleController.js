const { createModuleModel , getModuleModel, subModuleModel, completionModel, createNewModuleModel, calcTestScoreModel, attemptTestModel} = require('../model/modulem.js');
const CreateModule = async (req, res) => {
    const requester = req.user;
    const { course_id, chapter_name } = req.body;
    if (!course_id || course_id.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "course_id should not be empty"
        });
    }
    if (!chapter_name || chapter_name.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "module_name should not be empty"
        });
    }
    try {
        const result = await createModuleModel(course_id, chapter_name, requester);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const GetModule = async (req, res) => {
    const requester = req.user;
    const chapter_id  = req.query.chapter_id;
    try
    {
        const result = await getModuleModel(chapter_id, requester);
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
const subModuleController = async (req, res) => {
    const requester = req.user;
    const {module_id, submod_name} = req.body;
    if (!module_id || module_id.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "module_id should not be empty"
        });
    }
    if (!submod_name || submod_name.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "submod_name should not be empty"
        });
    }
    try
    {
        const result = await subModuleModel(module_id, submod_name, requester);
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}
const completeModule = async (req, res) => {
    const requester = req.user;
    const {is_completed, r_id} = req.query;
    //const submod_id = req.query.submod_id;
    try{
        const result = await completionModel(is_completed, r_id, requester);
        //console.log(submod_id);
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
// controller
const ModuleNewController = async (req, res) => {
    const requester = req.user;
    const { chapter_id, module_name } = req.body;  
    if (!chapter_id || chapter_id.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "chapter_id should not be empty"
        });
    }
    if (!module_name || module_name.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "module_name should not be empty"
        });
    } 
    try
    {
        const result = await createNewModuleModel(module_name, chapter_id, requester);
        res.status(200).send(result);
    } 
    catch(err)
    {
        res.status(500).send(err);
    }
}
const calcTestScoreController = async (req, res) => {
    const requester = req.user;
    const {r_id, plane_identification, image_optimization, measurement, diagnostic_interpretation} = req.body;
    if(!r_id || r_id.trim() === "" || !plane_identification || plane_identification.trim() === "" || !image_optimization || image_optimization.trim() === "" || !measurement || measurement.trim() === "" || !diagnostic_interpretation || diagnostic_interpretation.trim() === "")
    {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "All fields are required and should not be empty"
        });
    }
    try {
        const result = await calcTestScoreModel(requester, r_id, plane_identification, image_optimization, measurement, diagnostic_interpretation);
        res.status(200).send({
            status: "Success",
            code: 200
        });
    } catch (err) {
        res.status(500).send(err);
    }
} 
const attemptTestCont = async(req, res) => {
    const requester = req.user;
    const {r_id, plane_identification, image_optimization, measurement, diagnostic_interpretation} = req.query;
    try
    {
        await attemptTestModel(requester, r_id, plane_identification, image_optimization, measurement, diagnostic_interpretation);
        res.status(200).send({
            status: "Success in Re-Attempt",
            code: 200
        });
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {CreateModule, GetModule, subModuleController, completeModule, ModuleNewController, calcTestScoreController, attemptTestCont};