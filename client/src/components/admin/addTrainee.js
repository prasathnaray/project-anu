import React, {useEffect, useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';
import { Lock, MessageCircleWarning, UserPen } from 'lucide-react';
import Profile from '../../pages/Profile';

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
                                              {/* <img
                                                src={currentStep === 0 ? messagesvg : messagesvgblack}
                                                className="w-5 mb-1"
                                                alt="Step 1"
                                              /> */}
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
                                              {/* <img
                                                src={currentStep === 0 ? messagesvg : messagesvgblack}
                                                className="w-5 mb-1"
                                                alt="Step 1"
                                              /> */}
                                              <UserPen className={`mb-[2px] text-lg font-normal ${currentStep === 1 ? "text-white" : "text-black"}`} size={25}/>
                                              <span
                                                className={`text-lg ${currentStep === 2 ? "text-white" : "text-black"}`}
                                              >
                                                Profile & Meta Info
                                              </span>
                                            </div>
                                  </div>
                                  <div className="mt-7 grid grid-cols-2 gap-5">
                                                  <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="Name"
                                                        className="block px-2.5 pb-2.5 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                      />
                                                      <label
                                                        htmlFor="Name"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Name
                                                      </label>
                                                    </div>
                                                    <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="Name"
                                                        className="block px-2.5 pb-2.5 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                      />
                                                      <label
                                                        htmlFor="Name"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Email Address
                                                      </label>
                                                    </div>
                                                    <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="Phone"
                                                        className="block px-2.5 pb-2.5 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                      />
                                                      <label
                                                        htmlFor="Phone"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Contact Number
                                                      </label>
                                                    </div>
                                                    <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="dob"
                                                        className="block px-2.5 pb-2.5 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                      />
                                                      <label
                                                        htmlFor="dob"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                         Date of Birth
                                                      </label>
                                                    </div>


                                  </div>
                                  <div className="mt-7 flex justify-between items-center gap-5">
                                                <button className="bg-[#8DC63F] px-4 py-2 rounded text-white font-semibold">Prev</button>
                                                <button className="bg-[#8DC63F] px-4 py-2 rounded text-white font-semibold">Next</button>
                                  </div>
                            </div>
                  </div>
            </div>
        </div>
    </div>
  )
}
export default AddTrainee;