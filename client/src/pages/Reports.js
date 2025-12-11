import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, Filter, LayoutDashboard, ListFilter, Notebook } from 'lucide-react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; 
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControl, InputLabel, MenuItem, Select, Table } from '@mui/material';
function Reports() {
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
    };
    let token = localStorage.getItem("user_token");
    const decoded = jwtDecode(token);
    if (decoded.role != 101) {
        return <Navigate to="/" replace />;
    }
  return (
    <div className="flex flex-col min-h-screen">
          <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                <NavBar />
          </div>
          <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
              <div>
                            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
              </div>
              <div className="mt-12">
                                <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px]">Reports</span></div>
                                <div className={` ${buttonOpen === true ? "px-[20px] py-4 w-full max-w-[1800px] mx-auto" : "px-[50px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                    <span className="text-xl font-semibold text-gray-600">Reports</span>
                                    <div className="mt-4"> 
                                        {/* Report content goes here */}
                                        <div className="p-2 bg-white border">
                                              <div className='flex justify-between items-center gap-4'>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                          <DatePicker
                                                                          label="From"
                                                                          // value={
                                                                          // targetedLearning.end_date
                                                                          //         ? dayjs(targetedLearning.end_date)
                                                                          //         : null
                                                                          // }
                                                                          // onChange={(date) => {
                                                                          //         setTargetedLearningState(prev => ({ ...prev, end_date: date }));
                                                                          // }}
                                                                          slotProps={{
                                                                          textField: {
                                                                                  fullWidth: true,
                                                                                  variant: "outlined",
                                                                                  size: "small",
                                                                                  sx: { minHeight: "35px" },
                                                                          },
                                                                          }}
                                                          />
                                                        </LocalizationProvider>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                          <DatePicker
                                                                          label="To"
                                                                          // value={
                                                                          // targetedLearning.end_date
                                                                          //         ? dayjs(targetedLearning.end_date)
                                                                          //         : null
                                                                          // }
                                                                          // onChange={(date) => {
                                                                          //         setTargetedLearningState(prev => ({ ...prev, end_date: date }));
                                                                          // }}
                                                                          slotProps={{
                                                                          textField: {
                                                                                  fullWidth: true,
                                                                                  variant: "outlined",
                                                                                  size: "small",
                                                                                  sx: { minHeight: "35px" },
                                                                          },
                                                                          }}
                                                          />
                                                        </LocalizationProvider>
                                                        <FormControl
                                                          fullWidth
                                                          variant="outlined"
                                                          size="small"
                                                          sx={{ minHeight: "35px" }}
                                                        >
                                                          <InputLabel id="chip-select-label">Select Certificate</InputLabel>
                                                          <Select
                                                            // multiple
                                                            labelId="chip-select-label"
                                                            label="Select Certificate"
                                                            className=""
                                                            //onChange={handleTChange}
                                                            name="resources_id"
                                                            //value={targetedLearning?.resources_id || []}
                                                            MenuProps={{
                                                                    disablePortal: false, // ← force to portal
                                                                    anchorOrigin: {
                                                                    vertical: "bottom",
                                                                    horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                    vertical: "top",
                                                                    horizontal: "left"
                                                                    },
                                                                    PaperProps: {
                                                                    style: {
                                                                            zIndex: 2300 // must be higher than modal
                                                                    }
                                                                    }
                                                            }}
                                                            // renderValue={(selectedIds) => (
                                                            //         Array.isArray(selectedIds) ? (
                                                            //                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                            //                         {selectedIds.map((id) => {
                                                            //                         const resource = resourceList.find((m) => m.resource_id === id);
                                                            //                         return (
                                                            //                         <Chip
                                                            //                                 key={id}
                                                            //                                 label={resource ? resource.resource_name : id}
                                                            //                                 sx={{ borderRadius: "4px" }}
                                                            //                         />
                                                            //                         );
                                                            //                         })}
                                                            //                 </Box>
                                                            //                 ) : null 
                                                            // )}
                                                          >
                                                                    {/* {Array.isArray(resourceList) && resourceList.length > 0 ? (
                                                                            resourceList.map((data, index) => (
                                                                                    <MenuItem key={index} value={data?.resource_id}>
                                                                                    {data?.resource_name}
                                                                                    </MenuItem>
                                                                            ))
                                                                    ) : ( */}
                                                                            <MenuItem disabled>No data found</MenuItem>
                                                                    {/* )} */}
                                                          </Select>
                                                        </FormControl>
                                                        <FormControl
                                                          fullWidth
                                                          variant="outlined"
                                                          size="small"
                                                          sx={{ minHeight: "35px" }}
                                                        >
                                                          <InputLabel id="chip-select-label">Select Batch</InputLabel>
                                                          <Select
                                                            // multiple
                                                            labelId="chip-select-label"
                                                            label="Select Batch"
                                                            className=""
                                                            //onChange={handleTChange}
                                                            name="resources_id"
                                                            //value={targetedLearning?.resources_id || []}
                                                            MenuProps={{
                                                                    disablePortal: false, // ← force to portal
                                                                    anchorOrigin: {
                                                                    vertical: "bottom",
                                                                    horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                    vertical: "top",
                                                                    horizontal: "left"
                                                                    },
                                                                    PaperProps: {
                                                                    style: {
                                                                            zIndex: 2300 // must be higher than modal
                                                                    }
                                                                    }
                                                            }}
                                                            // renderValue={(selectedIds) => (
                                                            //         Array.isArray(selectedIds) ? (
                                                            //                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                            //                         {selectedIds.map((id) => {
                                                            //                         const resource = resourceList.find((m) => m.resource_id === id);
                                                            //                         return (
                                                            //                         <Chip
                                                            //                                 key={id}
                                                            //                                 label={resource ? resource.resource_name : id}
                                                            //                                 sx={{ borderRadius: "4px" }}
                                                            //                         />
                                                            //                         );
                                                            //                         })}
                                                            //                 </Box>
                                                            //                 ) : null 
                                                            // )}
                                                          >
                                                                    {/* {Array.isArray(resourceList) && resourceList.length > 0 ? (
                                                                            resourceList.map((data, index) => (
                                                                                    <MenuItem key={index} value={data?.resource_id}>
                                                                                    {data?.resource_name}
                                                                                    </MenuItem>
                                                                            ))
                                                                    ) : ( */}
                                                                            <MenuItem disabled>No data found</MenuItem>
                                                                    {/* )} */}
                                                          </Select>
                                                        </FormControl>
                                                        <FormControl
                                                          fullWidth
                                                          variant="outlined"
                                                          size="small"
                                                          sx={{ minHeight: "35px" }}
                                                        >
                                                          <InputLabel id="chip-select-label">Select Instructor</InputLabel>
                                                          <Select
                                                            // multiple
                                                            labelId="chip-select-label"
                                                            label="Select Instructor"
                                                            className=""
                                                            //onChange={handleTChange}
                                                            name="resources_id"
                                                            //value={targetedLearning?.resources_id || []}
                                                            MenuProps={{
                                                                    disablePortal: false, // ← force to portal
                                                                    anchorOrigin: {
                                                                    vertical: "bottom",
                                                                    horizontal: "left"
                                                                    },
                                                                    transformOrigin: {
                                                                    vertical: "top",
                                                                    horizontal: "left"
                                                                    },
                                                                    PaperProps: {
                                                                    style: {
                                                                            zIndex: 2300 // must be higher than modal
                                                                    }
                                                                    }
                                                            }}
                                                            // renderValue={(selectedIds) => (
                                                            //         Array.isArray(selectedIds) ? (
                                                            //                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                            //                         {selectedIds.map((id) => {
                                                            //                         const resource = resourceList.find((m) => m.resource_id === id);
                                                            //                         return (
                                                            //                         <Chip
                                                            //                                 key={id}
                                                            //                                 label={resource ? resource.resource_name : id}
                                                            //                                 sx={{ borderRadius: "4px" }}
                                                            //                         />
                                                            //                         );
                                                            //                         })}
                                                            //                 </Box>
                                                            //                 ) : null 
                                                            // )}
                                                          >
                                                                    {/* {Array.isArray(resourceList) && resourceList.length > 0 ? (
                                                                            resourceList.map((data, index) => (
                                                                                    <MenuItem key={index} value={data?.resource_id}>
                                                                                    {data?.resource_name}
                                                                                    </MenuItem>
                                                                            ))
                                                                    ) : ( */}
                                                                            <MenuItem disabled>No data found</MenuItem>
                                                                    {/* )} */}
                                                          </Select>
                                                        </FormControl>
                                                        <div className="flex flex-col">
                                                              <button className="bg-[#8DC63F] text-white px-4 py-2 rounded-md">
                                                                  Generate
                                                              </button>
                                                        </div>
                                              </div>
                                        </div>
                                        <div className='mt-5 bg-white p-2'>
                                              <div className="flex justify-between items-center">
                                                    <div className="text-lg font-semibold">Instructor's Performance</div>
                                                    <div className=""><button><ListFilter size={20} /></button></div>
                                              </div>
                                              
                                              <div className="mt-5">
                                                  <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex justify-center items-center gap-2"><div>Instructor Name</div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex justify-center items-center gap-2"><span>Trainees Managed</span></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex justify-center items-center gap-2"><span>Last Active</span></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex justify-center items-center gap-2"><span>Avg Completion Rate</span></div></th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                             <tr>
                                                                <td></td>
                                                                <td></td>
                                                             </tr>    
                                                        </tbody>
                                                  </table>
                                              </div>
                                        </div>
                                    </div>
                                </div>
              </div>
          </div>
    </div>
  )
}
export default Reports