import React from 'react'
import NavBar from '../components/navBar'
import SideBar from '../components/sideBar'
import { LayoutDashboard, ListTodo, Notebook } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function RequestRaised() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={`flex flex-col min-h-screen`}>
             <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                    <NavBar />
             </div>
             <div className="flex flex-grow pt-12">
                    <div>
                          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>
                    </div>
                    <div
                      className={`${
                        buttonOpen === true
                          ? "ms-[221px] flex-grow"
                          : "ms-[55.5px] flex-grow"
                      } `}
                    >
                        <div className="bg-gray-100 h-screen">
                              <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                <LayoutDashboard size={15} /> Dashboard / <ListTodo size={15} />{' '}
                                <span className="text-[15px] hover:underline hover:underline-offset-4">
                                  <button onClick={() => navigate('/request-raised')}>Requests</button>
                                </span>
                              </div>
                              <div className="mt-3 mx-2">
                                    <div className="bg-white">
                                            <div className="px-3 py-1 text-lg text-gray-500">10 Request Pending</div>
                                            <div className="p-2">
                                                  <div className="border flex justify-between items-center px-2">
                                                        <div className="">Sjfh</div>
                                                        <div className="text-sm m-3 border rounded-lg border-green-400 p-2">Approved</div>
                                                  </div>
                                            </div>
                                    </div>
                              </div>
                        </div>
                    </div>
             </div>
    </div>
  )
}
export default RequestRaised