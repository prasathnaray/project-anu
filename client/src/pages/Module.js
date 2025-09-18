import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow } from 'lucide-react';

function Module() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  // decode token and restrict access
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>
      <div className="flex flex-grow">
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen pt-12">
            <div className={`${buttonOpen ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
              <div className="text-gray-500">Course / Chapters / Modules</div>
              <div className="mt-5 font-semibold text-xl text-gray-600">Associated Modules</div>
              <div className="mt-5 bg-white rounded px-8 py-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Module Name</div>
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Completion Status</span>
                          <button>
                            <ArrowUpWideNarrow size={20} />
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-sm text-gray-700">
                      <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                        Module 1
                      </td>
                      <td className="py-2 px-4 text-gray-600 font-medium border-b-2">
                        In Progress
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
export default Module;