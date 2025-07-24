import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, OutlinedInput, Chip} from '@mui/material';
import { ValidatorComponent } from 'react-material-ui-form-validator';
function AddTraineeStep1({handleChange, handleInputData, listBatches, data}) {
  console.log(listBatches)
  return (
    <div className="mt-7 grid grid-cols-2 gap-5">
                                                    <div>
                                                          <TextField fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}
                                                            id="outlined-basic" 
                                                            label="Full Name" 
                                                            name="trainee_name"
                                                            onChange={handleChange}
                                                            value={handleInputData.trainee_name}
                                                          />
                                                    </div>
                                                    <div>
                                                          <TextField fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}
                                                            id="outlined-basic" 
                                                            label="Email address" 
                                                            name="trainee_email_address"
                                                            onChange={handleChange}
                                                            value={handleInputData.trainee_email_address}
                                                          />
                                                    </div>
                                                    <div className="mt-6">
                                                          <TextField fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}
                                                            id="outlined-basic" 
                                                            label="Contact Number" 
                                                            onChange={handleChange}
                                                            value={handleInputData.trainee_contact_address}
                                                            name="trainee_contact_address"
                                                          />
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
                                                              <MenuItem value={'male'}>Male</MenuItem>
                                                              <MenuItem value={'female'}>Female</MenuItem>
                                                              <MenuItem value={'prefer_not_to_say'}>Prefer not to say</MenuItem>
                                                          </Select>
                                                        </FormControl>
                                                  </div>
                                                  {data.people === "trainee" ? (
                                                      <div className="mt-4">
                                                        <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                          <InputLabel id="batch-select-label">Select Batch</InputLabel>
                                                          <Select
                                                            labelId="batch-select-label"
                                                            onChange={handleChange}
                                                            name="trainee_batch"
                                                            value={handleInputData.trainee_batch}
                                                            label="Select Batch"
                                                          >
                                                            {Array.isArray(listBatches) &&
                                                              listBatches.map((obj) => (
                                                                <MenuItem key={obj.batch_id} value={obj.batch_id}>
                                                                  {obj.batch_name}
                                                                </MenuItem>
                                                              ))}
                                                          </Select>
                                                        </FormControl>
                                                      </div>
                                                    ) : (
                                                      <div className="mt-4">
                                                        <FormControl fullWidth variant="outlined" size="small">
                                                          <InputLabel id="chip-select-label">Select Batches</InputLabel>
                                                          <Select
                                                            labelId="chip-select-label"
                                                            multiple
                                                            name="trainee_batch"
                                                            value={handleInputData.trainee_batch}
                                                            onChange={handleChange}
                                                            input={<OutlinedInput label="Select Batches" />}
                                                            renderValue={(selectedIds) => (
                                                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                {selectedIds.map((id) => {
                                                                  const batch = listBatches.find((b) => b.batch_id === id);
                                                                  return <Chip key={id} label={batch?.batch_name || id} />;
                                                                })}
                                                              </Box>
                                                            )}
                                                          >
                                                            {Array.isArray(listBatches) &&
                                                              listBatches.map((obj) => (
                                                                <MenuItem key={obj.batch_id} value={obj.batch_id}>
                                                                  {obj.batch_name}
                                                                </MenuItem>
                                                              ))}
                                                          </Select>
                                                        </FormControl>
                                                      </div>
                                                    )}

                                  </div>
  )
}

export default AddTraineeStep1