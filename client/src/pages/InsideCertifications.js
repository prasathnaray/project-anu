// -----------------------------------------------------------
// InsideCertifications.js (Final Version with Units Included)
// -----------------------------------------------------------

import React from 'react'
import NavBar from '../components/navBar'
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import SideBar from '../components/sideBar';
import { LayoutDashboard, ListTodo, Plus, X } from 'lucide-react';
import LearningModule from '../components/superadmin/LearningModule';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import GetCertificateDataByIdAPI from '../API/GetCertificateDataByIdAPI';

function InsideCertifications() {

  const navigate = useNavigate();
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);

  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [createLearningModule, setCreateLearningModule] = React.useState(false);

  const handleClose = () => setCreateLearningModule(false);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const { certificate_id } = useParams();

  const [certificateName, setCertificateName] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [moduleName, setModuleName] = React.useState("");
  const [unitName, setUnitName] = React.useState("");

  const [certificateData, setCertificateData] = React.useState([]);

  const getCertData = async () => {
    try {
      let token = localStorage.getItem('user_token');
      const response = await GetCertificateDataByIdAPI(token, certificate_id);
      setCertificateData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getCertData();
  }, []);

  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }

  const btcCourses = [
    "First Trimester",
    "Second Trimester",
    "Third Trimester"
  ];

  // -----------------------------
  // MODULES UNDER SECOND TRIMESTER
  // -----------------------------
  const secondTrimesterModules = [
    "6-Step Approach",
    "Biometry",
    "20 + 2 Planes"
  ];

  // -----------------------------
  // UNITS UNDER MODULES
  // -----------------------------
  const unitMap = {
    "6-Step Approach": [
      "Presentation, Number of Fetus, Cardiac Activity",
      "Placenta & Liquor"
    ],
    "Biometry": [
      "BPD & HC",
      "AC",
      "FL"
    ],
    "20 + 2 Planes": [
      "Sweep 1",
      "Head (Planes 4–6)",
      "Face (Planes 18–20)",
      "Spine (Planes 1–3)",
      "Thorax (Planes 7–10)",
      "Abdomen (Planes 11–13)",
      "Pelvis (Plane 14)",
      "Limbs (Planes 15–17)",
      "Sweep 2"
    ]
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

        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen">

            {/* Breadcrumb */}
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
              <LayoutDashboard size={15} /> Dashboard / 
              <ListTodo size={15} />
              <span className="text-[15px] hover:underline hover:underline-offset-4">
                <button onClick={() => navigate('/request-raised')}>
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

          {/* COURSE (BTC Only) */}
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
                  <MenuItem key={i} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* MODULES (ONLY FOR SECOND TRIMESTER) */}
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
                  <MenuItem key={i} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* UNITS BASED ON MODULE */}
          {moduleName && (
            <FormControl fullWidth size="small">
              <InputLabel>Select Unit</InputLabel>
              <Select
                label="Select Unit"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
              >
                {unitMap[moduleName]?.map((u, i) => (
                  <MenuItem key={i} value={u}>{u}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

        </div>
      </LearningModule>

    </div>
  );
}

export default InsideCertifications;