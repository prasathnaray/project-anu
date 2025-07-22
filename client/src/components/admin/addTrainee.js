import React, {useEffect, useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';
import { Lock, MessageCircleWarning, UserPen } from 'lucide-react';
import { toast, POSITION  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from '../../pages/Profile';
import { useParams } from 'react-router-dom';
import AddTraineeStep1 from './step/AddTraineeStep1';
import AddTraineeStep3 from './step/AddTraineeStep3';
import AddTraineeStep2 from './step/AddTraineeStep2';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import APP_URL from '../../API/config';
import AddTraineeAPI from '../../API/AddTraineeAPI.js';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import GetBatchesAPI from '../../API/GetBatchesAPI.js';
function AddTrainee() {
  const tokenData = localStorage.getItem('user_token')
  const data = useParams();
  const programOptions = [
    { label: 'Trainee', value: 'trainee' },
    { label: 'Instructor', value: 'instructor' }
  ];
  const [selectedProgram, setSelectedProgram] = useState('');
  const handleProgramChange = (event) => {
    setSelectedProgram(event.target.value);
  };
  console.log(selectedProgram);
  ///batches data 
  const [listBatches, setListBatches] = useState([]);
  const getBatches = async() => {
          try
          {
              const tokenData = localStorage.getItem('user_token')
              const response = await GetBatchesAPI(tokenData);
              setListBatches(response.data.rows);
          }
          catch(err)
          {
            console.log(GetBatchesAPI)
          }
  }
  useEffect(() => {
      getBatches()
  }, [])
  const [handleInputData, setHandleInputData] = useState({
          trainee_name: '',
          trainee_email_address: '',
          trainee_contact_address: '',
          trainee_dob: '',
          trainee_gender: '',
          trainee_batch: '',
          trainee_password: '',
          trainee_confirm_password: '',
          status: '',
          trainee_dp: '',
          description: '',
          role: '' 
  })
  console.log(handleInputData);
  const handleChange = (e) => {
    const {name, value, files} = e.target;
     if (files) {
        setHandleInputData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }));
      } else {
        setHandleInputData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
  }
  const roleCode = handleInputData.role === "trainee" ? 103 : 102;
  const submitHandle = async(e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('user_anu_id', 'ANUT0100113')
      formData.append('user_name', handleInputData.trainee_name);
      formData.append('user_email', handleInputData.trainee_email_address)
      formData.append('user_contact_num', handleInputData.trainee_contact_address)
      formData.append('user_dob', handleInputData.trainee_dob);
      formData.append('user_gender', handleInputData.trainee_gender)
      formData.append('user_batch', handleInputData.trainee_batch)
      formData.append('user_password', handleInputData.trainee_password)
      formData.append('user_role', roleCode)
      formData.append('status', handleInputData.status);
      formData.append('description', handleInputData.description)
      formData.append('file', handleInputData.trainee_dp)
      try
      {
          const result = await AddTraineeAPI(tokenData, formData);
          toast.success(`Trainee enabled successfully`);
          return <Navigate to="/trainee" replace/> 
      } 
      catch(err)
      {
        if(err.response.data.code === '23505')
        {
            toast.error(`${handleInputData.role.charAt(0).toUpperCase() + handleInputData.role.slice(1)} already exists`);
            return <Navigate to="/trainee" replace/>
        }
      } 
  }
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
  const [currentStep, setCurrentStep] = useState(0);
  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
  };
  const token = localStorage.getItem('user_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 102) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="flex">
        <div>
            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>
        </div>
          <div className={`${
                    buttonOpen === true
                    ? "ms-[221px] flex-grow"
                    : "ms-[85.5px] flex-grow"
                    } `}>
                    <div>                 
                          <NavBar />
            </div>
            <div className="bg-gray-100 h-screen overflow-y-auto">
                  <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                            <div className="text-gray-500 lg:mt-5 mt-1">{data.people.charAt(0).toUpperCase() + data.people.slice(1)} / Add new {data.people}</div>
                            <div className="mt-5 font-semibold text-xl text-gray-600 flex justify-between items-center">
                                      <div>Add new {data.people.charAt(0).toUpperCase() + data.people.slice(1)}s</div>
                                      {data.people==="trainee" && 
                                          <div className="w-[250px]">
                                                  <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                    <InputLabel id="program-select-label">Select people</InputLabel>
                                                    <Select
                                                      labelId="program-select-label"
                                                      value={handleInputData.role}
                                                      onChange={handleChange}
                                                      label="Select people"
                                                      className=""
                                                      name="role"
                                                    >
                                                      {programOptions.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>
                                                          {opt.label}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                          </div>}
                                          {data.people==="instructor" &&                                           <div className="w-[250px]">
                                                  <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                    <InputLabel id="program-select-label">Select people</InputLabel>
                                                    <Select
                                                      labelId="program-select-label"
                                                      value={handleInputData.role}
                                                      onChange={handleChange}
                                                      label="Select people"
                                                      className=""
                                                      name="role"
                                                    >
                                                      {programOptions.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>
                                                          {opt.label}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                          </div>}
                            </div>
                            {/* <div className="flex justify-center items-center"> */}
                              <div className="mt-5 bg-white rounded-3xl mx-auto shadow-md px-[50px] py-10">
                                  <div className="grid grid-cols-3 pt-6 gap-2">
                                            <div
                                              className={`flex items-center gap-2 justify-center p-6 ${currentStep === 0 ? "bg-[#8DC63F]" : "bg-[#D8F3D9]"}`}
                                              style={{
                                                clipPath:
                                                  "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
                                              }}
                                            >
                                              <MessageCircleWarning className={`mb-[2px] text-lg ${currentStep === 0 ? "text-white" : "text-black"}`} size={25}/>
                                              <span
                                                className={`text-lg ${currentStep === 0 ? "text-white" : "text-black"}`}
                                              >
                                                Basic
                                              </span>
                                            </div>
                                            <div
                                              className={`flex gap-2 items-center justify-center p-6 ${currentStep === 1 ? "bg-[#8DC63F]" : "bg-[#D8F3D9]"}`}
                                              style={{
                                                clipPath:
                                                  "polygon(89% 0%, 100% 50%, 89% 100%, 0% 100%, 9% 50%, 0% 0%)",
                                              }}
                                            >
                                              <Lock className={`mb-[2px] text-lg font-normal ${currentStep === 1 ? "text-white" : "text-black"}`} size={25}/>
                                              <span
                                                className={`text-lg ${currentStep === 1 ? "text-white" : "text-black"}`}
                                              >
                                                 Credentials
                                              </span>
                                            </div>
                                            <div
                                              className={`flex gap-2 items-center justify-center p-6 ${currentStep === 2 ? "bg-[#8DC63F]" : "bg-[#D8F3D9]"}`}
                                              style={{
                                                clipPath:
                                                  "polygon(89% 0%, 100% 50%, 89% 100%, 0% 100%, 9% 50%, 0% 0%)",
                                              }}
                                            >
                                              <UserPen className={`mb-[2px] text-lg font-normal ${currentStep === 2 ? "text-white" : "text-black"}`} size={25}/>
                                              <span
                                                className={`text-lg ${currentStep === 2 ? "text-white" : "text-black"}`}
                                              >
                                                Profile & Meta Info
                                              </span>
                                            </div>
                                  </div>
                                  {currentStep === 0 && <AddTraineeStep1 handleChange={handleChange} handleInputData={handleInputData} listBatches={listBatches}/>}
                                  {currentStep === 1 && <AddTraineeStep2 handleChange={handleChange} handleInputData={handleInputData}/>}
                                  {currentStep === 2 && <AddTraineeStep3 handleChange={handleChange} handleInputData={handleInputData}/>}
                                  <div className={`mt-7  ${currentStep === 0 ? ' flex justify-end items-center' : ' flex justify-between items-center'} gap-5`}>
                                                {currentStep > 0 && <button className="bg-[#8DC63F] px-8 py-1 rounded text-white font-semibold" onClick={() => setCurrentStep(currentStep - 1)}>Prev</button>}
                                                {currentStep < 2 && <button className={`bg-[#8DC63F] px-8 py-1 rounded text-white font-semibold`} onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
                                                {currentStep ==2 && <button className={`bg-[#8DC63F] px-8 py-1 rounded text-white font-semibold`} onClick={submitHandle}>Submit</button>}
                                  </div>
                            </div>
                            {/* </div> */}
                  </div>
            </div>
        </div>
    </div>
  )
}
export default AddTrainee;