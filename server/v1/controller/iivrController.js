const {
  submitType1,
  submitType2,
  submitAnnotation1,
  submitAnnotation2,
  submitMeasurement,
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

const createSubmission = async (req, res, next) => {
  try {
    const { questionType, questionNo, isCorrect } = req.body;
    if (!questionType || questionNo === undefined || isCorrect === undefined) {
      return res.status(400).json({
        success: false,
        message: 'questionType, questionNo, and isCorrect are required',
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
      result = await submitType1(Number(qNo), Number(optionChosen), isCorrectBool);
    } else if (questionType === 'type2') {
      result = await submitType2(Number(qNo), isCorrectBool, req.file);
    } else if (questionType === 'annotation1') {
      result = await submitAnnotation1(Number(qNo), isCorrectBool, Number(correctLabelCount), Number(wrongLabelCount), Number(unusedLabelCount), req.file);
    } else if (questionType === 'annotation2') {
      result = await submitAnnotation2(Number(qNo), isCorrectBool, Number(correctLabelCount), Number(wrongLabelCount), Number(unusedLabelCount), req.file);
    } else if (questionType === 'measurement') {
      result = await submitMeasurement(Number(qNo), isCorrectBool, parseFloat(value), interpretation, caliperPlacementInterpretation, req.file);
    }
    res.status(result.code).json({ success: true, ...result.data });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubmission };