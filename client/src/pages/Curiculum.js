import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, EllipsisVertical } from 'lucide-react';
function Curiculam() {
  const token = jwtDecode(localStorage.getItem('user_token'));
  const [buttonOpen, setButtonOpen] = React.useState(false);
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  if(!token.role == 99)
  {
     return <Navigate to="/" replace/>
  }
  return (
      <div className={`flex flex-col min-h-screen`}>
              <div>
                   <NavBar />
              </div>
              <div className="flex flex-grow">
                    <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>  
                    </div>
                    <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div>
                                  <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                      <div className="text-gray-600">Curiculum / All Curiculum</div>
                                      <div className="mt-5 font-semibold text-xl text-gray-600">Curiculum</div>
                                      <div className="mt-5 bg-white rounded px-8 py-10">
                                              <div className="font-semibold text-xl text-gray-500">All Curiculam</div>
                                              <div className="grid grid-cols-2 items-center my-5">
                                                        <div className="">
                                                              <input
                                                                  type="text"
                                                                  placeholder="Search Curriculum"
                                                                  className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                              />
                                                        </div>
                                                        <div className="flex justify-end items-center"><button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out">Create Curiculam</button></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                    <thead className=''>
                                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Curiculum Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Total Courses Asscoiated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Total Centres Associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>
                                                                </tr>
                                                    </thead>
                                                    <tbody>
                                                          <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">sc</td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">scv</td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">sc</td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                            <button><EllipsisVertical size={24} /></button>
                                                                    </td>
                                                          </tr>
                                                    </tbody>
                                                </table>
                                      </div>
                                  </div>
                            </div>
                    </div>
              </div>
      </div>
  )
}

export default Curiculam;