const client = require('../utils/supaBaseConfig.js');
const {svUploadModel, getUploadedVolume, VolumeApprovalModel, getVolumeInstructorViewModel, volumeConversionModel, getConvertedVolumeList, placedVolumeConversionModel, getVolumePlacementsModel, volumeRecordingsModel, associateVolumeModel, shadowRecoringDataModel, getVolumeRecordingCountsModel, getAssociatedVolumeModel} = require("../model/Volumem");
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
        const {
            volume_type,
            volume_name,
            volume_ga,
            volume_fetal_presentation,
            trimester,
            description
        } = req.body;
        if(!volume_type || !volume_name || !volume_ga || !volume_fetal_presentation || !trimester || !description)
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
        const result = await svUploadModel(
            requester,
            volume_type,
            volume_name,
            volume_ga,
            volume_fetal_presentation,
            trimester,
            description,
            filePath
        )
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
            job_id: result.job_id,
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
const getVolumePlacementsController = async(req, res) => {
    const requester = req.user;
    const volume_id = req.params.volume_id || req.query.volume_id || null;
    try {
        const result = await getVolumePlacementsModel(requester, volume_id);
        if (result.code === 401) {
            return res.status(401).json({
                error: result.message
            });
        }

        res.status(200).json(result.data);
    }
    catch(err) {
        console.error('Get volume placements error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
}
const getVolumePlacementsByVolumeIdController = async(req, res) => {
    if (!req.params.volume_id && !req.query.volume_id) {
        return res.status(400).json({
            error: 'volume_id is required'
        });
    }

    return getVolumePlacementsController(req, res);
}
// const volRecordingC = async(req, res) => {
//     const requester = req.user;
//     const {volume_id, recording_name, recording_type} = req.body;
    
//     try {
//         // Debug: Log what we received
//         // console.log('=== DEBUGGING FILE UPLOAD ===');
//         // console.log('req.files:', JSON.stringify(req.files, null, 2));
//         // console.log('req.body:', req.body);
//         // console.log('File field names:', req.files ? Object.keys(req.files) : 'No files');
//         // console.log('===========================');
        
//         // Access multiple files from req.files (not req.file)
//         const recording_file = req.files?.recording_file?.[0];
//         const audio_file = req.files?.audio_file?.[0];
        
//         // console.log('Parsed recording_file:', recording_file ? 'EXISTS' : 'MISSING');
//         // console.log('Parsed audio_file:', audio_file ? 'EXISTS' : 'MISSING');
        
//         // Validate both files are present (FIXED: changed && to ||)
//         if(!recording_file || !audio_file) {
//             return res.status(400).json({
//                 error: "Both recording file and audio file are required",
//                 received: {
//                     recording_file: !!recording_file,
//                     audio_file: !!audio_file
//                 }
//             });
//         }
        
//         // Validate JSON recording file
//         if(recording_file.mimetype !== 'application/json') {
//             return res.status(400).json({
//                 error: "Invalid recording file format. Only JSON files are allowed.",
//                 received: recording_file.mimetype
//             });
//         }
        
//         const fileExtension = recording_file.originalname.split('.').pop().toLowerCase();
//         if(fileExtension !== 'json') {
//             return res.status(400).json({
//                 error: "Invalid file extension. Only .json files are allowed.",
//                 received: fileExtension
//             });
//         }
        
//         // Validate JSON content
//         let jsonContent;
//         try {
//             const fileContent = recording_file.buffer.toString('utf-8');
//             jsonContent = JSON.parse(fileContent);
//         } catch(jsonError) {
//             return res.status(400).json({
//                 error: "Invalid JSON content. File contains malformed JSON.",
//                 details: jsonError.message
//             });
//         }
        
//         // Validate audio file
//         if(!audio_file.mimetype.startsWith('audio/') && audio_file.mimetype !== 'application/octet-stream') {
//             return res.status(400).json({
//                 error: "Invalid audio file format. Only audio files are allowed.",
//                 received: audio_file.mimetype
//             });
//         }
        
//         const audioExtension = audio_file.originalname.split('.').pop().toLowerCase();
//         if(audioExtension !== 'wav') {
//             return res.status(400).json({
//                 error: "Invalid audio file extension. Only .wav files are allowed.",
//                 received: audioExtension
//             });
//         }
        
//         // Upload JSON recording file
//         const jsonFileName = `volume_recordings/${volume_id}_${Date.now()}.json`;
//         const { data: jsonData, error: jsonError } = await client.storage
//             .from(process.env.BUCKET_NAME)
//             .upload(jsonFileName, recording_file.buffer, {
//                 contentType: 'application/json',
//                 upsert: false
//             });
        
//         if(jsonError) {
//             throw new Error(`JSON upload failed: ${jsonError.message}`);
//         }
        
//         // Upload audio file
//         const audioFileName = `volume_audio/${volume_id}_${Date.now()}.wav`;
//         const { data: audioData, error: audioError } = await client.storage
//             .from(process.env.BUCKET_NAME)
//             .upload(audioFileName, audio_file.buffer, {
//                 contentType: 'audio/wav',
//                 upsert: false
//             });
        
//         if(audioError) {
//             throw new Error(`Audio upload failed: ${audioError.message}`);
//         }
        
//         // Get public URLs
//         const { data: { publicUrl: jsonUrl } } = client.storage
//             .from(process.env.BUCKET_NAME)
//             .getPublicUrl(jsonFileName);
        
//         const { data: { publicUrl: audioUrl } } = client.storage
//             .from(process.env.BUCKET_NAME)
//             .getPublicUrl(audioFileName);
        
//         // Save to database using your model
//         const dbResult = await volumeRecordingsModel(
//             requester, 
//             volume_id, 
//             recording_name, 
//             recording_type, 
//             jsonUrl, 
//             audioUrl
//         );
        
//         // Check authorization response from model
//         if(dbResult.status === 'Unauthorized') {
//             return res.status(401).json({
//                 error: dbResult.message
//             });
//         }
        
//         res.status(200).json({
//             message: "Volume Recording Uploaded Successfully",
//             recordingUrl: jsonUrl,
//             audioUrl: audioUrl,
//             data: dbResult
//         });
//     }
//     catch(err) {
//         console.error('Volume recording upload error:', err);
//         res.status(500).json({
//             error: 'Internal server error',
//             message: err.message
//         });
//     }
// };
//vol recoding upload is working below but yet im making changes in the next set of codes
// const volRecordingC = async(req, res) => {
//     const requester = req.user;
//     const {volume_id, recording_name, recording_type} = req.body;
    
//     try {
//         // Validate recording_type
//         if (!recording_type || !['shadow', 'step'].includes(recording_type)) {
//             return res.status(400).json({
//                 error: "Invalid recording_type. Must be 'shadow' or 'step'",
//                 received: recording_type
//             });
//         }
        
//         // Access files from req.files
//         const recording_files = req.files?.recording_file || [];
//         const audio_files = req.files?.audio_file || [];
        
//         // Validate based on recording type
//         if (recording_type === 'shadow') {
//             // Shadow: expect exactly 1 file of each type
//             if (recording_files.length !== 1 || audio_files.length !== 1) {
//                 return res.status(400).json({
//                     error: "Shadow recording requires exactly 1 recording file and 1 audio file",
//                     received: {
//                         recording_files: recording_files.length,
//                         audio_files: audio_files.length
//                     }
//                 });
//             }
//         } else {
//             // Step: expect multiple files and equal counts
//             if (recording_files.length === 0 || audio_files.length === 0) {
//                 return res.status(400).json({
//                     error: "Step recording requires at least 1 recording file and 1 audio file",
//                     received: {
//                         recording_files: recording_files.length,
//                         audio_files: audio_files.length
//                     }
//                 });
//             }
            
//             if (recording_files.length !== audio_files.length) {
//                 return res.status(400).json({
//                     error: "Number of recording files must match number of audio files for step recording",
//                     received: {
//                         recording_files: recording_files.length,
//                         audio_files: audio_files.length
//                     }
//                 });
//             }
//         }
        
//         // Process and upload all files
//         const uploadedRecordings = [];
//         const uploadedAudio = [];
//         const timestamp = Date.now();
        
//         for (let i = 0; i < recording_files.length; i++) {
//             const recording_file = recording_files[i];
//             const audio_file = audio_files[i];
            
//             // Validate JSON recording file
//             if (recording_file.mimetype !== 'application/json') {
//                 return res.status(400).json({
//                     error: `Invalid recording file format at index ${i}. Only JSON files are allowed.`,
//                     received: recording_file.mimetype,
//                     filename: recording_file.originalname
//                 });
//             }
            
//             const fileExtension = recording_file.originalname.split('.').pop().toLowerCase();
//             if (fileExtension !== 'json') {
//                 return res.status(400).json({
//                     error: `Invalid file extension at index ${i}. Only .json files are allowed.`,
//                     received: fileExtension,
//                     filename: recording_file.originalname
//                 });
//             }
            
//             // Validate JSON content
//             try {
//                 const fileContent = recording_file.buffer.toString('utf-8');
//                 JSON.parse(fileContent);
//             } catch(jsonError) {
//                 return res.status(400).json({
//                     error: `Invalid JSON content at index ${i}. File contains malformed JSON.`,
//                     details: jsonError.message,
//                     filename: recording_file.originalname
//                 });
//             }
            
//             // Validate audio file
//             if (!audio_file.mimetype.startsWith('audio/') && audio_file.mimetype !== 'application/octet-stream') {
//                 return res.status(400).json({
//                     error: `Invalid audio file format at index ${i}. Only audio files are allowed.`,
//                     received: audio_file.mimetype,
//                     filename: audio_file.originalname
//                 });
//             }
            
//             const audioExtension = audio_file.originalname.split('.').pop().toLowerCase();
//             if (audioExtension !== 'wav') {
//                 return res.status(400).json({
//                     error: `Invalid audio file extension at index ${i}. Only .wav files are allowed.`,
//                     received: audioExtension,
//                     filename: audio_file.originalname
//                 });
//             }
            
//             // Upload JSON recording file
//             const jsonFileName = `volume_recordings/${volume_id}_${timestamp}_${i}.json`;
//             const { data: jsonData, error: jsonError } = await client.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(jsonFileName, recording_file.buffer, {
//                     contentType: 'application/json',
//                     upsert: false
//                 });
            
//             if (jsonError) {
//                 throw new Error(`JSON upload failed at index ${i}: ${jsonError.message}`);
//             }
            
//             // Upload audio file
//             const audioFileName = `volume_audio/${volume_id}_${timestamp}_${i}.wav`;
//             const { data: audioData, error: audioError } = await client.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(audioFileName, audio_file.buffer, {
//                     contentType: 'audio/wav',
//                     upsert: false
//                 });
            
//             if (audioError) {
//                 throw new Error(`Audio upload failed at index ${i}: ${audioError.message}`);
//             }
            
//             // Get public URLs
//             const { data: { publicUrl: jsonUrl } } = client.storage
//                 .from(process.env.BUCKET_NAME)
//                 .getPublicUrl(jsonFileName);
            
//             const { data: { publicUrl: audioUrl } } = client.storage
//                 .from(process.env.BUCKET_NAME)
//                 .getPublicUrl(audioFileName);
            
//             uploadedRecordings.push(jsonUrl);
//             uploadedAudio.push(audioUrl);
//         }
        
//         // Save to database using your model
//         // For shadow: arrays will have 1 element each
//         // For step: arrays will have multiple elements
//         const dbResult = await volumeRecordingsModel(
//             requester, 
//             volume_id, 
//             recording_name, 
//             recording_type, 
//             uploadedRecordings,  // Array of recording URLs
//             uploadedAudio        // Array of audio URLs
//         );
        
//         // Check authorization response from model
//         if (dbResult.status === 'Unauthorized') {
//             return res.status(401).json({
//                 error: dbResult.message
//             });
//         }
        
//         res.status(200).json({
//             message: `Volume ${recording_type} Recording Uploaded Successfully`,
//             recordingType: recording_type,
//             filesUploaded: uploadedRecordings.length,
//             recordingUrls: uploadedRecordings,
//             audioUrls: uploadedAudio,
//             data: dbResult
//         });
//     }
//     catch(err) {
//         console.error('Volume recording upload error:', err);
//         res.status(500).json({
//             error: 'Internal server error',
//             message: err.message
//         });
//     }
// }

///refined version after testing
const volRecordingC = async(req, res) => {
    const requester = req.user;
    const {volume_id, recording_name, recording_type} = req.body;
    
    try {
        // Validate recording_type
        if (!recording_type || !['shadow', 'step'].includes(recording_type)) {
            return res.status(400).json({
                error: "Invalid recording_type. Must be 'shadow' or 'step'",
                received: recording_type
            });
        }
        
        // Access file arrays from the multipart request.
        const recording_files = req.files?.recording_file || [];
        const audio_files = req.files?.audio_file || [];
        const image_files = req.files?.images || [];
        const manifest_file = req.files?.manifest_file?.[0];
        
        // Both recording types require one or more files in all repeatable groups and one manifest.
        if (recording_files.length === 0 || audio_files.length === 0 || image_files.length === 0 || !manifest_file) {
            return res.status(400).json({
                error: "Shadow and step recordings require at least 1 JSON file, 1 WAV file, 1 image, and 1 manifest file",
                received: {
                    recording_files: recording_files.length,
                    audio_files: audio_files.length,
                    images: image_files.length,
                    manifest_file: manifest_file ? 1 : 0
                }
            });
        }

        // Validate every file before uploading any of them.
        for (let i = 0; i < recording_files.length; i++) {
            const recording_file = recording_files[i];
            const fileExtension = path.extname(recording_file.originalname).slice(1).toLowerCase();

            const isJsonMime = ['application/json', 'application/octet-stream'].includes(recording_file.mimetype);
            if (!isJsonMime || fileExtension !== 'json') {
                return res.status(400).json({
                    error: `Invalid recording file at index ${i}. Only .json files are allowed.`,
                    received: recording_file.mimetype,
                    filename: recording_file.originalname
                });
            }

            try {
                JSON.parse(recording_file.buffer.toString('utf-8'));
            } catch(jsonError) {
                return res.status(400).json({
                    error: `Invalid JSON content at index ${i}. File contains malformed JSON.`,
                    details: jsonError.message,
                    filename: recording_file.originalname
                });
            }
        }

        for (let i = 0; i < audio_files.length; i++) {
            const audio_file = audio_files[i];
            const audioExtension = path.extname(audio_file.originalname).slice(1).toLowerCase();

            if (!audio_file.mimetype.startsWith('audio/') && audio_file.mimetype !== 'application/octet-stream') {
                return res.status(400).json({
                    error: `Invalid audio file format at index ${i}. Only audio files are allowed.`,
                    received: audio_file.mimetype,
                    filename: audio_file.originalname
                });
            }
            
            if (audioExtension !== 'wav') {
                return res.status(400).json({
                    error: `Invalid audio file extension at index ${i}. Only .wav files are allowed.`,
                    received: audioExtension,
                    filename: audio_file.originalname
                });
            }
            
        }

        const imageContentTypes = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            webp: 'image/webp',
            gif: 'image/gif',
            bmp: 'image/bmp'
        };
        for (let i = 0; i < image_files.length; i++) {
            const image_file = image_files[i];
            const imageExtension = path.extname(image_file.originalname).slice(1).toLowerCase();
            const isImageMime = image_file.mimetype.startsWith('image/') || image_file.mimetype === 'application/octet-stream';

            if (!isImageMime || !imageContentTypes[imageExtension]) {
                return res.status(400).json({
                    error: `Invalid image file at index ${i}. Allowed extensions: png, jpg, jpeg, webp, gif, bmp.`,
                    received: image_file.mimetype,
                    filename: image_file.originalname
                });
            }
        }

        const manifestExtension = path.extname(manifest_file.originalname).slice(1).toLowerCase();
        const manifestContentTypes = {
            json: 'application/json',
            manifest: 'text/plain'
        };
        const isManifestMime = [
            'application/json',
            'text/plain',
            'application/octet-stream'
        ].includes(manifest_file.mimetype);

        if (!isManifestMime || !manifestContentTypes[manifestExtension]) {
            return res.status(400).json({
                error: 'Invalid manifest file. Only .json or .manifest files are allowed.',
                received: manifest_file.mimetype,
                filename: manifest_file.originalname
            });
        }

        if (manifestExtension === 'json') {
            try {
                JSON.parse(manifest_file.buffer.toString('utf-8'));
            } catch(manifestError) {
                return res.status(400).json({
                    error: 'Invalid manifest JSON. File contains malformed JSON.',
                    details: manifestError.message,
                    filename: manifest_file.originalname
                });
            }
        }

        const timestamp = Date.now();
        const uploadedRecordings = [];
        const uploadedAudio = [];
        const uploadedImages = [];

        for (let i = 0; i < recording_files.length; i++) {
            const recording_file = recording_files[i];
            const jsonFileName = `volume_recordings/${volume_id}_${timestamp}_${i}.json`;
            const { error: jsonError } = await client.storage
                .from(process.env.BUCKET_NAME)
                .upload(jsonFileName, recording_file.buffer, {
                    contentType: 'application/json',
                    upsert: false
                });

            if (jsonError) {
                throw new Error(`JSON upload failed at index ${i}: ${jsonError.message}`);
            }

            const { data: { publicUrl: jsonUrl } } = client.storage
                .from(process.env.BUCKET_NAME)
                .getPublicUrl(jsonFileName);

            uploadedRecordings.push(jsonUrl);
        }

        for (let i = 0; i < audio_files.length; i++) {
            const audio_file = audio_files[i];
            const audioFileName = `volume_audio/${volume_id}_${timestamp}_${i}.wav`;
            const { error: audioError } = await client.storage
                .from(process.env.BUCKET_NAME)
                .upload(audioFileName, audio_file.buffer, {
                    contentType: 'audio/wav',
                    upsert: false
                });
            
            if (audioError) {
                throw new Error(`Audio upload failed at index ${i}: ${audioError.message}`);
            }
            
            // Get public URL for audio
            const { data: { publicUrl: audioUrl } } = client.storage
                .from(process.env.BUCKET_NAME)
                .getPublicUrl(audioFileName);
            
            uploadedAudio.push(audioUrl);
        }

        for (let i = 0; i < image_files.length; i++) {
            const image_file = image_files[i];
            const imageExtension = path.extname(image_file.originalname).slice(1).toLowerCase();
            const imageFileName = `volume_images/${volume_id}_${timestamp}_${i}.${imageExtension}`;
            const { error: imageError } = await client.storage
                .from(process.env.BUCKET_NAME)
                .upload(imageFileName, image_file.buffer, {
                    contentType: imageContentTypes[imageExtension],
                    upsert: false
                });

            if (imageError) {
                throw new Error(`Image upload failed at index ${i}: ${imageError.message}`);
            }

            const { data: { publicUrl: imageUrl } } = client.storage
                .from(process.env.BUCKET_NAME)
                .getPublicUrl(imageFileName);

            uploadedImages.push(imageUrl);
        }

        const manifestFileName = `volume_manifests/${volume_id}_${timestamp}.${manifestExtension}`;
        const { error: manifestError } = await client.storage
            .from(process.env.BUCKET_NAME)
            .upload(manifestFileName, manifest_file.buffer, {
                contentType: manifestContentTypes[manifestExtension],
                upsert: false
            });

        if (manifestError) {
            throw new Error(`Manifest upload failed: ${manifestError.message}`);
        }

        const { data: { publicUrl: manifestUrl } } = client.storage
            .from(process.env.BUCKET_NAME)
            .getPublicUrl(manifestFileName);
        
        const dbResult = await volumeRecordingsModel(
            requester, 
            volume_id, 
            recording_name, 
            recording_type, 
            uploadedRecordings,
            uploadedAudio,
            uploadedImages,
            manifestUrl
        );
        
        // Check authorization response from model
        if (dbResult.status === 'Unauthorized') {
            return res.status(401).json({
                error: dbResult.message
            });
        }
        
        res.status(200).json({
            message: `Volume ${recording_type} Recording Uploaded Successfully`,
            recordingType: recording_type,
            recordingUrl: uploadedRecordings[0],
            recordingFilesUploaded: uploadedRecordings.length,
            recordingUrls: uploadedRecordings,
            audioFilesUploaded: uploadedAudio.length,
            audioUrls: uploadedAudio,
            imageFilesUploaded: uploadedImages.length,
            imageUrls: uploadedImages,
            manifestUrl,
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
    const {r_id, volume_id, shadowrec_id, steprec_id} = req.body;
    try
    {
        await associateVolumeModel(requester, r_id, volume_id, shadowrec_id, steprec_id);
        res.status(200).send("Associated Successfully");
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
const shadowRecordingDataController = async(req, res) => {
    const requester = req.user;
    const {volume_id} = req.query;
    try
    {
        const result = await shadowRecoringDataModel(requester, volume_id);
        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
const volumeRecordingCountsController = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await getVolumeRecordingCountsModel(requester);
        if (result.code === 401) {
            return res.status(401).json({
                error: result.message
            });
        }
        res.status(200).send(result.data);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
const getAssociatedVolumeController = async(req, res) => {
    const requester = req.user;
    const {r_id} = req.query;
    try
    {
        const result = await getAssociatedVolumeModel(requester, r_id);
        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {VolumeController, getVolumeDataC, volumeApprovalC, getVolumeInstructorViewController, updateVolumeConController, getConvVolumeListController, volumePlacementController, getVolumePlacementsController, getVolumePlacementsByVolumeIdController, volRecordingC, assocVolumeController, shadowRecordingDataController, volumeRecordingCountsController, getAssociatedVolumeController}
