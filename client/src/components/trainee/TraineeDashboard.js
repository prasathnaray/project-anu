import React from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';

function TraineeDashboard() {
  return (
    <div className={`flex`}>
                <div>
                    <SideBar /> 
                </div>
                <div className="ms-[221px] flex-grow">
                        <div>
                                <NavBar />
                        </div>
                </div>
    </div>
  )
}

export default TraineeDashboard;