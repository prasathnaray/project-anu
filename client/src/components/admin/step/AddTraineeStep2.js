import React from 'react'

function AddTraineeStep2({handleChange, handleInputData}) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-5">
                                                    <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="password"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        name="trainee_password"
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_password}
                                                      />
                                                      <label
                                                        htmlFor="password"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Password
                                                      </label>
                                                    </div>
                                                    <div className="relative">
                                                      <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_confirm_password}
                                                        name="trainee_confirm_password"
                                                      />
                                                      <label
                                                        htmlFor="confirmPassword"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Confirm Password
                                                      </label>
                                                    </div>
                                                    <div className="relative mt-6">
                                                      <input
                                                        type="text"
                                                        id="status"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        name="status"
                                                        onChange={handleChange}
                                                        value={handleInputData.status}
                                                      />
                                                      <label
                                                        htmlFor="status"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Status
                                                      </label>
                                                    </div>
    </div>
  )
}

export default AddTraineeStep2