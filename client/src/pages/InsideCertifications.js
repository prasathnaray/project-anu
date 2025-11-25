import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/navBar";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/sideBar";
import {
  ArrowUpWideNarrow,
  ChevronDown,
  LayoutDashboard,
  ListTodo,
  Plus,
  X,
} from "lucide-react";
import LearningModule from "../components/superadmin/LearningModule";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import GetCertificateDataByIdAPI from "../API/GetCertificateDataByIdAPI";
import CreateLearningModuleAPI from "../API/CreateLearningModuleAPI";
import GetLearningModuleByIdAPI from "../API/GetLearningModuleByIdAPI";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import CreateResources from "../components/CreateResources";

function InsideCertifications() {
  const navigate = useNavigate();
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);

  const { certificate_id } = useParams();

  const [buttonOpen, setButtonOpen] = useState(true);
  const [createLearningModule, setCreateLearningModule] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState({});
  const [certificateName, setCertificateName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [unitName, setUnitName] = useState("");

  const [certificateData, setCertificateData] = useState([]);
  const [learningModules, setLearningModules] = useState([]);

  // EXPAND ROW STATE
  const [openRes, setOpenRes] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const toggleExpand = (index) =>
    setExpandedRow(expandedRow === index ? null : index);

  // COURSE LISTS
  const btcCourses = ["First Trimester", "Second Trimester", "Third Trimester"];
  const ufcCourses = [
    "Principles of ultrasound",
    "Probe Movements",
    "Knobology",
    "Morphology",
  ];

  const secondTrimesterModules = [
    "6-Step Approach",
    "Biometry",
    "20 + 2 Planes",
  ];

  const unitMap = {
    "6-Step Approach": [
      "Presentation, Number of Fetus, Cardiac Activity",
      "Placenta & Liquor",
    ],
    Biometry: ["BPD & HC", "AC", "FL"],
    "20 + 2 Planes": [
      "Sweep 1",
      "Head (Planes 4–6)",
      "Face (Planes 18–20)",
      "Spine (Planes 1–3)",
      "Thorax (Planes 7–10)",
      "Abdomen (Planes 11–13)",
      "Pelvis (Plane 14)",
      "Limbs (Planes 15–17)",
      "Sweep 2",
    ],
  };

  const isCreateDisabled =
    certificateName === "BTC"
      ? !certificateName || !courseName || !moduleName
      : certificateName === "UFC"
      ? !certificateName || !courseName
      : true;

  const handleClose = () => {
    setCreateLearningModule(false);
    setCertificateName("");
    setCourseName("");
    setModuleName("");
    setUnitName("");
    setOpenRes(false);
  };

  const fetchCertificates = async () => {
    try {
      const response = await GetCertificateDataByIdAPI(token, certificate_id);
      setCertificateData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLearningModules = async () => {
    try {
      const response = await GetLearningModuleByIdAPI(token, certificate_id);
      setLearningModules(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateLearning = async () => {
    if (!certificateName || !courseName) {
      alert("Please select required fields.");
      return;
    }

    const moduleData = {
      certificate_id,
      course_name: courseName,
      module_name: moduleName,
      unit_name: unitName,
    };

    try {
      const response = await CreateLearningModuleAPI(token, moduleData);
      if (response.data.code === 200) {
        toast.success("Learning Module Created", {
          autoClose: 3000,
          toastId: "module-inserted",
          icon: false,
          closeButton: CustomCloseButton,
        });
        handleClose();
        fetchLearningModules();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", {
        autoClose: 3000,
        toastId: "mod-err",
        icon: false,
        closeButton: CustomCloseButton,
      });
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchLearningModules();
  }, []);

  if (decoded.role != 101 && decoded.role != 102) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      {/* MAIN BODY */}
      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={() => setButtonOpen(!buttonOpen)} buttonOpen={buttonOpen} />

        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen">
            
            {/*Breadcrumb*/}
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
              <LayoutDashboard size={15} /> Dashboard /
              <ListTodo size={15} />
              <span className="text-[15px] hover:underline cursor-pointer">
                <button onClick={() => navigate("/request-raised")}>
                  Learning Modules
                </button>
              </span>
            </div>

            {/* HEADER */}
            <div className="mt-5">
              <div className="bg-white p-5 rounded shadow-lg mx-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Learning Modules
                  </h1>
                  <button
                    className="text-gray-600"
                    onClick={() => setCreateLearningModule(true)}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/*TABLE*/}
                <div className="mt-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 shadow-sm">
                        {["Course Name", "Module Name", "Unit Name", "Action"].map(
                          (name, i) => (
                            <th key={i} className="py-2 px-4 text-[#8DC63F]">
                              <div className="flex items-center gap-2">
                                <span>{name}</span>
                                <ArrowUpWideNarrow size={20} />
                              </div>
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {learningModules.length > 0 ? (
                        learningModules.map((data, index) => (
                          <React.Fragment key={index}>
                            {/* MAIN ROW */}
                            <tr className="text-sm text-gray-700">
                              <td className="py-2 px-4 font-semibold text-[#8DC63F]">
                                {data.course_name}
                              </td>

                              <td className="py-2 px-4 font-semibold text-[#8DC63F]">
                                {data.module_name || "—"}
                              </td>

                              <td className="py-2 px-4 text-gray-600">
                                {data.unit_name || "—"}
                              </td>

                              <td className="py-2 px-4 relative">
                                <button
                                  onClick={() => toggleExpand(index)}
                                  className="text-[#8DC63F]"
                                >
                                  <ChevronDown
                                    size={24}
                                    className={`transition-transform ${
                                      expandedRow === index ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              </td>
                            </tr>
                            {expandedRow === index && (
                              <tr className="bg-gray-50">
                                <td colSpan={4} className="p-4 border-b">
                                  <div className="ml-4 border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="font-semibold mb-2 text-gray-600 flex justify-between items-center">
                                          <div>Resources</div>
                                          <button onClick={() => {setSelectedModuleId({learning_module_id: data.learning_module_id, module_name: data.module_name, unit_name: data.unit_name}); setOpenRes(true)}}><Plus /></button>
                                    </div>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b">
                                          <th className="py-2 px-2 text-left">
                                            Type
                                          </th>
                                          <th className="py-2 px-2 text-left">
                                             Number of Trainees Completed
                                          </th>
                                          <th className="py-2 px-2 text-left">
                                             Total Count of Resources
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="py-2 px-2">Learning Resources</td>
                                          <td className="py-2 px-2">100 / 143</td>
                                          <td className="py-2 px-2 text-blue-600 cursor-pointer">
                                            78
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 px-2">Practice</td>
                                          <td className="py-2 px-2">37 / 143</td>
                                          <td className="py-2 px-2 text-blue-600 cursor-pointer">
                                            4
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">
                            No Data to Show
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LearningModule isVisible={createLearningModule} onClose={handleClose}>
        <div className="flex justify-between items-center mb-4">
          <div>Create Learning Modules</div>
          <button onClick={handleClose} className="text-red-500">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4">
          <FormControl fullWidth size="small">
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
              {certificateData.map((data, i) => (
                <MenuItem key={i} value={data.certificate_name}>
                  {data.certificate_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {certificateName === "BTC" && (
            <>
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
                  {btcCourses.map((c, i) => (
                    <MenuItem key={i} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {courseName === "Second Trimester" && (
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
                    {secondTrimesterModules.map((m, i) => (
                      <MenuItem key={i} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {moduleName && (
                <FormControl fullWidth size="small">
                  <InputLabel>Select Unit</InputLabel>
                  <Select
                    label="Select Unit"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                  >
                    {unitMap[moduleName]?.map((u, i) => (
                      <MenuItem key={i} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
          {certificateName === "UFC" && (
            <FormControl fullWidth size="small">
              <InputLabel>Select Course</InputLabel>
              <Select
                label="Select Course"
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                }}
              >
                {ufcCourses.map((c, i) => (
                  <MenuItem key={i} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            disabled={isCreateDisabled}
            onClick={handleCreateLearning}
            className={`px-3 py-2 text-white rounded 
              ${
                isCreateDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#8DC63F] cursor-pointer"
              }`}
          >
            Create
          </button>
        </div>
      </LearningModule>
      <CreateResources isVisible={openRes} onClose={handleClose} learningModuleId={selectedModuleId}/>
    </div>
  );
}

export default InsideCertifications;