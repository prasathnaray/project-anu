import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
function IndividualInstructors() {
    let {people_id} = useParams();
    let token = localStorage.getItem('user_token');
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
    if (!token) {
                    return <Navigate to="/" replace />;
    }
    const decoded = jwtDecode(token);
    if (decoded.role != 101 && decoded.role != 102) {
                    return <Navigate to="/" replace />;
    }
  return (
    <div className={`flex flex-col min-h-screen`}>
          <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                  <NavBar />
          </div>
          <div className="flex flex-grow pt-12">
                  <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                  </div>
                  <div className={`${
                        buttonOpen === true
                          ? "ms-[221px] flex-grow"
                          : "ms-[55.5px] flex-grow"
                      } `}
                  >
                    <div className="bg-gray-100 h-screen">
                              <div></div>
                    </div>
                  </div>
          </div>
    </div>
  )
}

export default IndividualInstructors