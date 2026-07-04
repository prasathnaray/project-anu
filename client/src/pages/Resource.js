import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useParams } from "react-router-dom";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import { ArrowUpWideNarrow, Plus, X, CheckCircle, LayoutDashboard, Bookmark, Notebook, Settings, Trash2 } from "lucide-react";
import { FormControl, IconButton, InputLabel, List, MenuItem, Select, TextField } from "@mui/material";
import CreateModule from "../components/superadmin/CreateModule";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import getResourceAPI from "../API/GetResourceAPI";
import CreateResourceApi from "../API/createResourcesAPI";
import { deleteMindSparkQuestionAPI, getMindSparkQuestionsAPI, saveMindSparkQuestionsAPI } from "../API/MindSparkQuestionsAPI";
import { MarketingIcon } from "hugeicons-react";

const emptyQuestion = (questionNo = 1) => ({
  question_no: questionNo,
  question_type: "MCQ",
  prompt: "",
  options: [
    { key: "a", text: "" },
    { key: "b", text: "" },
    { key: "c", text: "" },
    { key: "d", text: "" },
  ],
  correct_answer_key: "",
  feedback_correct: "",
  feedback_wrong: "",
  assetsText: "[]",
  metadataText: "{}",
});

const parseJsonText = (value, fallback) => {
  try {
    return JSON.parse(value || JSON.stringify(fallback));
  } catch (err) {
    return fallback;
  }
};

const formatQuestionForForm = (question, index) => ({
  question_id: question.question_id,
  question_no: question.question_no ?? index + 1,
  question_type: question.question_type ?? "MCQ",
  prompt: question.prompt ?? "",
  options: Array.isArray(question.options) && question.options.length > 0
    ? question.options
    : emptyQuestion(index + 1).options,
  correct_answer_key: question.correct_answer?.key ?? "",
  feedback_correct: question.feedback_correct ?? "",
  feedback_wrong: question.feedback_wrong ?? "",
  assetsText: JSON.stringify(question.assets ?? [], null, 2),
  metadataText: JSON.stringify(question.metadata ?? {}, null, 2),
});

