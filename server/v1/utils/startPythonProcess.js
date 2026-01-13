// const { spawn } = require("child_process");
// const client = require('../utils/conn.js');
// const SLICER_PATH =
//   "C:\\Users\\igrs\\AppData\\Local\\NA-MIC\\Slicer 5.10.0\\Slicer.exe";

// const SCRIPT_PATH =
//   "C:\\Users\\igrs\\project-anu\\Vol-conversion\\ConvertVolToNifti.py";

// /**
//  * Starts volume conversion asynchronously
//  * @param {string} volumeId - ID of the volume to convert
//  * @param {object} requester - User object who started conversion
//  */
// const startVolumeConversion = async(volumeId) => {
//   const python = spawn("python", [
//     "C:/Users/igrs/Documents/testing_purpose.py",
//     volumeId
//   ]);
//   python.stdout.on("data", (data) => {
//     console.log(`[${volumeId}]`, data.toString());
//   });
//   python.stderr.on("data", (err) => {
//     console.error(`[${volumeId} ERROR]`, err.toString());
//   });
//   python.on("close", async (code) => {
//     if (code === 0) {
//       // ✅ SUCCESS
//       await client.query(`
//         UPDATE volume_conv_logs
//         SET conversion_completion = true
//         WHERE volume_id = $1
//       `, [volumeId]);

//     } else {
//       await client.query(`
//         UPDATE volume_conv_logs
//         SET conversion_completion = false
//         WHERE volume_id = $1
//       `, [volumeId]);
//     }
//   });
// }
// module.exports = { startVolumeConversion };

//working good so far



//--------------------------------------------------------------------------------------------------------------------------------------
// const { spawn } = require("child_process");
// const client = require('../utils/conn.js');
// const path = require('path');
// const fs = require('fs');

// const SLICER_PATH = "C:\\Users\\igrs\\AppData\\Local\\NA-MIC\\Slicer 5.10.0\\Slicer.exe";
// const SCRIPT_PATH = "C:\\Users\\igrs\\project-anu\\Vol-conversion\\ConvertVolToNifti.py";
// const LOG_DIR = "C:\\Users\\igrs\\project-anu\\Vol-conversion\\conversion_logs";

// // Ensure log directory exists
// if (!fs.existsSync(LOG_DIR)) {
//   fs.mkdirSync(LOG_DIR, { recursive: true });
// }

// /**
//  * Starts volume conversion asynchronously using 3D Slicer
//  * @param {string} volumeId - ID of the volume to convert
//  * @returns {Promise<void>}
//  */
// const startVolumeConversion = async (volumeId) => {
//   console.log(`[${volumeId}] Starting volume conversion...`);
  
//   try {
//     // Fetch volume information from database
//     const volumeResult = await client.query(
//       'SELECT volume_id, volume_name, volume_file FROM volumes WHERE volume_id = $1',
//       [volumeId]
//     );

//     if (volumeResult.rows.length === 0) {
//       console.error(`[${volumeId}] ERROR: Volume not found in database`);
//       await updateConversionFailure(volumeId, "Volume not found in database");
//       return;
//     }

//     const volume = volumeResult.rows[0];
//     const inputPath = volume.volume_file;
//     const volumeName = volume.volume_name || 'volume';

//     console.log(`[${volumeId}] Volume name: ${volumeName}`);
//     console.log(`[${volumeId}] Input file: ${inputPath}`);

//     // Verify input file exists
//     if (!fs.existsSync(inputPath)) {
//       console.error(`[${volumeId}] ERROR: Input file not found: ${inputPath}`);
//       await updateConversionFailure(volumeId, `Input file not found: ${inputPath}`);
//       return;
//     }

//     // Verify Slicer exists
//     if (!fs.existsSync(SLICER_PATH)) {
//       console.error(`[${volumeId}] ERROR: 3D Slicer not found at: ${SLICER_PATH}`);
//       await updateConversionFailure(volumeId, "3D Slicer executable not found");
//       return;
//     }
    
//     // Verify script exists
//     if (!fs.existsSync(SCRIPT_PATH)) {
//       console.error(`[${volumeId}] ERROR: Python script not found at: ${SCRIPT_PATH}`);
//       await updateConversionFailure(volumeId, "Conversion script not found");
//       return;
//     }
    
//     // Create log file for this specific conversion
//     const conversionLogPath = path.join(LOG_DIR, `conversion_${volumeId}_${Date.now()}.log`);
//     const logStream = fs.createWriteStream(conversionLogPath, { flags: 'a' });
    
