const client = require('../utils/supaBaseConfig.js');
const {svUploadModel, getUploadedVolume, VolumeApprovalModel, getVolumeInstructorViewModel, volumeConversionModel, getConvertedVolumeList, placedVolumeConversionModel} = require("../model/Volumem");
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
    const requester = req.user;
    try
    {
        const result = await getUploadedVolume(requester)
        res.status(200).send(result.data);
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send(err)
    }
}
const volumeApprovalC = async(req, res) => {
    const requester = req.user;
    const status_approval = req.params.status_approval;
    const volume_id = req.params.volume_id;
    try
    {
        await VolumeApprovalModel(requester, status_approval, volume_id)
        res.status(200).send("Updated Successfully");
    }
    catch(err)
    {
        console.
        res.status(500).send(err)
    }
}
const getVolumeInstructorViewController = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await getVolumeInstructorViewModel(requester);
        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}

// const updateVolumeConController = async(req, res) => {
//         const requester = req.user;
//         const volume_id = req.params.volume_id;
//         try
//         {
//             const result = await volumeConversionModel(requester, volume_id);
//             res.status(200).json({
//                     success: true,
//                     volume_id,
//                     status: "RUNNING",   // ✅ explicitly say this
//                     message: "Volume conversion started"
//             });
//         }
//         catch(err)
//         {
//                 res.status(500).send(err)
//         }
// }

///working good so far but needs betterment
const updateVolumeConController = async (req, res) => {
    const requester = req.user;
    const volume_id = req.params.volume_id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(volume_id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid volume ID format"
        });
    }
    try {
        const result = await volumeConversionModel(requester, volume_id);
        if (result.code === 401) {
            return res.status(401).json({
                success: false,
                error: result.message
            });
        }
        if (result.code === 404) {
            return res.status(404).json({
                success: false,
                error: result.message
            });
        }
        if (result.code === 409) {
            return res.status(409).json({
                success: false,
                error: result.message,
                volume_id: volume_id
            });
        }
        res.status(200).json({
            success: true,
            volume_id: volume_id,
            status: "RUNNING",
            message: "Volume conversion started successfully",
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Conversion start error:', err);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: err.message
        });
    }
};
const getConvVolumeListController = async(req, res) => {
    const requester = req.user;
    try
    {
        const response = await getConvertedVolumeList(requester);
        res.status(200).json(response);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}
// const volumePlacementController = async(req, res) => {
//     const requester = req.user;
//     const {volume_id} = req.body;
//     const placed_file = req.file;
//     try
//     {
//         if(!placed_file)
//         {
//             return res.status(400).send("No file uploaded");
//         }   
//         if(placed_file.mimetype !== 'application/json') {
//             return res.status(400).send("Invalid file format. Only JSON files are allowed.");
//         }
//         const fileExtension = placed_file.originalname.split('.').pop().toLowerCase();

//         if(fileExtension !== 'json') {
//             return res.status(400).send("Invalid file extension. Only .json files are allowed.");
//         }

//         try {
//             const fileContent = placed_file.buffer.toString('utf-8');
//             JSON.parse(fileContent);
//         } catch(jsonError) {
//             return res.status(400).send("Invalid JSON content. File contains malformed JSON.");
//         }
//         await placedVolumeConversionModel(requester, volume_id, placed_file);
//         res.status(200).send("Volume Placed Successfully");
//     }
//     catch(err)
//     {
//         res.status(500).send(err)
//     }
// }


///improved version with validations
const volumePlacementController = async(req, res) => {
    const requester = req.user;
    const {volume_id} = req.body;
    const placed_file = req.file;
    try {
        if(!placed_file) {
            return res.status(400).send("No file uploaded");
        }
        
        if(placed_file.mimetype !== 'application/json') {
            return res.status(400).send("Invalid file format. Only JSON files are allowed.");
        }
        
        const fileExtension = placed_file.originalname.split('.').pop().toLowerCase();
        if(fileExtension !== 'json') {
            return res.status(400).send("Invalid file extension. Only .json files are allowed.");
        }
        
        try {
            const fileContent = placed_file.buffer.toString('utf-8');
            JSON.parse(fileContent);
        } catch(jsonError) {
            return res.status(400).send("Invalid JSON content. File contains malformed JSON.");
        }
        
        const fileName = `volume_placements/${volume_id}_${Date.now()}.json`;
        const { data, error } = await client.storage
            .from(process.env.BUCKET_NAME)
            .upload(fileName, placed_file.buffer, {
                contentType: 'application/json',
                upsert: false
            });
        
        if(error) {
            throw new Error(`Supabase upload failed: ${error.message}`);
        }
        
        const { data: { publicUrl } } = client.storage
            .from(process.env.BUCKET_NAME)
            .getPublicUrl(fileName);
        
        await placedVolumeConversionModel(requester, volume_id, publicUrl);
        
        res.status(200).send({
            message: "Volume Placed Successfully",
            fileUrl: publicUrl
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).send(err.message || "Internal server error");
    }
}
module.exports = {VolumeController, getVolumeDataC, volumeApprovalC, getVolumeInstructorViewController, updateVolumeConController, getConvVolumeListController, volumePlacementController}