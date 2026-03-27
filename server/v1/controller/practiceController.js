const { bulkCreatePracticeResults, getPractice12ByUserId } = require('../model/practiceModel.js');

const bulkCreatePracticeResultsController = async (req, res) => {
    const { resource_id, practice_id, practice_number, practiceresults } = req.body;
    const requester = req.user;

    if (!resource_id || !practice_id || !practice_number || !Array.isArray(practiceresults)) {
        return res.status(400).json({
            error: 'resource_id, practice_number, and practiceresults array are required',
        });
    }

    try {
        const result = await bulkCreatePracticeResults(requester, practice_id, resource_id, practice_number, practiceresults );

        if (result.code === 401) return res.status(401).send(result);
        if (result.code === 400) return res.status(400).send(result);

        res.status(201).send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
};

const getPracticesByUser = async (req, res) => {
    const requester = req.user;
    try
    {
        const result = await getPractice12ByUserId(requester);
        if (result.code === 401) return res.status(401).send(result);
        if (result.code === 400) return res.status(400).send(result);
    }
    catch(err)
    {
        res.status(500).send(err);
    }   
}
module.exports = { bulkCreatePracticeResultsController, getPracticesByUser};