//     console.log(`[${volumeId}] Log file: ${conversionLogPath}`);
    
//     // Spawn 3D Slicer process with volume info as arguments
//     const slicerProcess = spawn(SLICER_PATH, [
//       "--no-main-window",
//       "--disable-cli-modules",
//       "--python-script",
//       SCRIPT_PATH,
//       volumeId,
//       inputPath,
//       volumeName
//     ]);
    
//     // Log process start
//     const startMessage = `[${new Date().toISOString()}] Starting conversion for volume: ${volumeId}\nInput: ${inputPath}\nName: ${volumeName}\n`;
//     logStream.write(startMessage);
//     console.log(`[${volumeId}] 3D Slicer process started (PID: ${slicerProcess.pid})`);
    
//     let conversionResult = null;
//     let stdoutBuffer = '';
    
//     // Handle stdout (standard output)
//     slicerProcess.stdout.on("data", (data) => {
//       const output = data.toString();
//       stdoutBuffer += output;
      
//       // Look for structured result
//       const resultMatch = output.match(/CONVERSION_RESULT:(\{.*\})/);
//       if (resultMatch) {
//         try {
//           conversionResult = JSON.parse(resultMatch[1]);
//           console.log(`[${volumeId}] Received conversion result:`, conversionResult);
//         } catch (e) {
//           console.error(`[${volumeId}] Failed to parse conversion result:`, e);
//         }
//       }
      
//       console.log(`[${volumeId}] ${output}`);
//       logStream.write(`[STDOUT] ${output}\n`);
//     });
    
//     // Handle stderr (error output)
//     slicerProcess.stderr.on("data", (data) => {
//       const error = data.toString();
//       console.error(`[${volumeId}] STDERR: ${error}`);
//       logStream.write(`[STDERR] ${error}\n`);
//     });
    
//     // Handle process error (e.g., failed to spawn)
//     slicerProcess.on("error", async (error) => {
//       const errorMsg = `Failed to start process: ${error.message}`;
//       console.error(`[${volumeId}] ${errorMsg}`);
//       logStream.write(`[ERROR] ${errorMsg}\n`);
//       logStream.end();
      
//       await updateConversionFailure(volumeId, errorMsg);
//     });
    
//     // Handle process completion
//     slicerProcess.on("close", async (code) => {
//       const endMessage = `[${new Date().toISOString()}] Process exited with code: ${code}\n`;
//       logStream.write(endMessage);
//       logStream.end();
      
//       console.log(`[${volumeId}] Process exited with code: ${code}`);
      
//       try {
//         if (code === 0 && conversionResult && conversionResult.success) {
//           // ✅ SUCCESS
//           console.log(`[${volumeId}] ✅ Conversion completed successfully`);
//           console.log(`[${volumeId}] Output: ${conversionResult.output_path}`);
//           console.log(`[${volumeId}] Size: ${conversionResult.output_size} bytes`);
          
//           await client.query(`
//             UPDATE volume_conv_logs
//             SET conversion_completion = true,
//                 completed_at = NOW(),
//                 error_message = NULL,
//                 output_file = $2,
//                 output_size = $3
//             WHERE volume_id = $1
//           `, [volumeId, conversionResult.output_path, conversionResult.output_size]);
          
//           await client.query(`
//             UPDATE volumes
//             SET conversion_process_status = false
//             WHERE volume_id = $1
//           `, [volumeId]);
          
//           console.log(`[${volumeId}] Database updated: conversion successful`);
          
//         } else {
//           // ❌ FAILURE
//           let errorMsg = `Conversion failed with exit code ${code}`;
          
//           if (conversionResult && !conversionResult.success) {
//             errorMsg = conversionResult.error || errorMsg;
//           }
          
//           console.error(`[${volumeId}] ❌ ${errorMsg}`);
//           await updateConversionFailure(volumeId, errorMsg);
//         }
//       } catch (dbError) {
//         console.error(`[${volumeId}] Database update error:`, dbError);
//         // Even if DB update fails, log it but don't crash
//       }
//     });

//   } catch (error) {
//     console.error(`[${volumeId}] Fatal error:`, error);
//     await updateConversionFailure(volumeId, error.message);
//   }
// };

// /**
//  * Update database when conversion fails
//  * @param {string} volumeId - Volume ID
//  * @param {string} errorMessage - Error description
//  */
// const updateConversionFailure = async (volumeId, errorMessage) => {
//   try {
//     await client.query(`
//       UPDATE volume_conv_logs
//       SET conversion_completion = false,
//           completed_at = NOW(),
//           error_message = $2
//       WHERE volume_id = $1
//     `, [volumeId, errorMessage]);
    
