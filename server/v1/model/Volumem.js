const client = require('../utils/conn.js');
const {startVolumeConversion} = require('../utils/startPythonProcess.js');
const svUploadModel = (requester, volume_type, volume_name, volume_ga, volume_fetal_presentation, volume_file) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 102, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volumes',
            });
        }

        const query = `
            INSERT INTO volumes (volume_type, volume_name, volume_ga, volume_fetal_presentation, volume_file, added_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        client.query(query, [volume_type, volume_name, volume_ga, volume_fetal_presentation, volume_file, requester.user_mail], (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const getUploadedVolume = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 102, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view uploaded volumes',
            });
        }
        const query = `SELECT v.*, ud.user_name FROM volumes v JOIN user_data ud ON v.added_by=ud.user_email ORDER by v.created_at DESC;`;
        client.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve({
                    status: 'Success',
                    code: 200,
                    data: result.rows
                });
            }
        });
    });
};
const VolumeApprovalModel = (requester, status_approval, volume_id) => {
    const isPrivileged = [99, 101, 102].includes(Number(requester.role))
    if(!isPrivileged)
    {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view uploaded volumes',
            });
    }
    return new Promise((resolve, reject) => {
        client.query('update volumes SET status=$1 WHERE volume_id=$2', [status_approval, volume_id], (err, result) => {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(result)
            }
        })
    })
}
// const getVolumeInstructorViewModel = (requester) => {
//     const isPrivileged = [99, 101, 102].includes(Number(requester.role))
//     if(!isPrivileged)
//     {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to view uploaded volumes',
//             });
//     }
//     return new Promise((resolve, reject) => {
//         const query = `SELECT * FROM volumes WHERE added_by=$1`;
//         client.query(query, [requester.user_mail], (err, result) => {
//             if (err) {  
//                 return reject(err);
//             } else {     
//                 return resolve(result);
//             }
//         });
//     });
// }

// const getVolumeInstructorViewModel = (requester) => {
//     return new Promise((resolve, reject) => {
//         // Check authorization first
//         const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        
//         if (!isPrivileged) {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to view uploaded volumes',
//             });
//         }
//         const query = `
//               SELECT 
//                 v.volume_id,
//                 v.volume_type,
//                 v.volume_name,
//                 v.volume_ga,
//                 v.volume_fetal_presentation,
//                 v.status,
//                 v.volume_file,
//                 vcl.started_at,
//                 vcl.conversion_completion,
//                 vcl.converted_by,
//                 vcl.completed_at,
//                 vcl.output_file
//             FROM public.volumes v
//             LEFT JOIN public.volume_conv_logs vcl ON v.volume_id = vcl.volume_id
//             WHERE v.added_by = $1
//             ORDER BY vcl.completed_at DESC NULLS LAST
//         `;

//         client.query(query, [requester.user_mail], (err, result) => {
//             if (err) {
//                 return reject({
//                     status: 'Error',
//                     code: 500,
//                     message: 'Database query failed',
//                     error: err
//                 });
//             }
            
//             return resolve(result);
//         });
//     });
// };

// const getVolumeInstructorViewModel = (requester) => {
//     return new Promise((resolve, reject) => {
//         // Check authorization first
//         const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        
//         if (!isPrivileged) {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to view uploaded volumes',
//             });
//         }

//         const isSuperAdmin = Number(requester.role) === 99;
        
//         // Build query based on role
//         const query = `
//             SELECT 
//                 v.volume_id,
//                 v.volume_type,
//                 v.volume_name,
//                 v.volume_ga,
//                 v.volume_fetal_presentation,
//                 v.status,
//                 v.volume_file,
//                 v.added_by,
//                 v.approver_id,
//                 vcl.started_at,
//                 vcl.conversion_completion,
//                 vcl.converted_by,
//                 vcl.completed_at,
//                 vcl.output_file
//             FROM public.volumes v
//             LEFT JOIN public.volume_conv_logs vcl ON v.volume_id = vcl.volume_id
//             ${isSuperAdmin ? '' : 'WHERE v.added_by = $1'}
//             ORDER BY vcl.completed_at DESC NULLS LAST
//         `;

//         const queryParams = isSuperAdmin ? [] : [requester.user_mail];

//         client.query(query, queryParams, (err, result) => {
//             if (err) {
//                 return reject({
//                     status: 'Error',
//                     code: 500,
//                     message: 'Database query failed',
//                     error: err
//                 });
//             }
            
//             return resolve(result);
//         });
//     });
// };

