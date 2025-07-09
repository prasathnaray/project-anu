import React, {useEffect, useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';
import { Lock, MessageCircleWarning, UserPen } from 'lucide-react';
import Profile from '../../pages/Profile';
import AddTraineeStep1 from './step/AddTraineeStep1';
import AddTraineeStep3 from './step/AddTraineeStep3';
import AddTraineeStep2 from './step/AddTraineeStep2';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import APP_URL from '../../API/config';
import AddTraineeAPI from '../../API/AddTraineeAPI.js';
function AddTrainee() {
  const [handleInputData, setHandleInputData] = useState({
          trainee_name: '',
          trainee_email_address: '',
          trainee_contact_address: '',
          trainee_dob: '',
          trainee_gender: '',
          trainee_password: '',
          trainee_confirm_password: '',
          status: '',
          trainee_dp: '',
          description: ''
  })
  console.log(handleInputData);
  const handleChange = (e) => {
      const {name, value} = e.target;
        setHandleInputData((prevData)=>({
            ...prevData,
            [name]: value,
        }))
  }
  const tokenData = localStorage.getItem('user_data')
  const submitHandle = async(e) => {
      e.preventDefault();
      try
      {
          const result = await AddTraineeAPI(tokenData, handleInputData);
          console.log(result);
      } 
      catch(err)
      {
         console.log(err)
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
  if (decoded.role != 102) {
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
                  <div className="px-10 py-4 w-full max-w-[1800px] mx-auto">
                            <div className="text-gray-500 lg:mt-5 mt-1">Trainees / Add new trainee </div>
                            <div className="mt-5 font-semibold text-xl text-gray-600">Add new Trainees</div>
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
                                  {currentStep === 0 && <AddTraineeStep1 handleChange={handleChange} handleInputData={handleInputData}/>}
                                  {currentStep === 1 && <AddTraineeStep2 handleChange={handleChange} handleInputData={handleInputData}/>}
                                  {currentStep === 2 && <AddTraineeStep3 handleChange={handleChange} handleInputData={handleInputData}/>}
                                  <div className={`mt-7  ${currentStep === 0 ? ' flex justify-end items-center' : ' flex justify-between items-center'} gap-5`}>
                                                {currentStep > 0 && <button className="bg-[#8DC63F] px-4 py-2 rounded text-white font-semibold" onClick={() => setCurrentStep(currentStep - 1)}>Prev</button>}
                                                <button className={`bg-[#8DC63F] px-4 py-2 rounded text-white font-semibold`} onClick={() => setCurrentStep(currentStep + 1)}>Next</button>
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