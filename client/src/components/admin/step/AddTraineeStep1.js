import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
function AddTraineeStep1({handleChange, handleInputData}) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-5">
                                                   <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="Name"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        name="trainee_name"
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_name}
                                                      />
                                                      <label
                                                        htmlFor="Name"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Name
                                                      </label>
                                                    </div>
                                                    <div className="relative">
                                                      <input
                                                        type="text"
                                                        id="Name"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        name="trainee_email_address"
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_email_address}
                                                      />
                                                      <label
                                                        htmlFor="Name"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Email Address
                                                      </label>
                                                    </div>
                                                    <div className="relative mt-6">
                                                      <input
                                                        type="text"
                                                        id="Phone"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_contact_address}
                                                        name="trainee_contact_address"
                                                      />
                                                      <label
                                                        htmlFor="Phone"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                        Contact Number
                                                      </label>
                                                    </div>
                                                    <div className="relative mt-6">
                                                      <input
                                                        type="text"
                                                        id="dob"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_dob}
                                                        name="trainee_dob"
                                                      />
                                                      <label
                                                        htmlFor="dob"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                         Date of Birth
                                                      </label>
                                                    </div>
                                                    {/* <div className="relative mt-4">
                                                      <input
                                                        type="text"
                                                        id="gender"
                                                        className="block px-2.5 pb-2.5 pt-3 w-full text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                                        placeholder=" "
                                                        onChange={handleChange}
                                                        value={handleInputData.trainee_gender}
                                                        name="trainee_gender"
                                                      />
                                                      <label
                                                        htmlFor="gender"
                                                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                                  peer-focus:px-2 
                                                                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600
                                                                  rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                      >
                                                          Gender
                                                      </label>
                                                    </div> */}
                                                    <div className="mt-4">
                                                        <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                          <InputLabel id="program-select-label">Select Gender</InputLabel>
                                                          <Select
                                                            labelId="program-select-label"
                                                            onChange={handleChange}
                                                            name="trainee_gender"
                                                            value={handleInputData.trainee_gender}
                                                            label="Select Gender"
                                                            className=""
                                                          >
                                                              <MenuItem value={'Male'}>Male</MenuItem>
                                                              <MenuItem value={'Female'}>Female</MenuItem>
                                                              <MenuItem value={'Other'}>Other</MenuItem>
                                                          </Select>
                                                        </FormControl>
                                                  </div>

                                  </div>
  )
}

export default AddTraineeStep1