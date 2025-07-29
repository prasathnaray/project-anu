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
    <div className={`flex`}>
            <div>
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>
            </div>
            <div className={`${buttonOpen === true ? "ms-[221px] flex-grow" : "ms-[85.5px] flex-grow"} `}>
                    <div>
                            <NavBar />
                    </div>
                    <div className="bg-gray-100">
                            <div></div>
                    </div>
            </div>
    </div>
  )
}

export default Course