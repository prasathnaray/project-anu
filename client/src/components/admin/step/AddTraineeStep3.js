import React from 'react'

function AddTraineeStep3({handleChange, handleInputData}) {
  return (
    <div className="mt-7 grid grid-cols-1 gap-5">
                                                    <div className="relative">
                                                      <input
                                                        type="file"
                                                        id="confirmPassword"
                                                        className="block px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        onChange={handleChange}
                                                        name="trainee_dp"
                                                      />
                                                      <label
                                                        htmlFor="confirmPassword"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Profile Photo
                                                      </label>
                                                    </div>
                                                    <div className="relative">
                                                      <textarea
                                                        type="password"
                                                        id="confirmPassword"
                                                        className="block px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        onChange={handleChange}
                                                        value={handleInputData.description}
                                                        name="description"
                                                      />
                                                      <label
                                                        htmlFor="confirmPassword"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Description
                                                      </label>
                                                    </div>

    </div>
  )
}

export default AddTraineeStep3