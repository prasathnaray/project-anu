import React from 'react'
import NavBar from '../components/navBar'
import SideBar from '../components/sideBar'
import { jwtDecode } from 'jwt-decode'
import { Navigate, useNavigate } from 'react-router-dom'
import { Cross, CrossIcon } from 'lucide-react'
import UploadVol from '../components/Instructors/UploadVol'

function VolumeList() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [openUploadVol, setOpenUploadVol] = React.useState(false);
  const handleClose = () => {
    setOpenUploadVol(true);
  }
  let decoded = jwtDecode(localStorage.getItem('user_token'));
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
  if(decoded.role != 102 && decoded.role != 103){
    return <Navigate to="/" replace/>
  }
  return (
    <div className={'flex flex-col min-h-screen'}>
          <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                  <NavBar />
          </div>
          <div className="flex flex-grow pt-12">
              <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
              <div className={`${
                  buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
                } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
              >
                  <div className="p-2 flex justify-between items-center border-b bg-white">
                        <div>Volume List</div>
                        <div className="flex gap-2 text-sm">
                          <div className="text-[#8DC63F]">
                            <button onClick={() => navigate("/dashboard")}>Home</button>
                          </div>
                          <div>/</div>
                          <div>Volume Management</div>
                        </div>
                  </div>
                  <div className="m-5 bg-white border-b">
                          <div className="flex justify-end items-center p-4">
                                  <div><button className="px-2 p-1 bg-[#8DC63F] text-white rounded text-sm" onClick={() => setOpenUploadVol(true)}>Upload Volume</button></div>
                          </div>
                  </div>
              </div>
          </div>
          <UploadVol isVisible={openUploadVol} onClose={handleClose}>
                  <>
                      <div className="text-md">

                      </div>
                  </>
          </UploadVol>
    </div>
  )
}

export default VolumeList