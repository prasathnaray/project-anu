import React, {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "../navBar";
import SideBar from "../sideBar";
import { ClipboardPenLine, GraduationCap, LayoutDashboard, NotepadText } from "lucide-react";
import getDashboardAPI from "../../API/dashboardAPI";
import { Calendar01Icon } from "hugeicons-react";
import BasicPie from "../../charts/PieChart";
// import { useNotifications } from '../../Hooks/useNotification';
function AdminDashboard(){
    // const { notifications, loading } = useNotifications();
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
        // if (loading) return <p>Loading notifications...</p>;

    return (
  <div className="flex flex-col min-h-screen">
    <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
      <NavBar />
    </div>
    <div className="flex flex-grow pt-12">
      <div>
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
      </div>
      <div
        className={`${
          buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
        } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`} // 3rem = 12 (navbar height)
      >
        <div className="px-10 grid grid-cols-3 gap-4">
          <div className="border bg-white rounded-sm mt-3 col-span-2">
            <div className="m-2 flex gap-4 items-center">
              <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                <LayoutDashboard size={21} />
              </div>
              <span className="text-lg text-gray-500">General Dashboard</span>
            </div>

            <div className="border border-t-1 border-r-0 border-l-0 border-b-0 p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="border p-2 rounded shadow-md">
                  <span className="font-semibold px-2">Trainees (in total)</span>
                  <div className="flex justify-between items-center px-2 pt-5">
                    <div className="text-[#8DC63F]">
                      <GraduationCap size={43} />
                    </div>
                    <div className="text-3xl text-gray-600">
                      {dashboardData?.getTraineesIns?.rows[1]?.count || 0}
                    </div>
                  </div>
                </div>
                <div className="border p-2 shadow-md">
                  <span className="font-semibold">Instructors (in total)</span>
                  <div className="flex justify-between items-center px-2 pt-5">
                    <div className="text-[#8DC63F]">
                      <ClipboardPenLine size={43} />
                    </div>
                    <div className="text-3xl text-gray-600">
                      {dashboardData?.getTraineesIns?.rows[0]?.count || 0}
                    </div>
                  </div>
                </div>
                <div className="border p-2 shadow-md">
                  <span className="font-semibold">Batches (in total)</span>
                  <div className="flex justify-between items-center px-2 pt-5">
                    <div className="text-[#8DC63F]">
                      <GraduationCap size={43} />
                    </div>
                    <div className="text-3xl text-gray-600">
                      {dashboardData?.getBatchDas?.rows[0]?.count || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-2 mx-5 text-lg">Gender Population</div>
            <div className="flex justify-start items-center">
              <div className="ms-5">
                <BasicPie />
              </div>
            </div>
          </div>
          <div className="border bg-white rounded-sm mt-3">
                <div className="m-2 flex gap-4 items-center">
                  <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                    <Calendar01Icon size={21} />
                  </div>
                  <span className="text-lg text-gray-500">Approvals</span>
                </div>
                <div className="flex items-center justify-center">
                      No data to show
                </div>
          </div>
        </div>
      </div>
    </div> 
  </div>
);

}
export default AdminDashboard;