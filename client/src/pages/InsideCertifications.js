import React, {useEffect, useState, useCallback} from "react";
import NavBar from "../components/navBar";
import {jwtDecode} from "jwt-decode";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/sideBar";
import { ClipLoader } from "react-spinners";
import {
  ChevronDown,
  LayoutDashboard,
  ListTodo,
  Plus,
  X,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import LearningModule from "../components/superadmin/LearningModule";
import CustomCloseButton from "../utils/CustomCloseButton";
import GetCertificateDataByIdAPI from "../API/GetCertificateDataByIdAPI";
import CreateLearningModuleAPI from "../API/CreateLearningModuleAPI";
import GetLearningModuleByIdAPI from "../API/GetLearningModuleByIdAPI";
import getResourceAPI from "../API/GetResourceAPI";
import { toast } from "react-toastify";
import CreateResources from "../components/CreateResources";
import AttachVolume from "../components/AttachVolume";
import getConvertedVolumeListApi from "../API/GetConvertedVolumeList";
import GetShadowRecordingsAPI from "../API/GetShadowRecordingsAPI";
import AssoVolumeAPI from "../API/AssoVolumeAPI";

function InsideCertifications() {
  const navigate = useNavigate();
  const { certificate_id } = useParams();
  let token = localStorage.getItem("user_token");
  const [buttonOpen, setButtonOpen] = useState(true);
  const [createLearningModule, setCreateLearningModule] = useState(false);
  
  // create form
  const [certificateName, setCertificateName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [expandedResource, setExpandedResource] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  
  // Data states
  const [certificateData, setCertificateData] = useState([]);
  const [learningModules, setLearningModules] = useState([]);
  
  // Expand row + resources
  const [expandedRow, setExpandedRow] = useState(null);
  const [resourceMap, setResourceMap] = useState({});
  
  // Create Resources Modal
  const [openRes, setOpenRes] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  
  // Completion Popup States
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [selectedResourceForPopup, setSelectedResourceForPopup] = useState(null);
  
  //set volume list 
  const [volumeList, setVolumeList] = useState([]);
  const [volumeLoading, setVolumeLoading] = useState(false);

  //attach volume
  const [attachVolume, setAttachVolume] = useState(false);
  const [resourcesData, setResourcesData] = useState({
        resource_id: '',
        resource_name: ''
  });
  
  //for api purposes 
  const [attachFormData, setAttachFormData] = useState({
      resource_id: '',
      volume_id: '',
      shadow_recording: '',
      step_recording: ''
  });
  
  // Shadow recordings state
  const [shadowRecordings, setShadowRecordings] = useState([]);
  const [stepRecordings, setStepRecordings] = useState([]);
  const [recordingsLoading, setRecordingsLoading] = useState(false);
  const [attachSubmitting, setAttachSubmitting] = useState(false);
  
  const ufcCourses = [
    "Principles of ultrasound",
    "Probe Movements",
    "Knobology",
    "Morphology",
  ];

  // Fetch shadow recordings
  const fetchShadowRecordings = useCallback(async (volumeId) => {
    if (!volumeId) return;
    
    setRecordingsLoading(true);
    try {
      const res = await GetShadowRecordingsAPI(volumeId);
      if (res.data && Array.isArray(res.data)) {
        const shadowRecs = res.data.filter(rec => rec.recording_type === 'shadow');
        setShadowRecordings(shadowRecs);
        
        const stepRecs = res.data.filter(rec => rec.recording_type === 'step');
        setStepRecordings(stepRecs);
      }
    } catch (err) {
      console.error("Error loading recordings:", err);
      toast.error("Failed to load recordings", {
        closeButton: CustomCloseButton,
      });
      setShadowRecordings([]);
      setStepRecordings([]);
    } finally {
      setRecordingsLoading(false);
    }
  }, []);

  // Fetch volume list
  const fetchVolumeList = useCallback(async () => {
    setVolumeLoading(true);
    try {
      const res = await getConvertedVolumeListApi();
      if (res.data) {
        setVolumeList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Error loading volumes:", err);
      toast.error("Failed to load volumes", {
        closeButton: CustomCloseButton,
      });
    } finally {
      setVolumeLoading(false);
    }
  }, []);
  
  const handleAttachVolume = () => {
    setAttachVolume(!attachVolume);
    if (!attachVolume) {
      fetchVolumeList();
      setAttachFormData({
        resource_id: '',
        volume_id: '',
        shadow_recording: '',
        step_recording: ''
      });
      setShadowRecordings([]);
      setStepRecordings([]);
    }
  };
  
  // Handle volume selection change
  const handleVolumeChange = (volumeId) => {
    setAttachFormData(prev => ({
      ...prev,
      volume_id: volumeId,
      shadow_recording: '',
      step_recording: ''
    }));
    
    if (volumeId) {
      fetchShadowRecordings(volumeId);
    } else {
      setShadowRecordings([]);
      setStepRecordings([]);
    }
  };
  
  // Handle attach volume form submission
  const handleSubmitAttachVolume = async (e) => {
    e.preventDefault();
    
    setAttachSubmitting(true);
    try {
      const decoded = jwtDecode(token);
      const payload = {
        requester: decoded?.email || decoded?.username || '',
        r_id: attachFormData.resource_id,
        volume_id: attachFormData.volume_id,
        shadowrec_id: attachFormData.shadow_recording,
        steprec_id: attachFormData.step_recording
      };
      
      const res = await AssoVolumeAPI(payload);
      
      if (res.data?.code === 200 || res.status === 200) {
        toast.success("Volume attached successfully!", {
          closeButton: CustomCloseButton,
        });
        setAttachVolume(false);
        setAttachFormData({
          resource_id: '',
          volume_id: '',
          shadow_recording: '',
          step_recording: ''
        });
        setResourcesData({
          resource_id: '',
          resource_name: ''
        });
        setShadowRecordings([]);
        setStepRecordings([]);
      } else {
        throw new Error(res.data?.message || "Failed to attach volume");
      }
    } catch (err) {
      console.error("Error attaching volume:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to attach volume", {
        closeButton: CustomCloseButton,
      });
    } finally {
      setAttachSubmitting(false);
    }
  };
  
  const fetchCertificates = useCallback(async () => {
    try {
      const res = await GetCertificateDataByIdAPI(token, certificate_id);
      setCertificateData(res.data || []);
    } catch (err) {
      console.error("Error loading certificate details:", err);
    }
  }, [token, certificate_id]);
  
  const fetchLearningModules = useCallback(async () => {
    try {
      const res = await GetLearningModuleByIdAPI(token, certificate_id);
      setLearningModules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading modules:", err);
    }
  }, [token, certificate_id]);

  const fetchResourcesForModule = useCallback(
    async (moduleId) => {
      if (!moduleId) return;
      setResourceMap((p) => ({
        ...p,
        [moduleId]: { loading: true, error: null, data: [] },
      }));
      try {
        const res = await getResourceAPI(token, moduleId);
        setResourceMap((p) => ({
          ...p,
          [moduleId]: {
            loading: false,
            error: null,
            data: res.data || [],
          },
        }));
      } catch (err) {
        setResourceMap((p) => ({
          ...p,
          [moduleId]: { loading: false, error: true, data: [] },
        }));
        toast.error("Failed to load resources", {
          closeButton: CustomCloseButton,
        });
      }
    },
    [token]
  );
  
  useEffect(() => {
    fetchCertificates();
    fetchLearningModules();
  }, [fetchCertificates, fetchLearningModules]);
  
  const courseList = [...new Set(learningModules.map((m) => m.course_name))];
  const moduleList = learningModules
    .filter((m) => m.course_name === courseName)
    .map((m) => m.module_name)
    .filter((v, i, arr) => arr.indexOf(v) === i);
  const unitList = learningModules
    .filter((m) => m.course_name === courseName && m.module_name === moduleName)
    .map((m) => m.unit_name)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  useEffect(() => {
    if (courseName) {
      const firstModule =
        learningModules.find(m => m.course_name === courseName)?.module_name || "";
      setModuleName(prev => prev || firstModule);
      setUnitName("");
    } else {
      setModuleName("");
      setUnitName("");
    }
    setExpandedRow(null);
  }, [courseName, learningModules]);
  
  useEffect(() => {
    setExpandedRow(null);
  }, [moduleName]);
  
  const filteredRows = learningModules.filter(row => {
    return (
      (!courseName || row.course_name === courseName) &&
      (!moduleName || row.module_name === moduleName) &&
      (!unitName || row.unit_name === unitName)
    );
  });

  const handleCreateLearning = async () => {
    const payload = {
      certificate_id,
      course_name: courseName,
      module_name: moduleName,
      unit_name: unitName,
    };
    try {
      const res = await CreateLearningModuleAPI(token, payload);

      if (res.data?.code === 200) {
        toast.success("Learning Module Created");
        handleCloseCreateModule();
        fetchLearningModules();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to create module");
    }
  };
  
  const handleCloseCreateModule = () => {
    setCreateLearningModule(false);
    setCertificateName("");
    setCourseName("");
    setModuleName("");
    setUnitName("");
  };
  
  const toggleExpand = async (index, moduleId) => {
    const newIndex = expandedRow === index ? null : index;
    setExpandedRow(newIndex);

    if (newIndex !== null) {
      fetchResourcesForModule(moduleId);
    }
  };

  // Handle resource click for popup
  const handleResourceClick = (item) => {
    if (item.completed_by_names && item.trainee_completed > 0) {
      setSelectedResourceForPopup(item);
      setShowCompletionPopup(true);
    }
  };

  // Close completion popup
  const closeCompletionPopup = () => {
    setShowCompletionPopup(false);
    setSelectedResourceForPopup(null);
  };

  let decoded = null;
  try {
    if (token) decoded = jwtDecode(token);
  } catch (_) {}

  if (decoded.role != 101 && decoded.role != 102 && decoded.role != 99) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      {/* MAIN */}
      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={() => setButtonOpen(!buttonOpen)} buttonOpen={buttonOpen} />

        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
              <LayoutDashboard size={15} /> Dashboard /
              <ListTodo size={15} />
              <span className="text-[15px] hover:underline cursor-pointer">
                <button onClick={() => navigate("/request-raised")}>Learning Modules</button>
              </span>
            </div>

            {/* FILTERS ABOVE TABLE */}
            <div className="mt-5 px-5">
              <div className="p-5 grid grid-cols-5 gap-5 bg-white shadow rounded">
                <FormControl fullWidth size="small">
                  <InputLabel>Select Course</InputLabel>
                  <Select
                    label="Select Course"
                    value={courseName}
                    onChange={(e) => {
                      setCourseName(e.target.value);
                      setModuleName("");
                      setUnitName("");
                    }}
                  >
                    {courseList.map((course, i) => (
                      <MenuItem key={i} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Select Module</InputLabel>
                  <Select
                    label="Select Module"
                    value={moduleName}
                    onChange={(e) => {
                      setModuleName(e.target.value);
                      setUnitName("");
                    }}
                  >
                    {moduleList.map((m, i) => (
                      <MenuItem key={i} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Select Unit</InputLabel>
                  <Select label="Select Unit" value={unitName} onChange={(e) => setUnitName(e.target.value)}>
                    {unitList.map((u, i) => (
                      <MenuItem key={i} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* TABLE */}
              <div className="bg-white p-5 rounded shadow-lg mt-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">Learning Modules</h1>
                  <button className="text-gray-600" onClick={() => setCreateLearningModule(true)}>
                    <Plus size={20} />
                  </button>
                </div>

                <div className="mt-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 shadow-sm">
                        <th className="py-2 px-4 text-[#8DC63F]">Name</th>
                        <th className="py-2 px-4 text-[#8DC63F]">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">
                            No Data to Show
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((row, index) => {
                          const moduleId = row.learning_module_id;
                          const entry = resourceMap[moduleId] || { loading: false, error: null, data: [] };

                          return (
                            <React.Fragment key={moduleId}>
                              <tr className="text-sm text-gray-700">
                                <td className="py-2 px-4 text-gray-600">{row.unit_name || row.course_name}</td>
                                <td className="py-2 px-4">
                                  <button onClick={() => toggleExpand(index, moduleId)} className="text-[#8DC63F]">
                                    <ChevronDown size={22} className={`transition-transform ${expandedRow === index ? "rotate-180" : ""}`} />
                                  </button>
                                </td>
                              </tr>
                              {expandedRow === index && (
                                <tr className="bg-gray-50">
                                  <td colSpan={4} className="p-4 border-b">
                                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                                      <div className="flex justify-between mb-3">
                                        <span className="font-semibold text-gray-600">Resources</span>
                                        <button
                                          onClick={() => {
                                            setSelectedModule({
                                              learning_module_id: moduleId,
                                              course_name: row.course_name,
                                              module_name: row.module_name,
                                              unit_name: row.unit_name,
                                            });
                                            setOpenRes(true);
                                          }}
                                          className="text-[#8DC63F] hover:text-[#7ab52f]"
                                        >
                                          <Plus />
                                        </button>
                                      </div>
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b bg-gray-50">
                                            <th className="py-3 px-4 text-left text-[#8DC63F]">Resource Type</th>
                                            <th className="py-3 px-4 text-left text-[#8DC63F]">Trainees Attempted</th>
                                            <th className="py-3 px-4 text-left text-[#8DC63F]">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {entry.loading ? (
                                            <tr>
                                              <td colSpan={3} className="py-4 text-center">
                                                <ClipLoader size={30} />
                                              </td>
                                            </tr>
                                          ) : entry.error ? (
                                            <tr>
                                              <td colSpan={3} className="py-4 text-center text-red-500">
                                                Failed to Load
                                              </td>
                                            </tr>
                                          ) : entry.data.length === 0 ? (
                                            <tr>
                                              <td colSpan={3} className="py-4 text-center text-gray-500">
                                                No Resources Found
                                              </td>
                                            </tr>
                                          ) : (
                                            (() => {
                                              const groupedByType = entry.data.reduce((acc, res) => {
                                                if (!acc[res.resource_type]) {
                                                  acc[res.resource_type] = [];
                                                }
                                                acc[res.resource_type].push(res);
                                                return acc;
                                              }, {});

                                              return Object.entries(groupedByType).map(([type, items]) => {
                                                const totalCompleted = items.reduce((sum, item) => 
                                                  sum + parseInt(item.trainee_completed || 0), 0
                                                );

                                                return (
                                                  <React.Fragment key={type}>
                                                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                                                      <td className="py-3 px-4 font-medium text-gray-800">{type}</td>
                                                      <td className="py-3 px-4 text-gray-700 font-semibold">{totalCompleted}</td>
                                                      <td className="py-3 px-4">
                                                        <button
                                                          onClick={() => {
                                                            const key = `${moduleId}-${type}`;
                                                            setExpandedResource(expandedResource === key ? null : key);
                                                          }}
                                                          className="text-[#8DC63F] hover:text-[#7ab52f]"
                                                        >
                                                          <ChevronDown 
                                                            size={22} 
                                                            className={`transition-transform ${
                                                              expandedResource === `${moduleId}-${type}` ? "rotate-180" : ""
                                                            }`} 
                                                          />
                                                        </button>
                                                      </td>
                                                    </tr>
                                                    {expandedResource === `${moduleId}-${type}` && (
                                                      <tr>
                                                        <td colSpan={3} className="p-0">
                                                          <div className="bg-gray-50 p-4">
                                                            {(() => {
                                                              const hasTopics = items.some(item => item.resource_topic && item.resource_topic.trim() !== "");
                                                              
                                                              if (!hasTopics) {
                                                                return (
                                                                  <table className="w-full bg-white rounded shadow-sm">
                                                                    <thead>
                                                                      <tr className="border-b bg-gray-100">
                                                                        <th className="py-2 px-4 text-left text-gray-600">Resource Name</th>
                                                                        <th className="py-2 px-4 text-left text-gray-600">Trainees Completed</th>
                                                                        {decoded.role == 99 && (
                                                                         <th className="py-2 px-4 text-left text-gray-600">Actions</th>
                                                                        )}
                                                                      </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                      {items.map((item) => (
                                                                        <tr 
                                                                          key={item.resource_id} 
                                                                          className={`border-b last:border-0 hover:bg-gray-50 ${
                                                                            item.completed_by_names ? 'cursor-pointer' : ''
                                                                          }`}
                                                                          onClick={() => handleResourceClick(item)}
                                                                        >
                                                                          <td className="py-2 px-4 text-gray-800">
                                                                            {item.resource_name}
                                                                          </td>
                                                                          <td className="py-2 px-4">
                                                                            <span className={`${
                                                                              item.trainee_completed > 0 ? 'font-semibold text-[#8DC63F]' : 'text-gray-700'
                                                                            }`}>
                                                                              {item.trainee_completed}
                                                                            </span>
                                                                          </td>
                                                                          <td>
                                                                            {decoded.role == 99 && (
                                                                              <button 
                                                                                className="bg-[#8DC63F] rounded-xl text-white px-1 py-1 text-xs hover:bg-[#7ab52f]" 
                                                                                onClick={(e) => {
                                                                                  e.stopPropagation();
                                                                                  handleAttachVolume();
                                                                                  setResourcesData({
                                                                                    resource_id: item.resource_id,
                                                                                    resource_name: item.resource_name
                                                                                  });
                                                                                  setAttachFormData(prev => ({
                                                                                    ...prev,
                                                                                    resource_id: item.resource_id
                                                                                  }));
                                                                                }}
                                                                              >
                                                                                Attach Volume
                                                                              </button>
                                                                            )}
                                                                          </td>
                                                                        </tr>
                                                                      ))}
                                                                    </tbody>
                                                                  </table>
                                                                );
                                                              }
                                                              
                                                              return (
                                                                <table className="w-full bg-white rounded shadow-sm">
                                                                  <thead>
                                                                    <tr className="border-b bg-gray-100">
                                                                      <th className="py-2 px-4 text-left text-gray-600">Resource Topic</th>
                                                                      <th className="py-2 px-4 text-left text-gray-600">Trainees Completed</th>
                                                                      <th className="py-2 px-4 text-left text-gray-600">Actions</th>
                                                                    </tr>
                                                                  </thead>
                                                                  <tbody>
                                                                    {(() => {
                                                                      const groupedByTopic = items.reduce((acc, item) => {
                                                                        const topic = item.resource_topic && item.resource_topic.trim() !== "" 
                                                                          ? item.resource_topic 
                                                                          : "Uncategorized";
                                                                        if (!acc[topic]) {
                                                                          acc[topic] = [];
                                                                        }
                                                                        acc[topic].push(item);
                                                                        return acc;
                                                                      }, {});

                                                                      return Object.entries(groupedByTopic).map(([topic, topicItems]) => {
                                                                        const topicCompleted = topicItems.reduce((sum, item) => 
                                                                          sum + parseInt(item.trainee_completed || 0), 0
                                                                        );
                                                                        const topicKey = `${moduleId}-${type}-${topic}`;

                                                                        return (
                                                                          <React.Fragment key={topic}>
                                                                            <tr className="border-b hover:bg-gray-50 cursor-pointer">
                                                                              <td className="py-2 px-4 text-gray-800 font-medium">
                                                                                {topic}
                                                                              </td>
                                                                              <td className="py-2 px-4 text-gray-700">
                                                                                {topicCompleted}
                                                                              </td>
                                                                              <td className="py-2 px-4">
                                                                                <button
                                                                                  onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setExpandedTopic(
                                                                                      expandedTopic === topicKey ? null : topicKey
                                                                                    );
                                                                                  }}
                                                                                  className="text-[#8DC63F] hover:text-[#7ab52f]"
                                                                                >
                                                                                  <ChevronDown 
                                                                                    size={20} 
                                                                                    className={`transition-transform ${
                                                                                      expandedTopic === topicKey ? "rotate-180" : ""
                                                                                    }`} 
                                                                                  />
                                                                                </button>
                                                                              </td>
                                                                            </tr>
                                                                            {expandedTopic === topicKey && (
                                                                              <tr>
                                                                                <td colSpan={3} className="p-0">
                                                                                  <div className="bg-blue-50 p-3">
                                                                                    <table className="w-full bg-white rounded">
                                                                                      <thead>
                                                                                        <tr className="border-b bg-gray-50">
                                                                                          <th className="py-2 px-4 text-left text-gray-600 text-sm">Resource Name</th>
                                                                                          <th className="py-2 px-4 text-left text-gray-600 text-sm">Trainees Completed</th>
                                                                                        </tr>
                                                                                      </thead>
                                                                                      <tbody>
                                                                                        {topicItems.map((item) => (
                                                                                          <tr 
                                                                                            key={item.resource_id} 
                                                                                            className={`border-b last:border-0 hover:bg-gray-50 ${
                                                                                              item.completed_by_names ? 'cursor-pointer' : ''
                                                                                            }`}
                                                                                            onClick={() => handleResourceClick(item)}
                                                                                          >
                                                                                            <td className="py-2 px-4 text-gray-800 text-sm">
                                                                                              {item.resource_name}
                                                                                            </td>
                                                                                            <td className="py-2 px-4 text-sm">
                                                                                              <span className={`${
                                                                                                item.trainee_completed > 0 ? 'font-semibold text-[#8DC63F]' : 'text-gray-700'
                                                                                              }`}>
                                                                                                {item.trainee_completed}
                                                                                              </span>
                                                                                            </td>
                                                                                          </tr>
                                                                                        ))}
                                                                                      </tbody>
                                                                                    </table>
                                                                                  </div>
                                                                                </td>
                                                                              </tr>
                                                                            )}
                                                                          </React.Fragment>
                                                                        );
                                                                      });
                                                                    })()}
                                                                  </tbody>
                                                                </table>
                                                              );
                                                            })()}
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    )}
                                                  </React.Fragment>
                                                );
                                              });
                                            })()
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE LEARNING MODULE MODAL */}
      <LearningModule isVisible={createLearningModule} onClose={handleCloseCreateModule}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Create Learning Module</div>
          <button onClick={handleCloseCreateModule} className="text-red-500">
            <X size={20} />
          </button>
        </div>

        <FormControl fullWidth size="small" className="mb-4">
          <InputLabel>Select Certification</InputLabel>
          <Select
            label="Select Certification"
            value={certificateName}
            onChange={(e) => {
              setCertificateName(e.target.value);
              setCourseName("");
              setModuleName("");
              setUnitName("");
            }}
          >
            {certificateData.map((d, i) => (
              <MenuItem key={i} value={d.certificate_name}>
                {d.certificate_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {certificateName === "BTC" && (
          <>
            <FormControl fullWidth size="small" className="mb-4 mt-2">
              <InputLabel>Select Course</InputLabel>
              <Select
                label="Select Course"
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                  setModuleName("");
                  setUnitName("");
                }}
              >
                {["First Trimester", "Second Trimester", "Third Trimester"].map((c, i) => (
                  <MenuItem key={i} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" className="mb-4">
              <InputLabel>Select Module</InputLabel>
              <Select
                label="Select Module"
                value={moduleName}
                onChange={(e) => {
                  setModuleName(e.target.value);
                  setUnitName("");
                }}
              >
                {moduleList.map((m, i) => (
                  <MenuItem key={i} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" className="mb-4">
              <InputLabel>Select Unit</InputLabel>
              <Select label="Select Unit" value={unitName} onChange={(e) => setUnitName(e.target.value)}>
                {unitList.map((u, i) => (
                  <MenuItem key={i} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {certificateName === "UFC" && (
          <FormControl fullWidth size="small" className="mb-4">
            <InputLabel>Select Course</InputLabel>
            <Select label="Select Course" value={courseName} onChange={(e) => setCourseName(e.target.value)}>
              {ufcCourses.map((c, i) => (
                <MenuItem key={i} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <div className="flex justify-end mt-6">
          <button
            disabled={!certificateName || !courseName || (certificateName === "BTC" && (!moduleName || !unitName))}
            onClick={handleCreateLearning}
            className="px-4 py-2 bg-[#8DC63F] text-white rounded disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </LearningModule>

      {/* CREATE RESOURCES MODAL */}
      <CreateResources
        isVisible={openRes}
        onClose={() => {
          setOpenRes(false);
          setSelectedModule(null);
        }}
        learningModuleId={selectedModule}
        onCreated={() => {
          if (selectedModule?.learning_module_id) {
            fetchResourcesForModule(selectedModule.learning_module_id);
          }
        }}
      />
      
      {/* ATTACH VOLUME MODAL */}
      <AttachVolume isVisible={attachVolume} onClose={() => setAttachVolume(false)}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Attach Volume</div>
          <button onClick={() => setAttachVolume(false)}>
            <X className="text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmitAttachVolume}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              fullWidth
              size="small"
              label="Resource Name"
              value={resourcesData.resource_name}
              InputProps={{
                readOnly: true,
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="volume-name-label">Volume Name</InputLabel>
              <Select
                labelId="volume-name-label"
                id="volume-name"
                value={attachFormData.volume_id}
                label="Volume Name"
                onChange={(e) => handleVolumeChange(e.target.value)}
                disabled={volumeLoading}
              >
                {volumeLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : volumeList.length === 0 ? (
                  <MenuItem disabled>No volumes available</MenuItem>
                ) : (
                  volumeList.map((volume) => (
                    <MenuItem key={volume.volume_id} value={volume.volume_id}>
                      {volume.volume_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="shadow-recording-label">Shadow Recording</InputLabel>
              <Select
                labelId="shadow-recording-label"
                id="shadow-recording"
                value={attachFormData.shadow_recording}
                label="Shadow Recording"
                onChange={(e) => setAttachFormData(prev => ({
                  ...prev,
                  shadow_recording: e.target.value
                }))}
                disabled={!attachFormData.volume_id || recordingsLoading}
              >
                {recordingsLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : !attachFormData.volume_id ? (
                  <MenuItem disabled>Select a volume first</MenuItem>
                ) : shadowRecordings.length === 0 ? (
                  <MenuItem disabled>No shadow recordings available</MenuItem>
                ) : (
                  shadowRecordings.map((recording) => (
                    <MenuItem key={recording.recording_id} value={recording.recording_id}>
                      {recording.recording_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="step-recording-label">Step Recording</InputLabel>
              <Select
                labelId="step-recording-label"
                id="step-recording"
                value={attachFormData.step_recording}
                label="Step Recording"
                onChange={(e) => setAttachFormData(prev => ({
                  ...prev,
                  step_recording: e.target.value
                }))}
                disabled={!attachFormData.volume_id || recordingsLoading}
              >
                {recordingsLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : !attachFormData.volume_id ? (
                  <MenuItem disabled>Select a volume first</MenuItem>
                ) : stepRecordings.length === 0 ? (
                  <MenuItem disabled>No step recordings available</MenuItem>
                ) : (
                  stepRecordings.map((recording) => (
                    <MenuItem key={recording.recording_id} value={recording.recording_id}>
                      {recording.recording_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="text-red-500"
              onClick={() => setAttachVolume(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#8DC63F] text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!attachFormData.resource_id || !attachFormData.volume_id || !attachFormData.shadow_recording || attachSubmitting}
            >
              {attachSubmitting ? "Attaching..." : "Attach"}
            </button>
          </div>
        </form>
      </AttachVolume>

      {/* COMPLETION POPUP */}
        {showCompletionPopup && selectedResourceForPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeCompletionPopup}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 pb-4 border-b">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedResourceForPopup.resource_name}
                </h3>
                <div className="flex gap-3 items-center">
                  <span className="text-sm px-3 py-1 bg-[#8DC63F] bg-opacity-20 text-[#8DC63F] rounded-full font-medium">
                    {selectedResourceForPopup.resource_type}
                  </span>
                  {selectedResourceForPopup.resource_topic && (
                    <span className="text-sm text-gray-600">
                      Topic: <span className="font-medium text-gray-800">{selectedResourceForPopup.resource_topic}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeCompletionPopup}
                className="text-red-500 hover:text-red-500 transition-colors ml-4"
              >
                <X size={24} />
              </button>
            </div>
            {/* Table */}
            <div className="mb-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Trainee Name</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="max-h-80 overflow-y-auto">
                    {(() => {
                      const names = selectedResourceForPopup.completed_by_names.split(', ');
                      const peopleIds = selectedResourceForPopup.completed_by_ids 
                        ? selectedResourceForPopup.completed_by_ids.split(', ') 
                        : [];
                      
                      return names.map((name, index) => {
                        const peopleId = peopleIds[index] || 'N/A';
                        
                        return (
                          <tr 
                            key={index}
                            className="border-b last:border-b-0 hover:bg-green-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#8DC63F] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-800 font-medium">{name}</span>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Completed
                              </span>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <button
                                onClick={() => {
                                  // Redirect to user details page with people_id
                                  navigate(`/trainee/${peopleId}`);
                                  closeCompletionPopup();
                                }}
                                className="px-3 py-1.5 bg-[#8DC63F] text-white text-xs rounded-lg hover:bg-[#7ab52f] transition-colors font-medium"
                                disabled={peopleId === 'N/A'}
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
          </div>
        </div>
      )}
    </div>
  );
}
export default InsideCertifications;