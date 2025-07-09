import React, {useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';
import { LayoutDashboard } from 'lucide-react';

function TraineeDashboard() {
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
  return (
    
    <div className={`flex`}>
                <div>
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/> 
                </div>
                <div className={`${
          buttonOpen === true
            ? "ms-[221px] flex-grow"
            : "ms-[85.5px] flex-grow"
        } `}>
                        <div>
                                <NavBar />
                        </div>
                        <div className="bg-gray-100 h-screen">
                                <div className="px-2 grid grid-cols-2 gap-4">
                                        <div className="border bg-white rounded-sm mt-3">
                                              <div className="m-2 flex gap-4 items-center">
                                                <div className="text-white bg-[#8DC63F] p-2 rounded-full"><LayoutDashboard size={21}/></div>
                                                <span className="text-lg text-gray-500">General Dashboard</span>
                                              </div>
                                              <div className="">

                                              </div>
                                        </div>
                                        <div className="border bg-white rounded-sm mt-3">
                                              <div></div>
                                        </div>
                                </div>
                        </div>
                </div>
    </div>
  )
}

export default TraineeDashboard;