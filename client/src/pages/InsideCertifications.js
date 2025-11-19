import React from 'react'
import NavBar from '../components/navBar'
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import SideBar from '../components/sideBar';
import { LayoutDashboard, ListTodo } from 'lucide-react';

function InsideCertifications() {
  const navigate = useNavigate();
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col min-h-screen">
                <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                        <NavBar />
                </div>
                <div className="flex flex-grow pt-12">
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                    <div
                        className={`${
                            buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
                        } flex-grow`}
                        >
                        <div className="bg-gray-100 h-screen">
                              <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                    <LayoutDashboard size={15} /> Dashboard / <ListTodo size={15} />{" "}
                                    <span className="text-[15px] hover:underline hover:underline-offset-4">
                                        <button onClick={() => navigate('/request-raised')}>
                                            Requests
                                        </button>
                                    </span>
                              </div>  
                        </div> 
                    </div>
                </div>
    </div>
  )
}
export default InsideCertifications