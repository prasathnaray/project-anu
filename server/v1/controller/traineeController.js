const {getTraineesm} = require('../model/traineem.js');
const TraineeController = async(req, res) => {
        const requester = req.user;
        try {
                const result = await getTraineesm(requester);
                res.status(200).send(result);
                //res.send(requester)
        } catch (err) {
                res.status(500).send({
                        status: 'Error',
                        code: 500,
                        message: err.message
                });
                console.log(err);
        }
}

module.exports = TraineeController;