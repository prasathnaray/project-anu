// const { default: CreateTrainee } = require('../model/traineem.js');
const {getTraineesm, traineem, disableTraineem} = require('../model/traineem.js');
const {HashPassword} = require('../utils/hash.js');
const TraineeController = async(req, res) => {
        const requester = req.user;
        try {
                const result = await getTraineesm(requester);
                res.status(200).send(result);
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
                let hashedPass = await HashPassword(user_password); ;
                const result = await traineem(user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, hashedPass, user_role, status, description, requester);
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
const DisableTrainee = async(req, res) => {
        const requester = req.user
        const user_mail = req.params.user_mail
        const status = req.params.status
        try
        {
                const result = await disableTraineem(requester, user_mail, status);
                if(result.rowCount === 0)
                {
                        res.status(400).send({
                                error: 400,
                                result: 'No user found to update'
                        })
                }
                else
                {
                        res.status(200).send({
                                result: 'Updated Successfully',
                                statusCode: 200
                        })
                }
        }
        catch(err)
        {
                res.status(500).send(err)
        }
}
module.exports = {TraineeController, CreateTraineeController, DisableTrainee};