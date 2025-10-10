import React from 'react'
import {jwtDecode} from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
function Schedules() {

    const [buttonOpen, setButtonOpen] = React.useState(true);
        const handleButtonOpen = () => {
                setButtonOpen(!buttonOpen);
        };
    let token = localStorage.getItem('user_token');
    if (!token) {
        return <Navigate to="/" replace />;
    }
    const decoded = jwtDecode(token);
    if (decoded.role != 101 && decoded.role != 102) {
        return <Navigate to="/" replace />;
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
                </div>
    </div>
  )
}

export default Schedules;