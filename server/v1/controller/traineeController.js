const {getTraineesm, traineem, disableTraineem} = require('../model/traineem.js');
const {HashPassword} = require('../utils/hash.js');
const client = require('../utils/supaBaseConfig.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
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
        try{
                if(!req.file)
                {
                        return res.status(404).json({
                        error: 'No file uploaded'   
                        })
                }
                const file = req.file;
                const {user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description, user_batch } = req.body;
                if(!user_name || !user_email || !user_contact_num)
                {
                        return res.status(501).json({
                                error: `${'Missing Fields'}`
                        })
                }
                const filePath = `trainee_images/${file.originalname}`;
                const { data, error } = await client.storage
                        .from(process.env.BUCKET_NAME)
                        .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true,
                        });
                if (error) {
                                return res.status(500).json({ status: 'Error', message: error.message });
                }
                let hashedPass = await HashPassword(user_password); ;
                const result = await traineem(filePath, user_name, user_email, user_contact_num, user_dob, user_gender, hashedPass, user_role, status, description, user_batch, requester);
                res.status(200).json({
                        status: 'Success',
                        message: 'File uploaded to Supabase Storage.',
                        filePath: filePath,
                        result: result,
                });  
        }
        catch(err)
        {
                res.status(500).send(err)
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