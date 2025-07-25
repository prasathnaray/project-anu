import React, {useState} from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "../navBar";
import SideBar from "../sideBar";
import { LayoutDashboard } from "lucide-react";
function AdminDashboard(){
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
                            <div className={'bg-gray-100 h-screen'}>
                                        <div className="px-2 grid grid-cols-3 gap-4"> 
                                                <div className="border bg-white rounded-sm mt-3 col-span-2">
                                                            <div className="m-2 flex gap-4 items-center">
                                                                        <div className="text-white bg-[#8DC63F] p-2 rounded-full"><LayoutDashboard size={21}/></div>
                                                                        <span className="text-lg text-gray-500">General Dashboard</span>
                                                            </div>
                                                            <div className="border border-t-1 border-r-0 border-l-0 border-b-0 p-4">
                                                                        <div className="grid grid-cols-3 gap-4">
                                                                                <div className="border p-2 bg-blue-100">sodfj</div>
                                                                                <div className="border p-2 bg-blue-100">dh</div>
                                                                                <div className="border p-2 bg-blue-100">skfj</div>
                                                                        </div>
                                                            </div>
                                                </div>
                                        </div>
                            </div>
                </div>
        </div>
    )
}
export default AdminDashboard;