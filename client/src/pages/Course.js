import React, {useState} from 'react'
import { jwtDecode } from 'jwt-decode'
import SideBar from '../components/sideBar';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
function Course() {
  //button toggle sidebar
  const [buttonOpen, setButtonOpen] = useState(true);
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
                              <div className="bg-gray-100 h-screen">
                                                <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                                                                                <div className="pt-12">sidh</div>
                                                </div>

                              </div>
                    </div>
            </div>
    </div>
  )
}

export default Course