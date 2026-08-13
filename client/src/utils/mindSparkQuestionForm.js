export const QUESTION_TYPE = {
  MCQ: "MCQ",
  TRUE_FALSE: "TRUE_FALSE",
  ORDERING: "ORDERING",
  IMAGE_ERROR: "IMAGE_ERROR",
  MATCHING: "MATCHING",
  MEASUREMENT: "MEASUREMENT",
  WORDSEARCH: "WORDSEARCH",
  CROSSWORD: "CROSSWORD",
  FIND_IMAGE: "type1",
  IMAGE_UPLOAD: "type2",
  ANNOTATION1: "annotation1",
  ANNOTATION2: "annotation2",
  II_MEASUREMENT: "measurement",
};

const MCQ_KEYS = ["a", "b", "c", "d"];
const IMAGE_OPTION_KEYS = ["A", "B", "C", "D"];
const TRUE_FALSE_OPTIONS = [
  { key: "true", text: "True", image_url: "", image_alt: "" },
  { key: "false", text: "False", image_url: "", image_alt: "" },
];

export const QUESTION_CONFIG_MODE = {
  MINDSPARK: "mindspark",
  OB_BOOSTER: "ob_booster",
  IMAGE_INTERPRETATION: "image_interpretation",
};

export const OB_BOOSTER_UNITS = ["BPD & HC", "AC", "FL"];

const MINDSPARK_QUESTION_TYPE_OPTIONS = [
  { value: QUESTION_TYPE.MCQ, label: "MCQ" },
  { value: QUESTION_TYPE.ORDERING, label: "Ordering" },
  { value: QUESTION_TYPE.IMAGE_ERROR, label: "Image Error" },
  { value: QUESTION_TYPE.MATCHING, label: "Matching" },
  { value: QUESTION_TYPE.MEASUREMENT, label: "Measurements" },
];

const OB_BOOSTER_QUESTION_TYPE_OPTIONS = [
  { value: QUESTION_TYPE.TRUE_FALSE, label: "True / False" },
  { value: QUESTION_TYPE.MCQ, label: "Text Options" },
  { value: QUESTION_TYPE.FIND_IMAGE, label: "Picture Pick" },
  { value: QUESTION_TYPE.WORDSEARCH, label: "Wordsearch" },
  { value: QUESTION_TYPE.CROSSWORD, label: "Crossword" },
];

const IMAGE_INTERPRETATION_QUESTION_TYPE_OPTIONS = [
  { value: QUESTION_TYPE.FIND_IMAGE, label: "Find the Image" },
  { value: QUESTION_TYPE.IMAGE_UPLOAD, label: "Image Upload" },
  { value: QUESTION_TYPE.ANNOTATION1, label: "Annotation 1" },
  { value: QUESTION_TYPE.ANNOTATION2, label: "Annotation 2" },
  { value: QUESTION_TYPE.II_MEASUREMENT, label: "Measurement" },
];

