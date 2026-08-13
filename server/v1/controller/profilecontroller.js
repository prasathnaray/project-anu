const profilem = require('../model/profilem');
const { hydrateStorageFields } = require('../utils/hydrateStorageFields');
const profilecontroller = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await profilem(requester);
        res.send(await hydrateStorageFields(result));
    }
    catch(err)
    {
        res.status(500).send(err);
        console.log(err);
    }
}
module.exports =  profilecontroller;
