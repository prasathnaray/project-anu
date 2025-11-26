import React, { useEffect, useState, useCallback } from "react";
import NavBar from "../components/navBar";
import {jwtDecode} from "jwt-decode";
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
import getResourceAPI from "../API/GetResourceAPI";

function InsideCertifications() {
  const navigate = useNavigate();
  const { certificate_id } = useParams();

  // auth token & decode safely
  const token = localStorage.getItem("user_token");
  let decoded = null;
  try {
    if (token) decoded = jwtDecode(token);
  } catch (e) {
    console.warn("Invalid token", e);
  }

  // UI states
  const [buttonOpen, setButtonOpen] = useState(true);

  // create learning modal
  const [createLearningModule, setCreateLearningModule] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [unitName, setUnitName] = useState("");

  // data
  const [certificateData, setCertificateData] = useState([]);
  const [learningModules, setLearningModules] = useState([]);

  // expand / resources per module
  const [expandedRow, setExpandedRow] = useState(null);
  const [resourceMap, setResourceMap] = useState({}); // { [learning_module_id]: { loading, error, data } }

  // modal for adding resources
  const [openRes, setOpenRes] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null); // { learning_module_id, module_name, unit_name }

  // small static lists
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

  // ----- Fetch APIs -----
  const fetchCertificates = useCallback(async () => {
    if (!token || !certificate_id) return;
    try {
      const response = await GetCertificateDataByIdAPI(token, certificate_id);
      setCertificateData(response.data || []);
    } catch (err) {
      console.error("fetchCertificates:", err);
    }
  }, [token, certificate_id]);

  const fetchLearningModules = useCallback(async () => {
    if (!token || !certificate_id) return;
    try {
      const response = await GetLearningModuleByIdAPI(token, certificate_id);
      const modules = Array.isArray(response.data) ? response.data : [];
      setLearningModules(modules);
    } catch (err) {
      console.error("fetchLearningModules:", err);
    }
  }, [token, certificate_id]);

  // Fetch resources for a module and store in resourceMap
  const fetchResourcesForModule = useCallback(
    async (moduleId) => {
      if (!token || !moduleId) return;

      // If we already loaded successfully, skip re-fetch (optional; you can force refresh)
      const current = resourceMap[moduleId];
      if (current && current.data && current.data.length > 0) {
        return;
      }

      // set loading
      setResourceMap((prev) => ({
        ...prev,
        [moduleId]: { loading: true, error: null, data: [] },
      }));

      try {
        const response = await getResourceAPI(token, moduleId);
        setResourceMap((prev) => ({
          ...prev,
          [moduleId]: { loading: false, error: null, data: response.data || [] },
        }));
      } catch (err) {
        console.error("getResourceAPI error for", moduleId, err);
        setResourceMap((prev) => ({
          ...prev,
          [moduleId]: { loading: false, error: err, data: [] },
        }));
        toast.error("Failed to load resources", {
          autoClose: 3000,
          icon: false,
          closeButton: CustomCloseButton,
        });
      }
    },
    [token, resourceMap]
  );

  // create learning module
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
      if (response.data?.code === 200) {
        toast.success("Learning Module Created", {
          autoClose: 3000,
          toastId: "module-inserted",
          icon: false,
          closeButton: CustomCloseButton,
        });
        handleCloseCreateModule();
        await fetchLearningModules();
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("handleCreateLearning:", err);
      toast.error("Something went wrong", {
        autoClose: 3000,
        toastId: "mod-err",
        icon: false,
        closeButton: CustomCloseButton,
      });
    }
  };

  // close create modal
  const handleCloseCreateModule = () => {
    setCreateLearningModule(false);
    setCertificateName("");
    setCourseName("");
    setModuleName("");
    setUnitName("");
  };

  // toggle expand and fetch resources
  const toggleExpand = async (index, moduleId) => {
    const newIndex = expandedRow === index ? null : index;
    setExpandedRow(newIndex);

    if (newIndex !== null && moduleId) {
      await fetchResourcesForModule(moduleId);
    }
  };

  // open CreateResources modal with selected module
  const openCreateResourcesModal = (module) => {
    setSelectedModule(module);
    setOpenRes(true);
  };

  // refresh resources for a module (used e.g. after adding a resource)
  const refreshResources = async (moduleId) => {
    await fetchResourcesForModule(moduleId);
  };

  useEffect(() => {
    fetchCertificates();
    fetchLearningModules();
  }, [fetchCertificates, fetchLearningModules]);

  // auth guard: if no token or invalid role, redirect
  if (!token || !decoded || (decoded.role != 101 && decoded.role != 102)) {
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
          <div className="bg-gray-100 h-screen">
            {/* Breadcrumb */}
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
              <LayoutDashboard size={15} /> Dashboard /
              <ListTodo size={15} />
              <span className="text-[15px] hover:underline cursor-pointer">
                <button onClick={() => navigate("/request-raised")}>Learning Modules</button>
              </span>
            </div>

            {/* Header */}
            <div className="mt-5">
              <div className="bg-white p-5 rounded shadow-lg mx-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">Learning Modules</h1>
                  <button className="text-gray-600" onClick={() => setCreateLearningModule(true)}>
                    <Plus size={20} />
                  </button>
                </div>

                {/* TABLE */}
                <div className="mt-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 shadow-sm">
                        {["Course Name", "Module Name", "Unit Name", "Action"].map((name, i) => (
                          <th key={i} className="py-2 px-4 text-[#8DC63F]">
                            <div className="flex items-center gap-2">
                              <span>{name}</span>
                              <ArrowUpWideNarrow size={20} />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {learningModules.length > 0 ? (
                        learningModules.map((data, index) => {
                          const moduleId = data.learning_module_id;
                          const resourcesEntry = resourceMap[moduleId] || { loading: false, error: null, data: [] };

                          return (
                            <React.Fragment key={moduleId || index}>
                              <tr className="text-sm text-gray-700">
                                <td className="py-2 px-4 font-semibold text-[#8DC63F]">{data.course_name}</td>
                                <td className="py-2 px-4 font-semibold text-[#8DC63F]">{data.module_name || "—"}</td>
                                <td className="py-2 px-4 text-gray-600">{data.unit_name || "—"}</td>
                                <td className="py-2 px-4 relative">
                                  <button
                                    onClick={() => toggleExpand(index, moduleId)}
                                    className="text-[#8DC63F]"
                                  >
                                    <ChevronDown
                                      size={24}
                                      className={`transition-transform ${expandedRow === index ? "rotate-180" : ""}`}
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
                                        <button
                                          onClick={() =>
                                            openCreateResourcesModal({
                                              learning_module_id: moduleId,
                                              module_name: data.module_name,
                                              unit_name: data.unit_name,
                                            })
                                          }
                                        >
                                          <Plus />
                                        </button>
                                      </div>

                                      {/* resource summary table */}
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b">
                                            <th className="py-2 px-2 text-left">Type</th>
                                            <th className="py-2 px-2 text-left">Number of Trainees Completed</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {/* while loading */}
                                          {resourcesEntry.loading ? (
                                            <tr>
                                              <td colSpan={3} className="py-4 px-2 text-center text-gray-500">
                                                Loading resources...
                                              </td>
                                            </tr>
                                          ) : resourcesEntry.error ? (
                                            <tr>
                                              <td colSpan={3} className="py-4 px-2 text-center text-red-500">
                                                Failed to load resources
                                              </td>
                                            </tr>
                                          ) : (
                                            // If you have structured resource types in API, map them.
                                            // For now, we display aggregated counts based on the API response structure.
                                          //   (() => {
                                          //     const resList = Array.isArray(resourcesEntry.data) ? resourcesEntry.data : [];
                                          //     // Example aggregation: count by resource_type (if present). Otherwise show totals.
                                          //     const totalResources = resList.length;
                                          //     // count completed mock: if resource object has trainee_completed or progress counts, sum them
                                          //     // We'll attempt to derive numbers conservatively:
                                          //     let learningResourcesCount = 0;
                                          //     let practiceCount = 0;
                                          //     let learningCompleted = 0;
                                          //     let practiceCompleted = 0;

                                          //     resList.forEach((r) => {
                                          //       const type = (r.resource_type || "").toLowerCase();
                                          //       if (type.includes("practice")) {
                                          //         practiceCount += 1;
                                          //         practiceCompleted += Number(r.trainee_completed || 0);
                                          //       } else {
                                          //         learningResourcesCount += 1;
                                          //         learningCompleted += Number(r.trainee_completed || 0);
                                          //       }
                                          //     });

                                          //     // fallback when there are no typed resources
                                          //     if (resList.length === 0) {
                                          //       return (
                                          //         <tr>
                                          //           <td colSpan={3} className="py-4 px-2 text-center text-gray-500">
                                          //             No resources found for this module.
                                          //           </td>
                                          //         </tr>
                                          //       );
                                          //     }

                                          //     return (
                                          //       <>
                                          //         <tr>
                                          //           <td className="py-2 px-2">Learning Resources</td>
                                          //           <td className="py-2 px-2">{learningCompleted}</td>
                                          //         </tr>
                                          //         <tr>
                                          //           <td className="py-2 px-2">Practice</td>
                                          //           <td className="py-2 px-2">{practiceCompleted}</td>
                                          //         </tr>
                                          //       </>
                                          //     );
                                          //   })()
                                          
                                          resourcesEntry.data.length > 0 ? (
                                            resourcesEntry.data.map((res, i) => (
                                              <tr key={i} className="border-b">
                                                <td className="py-2 px-2">{res.resource_name || "—"}</td>
                                                <td className="py-2 px-2">{res.trainee_completed || 0}</td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                              <td colSpan={3} className="py-4 px-2 text-center text-gray-500">
                                                No resources found for this module.
                                              </td>
                                            </tr>
                                          )
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

      {/* Create Learning Module Modal */}
      <LearningModule isVisible={createLearningModule} onClose={handleCloseCreateModule}>
        <div className="flex justify-between items-center mb-4">
          <div>Create Learning Modules</div>
          <button onClick={handleCloseCreateModule} className="text-red-500">
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
              {certificateData.map((d, i) => (
                <MenuItem key={i} value={d.certificate_name}>
                  {d.certificate_name}
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
            className={`px-3 py-2 text-white rounded ${
              isCreateDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#8DC63F] cursor-pointer"
            }`}
          >
            Create
          </button>
        </div>
      </LearningModule>

      {/* CreateResources modal - pass selectedModule object and a callback to refresh */}
      <CreateResources
        isVisible={openRes}
        onClose={() => {
          setOpenRes(false);
          setSelectedModule(null);
        }}
        learningModuleId={selectedModule}
        onCreated={() => {
          // refresh resource list after creation
          if (selectedModule?.learning_module_id) {
            refreshResources(selectedModule.learning_module_id);
          }
        }}
      />
    </div>
  );
}

export default InsideCertifications;