function Resource() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  // popup state
  const [openResource, setOpenResource] = React.useState(false);
  const handleClose = () => {
    setOpenResource(false);
    setResourceData({
      resource_name: "",
      module_id: url.module_id, // auto assign from URL
    });
  };

  // get module_id from URL params
  const url = useParams();

  const [resourceData, setResourceData] = React.useState({
    resource_name: "",
    module_id: url.module_id, // ensure correct mapping
  });

  const [questionModalOpen, setQuestionModalOpen] = React.useState(false);
  const [selectedResource, setSelectedResource] = React.useState(null);
  const [mindsparkNo, setMindsparkNo] = React.useState(1);
  const [mindSparkQuestions, setMindSparkQuestions] = React.useState([emptyQuestion()]);
  const [savingQuestions, setSavingQuestions] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData({
      ...resourceData,
      [name]: value,
    });
  };

  // create resource API call
  const createResourceAPI = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await CreateResourceApi(token, resourceData);
      if (response)
      {
          toast.success("Resource Created", {
            autoClose: 3000,
            toastId: "resource-created",
            closeButton: CustomCloseButton,
          });
          handleClose();
          getResources();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create resource");
    }
  };

  // fetch resources (dummy for now, replace with API later)
  const [resources, setResources] = React.useState([]);
  const getResources = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await getResourceAPI(token, url.module_id);
      setResources(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openQuestionForm = async (resource) => {
    setSelectedResource(resource);
    setMindsparkNo(1);
    setQuestionModalOpen(true);
    setMindSparkQuestions([emptyQuestion()]);

    try {
      const token = localStorage.getItem("user_token");
      const response = await getMindSparkQuestionsAPI(token, resource.resource_id, 1);
      const rows = response?.data?.data || [];
      setMindSparkQuestions(rows.length > 0 ? rows.map(formatQuestionForForm) : [emptyQuestion()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Mindspark questions");
    }
  };

  const closeQuestionForm = () => {
    setQuestionModalOpen(false);
    setSelectedResource(null);
    setMindsparkNo(1);
    setMindSparkQuestions([emptyQuestion()]);
  };

  const updateQuestionField = (index, field, value) => {
    setMindSparkQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      )
    );
  };

  const updateOptionField = (questionIndex, optionIndex, field, value) => {
    setMindSparkQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;
        const options = question.options.map((option, currentOptionIndex) =>
          currentOptionIndex === optionIndex ? { ...option, [field]: value } : option
        );
        return { ...question, options };
      })
    );
  };

  const addQuestion = () => {
    setMindSparkQuestions((previous) => [...previous, emptyQuestion(previous.length + 1)]);
  };

  const removeQuestion = async (index) => {
    const question = mindSparkQuestions[index];

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

    setMindSparkQuestions((previous) => {
      const next = previous.filter((_, questionIndex) => questionIndex !== index);
      return next.length > 0 ? next : [emptyQuestion()];
    });
  };

  const saveQuestions = async () => {
    if (!selectedResource?.resource_id) {
      toast.error("Select a resource first");
      return;
    }

    const invalidQuestion = mindSparkQuestions.find((question) => !question.prompt.trim() || !question.correct_answer_key.trim());
    if (invalidQuestion) {
      toast.error("Question and correct answer are required");
      return;
    }

    const payload = {
      resource_id: selectedResource.resource_id,
      mindspark_no: Number(mindsparkNo) || 1,
      questions: mindSparkQuestions.map((question, index) => ({
        question_no: Number(question.question_no) || index + 1,
        question_type: question.question_type,
        prompt: question.prompt.trim(),
        options: question.options.filter((option) => option.key?.trim() || option.text?.trim()),
        correct_answer: { key: question.correct_answer_key.trim() },
        feedback_correct: question.feedback_correct,
        feedback_wrong: question.feedback_wrong,
        assets: parseJsonText(question.assetsText, []),
        metadata: parseJsonText(question.metadataText, {}),
      })),
    };

    try {
      setSavingQuestions(true);
      const token = localStorage.getItem("user_token");
      await saveMindSparkQuestionsAPI(token, payload);
      toast.success("Mindspark questions saved", {
        autoClose: 3000,
        toastId: "mindspark-questions-saved",
        closeButton: CustomCloseButton,
      });
      closeQuestionForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Mindspark questions");
    } finally {
      setSavingQuestions(false);
    }
  };

  React.useEffect(() => {
    getResources();
  }, []);

  // decode token
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />

        {/* Main Content */}
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen pt-12">
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px] hover:underline hover:underline-offset-4"><a href={`/course`}>Course</a></span> / <List size={15}/> <a href={`${localStorage.getItem('last_page_visited')}`} className="text-[15px] hover:underline hover:underline-offset-4">Chapters</a> / <Bookmark size={15}/> Modules / <MarketingIcon size={15}/>Resources</div>
            <div
              className={`${
                buttonOpen
                  ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                  : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
              }`}
            >
              {/* Breadcrumb */}
              <div className="mt-5 font-semibold text-xl text-gray-600">
                Learning Resources
              </div>

              {/* Table + Add Button */}
              
              <div className="mt-5 bg-white rounded px-8 py-10">
                {
                decoded.role == 99 && (
                  <div className="flex justify-start mb-4">
                        <IconButton
                          size="md"
                          color="success"
                          className="bg-green-200"
                          onClick={() => setOpenResource(true)}
                        >
                          <Plus className="h-6 w-6" />
                        </IconButton>
                  </div>  
                )
              }
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Resource</div>
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">No. of Trainees Completed</th>
                      {(decoded.role == 99 || decoded.role == 101) && (
                        <th className="py-2 px-4 text-[#8DC63F]">Mindspark</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.resource_id} className="text-sm text-gray-700">
                        <td className="py-2 px-4 border-b-2">{r.resource_name}</td>
                        {/* <td className="py-2 px-4 border-b-2">
                          {r.trainee_completed}
                        </td> */}
                        <td className="py-2 px-4 border-b-2">
                          {decoded.role == 103 ? (
                            r.is_completed ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle size={16} /> Completed
                              </div>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )
                          ) : (
                            <span>{r.trainee_completed || 0}</span>
                          )}
                        </td>
                        {(decoded.role == 99 || decoded.role == 101) && (
                          <td className="py-2 px-4 border-b-2">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => openQuestionForm(r)}
                            >
                              <Settings className="h-5 w-5" />
                            </IconButton>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateModule isVisible={openResource} onClose={handleClose}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Create New Resource</div>
          <IconButton onClick={handleClose}>
            <X className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              id="outlined-basic"
              label="Resource Name"
              onChange={handleChange}
              name="resource_name"
              value={resourceData.resource_name}
            />
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-[#8DC63F] px-3 py-2 text-white"
            onClick={createResourceAPI}
          >
            Save
          </button>
        </div>
      </CreateModule>
      <CreateModule isVisible={questionModalOpen} onClose={closeQuestionForm}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-semibold">Configure Mindspark Questions</div>
            <div className="text-xs text-gray-500 mt-1">{selectedResource?.resource_name}</div>
          </div>
          <IconButton onClick={closeQuestionForm}>
            <X className="h-6 w-6" />
          </IconButton>
        </div>

        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              size="small"
              label="Resource ID"
              value={selectedResource?.resource_id || ""}
              disabled
            />
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
            {mindSparkQuestions.map((question, questionIndex) => (
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
                      onChange={(event) => updateQuestionField(questionIndex, "question_type", event.target.value)}
                    >
                      <MenuItem value="MCQ">MCQ</MenuItem>
                      <MenuItem value="ORDERING">Ordering</MenuItem>
                      <MenuItem value="IMAGE_ERROR">Image Error</MenuItem>
                      <MenuItem value="MATCHING">Matching</MenuItem>
                      <MenuItem value="MEASUREMENT">Measurement</MenuItem>
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

                <div className="mt-4 grid grid-cols-[80px_1fr] gap-3">
                  {question.options.map((option, optionIndex) => (
                    <React.Fragment key={optionIndex}>
                      <TextField
                        size="small"
                        label="Key"
                        value={option.key}
                        onChange={(event) => updateOptionField(questionIndex, optionIndex, "key", event.target.value)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Option ${optionIndex + 1}`}
                        value={option.text}
                        onChange={(event) => updateOptionField(questionIndex, optionIndex, "text", event.target.value)}
                      />
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4">
                  <TextField
                    fullWidth
                    size="small"
                    label="Correct Answer Key"
                    value={question.correct_answer_key}
                    onChange={(event) => updateQuestionField(questionIndex, "correct_answer_key", event.target.value)}
                  />
                </div>

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
            <button
              className="border border-[#8DC63F] text-[#5d8f20] px-3 py-2 rounded text-sm"
              onClick={addQuestion}
            >
              Add Question
            </button>
            <button
              className="bg-[#8DC63F] px-3 py-2 text-white rounded text-sm disabled:bg-gray-300"
              onClick={saveQuestions}
              disabled={savingQuestions}
            >
              {savingQuestions ? "Saving..." : "Save Questions"}
            </button>
          </div>
        </div>
      </CreateModule>
    </div>
  );
}
export default Resource;
