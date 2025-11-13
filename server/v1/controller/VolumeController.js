const client = require('../utils/supaBaseConfig.js');
const {svUploadModel, getUploadedVolume} = require("../model/Volumem");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const VolumeController = async(req, res) => {
    const requester = req.user;
    try
    {
        if(!req.file)
        {
                return res.status(404).json({
                error: 'No file uploaded'   
                })
        }
        const file = req.file;
        const {volume_type, volume_name, volume_ga, volume_fetal_presentation} = req.body;
        if(!volume_type||!volume_name || !volume_ga || !volume_fetal_presentation)
        {
          
            return res.status(406).json({
                    message: "Fields should not be empty"
            })
            
        }
        const filePath = `volumes/${file.originalname}`;
        const { data, error } = await client.storage
                        .from(process.env.BUCKET_NAME)
                        .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true,
                        });
        if (error) {
            return res.status(500).json({ status: 'Error', message: error.message });
        }
        const result = await svUploadModel(requester, volume_type, volume_name, volume_ga, volume_fetal_presentation, filePath)
        if(result.rowCount == 1)
        {
            res.status(200).json({
                statusCode: 200,
                message: 'Volume Uploaded'
            })
        }
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}

const getVolumeDataC = async(req, res) => {
    try
    {
        const result = await getUploadedVolume(requester)
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {VolumeController}