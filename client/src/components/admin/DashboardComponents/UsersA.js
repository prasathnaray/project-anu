import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React from "react"
import GetIntructorsAPI from "../../../API/GetIntructorsAPI";
function UsersA({}){
    const programOptions = [
        { value: 'trainees', label: 'Trainees' },
        { value: 'instructors', label: 'Instructors' },
    ];
    const [peopleState, setPeopleState] = React.useState('trainee');
    const [APIState, setAPIState] = React.useState([])
    const handleAPI = async () => {
        try
        {
            let token = localStorage.getItem('user_token');
            const response = await GetIntructorsAPI(token);
            setAPIState(response.data) 
        }
        catch(err)
        {
            console.log(err);
        }
    }
    React.useEffect(() => {
        handleAPI();
    }, [])
    React.useEffect(() => {
        console.log(APIState);
    }, [])
    return (
        <div className="grid grid-cols-3 gap-4 px-3 mt-3">
                    <div className="col-span-2 bg-white border">
                                <div className="flex justify-between items-center p-2">
                                            <div className="text-lg font-semibold text-gray-500">People</div>
                                            <div className="w-[250px]">
                                                  <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                    <InputLabel id="program-select-label">Select people</InputLabel>
                                                    <Select
                                                      labelId="program-select-label"
                                                    //   value={handleInputData.role}
                                                    //   onChange={handleChange}
                                                      label="Select people"
                                                      className=""
                                                      name="role"
                                                    >
                                                      {(programOptions || []).map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>
                                                          {opt.label}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                            </div>
                                </div>
                                <div className="p-2">
                                                        <table className="w-full text-left border-collapse">
                                                            <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                    <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">Name</th>
                                                                    <th className="py-2 px-4 text-[#8DC63F]">Batch</th>
                                                                    <th className="py-2 px-4 text-[#8DC63F]">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {APIState.map((instructor, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className="border-b border-gray-200 hover:bg-gray-50 shadow-sm"
                                                                >
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                                                                        {instructor.user_name}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                                                                        {instructor.batch_names}
                                                                    </td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                                                                        <div>{instructor.status}</div>
                                                                    </td>
                                                                </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                            </div>
                    </div>
                    <div className="col-span-1 bg-white">
                                    skjd
                    </div>
        </div>
    )
}
export default UsersA;