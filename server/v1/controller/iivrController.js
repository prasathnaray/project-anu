const {
  submitType1,
  submitType2,
  submitAnnotation1,
  submitAnnotation2,
  submitMeasurement,
  iivrStartTestm,
  iivrEndTestm
} = require('../model/iivrm.js');
const VALID_TYPES = ['type1', 'type2', 'annotation1', 'annotation2', 'measurement'];
const getMissingFields = (questionType, body, file) => {
  const missing = [];
  if (questionType === 'type1') {
    if (body.optionChosen === undefined) missing.push('optionChosen');
  }
  if (['type2', 'annotation1', 'annotation2', 'measurement'].includes(questionType)) {
    if (!file) missing.push('userImage');
  }
  if (['annotation1', 'annotation2'].includes(questionType)) {
    if (body.correctLabelCount === undefined) missing.push('correctLabelCount');
    if (body.wrongLabelCount === undefined) missing.push('wrongLabelCount');
    if (body.unusedLabelCount === undefined) missing.push('unusedLabelCount');
  }
  if (questionType === 'measurement') {
    if (body.value === undefined) missing.push('value');
    if (!body.interpretation) missing.push('interpretation');
    if (!body.caliperPlacementInterpretation) missing.push('caliperPlacementInterpretation');
  }
  return missing;
};

// const createSubmission = async (req, res, next) => {
//   try {
//     const { questionType, questionNo, isCorrect } = req.body;
//     const requester = req.user;
//     if (!questionType || questionNo === undefined || isCorrect === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: 'questionType, questionNo, and isCorrect are required',
//       });
//     }
//     if (!VALID_TYPES.includes(questionType)) {
//       return res.status(400).json({
//         success: false,
//         message: `questionType must be one of: ${VALID_TYPES.join(', ')}`,
//       });
//     }
//     const missingFields = getMissingFields(questionType, req.body, req.file);
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields for ${questionType}: ${missingFields.join(', ')}`,
//       });
//     }
//     const { questionNo: qNo, optionChosen, correctLabelCount, wrongLabelCount, unusedLabelCount, value, interpretation, caliperPlacementInterpretation } = req.body;
//     const isCorrectBool = JSON.parse(String(isCorrect).toLowerCase());
//     let result;
//     if (questionType === 'type1') {
//       result = await submitType1(requester, Number(qNo), Number(optionChosen), isCorrectBool);
//     } else if (questionType === 'type2') {
//       result = await submitType2(requester, Number(qNo), isCorrectBool, req.file);
//     } else if (questionType === 'annotation1') {
//       result = await submitAnnotation1(requester, Number(qNo), isCorrectBool, Number(correctLabelCount), Number(wrongLabelCount), Number(unusedLabelCount), req.file);
//     } else if (questionType === 'annotation2') {
//       result = await submitAnnotation2(requester, Number(qNo), isCorrectBool, Number(correctLabelCount), Number(wrongLabelCount), Number(unusedLabelCount), req.file);
//     } else if (questionType === 'measurement') {
//       result = await submitMeasurement(requester, Number(qNo), isCorrectBool, parseFloat(value), interpretation, caliperPlacementInterpretation, req.file);
//     }
//     res.status(result.code).json({result });
//   } catch (error) {
//     next(error);
//   }
// };

const createSubmission = async (req, res, next) => {
  try {
    const { questionType, questionNo, isCorrect, session_id } = req.body;
    const requester = { ...req.user, session_id };

    if (!questionType || questionNo === undefined || isCorrect === undefined || !session_id) {
      return res.status(400).json({
        success: false,
        message: 'questionType, questionNo, isCorrect, and session_id are required',
      });
    }
    if (!VALID_TYPES.includes(questionType)) {
      return res.status(400).json({
        success: false,
        message: `questionType must be one of: ${VALID_TYPES.join(', ')}`,
      });
    }
    const missingFields = getMissingFields(questionType, req.body, req.file);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields for ${questionType}: ${missingFields.join(', ')}`,
      });
    }
    const { questionNo: qNo, optionChosen, correctLabelCount, wrongLabelCount, unusedLabelCount, value, interpretation, caliperPlacementInterpretation } = req.body;
    const isCorrectBool = JSON.parse(String(isCorrect).toLowerCase());
    let result;
    if (questionType === 'type1') {
      result = await submitType1(requester, Number(qNo), Number(optionChosen), isCorrectBool);
    } else if (questionType === 'type2') {
      result = await submitType2(requester, Number(qNo), isCorrectBool, req.file);
    } else if (questionType === 'annotation1') {
      result = await submitAnnotation1(requester, Number(qNo), isCorrectBool, Number(correctLabelCount), Number(wrongLabelCount), Number(unusedLabelCount), req.file);
    } else if (questionType === 'annotation2') {
      result = await submitAnnotation2(requester, Number(qNo), isCorrectBool, Number(correctLabelCount), Number(wrongLabelCount), Number(unusedLabelCount), req.file);
    } else if (questionType === 'measurement') {
      result = await submitMeasurement(requester, Number(qNo), isCorrectBool, parseFloat(value), interpretation, caliperPlacementInterpretation, req.file);
    }
    res.status(result.code).json({ result });
  } catch (error) {
    next(error);
  }
};
const iivrStartTest = async(req, res) => {
     try
     {
        const {resource_id} = req.body;
        const requester = req.user;
        const response = await iivrStartTestm(requester, resource_id);
        res.status(200).json({ message: 'II Test has been Started', data: response.data });
     }
     catch(error)
     {
        res.status(500).send('Internal Server Error');
        console.log(error)
     }
}
const iivrEndTest = async(req, res) => {
      try
      {
         const {test_id} = req.body;
        const requester = req.user;
        const response = await iivrEndTestm(requester, test_id);
        res.status(200).json({ message: 'II Test has been Ended', data: response.data });
      }
      catch(error)
      {
        res.status(500).send('Internal Server Error');
      }
}
module.exports = { createSubmission, iivrStartTest, iivrEndTest};