const defaultMcqOptions = (questionType = QUESTION_TYPE.MCQ) => {
  if (questionType === QUESTION_TYPE.TRUE_FALSE) {
    return TRUE_FALSE_OPTIONS.map((option) => ({ ...option }));
  }

  const keys = questionType === QUESTION_TYPE.FIND_IMAGE ? IMAGE_OPTION_KEYS : MCQ_KEYS;
  return keys.map((key) => ({ key, text: "", image_url: "", image_alt: "" }));
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

const getQuestionImageAsset = (assets) => {
  const rows = Array.isArray(assets) ? assets : [];
  return rows.find((asset) => asset?.source === "question_image" && asset?.url)
    || rows.find((asset) => asset?.type === "image" && asset?.url)
    || rows.find((asset) => asset?.url);
};

const getQuestionVideoAsset = (assets) => {
  const rows = Array.isArray(assets) ? assets : [];
  return rows.find((asset) => asset?.source === "question_video" && asset?.url)
    || rows.find((asset) => asset?.type === "video" && asset?.url)
    || null;
};

const normalizeImageValue = (value) => String(value ?? "").trim();

const normalizeTextValue = (value) => String(value ?? "").trim();

const normalizeOptionImageFields = (option = {}) => ({
  image_url: normalizeImageValue(option.image_url ?? option.imageUrl ?? option.url ?? option.asset_url),
  image_storage_path: normalizeImageValue(option.image_url_storage_path ?? option.image_storage_path),
  image_alt: String(option.image_alt ?? option.imageAlt ?? option.alt ?? ""),
});

export const isMcqType = (questionType) => questionType === QUESTION_TYPE.MCQ;
export const isImageInterpretationFindImageType = (questionType) => questionType === QUESTION_TYPE.FIND_IMAGE;
export const isChoiceType = (questionType) => (
  questionType === QUESTION_TYPE.MCQ
  || questionType === QUESTION_TYPE.FIND_IMAGE
  || questionType === QUESTION_TYPE.TRUE_FALSE
);
export const isTrueFalseType = (questionType) => questionType === QUESTION_TYPE.TRUE_FALSE;
export const isOrderingType = (questionType) => questionType === QUESTION_TYPE.ORDERING;
export const isAnnotation1Type = (questionType) => questionType === QUESTION_TYPE.ANNOTATION1;
export const isAnnotation2Type = (questionType) => questionType === QUESTION_TYPE.ANNOTATION2;
export const isAnnotationType = (questionType) => isAnnotation1Type(questionType) || isAnnotation2Type(questionType);
export const isImageInterpretationMeasurementType = (questionType) => questionType === QUESTION_TYPE.II_MEASUREMENT;
export const questionUsesRows = (questionType) => isChoiceType(questionType) || isOrderingType(questionType);

export const getImageInterpretationFeedbackCaseCount = (questionType) => {
  if (isAnnotation1Type(questionType)) return 6;
  if (isAnnotation2Type(questionType)) return 11;
  if (isImageInterpretationMeasurementType(questionType)) return 3;
  return 0;
};

export const getImageInterpretationFeedbackCaseEntries = (questionType) => {
  const count = getImageInterpretationFeedbackCaseCount(questionType);
  return Array.from({ length: count }, (_, index) => ({
    key: `case_${index + 1}`,
    label: `Case ${index + 1}`,
  }));
};

export const isObBoosterResource = (resource) => {
  const topic = String(resource?.resource_topic || resource?.topic || "").toLowerCase();
  const name = String(resource?.resource_name || resource?.name || "").toLowerCase();
  return topic.includes("ob booster") || topic.includes("obboost")
    || name.includes("ob booster") || name.includes("obboost");
};

export const getQuestionConfigMode = (resource) => {
  if (String(resource?.resource_type || "").toLowerCase() === "image interpretation") {
    return QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION;
  }

  if (isObBoosterResource(resource)) {
    return QUESTION_CONFIG_MODE.OB_BOOSTER;
  }

  return QUESTION_CONFIG_MODE.MINDSPARK;
};

export const getQuestionTypeOptions = (mode = QUESTION_CONFIG_MODE.MINDSPARK) => (
  mode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
    ? IMAGE_INTERPRETATION_QUESTION_TYPE_OPTIONS
    : mode === QUESTION_CONFIG_MODE.OB_BOOSTER
      ? OB_BOOSTER_QUESTION_TYPE_OPTIONS
      : MINDSPARK_QUESTION_TYPE_OPTIONS
);

export const getDefaultQuestionType = (mode = QUESTION_CONFIG_MODE.MINDSPARK) => (
  mode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
    ? QUESTION_TYPE.FIND_IMAGE
    : mode === QUESTION_CONFIG_MODE.OB_BOOSTER
      ? QUESTION_TYPE.TRUE_FALSE
      : QUESTION_TYPE.MCQ
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
    : mode === QUESTION_CONFIG_MODE.OB_BOOSTER
      ? {
          title: "Configure OB Booster Questions",
          setNumberLabel: "OB Booster Set",
          successMessage: "OB Booster questions saved",
          failureLoadMessage: "Failed to load OB Booster questions",
          failureSaveMessage: "Failed to save OB Booster questions",
          optionLabel: "Option",
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
    if (isTrueFalseType(questionType)) {
      return TRUE_FALSE_OPTIONS.map((fallbackOption) => {
        const existing = rows.find((option) =>
          String(option?.key ?? option?.value ?? "").toLowerCase() === fallbackOption.key
        );
        return {
          ...fallbackOption,
          text: String(existing?.text ?? existing?.label ?? fallbackOption.text),
          ...normalizeOptionImageFields(existing || {}),
        };
      });
    }

    const fallbackKeys = questionType === QUESTION_TYPE.FIND_IMAGE ? IMAGE_OPTION_KEYS : MCQ_KEYS;
    return rows.length > 0
      ? rows.map((option, index) => ({
          key: String(option?.key ?? option?.value ?? fallbackKeys[index] ?? index + 1),
          text: String(option?.text ?? option?.label ?? ""),
          ...normalizeOptionImageFields(option),
        }))
      : defaultMcqOptions(questionType);
  }

  return [];
};

export const emptyQuestion = (questionNo = 1, mode = QUESTION_CONFIG_MODE.MINDSPARK) => {
  const questionType = getDefaultQuestionType(mode);
  const feedbackCases = Object.fromEntries(
    getImageInterpretationFeedbackCaseEntries(questionType).map((item) => [item.key, ""])
  );
  return {
    question_no: questionNo,
    question_type: questionType,
    prompt: "",
    options: defaultMcqOptions(questionType),
    correct_answer_key: "",
    feedback_correct: "",
    feedback_wrong: "",
    ob_unit: OB_BOOSTER_UNITS[0],
    image_url: "",
    image_alt: "",
    video_url: "",
    video_title: "",
    expected_timeframe: "",
    expected_landmarks_text: "",
    interpretation_guidance: "",
    feedback_cases: feedbackCases,
    assetsText: "[]",
    metadataText: "{}",
  };
};

export const formatQuestionForForm = (question, index) => {
  const questionType = question.question_type ?? QUESTION_TYPE.MCQ;
  const imageAsset = getQuestionImageAsset(question.assets);
  const videoAsset = getQuestionVideoAsset(question.assets);
  const feedbackCaseEntries = getImageInterpretationFeedbackCaseEntries(questionType);
  const storedFeedbackCases = question.metadata?.feedback_cases ?? {};
  const feedbackCases = Object.fromEntries(
    feedbackCaseEntries.map((item) => [item.key, String(storedFeedbackCases[item.key] ?? "")])
  );

  return {
    question_id: question.question_id,
    question_no: question.question_no ?? index + 1,
    question_type: questionType,
    prompt: question.prompt ?? "",
    options: normalizeOptionRows(question.options, questionType),
    correct_answer_key: question.correct_answer?.key ?? "",
    feedback_correct: question.feedback_correct ?? "",
    feedback_wrong: question.feedback_wrong ?? "",
    ob_unit: question.metadata?.ob_unit ?? question.metadata?.unit ?? OB_BOOSTER_UNITS[0],
    image_url: imageAsset?.url ?? "",
    image_storage_path: imageAsset?.url_storage_path ?? "",
    image_alt: imageAsset?.alt ?? imageAsset?.name ?? "",
    video_url: videoAsset?.url ?? question.metadata?.video_url ?? "",
    video_title: videoAsset?.title ?? videoAsset?.name ?? question.metadata?.video_title ?? "",
    expected_timeframe: question.metadata?.expected_timeframe ?? "",
    expected_landmarks_text: Array.isArray(question.metadata?.expected_landmarks)
      ? question.metadata.expected_landmarks.join(", ")
      : String(question.metadata?.expected_landmarks_text ?? ""),
    interpretation_guidance: question.metadata?.interpretation_guidance ?? "",
    feedback_cases: feedbackCases,
    assetsText: JSON.stringify(question.assets ?? [], null, 2),
    metadataText: JSON.stringify(question.metadata ?? {}, null, 2),
  };
};

export const changeQuestionType = (question, questionType) => ({
  ...question,
  question_type: questionType,
  options: isTrueFalseType(questionType) ? defaultMcqOptions(questionType) : normalizeOptionRows(question.options, questionType),
  correct_answer_key: isChoiceType(questionType) ? question.correct_answer_key : "",
  feedback_cases: Object.fromEntries(
    getImageInterpretationFeedbackCaseEntries(questionType).map((item) => [
      item.key,
      question.feedback_cases?.[item.key] ?? "",
    ])
  ),
});

export const getNextOptionRow = (questionType, rows) => {
  const nextIndex = Array.isArray(rows) ? rows.length : 0;

  if (isOrderingType(questionType)) {
    return { key: String(nextIndex + 1), text: "" };
  }

  if (isTrueFalseType(questionType)) {
    return null;
  }

  const keys = questionType === QUESTION_TYPE.FIND_IMAGE ? IMAGE_OPTION_KEYS : MCQ_KEYS;
  return { key: keys[nextIndex] ?? String(nextIndex + 1), text: "", image_url: "", image_alt: "" };
};

export const getQuestionValidationError = (question) => {
  if (!question.prompt.trim()) return "Question is required";

  if (
    isChoiceType(question.question_type)
    && question.question_type !== QUESTION_TYPE.FIND_IMAGE
    && !question.correct_answer_key.trim()
  ) {
    return "Correct answer key is required for option questions";
  }

  return null;
};

export const buildQuestionPayload = (question, index) => {
  const options = normalizeOptionRows(question.options, question.question_type)
    .map((option) => ({
      key: option.key.trim(),
      text: option.text.trim(),
      image_url: normalizeImageValue(option.image_storage_path || option.image_url),
      image_alt: String(option.image_alt ?? "").trim(),
    }))
    .filter((option) => option.key || option.text || option.image_url)
    .map((option) => ({
      key: option.key,
      text: option.text,
      ...(option.image_url ? { image_url: option.image_url } : {}),
      ...(option.image_alt ? { image_alt: option.image_alt } : {}),
    }));

  const parsedAssets = parseJsonText(question.assetsText, []);
  const parsedMetadata = parseJsonText(question.metadataText, {});
  const questionImageUrl = normalizeImageValue(question.image_storage_path || question.image_url);
  const questionVideoUrl = normalizeImageValue(question.video_url);
  const feedbackCases = Object.fromEntries(
    Object.entries(question.feedback_cases ?? {})
      .map(([key, value]) => [key, normalizeTextValue(value)])
      .filter(([, value]) => value)
  );
  const expectedLandmarks = normalizeTextValue(question.expected_landmarks_text)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const assets = questionImageUrl
    ? [
        {
          type: "image",
          source: "question_image",
          url: questionImageUrl,
          ...(question.image_alt?.trim() ? { alt: question.image_alt.trim() } : {}),
        },
        ...parsedAssets.filter((asset) => asset?.source !== "question_image" && asset?.url !== questionImageUrl),
      ]
    : [...parsedAssets];

  if (questionVideoUrl) {
    assets.unshift({
      type: "video",
      source: "question_video",
      url: questionVideoUrl,
      ...(normalizeTextValue(question.video_title) ? { title: normalizeTextValue(question.video_title) } : {}),
    });
  }

  let correctAnswer = {};
  if (isChoiceType(question.question_type)) {
    correctAnswer = question.question_type === QUESTION_TYPE.FIND_IMAGE && normalizeTextValue(question.expected_timeframe)
      ? { timeframe: normalizeTextValue(question.expected_timeframe) }
      : { key: question.correct_answer_key.trim() };
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
    assets,
    metadata: {
      ...parsedMetadata,
      ...(question.ob_unit ? { ob_unit: question.ob_unit } : {}),
      ...(normalizeTextValue(question.video_url) ? { video_url: normalizeTextValue(question.video_url) } : {}),
      ...(normalizeTextValue(question.video_title) ? { video_title: normalizeTextValue(question.video_title) } : {}),
      ...(normalizeTextValue(question.expected_timeframe) ? { expected_timeframe: normalizeTextValue(question.expected_timeframe) } : {}),
      ...(expectedLandmarks.length > 0 ? { expected_landmarks: expectedLandmarks } : {}),
      ...(normalizeTextValue(question.interpretation_guidance) ? { interpretation_guidance: normalizeTextValue(question.interpretation_guidance) } : {}),
      ...(Object.keys(feedbackCases).length > 0 ? { feedback_cases: feedbackCases } : {}),
    },
  };
};
