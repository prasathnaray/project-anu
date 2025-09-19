const {resourcem, getResourcesModel} = require('../model/resourcem');
const CreateResourceController = async (req, res) => {
    const requester = req.user;
    const{module_id, resource_name} = req.body;
    if (!module_id || module_id.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "module_id should not be empty"
        });
    }
    if (!resource_name || resource_name.trim() === "") {
        return res.status(400).json({
            status: "Bad Request",
            code: 400,
            message: "resource_name should not be empty"
        });
    }
    try 
    {
        const result = await resourcem(module_id, resource_name, requester);
        res.status(200).json(result);
    }
    catch(err)
    {
        res.status(500).json({err});
    }
}
const getResourcesController = async (req, res) => {
    const {module_id} = req.query
    try
    {
        const result = await getResourcesModel(req.user, module_id);
        res.status(200).json(result.rows);
    }
    catch(err)
    {
        console.log(err);
    }
}
module.exports = {CreateResourceController, getResourcesController}