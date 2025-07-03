import React, {useEffect, useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';
import { Lock, MessageCircleWarning, UserPen } from 'lucide-react';
import Profile from '../../pages/Profile';
import AddTraineeStep1 from './step/AddTraineeStep1';
import AddTraineeStep3 from './step/AddTraineeStep3';
import AddTraineeStep2 from './step/AddTraineeStep2';

function AddTrainee() {
  const [currentStep, setCurrentStep] = useState(0);
  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
  };
  return (
    // <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xs flex justify-center items-center border-md" id="wrapper" onClick={handleClose}>
    //         <div className="w-[700px]">
    //                 <div className="bg-white p-4 rounded">
    //                     {children}
    //                 </div>
    //         </div>
    // </div>
    <div className="flex">
        <div>
            <SideBar />
        </div>
        <div className="ms-[221px] flex-grow">
            <div>
                <NavBar />
            </div>
            <div className="bg-gray-100">
                  <div className="px-10 py-4">
                            <div className="text-gray-500">Trainees / Add new trainee </div>
                            <div className="mt-5 font-semibold text-xl text-gray-600">Add new Trainees</div>
                            <div className="mt-5 bg-white rounded px-8 py-10">
                                  <div className="grid grid-cols-3 mt-6 gap-2">
                                            <div
                                              className={`flex items-center gap-2 justify-center p-4 ${currentStep === 0 ? "bg-[#8DC63F]" : "bg-[#D8F3D9]"}`}
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
                                              className={`flex gap-2 items-center justify-center p-4 ${currentStep === 1 ? "bg-[#8DC63F]" : "bg-[#D8F3D9]"}`}
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
                                              className={`flex gap-2 items-center justify-center p-4 ${currentStep === 2 ? "bg-[#8DC63F]" : "bg-[#D8F3D9]"}`}
                                              style={{
                                                clipPath:
                                                  "polygon(89% 0%, 100% 50%, 89% 100%, 0% 100%, 9% 50%, 0% 0%)",
                                              }}
                                            >
                                              <UserPen className={`mb-[2px] text-lg font-normal ${currentStep === 1 ? "text-white" : "text-black"}`} size={25}/>
                                              <span
                                                className={`text-lg ${currentStep === 2 ? "text-white" : "text-black"}`}
                                              >
                                                Profile & Meta Info
                                              </span>
                                            </div>
                                  </div>
                                  {currentStep === 0 && <AddTraineeStep1 />}
                                  {currentStep === 1 && <AddTraineeStep2 />}
                                  {currentStep === 2 && <AddTraineeStep3 />}
                                  <div className={`mt-7  ${currentStep === 0 ? ' flex justify-end items-center' : ' flex justify-between items-center'} gap-5`}>
                                                {currentStep > 0 && <button className="bg-[#8DC63F] px-4 py-2 rounded text-white font-semibold" onClick={() => setCurrentStep(currentStep - 1)}>Prev</button>}
                                                <button className={`bg-[#8DC63F] px-4 py-2 rounded text-white font-semibold`} onClick={() => setCurrentStep(currentStep + 1)}>Next</button>
                                  </div>
                            </div>
                  </div>
            </div>
        </div>
    </div>
  )
}
export default AddTrainee;