const getVolumeInstructorViewModel = (requester) => {
    return new Promise((resolve, reject) => {
        const userRole = Number(requester.role);
        
        // Check authorization first
        const isPrivileged = [99, 101, 102].includes(userRole);
        
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view uploaded volumes',
            });
        }

        // Role 99 and 101 can see all volumes, Role 102 can only see their own
        const canViewAllVolumes = [99, 101].includes(userRole);
        
        // Build query based on role
        const query = `
            SELECT 
                v.volume_id,
                v.volume_type,
                v.volume_name,
                v.volume_ga,
                v.volume_fetal_presentation,
                v.status,
                v.volume_file,
                v.added_by,
                v.approver_id,
                vcl.started_at,
                vcl.conversion_completion,
                vcl.converted_by,
                vcl.completed_at,
                vcl.output_file
            FROM public.volumes v
            LEFT JOIN public.volume_conv_logs vcl 
                ON v.volume_id = vcl.volume_id
            ${!canViewAllVolumes ? 'WHERE v.added_by = $1' : ''}
            ORDER BY vcl.completed_at DESC NULLS LAST
        `;

        const queryParams = canViewAllVolumes ? [] : [requester.user_mail];

        client.query(query, queryParams, (err, result) => {
            if (err) {
                return reject({
                    status: 'Error',
                    code: 500,
                    message: 'Database query failed',
                    error: err
                });
            }
            
            return resolve(result);
        });
    });
};
// const volumeConversionModel = (requester, volume_id) => {
//     return new Promise((resolve, reject) => {
//         client.query('update volumes SET conversion_process_status=$1 WHERE volume_id=$2', [true, volume_id], (err, result) => {
//             if(err)
//             {
//                 reject(err)
//             }
//             else
//             {
//                 resolve(result)
//             }
//         })
//     })
// }
// const volumeConversionModel = (requester, volume_id) => {
//     const isPrivileged = [99, 101, 102].includes(Number(requester.role))
//     if(!isPrivileged)
//     {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to view uploaded volumes',
//             });
//     }
//   return new Promise(async (resolve, reject) => {
//     const startedBy = requester.user_mail;
//     try {
//       await client.query(
//         `UPDATE volumes
//          SET conversion_process_status = $1
//          WHERE volume_id = $2`,
//         [true, volume_id]
//       );
//       await client.query(
//         `
//         INSERT INTO volume_conv_logs (
//           volume_id,
//           conversion_completion,
//           started_at,
//           converted_by
//         )
//         VALUES ($1, $2, NOW(), $3)
//         ON CONFLICT (volume_id)
//         DO UPDATE SET
//           conversion_completion = $2,
//           started_at = NOW(),
//           converted_by = $3
//         `,
//         [volume_id, true, startedBy]
//       );
//       startVolumeConversion(volume_id);
//       resolve({
//         success: true,
//         message: "Volume conversion started"
//       });

//     } catch (err) {
//       reject(err);
//     }
//   });
// };
const volumeConversionModel = (requester, volume_id) => {
    return new Promise(async (resolve, reject) => {
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to convert volumes',
            });
        }
        const startedBy = requester.user_mail;
        try {
            const volumeCheck = await client.query(
                'SELECT volume_id, volume_name FROM volumes WHERE volume_id = $1',
                [volume_id]
            );
            if (volumeCheck.rows.length === 0) {
                return resolve({
                    status: 'Not Found',
                    code: 404,
                    message: 'Volume not found',
                });
            }
            const statusCheck = await client.query(
                'SELECT conversion_process_status FROM volumes WHERE volume_id = $1',
                [volume_id]
            );
            if (statusCheck.rows[0].conversion_process_status === true) {
                return resolve({
                    status: 'Conflict',
                    code: 409,
                    message: 'Conversion already in progress for this volume',
                });
            }
            await client.query(
                `UPDATE volumes
                 SET conversion_process_status = $1
                 WHERE volume_id = $2`,
                [true, volume_id]
            );
            await client.query(
                `
                INSERT INTO volume_conv_logs (
                    volume_id,
                    conversion_completion,
                    started_at,
                    converted_by,
                    error_message
                )
                VALUES ($1, $2, NOW(), $3, NULL)
                ON CONFLICT (volume_id)
                DO UPDATE SET
                    conversion_completion = $2,
                    started_at = NOW(),
                    converted_by = $3,
                    completed_at = NULL,
                    error_message = NULL
                `,
                [volume_id, false, startedBy]
            );
            startVolumeConversion(volume_id).catch(err => {
                console.error(`Error in conversion process for ${volume_id}:`, err);
            });
            resolve({
                success: true,
                code: 200,
                message: "Volume conversion started",
                volume_id: volume_id,
                status: "RUNNING"
            });
        } catch (err) {
            try {
                await client.query(
                    'UPDATE volumes SET conversion_process_status = false WHERE volume_id = $1',
                    [volume_id]
                );
            } catch (rollbackErr) {
                console.error('Rollback error:', rollbackErr);
            }
            reject(err);
        }
    });
};

