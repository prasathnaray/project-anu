export const QUESTION_TYPE = {
  MCQ: "MCQ",
  ORDERING: "ORDERING",
  IMAGE_ERROR: "IMAGE_ERROR",
  MATCHING: "MATCHING",
  MEASUREMENT: "MEASUREMENT",
  FIND_IMAGE: "type1",
  IMAGE_UPLOAD: "type2",
  ANNOTATION1: "annotation1",
  ANNOTATION2: "annotation2",
  II_MEASUREMENT: "measurement",
};

const MCQ_KEYS = ["a", "b", "c", "d"];
const IMAGE_OPTION_KEYS = ["A", "B", "C", "D"];

export const QUESTION_CONFIG_MODE = {
  MINDSPARK: "mindspark",
  IMAGE_INTERPRETATION: "image_interpretation",
};

const MINDSPARK_QUESTION_TYPE_OPTIONS = [
  { value: QUESTION_TYPE.MCQ, label: "MCQ" },
  { value: QUESTION_TYPE.ORDERING, label: "Ordering" },
  { value: QUESTION_TYPE.IMAGE_ERROR, label: "Image Error" },
  { value: QUESTION_TYPE.MATCHING, label: "Matching" },
  { value: QUESTION_TYPE.MEASUREMENT, label: "Measurements" },
];

const IMAGE_INTERPRETATION_QUESTION_TYPE_OPTIONS = [
  { value: QUESTION_TYPE.FIND_IMAGE, label: "Find the Image" },
  { value: QUESTION_TYPE.IMAGE_UPLOAD, label: "Image Upload" },
  { value: QUESTION_TYPE.ANNOTATION1, label: "Annotation 1" },
  { value: QUESTION_TYPE.ANNOTATION2, label: "Annotation 2" },
  { value: QUESTION_TYPE.II_MEASUREMENT, label: "Measurement" },
];

const defaultMcqOptions = (questionType = QUESTION_TYPE.MCQ) => {
  const keys = questionType === QUESTION_TYPE.FIND_IMAGE ? IMAGE_OPTION_KEYS : MCQ_KEYS;
  return keys.map((key) => ({ key, text: "" }));
};

const defaultOrderingSteps = () => [
  { key: "1", text: "" },
  { key: "2", text: "" },
];

export const parseJsonText = (value, fallback) => {
  try {
    return JSON.parse(value || JSON.stringify(fallback));
  } catch (err) {
    return fallback;
  }
};

export const isMcqType = (questionType) => questionType === QUESTION_TYPE.MCQ;
export const isChoiceType = (questionType) => (
  questionType === QUESTION_TYPE.MCQ || questionType === QUESTION_TYPE.FIND_IMAGE
);
export const isOrderingType = (questionType) => questionType === QUESTION_TYPE.ORDERING;
export const questionUsesRows = (questionType) => isChoiceType(questionType) || isOrderingType(questionType);

export const getQuestionConfigMode = (resource) => (
  String(resource?.resource_type || "").toLowerCase() === "image interpretation"
    ? QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
    : QUESTION_CONFIG_MODE.MINDSPARK
);

export const getQuestionTypeOptions = (mode = QUESTION_CONFIG_MODE.MINDSPARK) => (
  mode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
    ? IMAGE_INTERPRETATION_QUESTION_TYPE_OPTIONS
    : MINDSPARK_QUESTION_TYPE_OPTIONS
);

export const getDefaultQuestionType = (mode = QUESTION_CONFIG_MODE.MINDSPARK) => (
  mode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION ? QUESTION_TYPE.FIND_IMAGE : QUESTION_TYPE.MCQ
);

export const getQuestionConfigCopy = (mode = QUESTION_CONFIG_MODE.MINDSPARK) => (
  mode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
    ? {
        title: "Configure Image Interpretation Questions",
        setNumberLabel: "Question Set",
        successMessage: "Image Interpretation questions saved",
        failureLoadMessage: "Failed to load Image Interpretation questions",
        failureSaveMessage: "Failed to save Image Interpretation questions",
        optionLabel: "Image Option",
      }
    : {
        title: "Configure Mindspark Questions",
        setNumberLabel: "Mindspark No",
        successMessage: "Mindspark questions saved",
        failureLoadMessage: "Failed to load Mindspark questions",
        failureSaveMessage: "Failed to save Mindspark questions",
        optionLabel: "Option",
      }
);

