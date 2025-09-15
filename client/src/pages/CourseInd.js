import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Plus } from 'lucide-react';
import CollapsibleTable from '../components/CourseTable';
import EnhancedTable from '../components/CourseTable';
import CreateModule from '../components/superadmin/CreateModule'
function CourseInd() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  const url = useParams();
  console.log(url)
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  if (decoded.role != 99) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={`flex flex-col min-h-screen`}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                        <NavBar />
            </div>
            <div className="flex flex-grow">
                        <div>
                                <SideBar
                                    handleButtonOpen={handleButtonOpen}
                                    buttonOpen={buttonOpen}
                                />
                        </div>
                       <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
                                <div className="bg-gray-100 h-screen pt-12">
                                    <div className={`${buttonOpen ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="text-gray-500">Course / Module - {url.course_id}</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Associated Modules</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10">
                                                        <div className="font-semibold">
                                                                <IconButton size="md" color="success" className="bg-green-200">
                                                                            <Plus className="h-6 w-6" />
                                                                </IconButton>
                                                        </div>
                                                        <div className="mt-10">
                                                            {/* <EnhancedTable /> */}
                                                        </div>
                                            </div>
                                    </div>
                                </div>
                        </div>
            </div>
            <CreateModule>
                
            </CreateModule>
    </div>
  )
}

export default CourseInd