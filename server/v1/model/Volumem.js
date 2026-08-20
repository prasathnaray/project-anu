const client = require('../utils/conn.js');
const {startVolumeConversion} = require('../utils/startPythonProcess.js');
const { ROLES, COURSE_EDITOR_ROLES } = require('../Auth/authorization.js');
const { volumeAccessScope, volumeUploaderScope } = require('../Auth/volumeAuthorization.js');

const denied = (message) => ({ status: 'Forbidden', code: 403, message });
const visibleVolumeRows = (requester, rows) => {
    if (Number(requester.role) !== ROLES.SUPER_ADMIN) return rows;
    return rows.map(({ approver_id, ...volume }) => volume);
};

const assertVolumeEditableModel = async (requester, volumeId) => {
    const scope = volumeAccessScope(requester, 'v', 2);
    if (!scope) return null;
    const result = await client.query(
        `SELECT v.volume_id, v.owner_scope, v.owner_centre_id
         FROM volumes v WHERE v.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false`,
        [volumeId, ...scope.params]
    );
    return result.rows[0] || null;
};
const svUploadModel = (
    requester,
    volume_type,
    volume_name,
    volume_ga,
    volume_fetal_presentation,
    trimester,
    description,
    volume_file
) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = COURSE_EDITOR_ROLES.includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 403,
                message: 'You do not have permission to upload volumes',
            });
        }

        const isSuperAdmin = Number(requester.role) === ROLES.SUPER_ADMIN;
        const ownerScope = isSuperAdmin ? 'super_admin' : 'institution';
        const approverColumn = isSuperAdmin ? ', approver_id' : '';
        const approverValue = isSuperAdmin ? ', NULL' : '';
        if (ownerScope === 'institution' && !requester.centre_id) {
            return resolve(denied('Your account is not linked to an institution.'));
        }
        const query = `
            INSERT INTO volumes (
                volume_type,
                volume_name,
                volume_ga,
                volume_fetal_presentation,
                trimester,
                description,
                volume_file,
                added_by,
                uploader_role,
                owner_scope,
                owner_centre_id,
                status${approverColumn},
                ownership_review_required
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12${approverValue}, false)
            RETURNING *;
        `;

        client.query(
            query,
            [
                volume_type,
                volume_name,
                volume_ga,
                volume_fetal_presentation,
                trimester,
                description,
                volume_file,
                requester.user_mail,
                Number(requester.role),
                ownerScope,
                ownerScope === 'institution' ? requester.centre_id : null,
                isSuperAdmin
            ],
            (err, result) => {
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
        const scope = volumeAccessScope(requester);
        if (!scope) return resolve(denied('You do not have permission to view uploaded volumes.'));
        const query = `SELECT v.*, ud.user_name
                       FROM volumes v
                       JOIN user_data ud ON v.added_by = ud.user_email
                       WHERE ${scope.clause} AND v.ownership_review_required = false
                       ORDER BY v.created_at DESC;`;
        client.query(query, scope.params, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve({
                    status: 'Success',
                    code: 200, 
                    data: visibleVolumeRows(requester, result.rows)
                });
            }
        });
    });
};
const VolumeApprovalModel = (requester, status_approval, volume_id) => {
    return new Promise((resolve, reject) => {
        const scope = volumeAccessScope(requester, 'volumes', 3);
        if (!scope) return resolve(denied('You do not have permission to update volumes.'));
        client.query(
            `UPDATE volumes SET status = $1 WHERE volume_id = $2 AND ${scope.clause} AND ownership_review_required = false`,
            [status_approval, volume_id, ...scope.params],
            (err, result) => {
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
        const scope = volumeAccessScope(requester);
        if (!scope) return resolve(denied('You do not have permission to view uploaded volumes.'));
        
        // Build query based on role
        const query = `
            SELECT 
                v.volume_id,
                v.volume_type,
                v.volume_name,
                v.trimester,
                v.volume_ga,
                v.volume_fetal_presentation,
                v.status,
                v.conversion_process_status,
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
            WHERE ${scope.clause} AND v.ownership_review_required = false
            ORDER BY vcl.completed_at DESC NULLS LAST
        `;

        const queryParams = scope.params;

        client.query(query, queryParams, (err, result) => {
            if (err) {
                return reject({
                    status: 'Error',
                    code: 500,
                    message: 'Database query failed',
                    error: err
                });
            }
            
            result.rows = visibleVolumeRows(requester, result.rows);
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
        const scope = volumeAccessScope(requester);
        if (!scope) return resolve(denied('You do not have permission to convert volumes.'));
        const startedBy = requester.user_mail;
        try {
            const volumeIdScope = volumeAccessScope(requester, 'v', 2);
            const volumeCheck = await client.query(
                `SELECT v.volume_id, v.volume_name, v.conversion_process_status
                 FROM volumes v WHERE v.volume_id = $1 AND ${volumeIdScope.clause}
                   AND v.ownership_review_required = false`,
                [volume_id, ...volumeIdScope.params]
            );
            if (volumeCheck.rows.length === 0) {
                return resolve({
                    status: 'Not Found',
                    code: 404,
                    message: 'Volume not found',
                });
            }
            if (volumeCheck.rows[0].conversion_process_status === true) {
                return resolve({
                    status: 'Conflict',
                    code: 409,
                    message: 'Conversion already in progress for this volume',
                });
            }
            await client.query(
                `UPDATE volumes
                 SET conversion_process_status = $1, lifecycle_status = 'processing'
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
            const conversionJob = await startVolumeConversion(volume_id);
            resolve({
                success: true,
                code: 200,
                message: "Volume conversion started",
                volume_id: volume_id,
                status: "RUNNING",
                job_id: conversionJob.jobId,
                job_queue: conversionJob.jobQueue
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
        const scope = volumeUploaderScope(requester, 'v', 2);
        if (!scope) return resolve(denied('You do not have permission to view converted volumes.'));
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
AND ${scope.clause}
AND v.ownership_review_required = false
ORDER BY 
vcl.completed_at DESC;`;
        client.query(query, [true, ...scope.params], (err, result) => {
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
            const scope = volumeAccessScope(requester, 'v', 3);
            if (!scope) return resolve(denied('You do not have permission to place volumes.'));
            client.query(
                `WITH authorized_volume AS (
                    UPDATE volumes v SET lifecycle_status = 'placed'
                    WHERE v.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false
                    RETURNING v.volume_id
                 )
                 INSERT INTO volume_placements (volume_id, placed_url, created_at)
                 SELECT volume_id, $2, NOW() FROM authorized_volume
                 RETURNING *`,
                [volume_id, placed_url, ...scope.params],
                (err, result) => {
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
const getVolumePlacementsModel = (requester, volume_id = null) => {
    return new Promise((resolve, reject) => {
        const scope = volumeAccessScope(requester, 'v', 1);
        if (!scope) return resolve(denied('You do not have permission to view volume placements.'));

        let query = `
            SELECT
                vp.*,
                v.volume_name
            FROM volume_placements vp
            LEFT JOIN volumes v
                ON vp.volume_id = v.volume_id
        `;
        const values = [...scope.params];
        const conditions = [scope.clause, 'v.ownership_review_required = false'];

        if (volume_id) {
            values.push(volume_id);
            conditions.push(`vp.volume_id = $${values.length}`);
        }

        query += ` WHERE ${conditions.join(' AND ')}`;
        query += ` ORDER BY vp.created_at DESC;`;

        client.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve({
                status: 'Success',
                code: 200,
                data: result.rows
            });
        });
    });
};
// const volumeRecordingsModel = (requester, volume_id, recording_name, recording_type, rec_files, audio_files) => {
//     return new Promise((resolve, reject) => {
//         // Check user permissions
//         const isPrivileged = [99, 101, 102].includes(Number(requester.role));
        
//         if (!isPrivileged) {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to upload volume recordings',
//             });
//         }
        
//         // Validate inputs
//         if (!volume_id || !recording_name || !recording_type) {
//             return reject(new Error('Missing required fields: volume_id, recording_name, or recording_type'));
//         }
        
//         if (!Array.isArray(rec_files) || !Array.isArray(audio_files)) {
//             return reject(new Error('rec_files and audio_files must be arrays'));
//         }
        
//         if (rec_files.length === 0 || audio_files.length === 0) {
//             return reject(new Error('rec_files and audio_files arrays cannot be empty'));
//         }
        
//         if (rec_files.length !== audio_files.length) {
//             return reject(new Error('rec_files and audio_files must have the same length'));
//         }
        
//         // Convert arrays to JSON strings for PostgreSQL
//         const recFilesJson = JSON.stringify(rec_files);
//         const audioFilesJson = JSON.stringify(audio_files);
        
//         // Insert into database
//         const query = `
//             INSERT INTO vol_recordings 
//             (volume_id, recording_name, recording_type, rec_files, audio_files) 
//             VALUES($1, $2, $3, $4, $5) 
//             RETURNING *
//         `;
        
//         client.query(
//             query, 
//             [volume_id, recording_name, recording_type, recFilesJson, audioFilesJson], 
//             (err, result) => {
//                 if (err) {
//                     return reject(err);
//                 } else {
//                     return resolve({
//                         status: 'Success',
//                         code: 200,
//                         message: 'Volume recording(s) saved successfully',
//                         data: result.rows[0]
//                     });
//                 }
//             }
//         );
//     });
// };

// the above code is commented out and replaced with the following improved version
const volumeRecordingsModel = (requester, volume_id, recording_name, recording_type, rec_files, audio_files, image_files, manifest_file) => {
    return new Promise((resolve, reject) => {
        const scope = volumeAccessScope(requester, 'v', 9);
        if (!scope) return resolve(denied('You do not have permission to upload volume recordings.'));
        
        // Validate inputs
        if (!volume_id || !recording_name || !recording_type || !manifest_file) {
            return reject(new Error('Missing required fields: volume_id, recording_name, recording_type, or manifest_file'));
        }
        
        if (!Array.isArray(rec_files) || !Array.isArray(audio_files) || !Array.isArray(image_files)) {
            return reject(new Error('rec_files, audio_files, and image_files must be arrays'));
        }
        
        if (rec_files.length === 0 || audio_files.length === 0 || image_files.length === 0) {
            return reject(new Error('rec_files, audio_files, and image_files arrays cannot be empty'));
        }
        
        // Convert URL arrays to JSON for PostgreSQL.
        const recFilesJson = JSON.stringify(rec_files);
        const audioFilesJson = JSON.stringify(audio_files);
        const imageFilesJson = JSON.stringify(image_files);
        
        // Insert into database
        const query = `
            WITH authorized_volume AS (
                UPDATE volumes v SET lifecycle_status = 'recorded'
                WHERE v.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false
                RETURNING v.volume_id
            )
            INSERT INTO vol_recordings
                (volume_id, recording_name, recording_type, rec_files, audio_files, image_files, manifest_file, created_by)
            SELECT volume_id, $2, $3, $4, $5, $6, $7, $8
            FROM authorized_volume
            RETURNING *
        `;
        
        client.query(
            query, 
            [volume_id, recording_name, recording_type, recFilesJson, audioFilesJson, imageFilesJson, manifest_file, requester.user_mail, ...scope.params],
            (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve({
                        status: 'Success',
                        code: 200,
                        message: 'Volume recording saved successfully',
                        data: result.rows[0]
                    });
                }
            }
        );
    });
};

const associateVolumeModel = (requester, r_id, volume_id, shadowrec_id, steprec_id) => {
    return new Promise((resolve, reject) => {
        const scope = volumeAccessScope(requester, 'v', 5);
        if (!scope) return resolve(denied('You do not have permission to associate volumes.'));
        client.query(
            `INSERT INTO asso_volume(r_id, vol_id, shadowrec_id, steprec_id)
             SELECT $1, $2, $3, $4 FROM volumes v
             WHERE v.volume_id = $2 AND ${scope.clause} AND v.ownership_review_required = false`,
            [r_id, volume_id, shadowrec_id, steprec_id, ...scope.params],
            (err, result) => {
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
        const scope = volumeAccessScope(requester, 'v', 2);
        if (!scope) return resolve(denied('You do not have permission to view volume recordings.'));
        client.query(`SELECT vr.recording_type, vr.recording_name, vr.recording_id, vr.rec_files, vr.audio_files, vr.image_files, vr.manifest_file, vr.validation_status
                      FROM vol_recordings vr
                      JOIN volumes v ON v.volume_id = vr.volume_id
                      WHERE vr.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false
                      GROUP BY vr.recording_type, vr.recording_name, vr.recording_id, vr.rec_files,
                               vr.audio_files, vr.image_files, vr.manifest_file, vr.validation_status;`,
                      [volume_id, ...scope.params], (err, result) => {
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
const getVolumeRecordingCountsModel = (requester) => {
    return new Promise((resolve, reject) => {
        const scope = volumeAccessScope(requester, 'v', 1);
        if (!scope) return resolve(denied('You do not have permission to view volume recordings.'));
        const query = `
            SELECT 
                vr.volume_id,
                COUNT(*) FILTER (
                    WHERE LOWER(TRIM(vr.recording_type)) LIKE '%shadow%'
                )::int AS shadow_recording_count,
                COALESCE(
                    jsonb_agg(DISTINCT step_files.file_url) FILTER (
                        WHERE step_files.file_url IS NOT NULL
                    ),
                    '[]'::jsonb
                ) AS step_recording_files,
                COALESCE(
                    jsonb_agg(DISTINCT step_images.image_url) FILTER (
                        WHERE step_images.image_url IS NOT NULL
                    ),
                    '[]'::jsonb
                ) AS step_recording_images
            FROM vol_recordings vr
            JOIN volumes v
                ON v.volume_id = vr.volume_id
            LEFT JOIN LATERAL jsonb_array_elements_text(vr.rec_files) AS step_files(file_url)
                ON LOWER(TRIM(vr.recording_type)) LIKE '%step%'
            LEFT JOIN LATERAL jsonb_array_elements_text(vr.image_files) AS step_images(image_url)
                ON LOWER(TRIM(vr.recording_type)) LIKE '%step%'
            WHERE vr.volume_id IS NOT NULL
              AND ${scope.clause}
              AND v.ownership_review_required = false
            GROUP BY vr.volume_id;
        `;
        const queryParams = scope.params;

        client.query(query, queryParams, (err, result) => {
            if (err)
            {
                return reject(err);
            }
            else
            {
                return resolve({
                    status: 'Success',
                    code: 200,
                    data: result.rows
                });
            }
        })
    })
}
const getAssociatedVolumeModel = (requester, r_id) => {
    return new Promise((resolve, reject) => {
        const scope = volumeAccessScope(requester, 'v', 2);
        if (!scope) return resolve(denied('You do not have permission to view associated volumes.'));
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
                    vr.audio_files,
                    vr.image_files,
                    vr.manifest_file
                FROM asso_volume av
                JOIN volumes v
                    ON av.vol_id = v.volume_id
                JOIN resource_data rd
                    ON av.r_id = rd.resource_id
                LEFT JOIN vol_recordings vr
                    ON v.volume_id = vr.volume_id
                WHERE av.r_id = $1 AND ${scope.clause} AND v.ownership_review_required = false;
            `,[r_id, ...scope.params], (err, result) => {
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
module.exports = {svUploadModel, getUploadedVolume, VolumeApprovalModel, getVolumeInstructorViewModel, volumeConversionModel, getConvertedVolumeList, placedVolumeConversionModel, getVolumePlacementsModel, volumeRecordingsModel, associateVolumeModel, shadowRecoringDataModel, getVolumeRecordingCountsModel, getAssociatedVolumeModel, assertVolumeEditableModel};
