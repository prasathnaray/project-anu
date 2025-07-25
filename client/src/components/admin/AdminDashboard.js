import React, {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "../navBar";
import SideBar from "../sideBar";
import { ClipboardPenLine, GraduationCap, LayoutDashboard, NotepadText } from "lucide-react";
import getDashboardAPI from "../../API/dashboardAPI";
function AdminDashboard(){
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
    const [dashboardData, setDashboardData] = useState([])
    const handleDashboardApi = async() => {
        try
        {   
            const token = localStorage.getItem('user_token');
            const result = await getDashboardAPI(token);
            setDashboardData(result.data);
        }
        catch(err)
        {
            console.log(err)
        }
    }
    useEffect(() => {
        handleDashboardApi()
        //console.log(dashboardData);
    }, [])
    console.log(dashboardData)
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
                                                                                <div className="border p-2 rounded">
                                                                                       <span className="font-semibold px-2">Trainees (in total)</span>
                                                                                       <div className="flex justify-between items-center px-2 pt-5">
                                                                                                    <div className="text-[#8DC63F]"><GraduationCap size={43}/></div>
                                                                                                    <div className="text-3xl text-gray-600">{dashboardData[1]?.count || 0}</div>
                                                                                       </div>
                                                                                </div>
                                                                                <div className="border p-2 ">
                                                                                        <span className="font-semibold">Instrutors (in total)</span>
                                                                                         <div className="flex justify-between items-center px-2 pt-5">
                                                                                                    <div className="text-[#8DC63F]"><ClipboardPenLine size={43}/></div>
                                                                                                    <div className="text-3xl text-gray-600">{dashboardData[0]?.count || 0}</div>
                                                                                         </div>
                                                                                </div>
                                                                                <div className="border p-2">
                                                                                        <span className="font-semibold">Batches (in total)</span>
                                                                                         <div className="flex justify-between items-center px-2 pt-5">
                                                                                                    <div className="text-[#8DC63F]"><GraduationCap size={43}/></div>
                                                                                                    <div className="text-3xl text-gray-600">80</div>
                                                                                         </div>
                                                                                </div>
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