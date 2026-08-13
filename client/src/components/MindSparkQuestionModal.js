import React, { useEffect, useState } from "react";
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Trash2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import {
  deleteMindSparkQuestionAPI,
  getMindSparkQuestionsAPI,
  saveMindSparkQuestionsAPI,
  uploadMindSparkQuestionAssetAPI,
} from "../API/MindSparkQuestionsAPI";
import {
  buildQuestionPayload,
  changeQuestionType,
  emptyQuestion,
  formatQuestionForForm,
  getNextOptionRow,
  getQuestionConfigCopy,
  getQuestionConfigMode,
  getQuestionValidationError,
  getQuestionTypeOptions,
  OB_BOOSTER_UNITS,
  QUESTION_CONFIG_MODE,
  getImageInterpretationFeedbackCaseEntries,
  isAnnotationType,
  isChoiceType,
  isImageInterpretationFindImageType,
  isImageInterpretationMeasurementType,
  isOrderingType,
  isTrueFalseType,
  questionUsesRows,
} from "../utils/mindSparkQuestionForm";

function MindSparkQuestionModal({ isVisible, onClose, resource }) {
  const configMode = getQuestionConfigMode(resource);
  const copy = getQuestionConfigCopy(configMode);
  const questionTypeOptions = getQuestionTypeOptions(configMode);
  const [mindsparkNo, setMindsparkNo] = useState(1);
  const [questions, setQuestions] = useState([emptyQuestion(1, configMode)]);
  const [saving, setSaving] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState({});
  const canRemoveOption = (question) => {
    if (isTrueFalseType(question.question_type)) return false;
    if (
      configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
      && isImageInterpretationFindImageType(question.question_type)
    ) {
      return true;
    }
    return !(isChoiceType(question.question_type) && question.options.length <= 2);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      if (!isVisible || !resource?.resource_id) return;

      setMindsparkNo(1);
      setQuestions([emptyQuestion(1, configMode)]);

      try {
        const token = localStorage.getItem("user_token");
        const response = await getMindSparkQuestionsAPI(token, resource.resource_id, 1);
        const rows = response?.data?.data || [];
        setQuestions(rows.length > 0 ? rows.map(formatQuestionForForm) : [emptyQuestion(1, configMode)]);
      } catch (err) {
        console.error(err);
        toast.error(copy.failureLoadMessage);
      }
    };

    loadQuestions();
  }, [isVisible, resource, configMode, copy.failureLoadMessage]);

  if (!isVisible) return null;

  const updateQuestionField = (index, field, value) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      )
    );
  };

  const updateOptionField = (questionIndex, optionIndex, field, value) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;
        const options = question.options.map((option, currentOptionIndex) =>
          currentOptionIndex === optionIndex ? { ...option, [field]: value } : option
        );
        return { ...question, options };
      })
    );
  };

  const updateQuestionType = (index, questionType) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index ? changeQuestionType(question, questionType) : question
      )
    );
  };

  const uploadQuestionImage = async (questionIndex, file) => {
    if (!file) return;
    const uploadKey = `question-${questionIndex}`;
    setUploadingAsset((previous) => ({ ...previous, [uploadKey]: true }));

    try {
      const token = localStorage.getItem("user_token");
      const response = await uploadMindSparkQuestionAssetAPI(token, file);
      const uploaded = response?.data?.data;
      if (!uploaded?.public_url) throw new Error("Upload did not return an image URL");

      setQuestions((previous) =>
        previous.map((question, index) =>
          index === questionIndex
            ? {
                ...question,
                image_url: uploaded.public_url,
                image_storage_path: uploaded.storage_path,
                image_alt: question.image_alt || uploaded.original_name || "",
              }
            : question
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploadingAsset((previous) => ({ ...previous, [uploadKey]: false }));
    }
  };

  const uploadOptionImage = async (questionIndex, optionIndex, file) => {
    if (!file) return;
    const uploadKey = `option-${questionIndex}-${optionIndex}`;
    setUploadingAsset((previous) => ({ ...previous, [uploadKey]: true }));

    try {
      const token = localStorage.getItem("user_token");
      const response = await uploadMindSparkQuestionAssetAPI(token, file);
      const uploaded = response?.data?.data;
      if (!uploaded?.public_url) throw new Error("Upload did not return an image URL");

      setQuestions((previous) =>
        previous.map((question, index) => {
          if (index !== questionIndex) return question;
          const options = question.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex
              ? {
                  ...option,
                  image_url: uploaded.public_url,
                  image_storage_path: uploaded.storage_path,
                  image_alt: option.image_alt || uploaded.original_name || "",
                }
              : option
          );
          return { ...question, options };
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploadingAsset((previous) => ({ ...previous, [uploadKey]: false }));
    }
  };

  const addOptionRow = (questionIndex) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;
        const nextOption = getNextOptionRow(question.question_type, question.options);
        if (!nextOption) return question;
        return {
          ...question,
          options: [...question.options, nextOption],
        };
      })
    );
  };

  const removeOptionRow = (questionIndex, optionIndex) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;
        return {
          ...question,
          options: question.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex),
        };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((previous) => [...previous, emptyQuestion(previous.length + 1, configMode)]);
  };

  const removeQuestion = async (index) => {
    const question = questions[index];

    if (question.question_id) {
      try {
        const token = localStorage.getItem("user_token");
        await deleteMindSparkQuestionAPI(token, question.question_id);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete question");
        return;
      }
    }

    setQuestions((previous) => {
      const next = previous.filter((_, questionIndex) => questionIndex !== index);
      return next.length > 0 ? next : [emptyQuestion(1, configMode)];
    });
  };

  const saveQuestions = async () => {
    if (!resource?.resource_id) {
      toast.error("Select a resource first");
      return;
    }

    const validationError = questions.map(getQuestionValidationError).find(Boolean);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      resource_id: resource.resource_id,
      mindspark_no: Number(mindsparkNo) || 1,
      questions: questions.map(buildQuestionPayload),
    };

    try {
      setSaving(true);
      const token = localStorage.getItem("user_token");
      await saveMindSparkQuestionsAPI(token, payload);
      toast.success(copy.successMessage, {
        autoClose: 3000,
        toastId: `${configMode}-questions-saved`,
        closeButton: CustomCloseButton,
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(copy.failureSaveMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="w-[760px] bg-white p-4 rounded shadow-md" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-semibold">{copy.title}</div>
            <div className="text-xs text-gray-500 mt-1">{resource?.resource_name}</div>
          </div>
          <IconButton onClick={onClose}>
            <X className="h-6 w-6" />
          </IconButton>
        </div>

        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <TextField fullWidth size="small" label="Resource ID" value={resource?.resource_id || ""} disabled />
            <TextField
              fullWidth
              size="small"
              type="number"
              label={copy.setNumberLabel}
              value={mindsparkNo}
              onChange={(event) => setMindsparkNo(event.target.value)}
            />
          </div>

          <div className="mt-5 space-y-5">
            {questions.map((question, questionIndex) => (
              <div key={question.question_id || questionIndex} className="border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium text-gray-700">Question {questionIndex + 1}</div>
                  <IconButton size="small" color="error" onClick={() => removeQuestion(questionIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Question No"
                    value={question.question_no}
                    onChange={(event) => updateQuestionField(questionIndex, "question_no", event.target.value)}
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      label="Question Type"
                      value={question.question_type}
                      onChange={(event) => updateQuestionType(questionIndex, event.target.value)}
                    >
                      {questionTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {configMode === QUESTION_CONFIG_MODE.OB_BOOSTER && (
                  <div className="mt-4">
                    <FormControl fullWidth size="small">
                      <InputLabel>OB Unit</InputLabel>
                      <Select
                        label="OB Unit"
                        value={question.ob_unit || OB_BOOSTER_UNITS[0]}
                        onChange={(event) => updateQuestionField(questionIndex, "ob_unit", event.target.value)}
                      >
                        {OB_BOOSTER_UNITS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                <div className="mt-4">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label="Question"
                    value={question.prompt}
                    onChange={(event) => updateQuestionField(questionIndex, "prompt", event.target.value)}
                  />
                </div>

                <div className="mt-4 grid grid-cols-[1fr_180px] gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      size="small"
                      label={configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION ? "Reference Image URL" : "Question Image URL"}
                      value={question.image_url}
                      onChange={(event) => updateQuestionField(questionIndex, "image_url", event.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label={configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION ? "Reference Image Alt" : "Question Image Alt"}
                      value={question.image_alt}
                      onChange={(event) => updateQuestionField(questionIndex, "image_alt", event.target.value)}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<Upload size={14} />}
                      disabled={uploadingAsset[`question-${questionIndex}`]}
                    >
                      {uploadingAsset[`question-${questionIndex}`] ? "Uploading..." : "Upload Question Image"}
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          uploadQuestionImage(questionIndex, event.target.files?.[0]);
                          event.target.value = "";
                        }}
                      />
                    </Button>
                  </div>
                  <div className="h-24 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {question.image_url ? (
                      <img src={question.image_url} alt={question.image_alt || "Question"} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">Image preview</span>
                    )}
                  </div>
                </div>

                {configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION && isImageInterpretationFindImageType(question.question_type) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      size="small"
                      label="Reference Video URL"
                      value={question.video_url}
                      onChange={(event) => updateQuestionField(questionIndex, "video_url", event.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Video Title"
                      value={question.video_title}
                      onChange={(event) => updateQuestionField(questionIndex, "video_title", event.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Expected Timeframe"
                      value={question.expected_timeframe}
                      onChange={(event) => updateQuestionField(questionIndex, "expected_timeframe", event.target.value)}
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      size="small"
                      label="Interpretation Guidance"
                      value={question.interpretation_guidance}
                      onChange={(event) => updateQuestionField(questionIndex, "interpretation_guidance", event.target.value)}
                    />
                  </div>
                )}

                {configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION && isAnnotationType(question.question_type) && (
                  <div className="mt-4">
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      size="small"
                      label="Expected Landmarks"
                      helperText="Comma-separated, e.g. Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
                      value={question.expected_landmarks_text}
                      onChange={(event) => updateQuestionField(questionIndex, "expected_landmarks_text", event.target.value)}
                    />
                  </div>
                )}

                {configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION && isImageInterpretationMeasurementType(question.question_type) && (
                  <div className="mt-4">
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      size="small"
                      label="Interpretation Guidance"
                      helperText="Example: Values between the 5th and 95th percentiles are considered normal."
                      value={question.interpretation_guidance}
                      onChange={(event) => updateQuestionField(questionIndex, "interpretation_guidance", event.target.value)}
                    />
                  </div>
                )}

                {questionUsesRows(question.question_type) && (
                  <div className="mt-4">
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="grid grid-cols-[70px_1fr_1fr_120px_40px] gap-3 items-start rounded border border-gray-100 bg-gray-50 p-3">
                          <TextField
                            size="small"
                            label={isOrderingType(question.question_type) ? "Step" : "Key"}
                            value={option.key}
                            onChange={(event) => updateOptionField(questionIndex, optionIndex, "key", event.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label={isOrderingType(question.question_type) ? `Movement ${optionIndex + 1}` : `${copy.optionLabel} ${optionIndex + 1}`}
                            value={option.text}
                            onChange={(event) => updateOptionField(questionIndex, optionIndex, "text", event.target.value)}
                          />
                          {!isOrderingType(question.question_type) && !isTrueFalseType(question.question_type) ? (
                            <div className="space-y-2">
                              <TextField
                                fullWidth
                                size="small"
                                label="Option Image URL"
                                value={option.image_url || ""}
                                onChange={(event) => updateOptionField(questionIndex, optionIndex, "image_url", event.target.value)}
                              />
                              <Button
                                component="label"
                                variant="outlined"
                                size="small"
                                startIcon={<Upload size={14} />}
                                disabled={uploadingAsset[`option-${questionIndex}-${optionIndex}`]}
                                fullWidth
                              >
                                {uploadingAsset[`option-${questionIndex}-${optionIndex}`] ? "Uploading..." : "Upload Image"}
                                <input
                                  hidden
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    uploadOptionImage(questionIndex, optionIndex, event.target.files?.[0]);
                                    event.target.value = "";
                                  }}
                                />
                              </Button>
                            </div>
                          ) : (
                            <div />
                          )}
                          <div className="h-20 rounded border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                            {option.image_url ? (
                              <img src={option.image_url} alt={option.image_alt || option.text || `Option ${option.key}`} className="h-full w-full object-contain" />
                            ) : (
                              <span className="px-2 text-center text-[11px] text-gray-400">Option preview</span>
                            )}
                          </div>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeOptionRow(questionIndex, optionIndex)}
                            disabled={!canRemoveOption(question)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                          {!isOrderingType(question.question_type) && !isTrueFalseType(question.question_type) && (
                            <TextField
                              className="col-start-3"
                              fullWidth
                              size="small"
                              label="Option Image Alt"
                              value={option.image_alt || ""}
                              onChange={(event) => updateOptionField(questionIndex, optionIndex, "image_alt", event.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {!isTrueFalseType(question.question_type) && (
                      <button
                        type="button"
                        className="mt-3 border border-[#8DC63F] text-[#5d8f20] px-3 py-1.5 rounded text-xs"
                        onClick={() => addOptionRow(questionIndex)}
                      >
                        {isOrderingType(question.question_type) ? "Add Step" : "Add Option"}
                      </button>
                    )}
                  </div>
                )}

                {isChoiceType(question.question_type) && (
                  <div className="mt-4">
                    {isTrueFalseType(question.question_type) ? (
                      <FormControl fullWidth size="small">
                        <InputLabel>Correct Answer</InputLabel>
                        <Select
                          label="Correct Answer"
                          value={question.correct_answer_key}
                          onChange={(event) => updateQuestionField(questionIndex, "correct_answer_key", event.target.value)}
                        >
                          <MenuItem value="true">True</MenuItem>
                          <MenuItem value="false">False</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        label="Correct Answer Key"
                        helperText={configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION && isImageInterpretationFindImageType(question.question_type)
                          ? "Optional. Use A/B/C/D if you want to configure the answer before uploading option images."
                          : ""}
                        value={question.correct_answer_key}
                        onChange={(event) => updateQuestionField(questionIndex, "correct_answer_key", event.target.value)}
                      />
                    )}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label={configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION ? "Feedback If Correct" : "Correct Feedback"}
                    value={question.feedback_correct}
                    onChange={(event) => updateQuestionField(questionIndex, "feedback_correct", event.target.value)}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label={configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION ? "Default Feedback If Wrong" : "Wrong Feedback"}
                    value={question.feedback_wrong}
                    onChange={(event) => updateQuestionField(questionIndex, "feedback_wrong", event.target.value)}
                  />
                </div>

                {configMode === QUESTION_CONFIG_MODE.IMAGE_INTERPRETATION
                  && getImageInterpretationFeedbackCaseEntries(question.question_type).length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-3">Case-Based Wrong Feedback</div>
                      <div className="grid grid-cols-1 gap-3">
                        {getImageInterpretationFeedbackCaseEntries(question.question_type).map((item) => (
                          <TextField
                            key={item.key}
                            fullWidth
                            multiline
                            minRows={2}
                            size="small"
                            label={item.label}
                            value={question.feedback_cases?.[item.key] || ""}
                            onChange={(event) =>
                              updateQuestionField(questionIndex, "feedback_cases", {
                                ...(question.feedback_cases || {}),
                                [item.key]: event.target.value,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    label="Assets JSON"
                    value={question.assetsText}
                    onChange={(event) => updateQuestionField(questionIndex, "assetsText", event.target.value)}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    label="Metadata JSON"
                    value={question.metadataText}
                    onChange={(event) => updateQuestionField(questionIndex, "metadataText", event.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-5">
            <button className="border border-[#8DC63F] text-[#5d8f20] px-3 py-2 rounded text-sm" onClick={addQuestion}>
              Add Question
            </button>
            <button
              className="bg-[#8DC63F] px-3 py-2 text-white rounded text-sm disabled:bg-gray-300"
              onClick={saveQuestions}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Questions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MindSparkQuestionModal;
