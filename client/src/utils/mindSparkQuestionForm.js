export const QUESTION_TYPE = {
  MCQ: "MCQ",
  ORDERING: "ORDERING",
  IMAGE_ERROR: "IMAGE_ERROR",
  MATCHING: "MATCHING",
  MEASUREMENT: "MEASUREMENT",
};

const MCQ_KEYS = ["a", "b", "c", "d"];

const defaultMcqOptions = () => MCQ_KEYS.map((key) => ({ key, text: "" }));

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
export const isOrderingType = (questionType) => questionType === QUESTION_TYPE.ORDERING;
export const questionUsesRows = (questionType) => isMcqType(questionType) || isOrderingType(questionType);

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

  if (isMcqType(questionType)) {
    return rows.length > 0
      ? rows.map((option, index) => ({
          key: String(option?.key ?? option?.value ?? MCQ_KEYS[index] ?? index + 1),
          text: String(option?.text ?? option?.label ?? ""),
        }))
      : defaultMcqOptions();
  }

  return [];
};

export const emptyQuestion = (questionNo = 1) => ({
  question_no: questionNo,
  question_type: QUESTION_TYPE.MCQ,
  prompt: "",
  options: defaultMcqOptions(),
  correct_answer_key: "",
  feedback_correct: "",
  feedback_wrong: "",
  assetsText: "[]",
  metadataText: "{}",
});

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
  correct_answer_key: isMcqType(questionType) ? question.correct_answer_key : "",
});

export const getNextOptionRow = (questionType, rows) => {
  const nextIndex = Array.isArray(rows) ? rows.length : 0;

  if (isOrderingType(questionType)) {
    return { key: String(nextIndex + 1), text: "" };
  }

  return { key: MCQ_KEYS[nextIndex] ?? String(nextIndex + 1), text: "" };
};

export const getQuestionValidationError = (question) => {
  if (!question.prompt.trim()) return "Question is required";

  if (isMcqType(question.question_type) && !question.correct_answer_key.trim()) {
    return "Correct answer key is required for MCQ questions";
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
  if (isMcqType(question.question_type)) {
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