//     await client.query(`
//       UPDATE volumes
//       SET conversion_process_status = false
//       WHERE volume_id = $1
//     `, [volumeId]);
    
//     console.log(`[${volumeId}] Database updated: conversion failed`);
//   } catch (error) {
//     console.error(`[${volumeId}] Failed to update database:`, error);
//   }
// };

// /**
//  * Check conversion status for a volume
//  * @param {string} volumeId - Volume ID
//  * @returns {Promise<Object>} Status information
//  */
// const getConversionStatus = async (volumeId) => {
//   try {
//     const result = await client.query(`
//       SELECT 
//         v.volume_id,
//         v.volume_name,
//         v.conversion_process_status,
//         vcl.conversion_completion,
//         vcl.started_at,
//         vcl.completed_at,
//         vcl.error_message,
//         vcl.output_file,
//         vcl.output_size,
//         vcl.converted_by
//       FROM volumes v
//       LEFT JOIN volume_conv_logs vcl ON v.volume_id = vcl.volume_id
//       WHERE v.volume_id = $1
//     `, [volumeId]);
    
//     if (result.rows.length === 0) {
//       return null;
//     }
    
//     return result.rows[0];
//   } catch (error) {
//     console.error(`Error fetching conversion status:`, error);
//     throw error;
//   }
// };

// module.exports = { 
//   startVolumeConversion,
//   getConversionStatus 
// };

//--------------------------------------------------------------------------------------------------------------------------------------

const { spawn } = require("child_process");
const client = require('../utils/conn.js');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const https = require('https');

const SLICER_PATH = "C:\\Users\\igrs\\AppData\\Local\\slicer.org\\3D Slicer 5.10.0\\Slicer.exe"
const SCRIPT_PATH = "C:\\Users\\igrs\\project-anu\\Vol-conversion\\ConvertVolToNifti.py";
const LOG_DIR = "C:\\Users\\igrs\\project-anu\\Vol-conversion\\conversion_logs";
const TEMP_DOWNLOAD_DIR = "C:\\Users\\igrs\\project-anu\\Vol-conversion\\temp_downloads";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://rnrnzmqtvcyqhpakynls.supabase.co',
  process.env.SUPABASE_KEY // Add your Supabase anon/service key here
);

// Ensure directories exist
[LOG_DIR, TEMP_DOWNLOAD_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Download file from Supabase Storage
 * @param {string} storagePath - Path in Supabase storage (e.g., "volumes/FL - I0000004.vol")
 * @param {string} volumeId - Volume ID for logging
 * @returns {Promise<string>} Local file path
 */
const downloadFromSupabase = async (storagePath, volumeId) => {
  console.log(`[${volumeId}] Downloading from Supabase: ${storagePath}`);
  
  // Extract bucket and file path
  // Assuming storagePath is like "volumes/filename.vol"
  const bucket = 'projectanu'; // Your bucket name
  const filePath = storagePath;
  
  try {
    // Get public URL or signed URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);
    
    if (error) {
      throw new Error(`Supabase download error: ${error.message}`);
    }
    
    // Create local filename
    const fileName = path.basename(filePath);
    const localPath = path.join(TEMP_DOWNLOAD_DIR, `${volumeId}_${fileName}`);
    
    // Convert blob to buffer and save
    const buffer = Buffer.from(await data.arrayBuffer());
    fs.writeFileSync(localPath, buffer);
    
    const fileSize = fs.statSync(localPath).size;
    console.log(`[${volumeId}] Downloaded ${fileSize} bytes to: ${localPath}`);
    
    return localPath;
    
  } catch (error) {
    console.error(`[${volumeId}] Download failed:`, error);
    throw error;
  }
};

/**
 * Download file using direct URL (alternative method)
 * @param {string} url - Full Supabase URL
 * @param {string} volumeId - Volume ID
 * @returns {Promise<string>} Local file path
 */
const downloadFromUrl = (url, volumeId) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(url.split('?')[0]); // Remove query params
    const localPath = path.join(TEMP_DOWNLOAD_DIR, `${volumeId}_${fileName}`);
    const file = fs.createWriteStream(localPath);
    
    console.log(`[${volumeId}] Downloading from URL: ${url}`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const fileSize = fs.statSync(localPath).size;
        console.log(`[${volumeId}] Downloaded ${fileSize} bytes to: ${localPath}`);
        resolve(localPath);
      });
      
    }).on('error', (err) => {
      fs.unlink(localPath, () => {}); // Delete incomplete file
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(localPath, () => {});
      reject(err);
    });
  });
};

