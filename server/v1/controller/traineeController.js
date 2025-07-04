const { default: CreateTrainee } = require('../model/traineem.js');
const {getTraineesm, traineem} = require('../model/traineem.js');
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
const CreateTraineeController = async (req, res) => {
        const requester = req.user;
        const { user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description } = req.body;
        try {
                const result = await traineem(user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description, requester);
                res.status(200).send({
                        status: 'Success',                  
                        code: 200,
                        message: 'Trainee profile created successfully.',       
                        data: result
                });
        }       
        catch(err)
        {
                res.status(500).send({
                        status: 'Error',
                        code: 500,
                        message: err.message
                });
                //console.log(err);
        }
}
module.exports = {TraineeController, CreateTraineeController};