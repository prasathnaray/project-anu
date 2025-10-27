import React from 'react'
import NavBar from '../navBar';
import SideBar from '../sideBar';

function SuperAdminDashboard() {
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
    };
  return (
    <div className={'flex flex-col min-h-screen'}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                        <NavBar />
            </div>
            <div className="flex flex-grow pt-12">
                    <div>
                            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                    </div>
                    <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div className="px-10 grid grid-cols-3 gap-4">

                            </div>
                    </div>
            </div>
    </div>
  )
}

export default SuperAdminDashboard;