/**
 * Starts volume conversion asynchronously using 3D Slicer
 * @param {string} volumeId - ID of the volume to convert
 * @returns {Promise<void>}
 */
const startVolumeConversion = async (volumeId) => {
  console.log(`[${volumeId}] Starting volume conversion...`);
  
  let downloadedFilePath = null;
  
  try {
    // Fetch volume information from database
    const volumeResult = await client.query(
      'SELECT volume_id, volume_name, volume_file FROM volumes WHERE volume_id = $1',
      [volumeId]
    );

    if (volumeResult.rows.length === 0) {
      console.error(`[${volumeId}] ERROR: Volume not found in database`);
      await updateConversionFailure(volumeId, "Volume not found in database");
      return;
    }

    const volume = volumeResult.rows[0];
    const storagePath = volume.volume_file; // e.g., "volumes/FL - I0000004.vol"
    const volumeName = volume.volume_name || 'volume';

    console.log(`[${volumeId}] Volume name: ${volumeName}`);
    console.log(`[${volumeId}] Storage path: ${storagePath}`);

    // Download file from Supabase
    try {
      downloadedFilePath = await downloadFromSupabase(storagePath, volumeId);
    } catch (downloadError) {
      console.error(`[${volumeId}] Supabase SDK download failed, trying direct URL...`);
      
      // Fallback: construct public URL and download
      const publicUrl = `https://rnrnzmqtvcyqhpakynls.supabase.co/storage/v1/object/public/projectanu/${storagePath}`;
      downloadedFilePath = await downloadFromUrl(publicUrl, volumeId);
    }

    // Verify downloaded file exists
    if (!fs.existsSync(downloadedFilePath)) {
      throw new Error(`Downloaded file not found: ${downloadedFilePath}`);
    }

    // Verify Slicer exists
    if (!fs.existsSync(SLICER_PATH)) {
      console.error(`[${volumeId}] ERROR: 3D Slicer not found at: ${SLICER_PATH}`);
      await updateConversionFailure(volumeId, "3D Slicer executable not found");
      return;
    }
    
    // Verify script exists
    if (!fs.existsSync(SCRIPT_PATH)) {
      console.error(`[${volumeId}] ERROR: Python script not found at: ${SCRIPT_PATH}`);
      await updateConversionFailure(volumeId, "Conversion script not found");
      return;
    }
    
    // Create log file for this specific conversion
    const conversionLogPath = path.join(LOG_DIR, `conversion_${volumeId}_${Date.now()}.log`);
    const logStream = fs.createWriteStream(conversionLogPath, { flags: 'a' });
    
    console.log(`[${volumeId}] Log file: ${conversionLogPath}`);
    
    // Spawn 3D Slicer process with downloaded file path
    const slicerProcess = spawn(SLICER_PATH, [
      "--no-main-window",
      "--disable-cli-modules",
      "--python-script",
      SCRIPT_PATH,
      volumeId,
      downloadedFilePath, // Use downloaded local file
      volumeName
    ]);
    
    // Log process start
    const startMessage = `[${new Date().toISOString()}] Starting conversion for volume: ${volumeId}\nStorage path: ${storagePath}\nLocal file: ${downloadedFilePath}\nName: ${volumeName}\n`;
    logStream.write(startMessage);
    console.log(`[${volumeId}] 3D Slicer process started (PID: ${slicerProcess.pid})`);
    
    let conversionResult = null;
    let stdoutBuffer = '';
    
    // Handle stdout (standard output)
    slicerProcess.stdout.on("data", (data) => {
      const output = data.toString();
      stdoutBuffer += output;
      
      // Look for structured result
      const resultMatch = output.match(/CONVERSION_RESULT:(\{.*\})/);
      if (resultMatch) {
        try {
          conversionResult = JSON.parse(resultMatch[1]);
          console.log(`[${volumeId}] Received conversion result:`, conversionResult);
        } catch (e) {
          console.error(`[${volumeId}] Failed to parse conversion result:`, e);
        }
      }
      
      console.log(`[${volumeId}] ${output}`);
      logStream.write(`[STDOUT] ${output}\n`);
    });
    
    // Handle stderr (error output)
    slicerProcess.stderr.on("data", (data) => {
      const error = data.toString();
      console.error(`[${volumeId}] STDERR: ${error}`);
      logStream.write(`[STDERR] ${error}\n`);
    });
    
    // Handle process error (e.g., failed to spawn)
    slicerProcess.on("error", async (error) => {
      const errorMsg = `Failed to start process: ${error.message}`;
      console.error(`[${volumeId}] ${errorMsg}`);
      logStream.write(`[ERROR] ${errorMsg}\n`);
      logStream.end();
      
      // Cleanup downloaded file
      cleanupDownloadedFile(downloadedFilePath, volumeId);
      
      await updateConversionFailure(volumeId, errorMsg);
    });
    
    // Handle process completion
    slicerProcess.on("close", async (code) => {
      const endMessage = `[${new Date().toISOString()}] Process exited with code: ${code}\n`;
      logStream.write(endMessage);
      logStream.end();
      
      console.log(`[${volumeId}] Process exited with code: ${code}`);
      
      // Cleanup downloaded file after conversion
      cleanupDownloadedFile(downloadedFilePath, volumeId);
      
      try {
        if (code === 0 && conversionResult && conversionResult.success) {
          // ✅ SUCCESS
          console.log(`[${volumeId}] ✅ Conversion completed successfully`);
          console.log(`[${volumeId}] Output: ${conversionResult.output_path}`);
          console.log(`[${volumeId}] Size: ${conversionResult.output_size} bytes`);
          
          await client.query(`
            UPDATE volume_conv_logs
            SET conversion_completion = true,
                completed_at = NOW(),
                error_message = NULL,
                output_file = $2,
                output_size = $3
            WHERE volume_id = $1
          `, [volumeId, conversionResult.output_path, conversionResult.output_size]);
          
          await client.query(`
            UPDATE volumes
            SET conversion_process_status = false
            WHERE volume_id = $1
          `, [volumeId]);
          
          console.log(`[${volumeId}] Database updated: conversion successful`);
          
        } else {
          // ❌ FAILURE
          let errorMsg = `Conversion failed with exit code ${code}`;
          
          if (conversionResult && !conversionResult.success) {
            errorMsg = conversionResult.error || errorMsg;
          }
          
          console.error(`[${volumeId}] ❌ ${errorMsg}`);
          await updateConversionFailure(volumeId, errorMsg);
        }
      } catch (dbError) {
        console.error(`[${volumeId}] Database update error:`, dbError);
      }
    });

  } catch (error) {
    console.error(`[${volumeId}] Fatal error:`, error);
    
    // Cleanup downloaded file on error
    if (downloadedFilePath) {
      cleanupDownloadedFile(downloadedFilePath, volumeId);
    }
    
    await updateConversionFailure(volumeId, error.message);
  }
};

