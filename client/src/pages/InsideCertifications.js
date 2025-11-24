// -----------------------------------------------------------
// InsideCertifications.js (Final Version with Units Included)
// -----------------------------------------------------------

import React from "react";
import NavBar from "../components/navBar";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SideBar from "../components/sideBar";
import {
  ArrowUpWideNarrow,
  EllipsisVertical,
  LayoutDashboard,
  ListTodo,
  Plus,
  X,
} from "lucide-react";
import LearningModule from "../components/superadmin/LearningModule";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import GetCertificateDataByIdAPI from "../API/GetCertificateDataByIdAPI";
import CreateLearningModuleAPI from "../API/CreateLearningModuleAPI";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import GetLearningModuleByIdAPI from "../API/GetLearningModuleByIdAPI";
import { ClipLoader } from "react-spinners";
import { set } from "date-fns";
function InsideCertifications() {
  const navigate = useNavigate();
  let token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);

  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [createLearningModule, setCreateLearningModule] = React.useState(false);

  const handleClose = () => {
    setCreateLearningModule(false);
    setCertificateName("");
    setCourseName("");
    setModuleName("");
    setUnitName("");
  }
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const { certificate_id } = useParams();

  const [certificateName, setCertificateName] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [moduleName, setModuleName] = React.useState("");
  const [unitName, setUnitName] = React.useState("");
  const [learningModules, setLearningModules] = React.useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
  const dropdownRefs = React.useRef([]);
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const getLearningModules = async () => {
    try {
      let token = localStorage.getItem("user_token");
      const response = await GetLearningModuleByIdAPI(token, certificate_id);

      if (response.data && Array.isArray(response.data)) {
        setLearningModules(response.data);
      } else {
        setLearningModules([]);
      }
    } catch (err) {
      console.log("Error fetching learning modules:", err);
      setLearningModules([]);
    }
  };
  const [certificateData, setCertificateData] = React.useState([]);
  const isCreateDisabled = !certificateName || !courseName || !moduleName;

  const getCertData = async () => {
    try {
      let token = localStorage.getItem("user_token");
      const response = await GetCertificateDataByIdAPI(token, certificate_id);
      setCertificateData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getCertData();
    getLearningModules();
  }, []);

  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }

  const btcCourses = ["First Trimester", "Second Trimester", "Third Trimester"];

  // -----------------------------
  // MODULES UNDER SECOND TRIMESTER
  // -----------------------------
  const secondTrimesterModules = [
    "6-Step Approach",
    "Biometry",
    "20 + 2 Planes",
  ];

  // -----------------------------
  // UNITS UNDER MODULES
  // -----------------------------
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
  const handleCreateLearning = async () => {
    // ---------- FRONT-END VALIDATION ----------
    if (!certificateName) {
      alert("Please select a certification");
      return;
    }
    if (!courseName) {
      alert("Please select a course");
      return;
    }
    if (!moduleName) {
      alert("Please select a module");
      return;
    }
    // unitName is optional so we don’t validate it
    // -------------------------------------------

    const moduleData = {
      certificate_id,
      course_name: courseName,
      module_name: moduleName,
      unit_name: unitName,
    };

    try {
      let token = localStorage.getItem("user_token");
      const response = await CreateLearningModuleAPI(token, moduleData);

      if (response.data.code === 200) {
        toast.success("Learning Module Created", {
          autoClose: 3000,
          toastId: "module-inserted",
          icon: false,
          closeButton: CustomCloseButton,
        });
        handleClose();
        // Reset all fields
        setCertificateName("");
        setCourseName("");
        setModuleName("");
        setUnitName("");
        getLearningModules();
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAV BAR */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />

        <div
          className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}
        >
          <div className="bg-gray-100 h-screen">
            {/* Breadcrumb */}
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
              <LayoutDashboard size={15} /> Dashboard /
              <ListTodo size={15} />
              <span className="text-[15px] hover:underline hover:underline-offset-4">
                <button onClick={() => navigate("/request-raised")}>
                  Learning Modules
                </button>
              </span>
            </div>

            {/* Header + Create */}
            <div className="mt-5">
              <div className="bg-white p-5 rounded shadow-lg mx-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold mb-4 text-gray-500">
                    Learning Modules
                  </h1>
                  <button
                    className="text-gray-600"
                    onClick={() => setCreateLearningModule(true)}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="mt-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 shadow-sm">
                        <th className="py-2 px-4 text-[#8DC63F]">
                          <div className="flex items-center gap-2">
                            <span>Course Name</span>
                            <button>
                              <ArrowUpWideNarrow size={20} />
                            </button>
                          </div>
                        </th>

                        <th className="py-2 px-4 text-[#8DC63F]">
                          <div className="flex items-center gap-2">
                            <span>Module Name</span>
                            <button>
                              <ArrowUpWideNarrow size={20} />
                            </button>
                          </div>
                        </th>

                        <th className="py-2 px-4 text-[#8DC63F]">
                          <div className="flex items-center gap-2">
                            <span>Unit Name</span>
                            <button>
                              <ArrowUpWideNarrow size={20} />
                            </button>
                          </div>
                        </th>

                        <th className="py-2 px-4 text-[#8DC63F]">
                          <div className="flex items-center gap-2">
                            <span>Action</span>
                            <button>
                              <ArrowUpWideNarrow size={20} />
                            </button>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(learningModules) &&
                      learningModules.length > 0 ? (
                        learningModules.map((data, index) => (
                          <tr className="text-sm text-gray-700" key={index}>
                            <td className="py-2 px-4 font-semibold border-b-2 text-[#8DC63F]">
                              {data.course_name}
                            </td>

                            <td className="py-2 px-4 font-semibold border-b-2 text-[#8DC63F]">
                              {data.module_name}
                            </td>

                            <td className="py-2 px-4 font-medium border-b-2 text-gray-600">
                              {data.unit_name || "—"}
                            </td>

                            <td className="py-2 px-4 font-semibold border-b-2 relative">
                              <button onClick={() => toggleDropdown(index)}>
                                <EllipsisVertical size={24} />
                              </button>

                              {openDropdownIndex === index && (
                                <div
                                  ref={(el) =>
                                    (dropdownRefs.current[index] = el)
                                  }
                                  className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow-md z-10 transition-all ease-in-out duration-500 origin-top-right"
                                >
                                  <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold">
                                    View
                                  </button>

                                  {jwtDecode(localStorage.getItem("user_token"))
                                    .role == 99 && (
                                    <button
                                      className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold"
                                      //onClick={() => handleLearningDelete(data.learning_id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 text-center text-gray-500"
                          >
                            <ClipLoader
                              color="#8DC63F"
                              size={24}
                              cssOverride={{ borderWidth: "4px" }}
                            />
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

      {/* MODAL */}
      <LearningModule isVisible={createLearningModule} onClose={handleClose}>
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <div>Create Learning Modules</div>
          <button onClick={handleClose} className="text-red-500">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="mt-5 grid grid-cols-1 gap-4">
          {/* CERTIFICATION */}
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
          )}
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
    </div>
  );
}
export default InsideCertifications;