//list of converted volumes nii /nrrd files
const getConvertedVolumeList = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view converted volumes',
            });
        }
        const query = `SELECT 
  vcl.*,
  v.volume_name,
  vp.placed_url
FROM 
volume_conv_logs vcl
INNER JOIN 
volumes v ON vcl.volume_id = v.volume_id
LEFT JOIN
volume_placements vp ON vcl.volume_id = vp.volume_id
WHERE 
vcl.conversion_completion = $1
ORDER BY 
vcl.completed_at DESC;`;
        client.query(query, [true], (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve({
                    status: 'Success',
                    code: 200,
                    data: result
                });
            }
        });
    })
}
const placedVolumeConversionModel = (requester, volume_id, placed_url) => {
      return new Promise((resolve, reject) => {
            const isPrivileged = [99, 101, 102].includes(Number(requester.role));
            if (!isPrivileged) {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to view converted volumes',
                });
            }
            client.query('INSERT INTO volume_placements (volume_id, placed_url, created_at) VALUES ($1, $2, NOW())', [volume_id, placed_url], (err, result) => {
                if (err) {
                    return reject(err);
                }
                else
                {
                    return resolve(result)
                }
            })
      })
}
const volumeRecordingsModel = (requester, volume_id, recording_name, recording_type, rec_files, audio_files) => {
    return new Promise((resolve, reject) => {
        // Check user permissions
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volume recordings',
            });
        }
        
        // Validate inputs
        if (!volume_id || !recording_name || !recording_type) {
            return reject(new Error('Missing required fields: volume_id, recording_name, or recording_type'));
        }
        
        if (!Array.isArray(rec_files) || !Array.isArray(audio_files)) {
            return reject(new Error('rec_files and audio_files must be arrays'));
        }
        
        if (rec_files.length === 0 || audio_files.length === 0) {
            return reject(new Error('rec_files and audio_files arrays cannot be empty'));
        }
        
        if (rec_files.length !== audio_files.length) {
            return reject(new Error('rec_files and audio_files must have the same length'));
        }
        
        // Convert arrays to JSON strings for PostgreSQL
        const recFilesJson = JSON.stringify(rec_files);
        const audioFilesJson = JSON.stringify(audio_files);
        
        // Insert into database
        const query = `
            INSERT INTO vol_recordings 
            (volume_id, recording_name, recording_type, rec_files, audio_files) 
            VALUES($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        
        client.query(
            query, 
            [volume_id, recording_name, recording_type, recFilesJson, audioFilesJson], 
            (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve({
                        status: 'Success',
                        code: 200,
                        message: 'Volume recording(s) saved successfully',
                        data: result.rows[0]
                    });
                }
            }
        );
    });
};
const associateVolumeModel = (requester, r_id, volume_id, shadowrec_id, steprec_id) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        if (!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volume recordings',
            })
        }
        client.query('INSERT INTO asso_volume(r_id, vol_id, shadowrec_id, steprec_id) VALUES($1, $2, $3, $4)',[r_id, volume_id, shadowrec_id, steprec_id], (err, result) => {
            if (err)
            {
                return reject(err);
            }
            else
            {
                return resolve(result);
            }
        })
    })
}
const shadowRecoringDataModel = (requester, volume_id) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        if (!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volume recordings',
            })
        }
        client.query(`SELECT recording_type, recording_name, recording_id, rec_files, audio_files
                      FROM vol_recordings
                      WHERE volume_id = $1
                      GROUP BY recording_type, recording_name, recording_id, rec_files, audio_files;`,[volume_id], (err, result) => {
            if (err)
            {
                return reject(err);
            }
            else
            {
                return resolve(result);
            }
        })
    })
}
const getAssociatedVolumeModel = (requester, r_id) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        if (!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volume recordings',
            })
        }
        client.query(`
                SELECT 
                    av.r_id,
                    av.vol_id,
                    av.shadowrec_id,
                    av.steprec_id,
                    v.volume_name,
                    rd.resource_id,
                    rd.resource_name,
                    rd.created_at,
                    vr.recording_id,
                    vr.recording_name,
                    vr.recording_type,
                    vr.rec_files,
                    vr.audio_files
                FROM asso_volume av
                JOIN volumes v
                    ON av.vol_id = v.volume_id
                JOIN resource_data rd
                    ON av.r_id = rd.resource_id
                LEFT JOIN vol_recordings vr
                    ON v.volume_id = vr.volume_id
                WHERE av.r_id = $1;
            `,[r_id], (err, result) => {
            if (err)
            {
                return reject(err);
            }

            else
            {
                return resolve(result);
            }
        })
    })
}
module.exports = {svUploadModel, getUploadedVolume, VolumeApprovalModel, getVolumeInstructorViewModel, volumeConversionModel, getConvertedVolumeList, placedVolumeConversionModel, volumeRecordingsModel, associateVolumeModel, shadowRecoringDataModel, getAssociatedVolumeModel};