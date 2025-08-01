import React, {useState} from 'react'
import { jwtDecode } from 'jwt-decode'
import SideBar from '../components/sideBar';
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from '../components/navBar';
import { ArrowUpWideNarrow, EllipsisVerticalIcon, X } from 'lucide-react';
import AddCourse from '../components/admin/AddCourse';
import { TextField } from '@mui/material';
import SubSideBar from '../components/subSideBar';
function Course() {
  //button toggle sidebar
  const [openCourse, setOpenCourse] = useState(false);
  const handleClose = () => {
    setOpenCourse(false);
  }
  const [buttonOpen, setButtonOpen] = useState(false);
  const handleButtonOpen = () => {
      setButtonOpen(!buttonOpen);
  };
  console.log(openCourse)
  ///main Layout
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  if (decoded.role != 101) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={`flex flex-col min-h-screen`}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                    <NavBar />
                    {/* <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/> */}
            </div>
            <div className="flex flex-grow">
                    <div className="">
                          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                    </div>
                    <div className={`${buttonOpen === true ? "ms-[221px] flex-grow" : "ms-[55.5px] flex-grow"} `}>
                              <div className="bg-gray-100 h-screen pt-12">
                                                <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                                      <div className="text-gray-500">Dashboard / Course</div>
                                                      <div className="mt-5 font-semibold text-xl text-gray-600">Course</div>
                                                      <div className="mt-5 bg-white rounded px-8 py-10">
                                                          <div className="font-semibold text-xl text-gray-500">All courses</div>
                                                          <div className="grid grid-cols-2 items-center my-5">
                                                              <div className="">
                                                                <input
                                                                  type="text"
                                                                  placeholder="Search courses"
                                                                  name="reset_password_mail"
                                                                  className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                                />
                                                              </div>
                                                              <div className="flex justify-end items-center"><button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out" onClick={() => setOpenCourse(true)}>Add Course</button></div>
                                                          </div>
                                                          <table className="w-full text-left border-collapse">
                                                                    <thead>
                                                                          <tr className="border-b border-gray-300 shadow-sm">
                                                                                  <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Course Name</div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Action</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                          </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                            <tr className="text-sm text-gray-700">
                                                                                    <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">dad</td>
                                                                                    <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">dad</td>
                                                                                    <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">dad</td>
                                                                                    <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2"><button><EllipsisVerticalIcon icon={20}/></button></td>
                                                                            </tr>
                                                                    </tbody>
                                                          </table>
                                                      </div>
                                                </div>

                              </div>
                    </div>
            </div>
            <AddCourse isVisible={openCourse} onClose={handleClose}>
                  <>
                      <div className="flex justify-between items-center">
                              <div>Add Course</div>
                              <div><button onClick={handleClose} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
                      </div>
                      <div className="grid grid-cols-5 gap-5 mt-5">
                                <div> 
                                      <TextField 
                                              fullWidth
                                              variant="outlined"
                                              size="small"
                                              sx={{ minHeight: "35px" }}
                                              id="outlined-basic"
                                              label="Course Name"
                                              name="batch_name"
                                      />
                                </div>
                                <div> 
                                      <TextField  
                                              fullWidth
                                              variant="outlined"
                                              size="small"
                                              sx={{ minHeight: "35px" }}
                                              id="outlined-basic"
                                              label="Start date"
                                              name="batch_name"
                                      />
                                </div>
                                <div> 
                                      <TextField 
                                              fullWidth
                                              variant="outlined"
                                              size="small"
                                              sx={{ minHeight: "35px" }}
                                              id="outlined-basic"
                                              label="Course Name"
                                              name="batch_name"
                                      />
                                </div>
                      </div>
                  </>
            </AddCourse>
    </div>
  )
}

export default Course