import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, OutlinedInput, Chip} from '@mui/material';
function AddTraineeStep2({handleChange, handleInputData}) {
  const status = [
    {label: 'Active', value: 'active'},
    {label: 'Inactive', value: 'inactive'}
  ]
  return (
    <div className="mt-7 grid grid-cols-2 gap-5">
                                                    <div>
                                                          <TextField fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}
                                                            id="outlined-basic" 
                                                            label="Password" 
                                                            name="trainee_password"
                                                            type="password"
                                                            onChange={handleChange}
                                                            value={handleInputData.trainee_password}
                                                          />
                                                    </div>
                                                    <div>
                                                          <TextField fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}
                                                            id="outlined-basic" 
                                                            label="Confirm password" 
                                                            name="trainee_confirm_password"
                                                            type="password"
                                                            onChange={handleChange}
                                                            value={handleInputData.trainee_confirm_password}
                                                          />
                                                    </div>
                                                    <div className="mt-6">
                                                      <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                        <InputLabel id="program-select-label">Select status</InputLabel>
                                                        <Select
                                                          labelId="program-select-label"
                                                          onChange={handleChange}
                                                          value={handleInputData.status}
                                                          label="Select status"
                                                          className=""
                                                          name="status"
                                                        >
                                                          {status.map((opt) => (
                                                            <MenuItem key={opt.value} value={opt.value}>
                                                              {opt.label}
                                                            </MenuItem>
                                                          ))}
                                                        </Select>
                                                      </FormControl>
                                                    </div>
    </div>
  )
}

export default AddTraineeStep2