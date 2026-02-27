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
      (err, result) => {
        if (err) return reject(err);
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
          (err, result) => {
            if (err) return reject(err);
            return resolve({ status: 'Submission Successful', code: 201, data: result.rows[0] });
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
          (err, result) => {
            if (err) return reject(err);
            return resolve({ status: 'Submission Successful', code: 201, data: result.rows[0] });
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
          (err, result) => {
            if (err) return reject(err);
            return resolve({ status: 'Submission Successful', code: 201, data: result.rows[0] });
          }
        );
      })
      .catch((err) => reject(err));
  });
};

const submitMeasurement = (requester, questionNo, isCorrect, value, interpretation, caliperPlacementInterpretation, file) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({ status: 'Unauthorized', code: 401, message: 'You do not have permission to access this profile.' });
    }
    uploadImage(file, requester)
      .then((imageData) => {
        client.query(
          `INSERT INTO submissions (question_type, question_no, is_correct, value, interpretation, caliper_placement_interpretation, filename, original_name, storage_path, public_url, mime_type, size, session_id, user_mail, resource_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
          ['measurement', questionNo, isCorrect, value, interpretation, caliperPlacementInterpretation, imageData.filename, imageData.original_name, imageData.storage_path, imageData.public_url, imageData.mime_type, imageData.size, requester.session_id, requester.user_mail, requester.resource_id],
          (err, result) => {
            if (err) return reject(err);
            return resolve({ status: 'Submission Successful', code: 201, data: result.rows[0] });
          }
        );
      })
      .catch((err) => reject(err));
  });
};
module.exports = { submitType1, submitType2, submitAnnotation1, submitAnnotation2, submitMeasurement };