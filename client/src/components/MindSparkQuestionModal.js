import React, { useEffect, useState } from "react";
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import { deleteMindSparkQuestionAPI, getMindSparkQuestionsAPI, saveMindSparkQuestionsAPI } from "../API/MindSparkQuestionsAPI";
import {
  buildQuestionPayload,
  changeQuestionType,
  emptyQuestion,
  formatQuestionForForm,
  getNextOptionRow,
  getQuestionValidationError,
  isMcqType,
  isOrderingType,
  questionUsesRows,
} from "../utils/mindSparkQuestionForm";

function MindSparkQuestionModal({ isVisible, onClose, resource }) {
  const [mindsparkNo, setMindsparkNo] = useState(1);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!isVisible || !resource?.resource_id) return;

      setMindsparkNo(1);
      setQuestions([emptyQuestion()]);

      try {
        const token = localStorage.getItem("user_token");
        const response = await getMindSparkQuestionsAPI(token, resource.resource_id, 1);
        const rows = response?.data?.data || [];
        setQuestions(rows.length > 0 ? rows.map(formatQuestionForForm) : [emptyQuestion()]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Mindspark questions");
      }
    };

    loadQuestions();
  }, [isVisible, resource]);

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

  const addOptionRow = (questionIndex) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;
        return {
          ...question,
          options: [...question.options, getNextOptionRow(question.question_type, question.options)],
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
    setQuestions((previous) => [...previous, emptyQuestion(previous.length + 1)]);
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
      return next.length > 0 ? next : [emptyQuestion()];
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
      toast.success("Mindspark questions saved", {
        autoClose: 3000,
        toastId: "mindspark-questions-saved",
        closeButton: CustomCloseButton,
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Mindspark questions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="w-[760px] bg-white p-4 rounded shadow-md" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-semibold">Configure Mindspark Questions</div>
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
              label="Mindspark No"
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
                      <MenuItem value="MCQ">MCQ</MenuItem>
                      <MenuItem value="ORDERING">Ordering</MenuItem>
                      <MenuItem value="IMAGE_ERROR">Image Error</MenuItem>
                      <MenuItem value="MATCHING">Matching</MenuItem>
                      <MenuItem value="MEASUREMENT">Measurements</MenuItem>
                    </Select>
                  </FormControl>
                </div>

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

                {questionUsesRows(question.question_type) && (
                  <div className="mt-4">
                    <div className="grid grid-cols-[80px_1fr_40px] gap-3">
                      {question.options.map((option, optionIndex) => (
                        <React.Fragment key={optionIndex}>
                          <TextField
                            size="small"
                            label={isOrderingType(question.question_type) ? "Step" : "Key"}
                            value={option.key}
                            onChange={(event) => updateOptionField(questionIndex, optionIndex, "key", event.target.value)}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label={isOrderingType(question.question_type) ? `Movement ${optionIndex + 1}` : `Option ${optionIndex + 1}`}
                            value={option.text}
                            onChange={(event) => updateOptionField(questionIndex, optionIndex, "text", event.target.value)}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeOptionRow(questionIndex, optionIndex)}
                            disabled={isMcqType(question.question_type) && question.options.length <= 2}
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </React.Fragment>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-3 border border-[#8DC63F] text-[#5d8f20] px-3 py-1.5 rounded text-xs"
                      onClick={() => addOptionRow(questionIndex)}
                    >
                      {isOrderingType(question.question_type) ? "Add Step" : "Add Option"}
                    </button>
                  </div>
                )}

                {isMcqType(question.question_type) && (
                  <div className="mt-4">
                    <TextField
                      fullWidth
                      size="small"
                      label="Correct Answer Key"
                      value={question.correct_answer_key}
                      onChange={(event) => updateQuestionField(questionIndex, "correct_answer_key", event.target.value)}
                    />
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label="Correct Feedback"
                    value={question.feedback_correct}
                    onChange={(event) => updateQuestionField(questionIndex, "feedback_correct", event.target.value)}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label="Wrong Feedback"
                    value={question.feedback_wrong}
                    onChange={(event) => updateQuestionField(questionIndex, "feedback_wrong", event.target.value)}
                  />
                </div>

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
