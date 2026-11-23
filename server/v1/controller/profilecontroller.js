const profilem = require('../model/profilem');
const { updateProfile } = require('../model/profilem');
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
const updateProfileController = async (req, res) => {
    try {
        const result = await updateProfile(req.user, req.body);
        res.status(result.code).json(result);
    } catch (error) {
        console.error('Failed to update profile:', error);
        res.status(500).json({ status: 'Error', message: 'Could not save your profile.' });
    }
};

module.exports = { profilecontroller, updateProfileController };
