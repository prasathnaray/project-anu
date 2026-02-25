const client = require('../utils/conn.js');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = process.env.BUCKET_NAME || 'question-images';

const uploadImage = (file) => {
  return new Promise(async (resolve, reject) => {
    const isPrivileged = [99, 101].includes(Number(requester.role));
    if(!isPrivileged) {
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
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: false });
      if (error) return reject(error);
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      return resolve({
        filename,
        original_name: file.originalname,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        mime_type: file.mimetype,
        size: file.size,
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const submitType1 = (requester, questionNo, optionChosen, isCorrect) => {
  //const isPrivileged = [101, 99, 102].includes(Number(requester.role));
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
    client.query(
      `INSERT INTO submissions (question_type, question_no, option_chosen, is_correct)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      ['type1', questionNo, optionChosen, isCorrect],
      (err, result) => {
        if (err) return reject(err);
        return resolve({
          status: 'Submission Successful',
          code: 201,
          data: result.rows[0],
        });
      }
    );
  });
};

const submitType2 = (requester, questionNo, isCorrect, file) => {
  return new Promise((resolve, reject) => {
     const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
    uploadImage(file)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, filename, original_name, storage_path, public_url, mime_type, size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          ['type2', questionNo, isCorrect, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size],
          (err, result) => {
            if (err) return reject(err);
            return resolve({
              status: 'Submission Successful',
              code: 201,
              data: result.rows[0],
            });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitAnnotation1 = (requester, questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, file) => {
  return new Promise((resolve, reject) => {
     const isPrivileged = [99, 101].includes(Number(requester.role));
      if(!isPrivileged) {
          return resolve({
              status: 'Unauthorized',
              code: 401,
              message: 'You do not have permission to access this profile.'
          });
      }
    uploadImage(file)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, correct_label_count, wrong_label_count, unused_label_count, filename, original_name, storage_path, public_url, mime_type, size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
          ['annotation1', questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size],
          (err, result) => {
            if (err) return reject(err);
            return resolve({
              status: 'Submission Successful',
              code: 201,
              data: result.rows[0],
            });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitAnnotation2 = (requester,questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, file) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101].includes(Number(requester.role));
    if(!isPrivileged) {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to access this profile.'
        });
    }
    uploadImage(file)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, correct_label_count, wrong_label_count, unused_label_count, filename, original_name, storage_path, public_url, mime_type, size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
          ['annotation2', questionNo, isCorrect, correctLabelCount, wrongLabelCount, unusedLabelCount, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size],
          (err, result) => {
            if (err) return reject(err);
            return resolve({
              status: 'Submission Successful',
              code: 201,
              data: result.rows[0],
            });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitMeasurement = (requester, questionNo, isCorrect, value, interpretation, caliperPlacementInterpretation, file) => {
  return new Promise((resolve, reject) => {
     const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
    uploadImage(file)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, value, interpretation, caliper_placement_interpretation, filename, original_name, storage_path, public_url, mime_type, size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
          ['measurement', questionNo, isCorrect, value, interpretation, caliperPlacementInterpretation, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size],
          (err, result) => {
            if (err) return reject(err);
            return resolve({
              status: 'Submission Successful',
              code: 201,
              data: result.rows[0],
            });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const iivrStartTestm = (requester, resource_id) => {
    return new Promise((resolve, reject) => {
          const isPrivileged = [103].includes(Number(requester.role));
          if(!isPrivileged)
          {
              return resolve({
                  status: 'Unauthorized',
                  code: 401,
                  message: 'You do not have permission to access this profile.'
              });
          }
          client.query(`INSERT INTO ii_test_attempts_logs (resource_id, user_id) VALUES ($1, $2) RETURNING *`, [resource_id, requester.user_mail], (err, result) => {
              if(err) return reject(err);
              return resolve({
                  status: 'Test Started',
                  code: 201,
                  data: result.rows[0],
              });
          });
    })
}
const iivrEndTestm = (requester, test_id) => {
    return new Promise((resolve, reject) => {
          const isPrivileged = [103].includes(Number(requester.role));
          if(!isPrivileged)
          {
              return resolve({
                  status: 'Unauthorized',
                  code: 401,
                  message: 'You do not have permission to access this profile.'
              });
          }
          client.query(`UPDATE ii_test_attempts_logs SET is_completed = true, completed_time = NOW() WHERE test_id = $1 AND user_id = $2 RETURNING *`, [test_id, requester.user_mail], (err, result) => {
              if(err) return reject(err);
              if(result.rows.length === 0) {
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
          }
        );
    })
}
module.exports = { submitType1, submitType2, submitAnnotation1, submitAnnotation2, submitMeasurement, iivrStartTestm, iivrEndTestm};