/**
 * Clean up downloaded temporary file
 * @param {string} filePath - Path to file to delete
 * @param {string} volumeId - Volume ID for logging
 */
const cleanupDownloadedFile = (filePath, volumeId) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`[${volumeId}] Cleaned up temporary file: ${filePath}`);
    } catch (err) {
      console.error(`[${volumeId}] Failed to cleanup file ${filePath}:`, err);
    }
  }
};

/**
 * Update database when conversion fails
 * @param {string} volumeId - Volume ID
 * @param {string} errorMessage - Error description
 */
const updateConversionFailure = async (volumeId, errorMessage) => {
  try {
    await client.query(`
      UPDATE volume_conv_logs
      SET conversion_completion = false,
          completed_at = NOW(),
          error_message = $2
      WHERE volume_id = $1
    `, [volumeId, errorMessage]);
    
    await client.query(`
      UPDATE volumes
      SET conversion_process_status = false
      WHERE volume_id = $1
    `, [volumeId]);
    
    console.log(`[${volumeId}] Database updated: conversion failed`);
  } catch (error) {
    console.error(`[${volumeId}] Failed to update database:`, error);
  }
};

/**
 * Check conversion status for a volume
 * @param {string} volumeId - Volume ID
 * @returns {Promise<Object>} Status information
 */
const getConversionStatus = async (volumeId) => {
  try {
    const result = await client.query(`
      SELECT 
        v.volume_id,
        v.volume_name,
        v.conversion_process_status,
        vcl.conversion_completion,
        vcl.started_at,
        vcl.completed_at,
        vcl.error_message,
        vcl.output_file,
        vcl.output_size,
        vcl.converted_by
      FROM volumes v
      LEFT JOIN volume_conv_logs vcl ON v.volume_id = vcl.volume_id
      WHERE v.volume_id = $1
    `, [volumeId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching conversion status:`, error);
    throw error;
  }
};

module.exports = { 
  startVolumeConversion,
  getConversionStatus 
};