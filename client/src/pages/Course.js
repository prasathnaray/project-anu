import React, {useState} from 'react'
import { jwtDecode } from 'jwt-decode'
import SideBar from '../components/sideBar';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import { ArrowUpWideNarrow } from 'lucide-react';
function Course() {
  //button toggle sidebar
  const [buttonOpen, setButtonOpen] = useState(false);
  const handleButtonOpen = () => {
      setButtonOpen(!buttonOpen);
  };
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
                                                              <div className="flex justify-end items-center"><a href="/instructor/add" className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out">Add Course</a></div>
                                                          </div>
                                                          <table className="w-full text-left border-collapse">
                                                                    <thead>
                                                                          <tr className="border-b border-gray-300 shadow-sm">
                                                                                  <th className="py-2 px-4"></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Course Name</div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                  <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Status</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                          </tr>
                                                                    </thead>
                                                          </table>
                                                      </div>
                                                </div>

                              </div>
                    </div>
            </div>
    </div>
  )
}

export default Course