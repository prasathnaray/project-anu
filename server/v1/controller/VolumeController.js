const client = require('../utils/supaBaseConfig.js');
const {svUploadModel, getUploadedVolume, VolumeApprovalModel, getVolumeInstructorViewModel, volumeConversionModel, getConvertedVolumeList, placedVolumeConversionModel, volumeRecordingsModel, associateVolumeModel} = require("../model/Volumem");
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
        res.status(200).json(response.data.rows);
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
const volRecordingC = async(req, res) => {
    const requester = req.user;
    const {volume_id, recording_name, recording_type} = req.body;
    
    try {
        // Debug: Log what we received
        // console.log('=== DEBUGGING FILE UPLOAD ===');
        // console.log('req.files:', JSON.stringify(req.files, null, 2));
        // console.log('req.body:', req.body);
        // console.log('File field names:', req.files ? Object.keys(req.files) : 'No files');
        // console.log('===========================');
        
        // Access multiple files from req.files (not req.file)
        const recording_file = req.files?.recording_file?.[0];
        const audio_file = req.files?.audio_file?.[0];
        
        // console.log('Parsed recording_file:', recording_file ? 'EXISTS' : 'MISSING');
        // console.log('Parsed audio_file:', audio_file ? 'EXISTS' : 'MISSING');
        
        // Validate both files are present (FIXED: changed && to ||)
        if(!recording_file || !audio_file) {
            return res.status(400).json({
                error: "Both recording file and audio file are required",
                received: {
                    recording_file: !!recording_file,
                    audio_file: !!audio_file
                }
            });
        }
        
        // Validate JSON recording file
        if(recording_file.mimetype !== 'application/json') {
            return res.status(400).json({
                error: "Invalid recording file format. Only JSON files are allowed.",
                received: recording_file.mimetype
            });
        }
        
        const fileExtension = recording_file.originalname.split('.').pop().toLowerCase();
        if(fileExtension !== 'json') {
            return res.status(400).json({
                error: "Invalid file extension. Only .json files are allowed.",
                received: fileExtension
            });
        }
        
        // Validate JSON content
        let jsonContent;
        try {
            const fileContent = recording_file.buffer.toString('utf-8');
            jsonContent = JSON.parse(fileContent);
        } catch(jsonError) {
            return res.status(400).json({
                error: "Invalid JSON content. File contains malformed JSON.",
                details: jsonError.message
            });
        }
        
        // Validate audio file
        if(!audio_file.mimetype.startsWith('audio/') && audio_file.mimetype !== 'application/octet-stream') {
            return res.status(400).json({
                error: "Invalid audio file format. Only audio files are allowed.",
                received: audio_file.mimetype
            });
        }
        
        const audioExtension = audio_file.originalname.split('.').pop().toLowerCase();
        if(audioExtension !== 'wav') {
            return res.status(400).json({
                error: "Invalid audio file extension. Only .wav files are allowed.",
                received: audioExtension
            });
        }
        
        // Upload JSON recording file
        const jsonFileName = `volume_recordings/${volume_id}_${Date.now()}.json`;
        const { data: jsonData, error: jsonError } = await client.storage
            .from(process.env.BUCKET_NAME)
            .upload(jsonFileName, recording_file.buffer, {
                contentType: 'application/json',
                upsert: false
            });
        
        if(jsonError) {
            throw new Error(`JSON upload failed: ${jsonError.message}`);
        }
        
        // Upload audio file
        const audioFileName = `volume_audio/${volume_id}_${Date.now()}.wav`;
        const { data: audioData, error: audioError } = await client.storage
            .from(process.env.BUCKET_NAME)
            .upload(audioFileName, audio_file.buffer, {
                contentType: 'audio/wav',
                upsert: false
            });
        
        if(audioError) {
            throw new Error(`Audio upload failed: ${audioError.message}`);
        }
        
        // Get public URLs
        const { data: { publicUrl: jsonUrl } } = client.storage
            .from(process.env.BUCKET_NAME)
            .getPublicUrl(jsonFileName);
        
        const { data: { publicUrl: audioUrl } } = client.storage
            .from(process.env.BUCKET_NAME)
            .getPublicUrl(audioFileName);
        
        // Save to database using your model
        const dbResult = await volumeRecordingsModel(
            requester, 
            volume_id, 
            recording_name, 
            recording_type, 
            jsonUrl, 
            audioUrl
        );
        
        // Check authorization response from model
        if(dbResult.status === 'Unauthorized') {
            return res.status(401).json({
                error: dbResult.message
            });
        }
        
        res.status(200).json({
            message: "Volume Recording Uploaded Successfully",
            recordingUrl: jsonUrl,
            audioUrl: audioUrl,
            data: dbResult
        });
    }
    catch(err) {
        console.error('Volume recording upload error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const assocVolumeController = async(req, res) => {
    const requester = req.user;
    const {r_id, volume_id} = req.body;
    try
    {
        await associateVolumeModel(requester, r_id, volume_id);
        res.status(200).send("Associated Successfully");
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {VolumeController, getVolumeDataC, volumeApprovalC, getVolumeInstructorViewController, updateVolumeConController, getConvVolumeListController, volumePlacementController, volRecordingC, assocVolumeController}