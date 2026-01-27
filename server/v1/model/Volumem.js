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

const getVolumeInstructorViewModel = (requester) => {
    return new Promise((resolve, reject) => {
        // Check authorization first
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view uploaded volumes',
            });
        }

        const isSuperAdmin = Number(requester.role) === 99;
        
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
            LEFT JOIN public.volume_conv_logs vcl ON v.volume_id = vcl.volume_id
            ${isSuperAdmin ? '' : 'WHERE v.added_by = $1'}
            ORDER BY vcl.completed_at DESC NULLS LAST
        `;

        const queryParams = isSuperAdmin ? [] : [requester.user_mail];

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
            // Check if volume exists
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
                        v.volume_name
                        FROM 
                        volume_conv_logs vcl
                        INNER JOIN 
                        volumes v ON vcl.volume_id = v.volume_id
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
        const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        if (!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volume recordings',
            })
        }
        client.query('INSERT INTO vol_recordings (volume_id, recording_name, recording_type, rec_files, audio_files) VALUES($1, $2, $3, $4, $5)', [volume_id, recording_name, recording_type, rec_files, audio_files], (err, result) => {
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
const associateVolumeModel = (requester, r_id, volume_id) => {
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
        client.query('INSERT INTO asso_volume(r_id, vol_id) VALUES($1, $2)',[r_id, volume_id], (err, result) => {
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
        client.query(`SELECT * FROM vol_recordings where recording_type=$1 AND volume_id=$2`,['shadow', volume_id], (err, result) => {
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
module.exports = {svUploadModel, getUploadedVolume, VolumeApprovalModel, getVolumeInstructorViewModel, volumeConversionModel, getConvertedVolumeList, placedVolumeConversionModel, volumeRecordingsModel, associateVolumeModel, shadowRecoringDataModel};