export const normalizeOptionRows = (options, questionType) => {
  const rows = Array.isArray(options) ? options : [];

  if (isOrderingType(questionType)) {
    return rows.length > 0
      ? rows.map((option, index) => ({
          key: String(option?.key ?? option?.value ?? index + 1),
          text: String(option?.text ?? option?.label ?? ""),
        }))
      : defaultOrderingSteps();
  }

  if (isChoiceType(questionType)) {
    const fallbackKeys = questionType === QUESTION_TYPE.FIND_IMAGE ? IMAGE_OPTION_KEYS : MCQ_KEYS;
    return rows.length > 0
      ? rows.map((option, index) => ({
          key: String(option?.key ?? option?.value ?? fallbackKeys[index] ?? index + 1),
          text: String(option?.text ?? option?.label ?? ""),
        }))
      : defaultMcqOptions(questionType);
  }

  return [];
};

export const emptyQuestion = (questionNo = 1, mode = QUESTION_CONFIG_MODE.MINDSPARK) => {
  const questionType = getDefaultQuestionType(mode);
  return {
    question_no: questionNo,
    question_type: questionType,
    prompt: "",
    options: defaultMcqOptions(questionType),
    correct_answer_key: "",
    feedback_correct: "",
    feedback_wrong: "",
    assetsText: "[]",
    metadataText: "{}",
  };
};

export const formatQuestionForForm = (question, index) => {
  const questionType = question.question_type ?? QUESTION_TYPE.MCQ;

  return {
    question_id: question.question_id,
    question_no: question.question_no ?? index + 1,
    question_type: questionType,
    prompt: question.prompt ?? "",
    options: normalizeOptionRows(question.options, questionType),
    correct_answer_key: question.correct_answer?.key ?? "",
    feedback_correct: question.feedback_correct ?? "",
    feedback_wrong: question.feedback_wrong ?? "",
    assetsText: JSON.stringify(question.assets ?? [], null, 2),
    metadataText: JSON.stringify(question.metadata ?? {}, null, 2),
  };
};

export const changeQuestionType = (question, questionType) => ({
  ...question,
  question_type: questionType,
  options: normalizeOptionRows(question.options, questionType),
  correct_answer_key: isChoiceType(questionType) ? question.correct_answer_key : "",
});

export const getNextOptionRow = (questionType, rows) => {
  const nextIndex = Array.isArray(rows) ? rows.length : 0;

  if (isOrderingType(questionType)) {
    return { key: String(nextIndex + 1), text: "" };
  }

  const keys = questionType === QUESTION_TYPE.FIND_IMAGE ? IMAGE_OPTION_KEYS : MCQ_KEYS;
  return { key: keys[nextIndex] ?? String(nextIndex + 1), text: "" };
};

export const getQuestionValidationError = (question) => {
  if (!question.prompt.trim()) return "Question is required";

  if (isChoiceType(question.question_type) && !question.correct_answer_key.trim()) {
    return "Correct answer key is required for option questions";
  }

  return null;
};

export const buildQuestionPayload = (question, index) => {
  const options = normalizeOptionRows(question.options, question.question_type)
    .map((option) => ({
      key: option.key.trim(),
      text: option.text.trim(),
    }))
    .filter((option) => option.key || option.text);

  let correctAnswer = {};
  if (isChoiceType(question.question_type)) {
    correctAnswer = { key: question.correct_answer_key.trim() };
  } else if (isOrderingType(question.question_type)) {
    correctAnswer = { order: options.map((option) => option.key) };
  }

  return {
    question_no: Number(question.question_no) || index + 1,
    question_type: question.question_type,
    prompt: question.prompt.trim(),
    options: questionUsesRows(question.question_type) ? options : [],
    correct_answer: correctAnswer,
    feedback_correct: question.feedback_correct,
    feedback_wrong: question.feedback_wrong,
    assets: parseJsonText(question.assetsText, []),
    metadata: parseJsonText(question.metadataText, {}),
  };
};
