const { submitSession } = require("../model/pracTestModel");

const pracTestController = async (req, res) => {
    const requester = req.user;
    const { sessionType, sessionNumber } = req.body;

    if (!req.body.payload) {
        return res.status(400).json({ status: 'Error', message: 'Payload is missing' });
    }
    if (!req.files || !req.files.userImages || !req.files.expertImages) {
        return res.status(400).json({ status: 'Error', message: 'Images are missing' });
    }

    const payload = JSON.parse(req.body.payload);
    const files = {
        userImages: req.files.userImages,
        expertImages: req.files.expertImages,
    };

    try {
        const result = await submitSession(requester, sessionType, sessionNumber, payload, files);
        res.status(result.code).json(result);
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
};
module.exports = { pracTestController };