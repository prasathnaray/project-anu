const client = require('../utils/conn');
const path = require('path');
const { uploadAsset, signAsset } = require('../utils/storageAdapter');
const BUCKET = process.env.BUCKET_NAME || 'question-images';

const updateProgress = async (userId, resourceId) => {
  try {
    console.log('Updating progress for:', userId, resourceId);

    const res = await client.query(
      `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (user_id, resourse_id)
       DO UPDATE SET
         is_completed = TRUE,
         updated_at   = NOW()
       RETURNING *`,
      [userId, resourceId]
    );
    console.log('Progress updated:', res.rows);
    return res;
  } catch (err) {
    console.error('Progress ERROR:', err);
    throw err;
  }
};

const uploadImage = (file, requester) => {
  return new Promise(async (resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({
        status: 'Unauthorized',
        code: 401,
        message: 'You do not have permission to access this profile.'
      });
    }
    try {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const storagePath = `iisub/${filename}`;
      const uploaded = await uploadAsset({
        sourceBucket: BUCKET, objectKey: storagePath, body: file.buffer,
        contentType: file.mimetype, upsert: false
      });
      return resolve({
        filename,
        original_name: file.originalname,
        storage_path: uploaded.reference,
        public_url: uploaded.reference,
        signed_url: await signAsset(uploaded.reference),
        mime_type: file.mimetype,
        size: file.size,
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const submitType1 = (requester, questionNo, optionChosen, isCorrect) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({ status: 'Unauthorized', code: 401, message: 'You do not have permission to access this profile.' });
    }
    client.query(
      `INSERT INTO submissions (question_type, question_no, option_chosen, is_correct, session_id, user_mail, resource_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      ['type1', questionNo, optionChosen, isCorrect, requester.session_id, requester.user_mail, requester.resource_id],
      async (err, result) => {
        if (err) return reject(err);
        try {
          await updateProgress(requester.user_mail, requester.resource_id);
        } catch (progressErr) {
          console.error('Failed to update progress after submitType1:', progressErr);
        }
        return resolve({ status: 'Submission Successful', code: 201, data: result.rows[0] });
      }
    );
  });
};

const submitType2 = (requester, questionNo, isCorrect, file) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({ status: 'Unauthorized', code: 401, message: 'You do not have permission to access this profile.' });
    }
    uploadImage(file, requester)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, filename, original_name, storage_path, public_url, mime_type, size, session_id, user_mail, resource_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
          ['type2', questionNo, isCorrect, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size, requester.session_id, requester.user_mail, requester.resource_id],
          async (err, result) => {
            if (err) return reject(err);
            try {
              await updateProgress(requester.user_mail, requester.resource_id);
            } catch (progressErr) {
              console.error('Failed to update progress after submitType2:', progressErr);
            }
            return resolve({ status: 'Submission Successful', code: 201, data: { ...result.rows[0], public_url: imageData.signed_url } });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitAnnotation1 = (requester, questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, file) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({ status: 'Unauthorized', code: 401, message: 'You do not have permission to access this profile.' });
    }
    uploadImage(file, requester)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, correct_label_count, wrong_label_count, unused_label_count, filename, original_name, storage_path, public_url, mime_type, size, session_id, user_mail, resource_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
          ['annotation1', questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size, requester.session_id, requester.user_mail, requester.resource_id],
          async (err, result) => {
            if (err) return reject(err);
            try {
              await updateProgress(requester.user_mail, requester.resource_id);
            } catch (progressErr) {
              console.error('Failed to update progress after submitAnnotation1:', progressErr);
            }
            return resolve({ status: 'Submission Successful', code: 201, data: { ...result.rows[0], public_url: imageData.signed_url } });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitAnnotation2 = (requester, questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, file) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({ status: 'Unauthorized', code: 401, message: 'You do not have permission to access this profile.' });
    }
    uploadImage(file, requester)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, correct_label_count, wrong_label_count, unused_label_count, filename, original_name, storage_path, public_url, mime_type, size, session_id, user_mail, resource_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
          ['annotation2', questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size, requester.session_id, requester.user_mail, requester.resource_id],
          async (err, result) => {
            if (err) return reject(err);
            try {
              await updateProgress(requester.user_mail, requester.resource_id);
            } catch (progressErr) {
              console.error('Failed to update progress after submitAnnotation2:', progressErr);
            }
            return resolve({ status: 'Submission Successful', code: 201, data: { ...result.rows[0], public_url: imageData.signed_url } });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitMeasurement = (requester, questionNo, partial, value, interpretation, caliperPlacementInterpretation, file) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({ status: 'Unauthorized', code: 401, message: 'You do not have permission to access this profile.' });
    }
    uploadImage(file, requester)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, partial, value, interpretation, caliper_placement_interpretation, filename, original_name, storage_path, public_url, mime_type, size, session_id, user_mail, resource_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
          ['measurement', questionNo, partial, value, interpretation, caliperPlacementInterpretation, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size, requester.session_id, requester.user_mail, requester.resource_id],
          async (err, result) => {
            if (err) return reject(err);
            try {
              await updateProgress(requester.user_mail, requester.resource_id);
            } catch (progressErr) {
              console.error('Failed to update progress after submitMeasurement:', progressErr);
            }
            return resolve({ status: 'Submission Successful', code: 201, data: { ...result.rows[0], public_url: imageData.signed_url } });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const iivrStartTestm = (requester, resource_id) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({
        status: 'Unauthorized',
        code: 401,
        message: 'You do not have permission to access this profile.'
      });
    }
    client.query(`INSERT INTO ii_test_attempts_logs (resource_id, user_id) VALUES ($1, $2) RETURNING *`, [resource_id, requester.user_mail], (err, result) => {
      if (err) return reject(err);
      return resolve({
        status: 'Test Started',
        code: 201,
        data: result.rows[0],
      });
    });
  });
};

const iivrEndTestm = (requester, test_id) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({
        status: 'Unauthorized',
        code: 401,
        message: 'You do not have permission to access this profile.'
      });
    }
    client.query(`UPDATE ii_test_attempts_logs SET is_completed = true, completed_time = NOW() WHERE test_id = $1 AND user_id = $2 RETURNING *`, [test_id, requester.user_mail], (err, result) => {
      if (err) return reject(err);
      if (result.rows.length === 0) {
        return resolve({
          status: 'Test Not Found',
          code: 404,
          message: 'No test attempt found with the provided test_id for this user.'
        });
      }
      return resolve({
        status: 'Test Ended',
        code: 200,
        data: result.rows[0],
      });
    });
  });
};

module.exports = { submitType1, submitType2, submitAnnotation1, submitAnnotation2, submitMeasurement, iivrStartTestm, iivrEndTestm };
