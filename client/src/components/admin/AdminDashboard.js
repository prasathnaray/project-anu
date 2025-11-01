import React, {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "../navBar";
import SideBar from "../sideBar";
import { ClipboardPenLine, EllipsisIcon, EllipsisVerticalIcon, GraduationCap, LayoutDashboard, NotepadText, SlidersHorizontal } from "lucide-react";
import getDashboardAPI from "../../API/dashboardAPI";
import { Book01Icon, Calendar01Icon } from "hugeicons-react";
import BasicPie from "../../charts/PieChart";
import TargetedLearningChart from "../../charts/TargetedLearningChart";
import UsersA from "./DashboardComponents/UsersA";
import CourseA from "./DashboardComponents/CourseA";
import BatchA from "./DashboardComponents/BatchA";
import { useNavigate } from "react-router-dom";
// import { useNotifications } from '../../Hooks/useNotification';
function AdminDashboard(){
    // const { notifications, loading } = useNotifications();
    const navigate = useNavigate();
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    const [dashboardState, setDashboardState] = React.useState('dashboard');
    console.log(dashboardState);
    const [dashboardData, setDashboardData] = useState([])
    const [showw, setShoww] = useState(false);
    useEffect(() => {
        setShoww(true);
    }, [])
    const handleDashboardApi = async() => {
        try
        {   
            //const token = localStorage.getItem('user_token');
            const result = await getDashboardAPI();
            setDashboardData(result.data);
        }
        catch(err)
        {
            //console.log(err)
            if(err?.data?.status == 401)
            {
              navigate('/');
              return;
            }
            setDashboardData([]);
        }
    }
    useEffect(() => {
        handleDashboardApi()
        //console.log(dashboardData);
    }, [])
    console.log(dashboardData)
        // if (loading) return <p>Loading notifications...</p>;

        //DISABLE RIGHT cliCK
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
        } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
      >
        {/* <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                <button onClick={() => setDashboardState('dashboard')}  className="flex justify-between gap-2 items-center bg-[#8DC63F] px-2 py-[2px] rounded cursor-pointer text-gray-100 font-semibold hover:rounded-full transition-all ease-in-out duration-300">
                                      <span className="text-[13px]">Overview</span>
                                </button>
                                <button onClick={() => setDashboardState('users')} className="flex items-center gap-1 px-2 py-[2px] rounded hover:bg-[#8DC63F] hover:text-white cursor-pointer transition-all duration-300 ease-in-out hover:rounded">
                                      <span className="text-[13px]" >Users</span>
                                </button>
                                <button onClick={() => setDashboardState('courses')} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded">
                                      <span className="text-[13px]" >Course</span>
                                </button>
                                <button onClick={() => setDashboardState('batches')} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded-full">
                                      <span className="text-[13px]">Batch</span>
                                </button>
        </div> */}
        <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
            <button
              onClick={() => setDashboardState("dashboard")}
              className={`flex justify-between gap-2 items-center px-2 py-[2px] rounded cursor-pointer font-semibold transition-all ease-in-out duration-300 ${
                dashboardState === "dashboard"
                  ? "bg-[#8DC63F] text-white"
                  : "hover:bg-gray-100 hover:text-[#8DC63F]"
              }`}
            >
              <span className="text-[13px]">Overview</span>
            </button>

            <button
              onClick={() => setDashboardState("users")}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === "users"
                  ? "bg-[#8DC63F] text-white"
                  : "hover:bg-gray-100 hover:text-[#8DC63F]"
              }`}
            >
              <span className="text-[13px]">Users</span>
            </button>

            <button
              onClick={() => setDashboardState("courses")}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === "courses"
                  ? "bg-[#8DC63F] text-white"
                  : "hover:bg-gray-100 hover:text-[#8DC63F]"
              }`}
            >
              <span className="text-[13px]">Course</span>
            </button>

            {/* <button
              onClick={() => setDashboardState("batches")}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === "batches"
                  ? "bg-[#8DC63F] text-white"
                  : "hover:bg-gray-100 hover:text-[#8DC63F]"
              }`}
            >
              <span className="text-[13px]">Batch</span>
            </button> */}
          </div>
        {dashboardState == "dashboard" && (
          <div className={`px-3 grid grid-cols-3 gap-4 contentt ${showw ? 'visible' : ''} `}>
          <div className="border bg-white h-[calc(100vh-5rem)] overflow-y-auto mb-4 rounded-sm mt-3 col-span-2" style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                }}>
            <div className="m-2 flex gap-4 items-center">
              <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                 <LayoutDashboard size={21} />
              </div>
              <span className="text-lg text-gray-500">General Dashboard</span>
            </div>

            <div className="border border-t-1 border-r-0 border-l-0 border-b-0 p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="border p-2 rounded shadow-md cursor-pointer" onClick={() => navigate('/trainees')}>
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
                <div className="border p-2 shadow-md cursor-pointer" onClick={() => navigate('/instructors')}>
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
                <div className="border p-2 shadow-md cursor-pointer" onClick={() => navigate('/batch')}>
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
            <div className="my-2 mx-5 text-lg" style={{ fontWeight: 'bold', color: '#4B5563' }}>Gender Population</div>
            <div className="flex justify-center items-center">
              <div className="ms-5">
                 <BasicPie />
              </div>
            </div>
            <div className="my-2 mx-5 text-lg" style={{ fontWeight: 'bold', color: '#4B5563' }}>Targeted Learning v Batch Ratio</div>
            <div className="flex justify-center items-center">
              <div className="ms-5">
                 <TargetedLearningChart targetedLearning={dashboardData} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-3  h-[calc(100vh-5rem)]">
              <div className="border bg-white rounded-sm p-3 flex-1 overflow-y-auto "
                style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                }}
              >
                <div className="flex gap-4 items-center mb-2">
                  <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                    <Book01Icon size={20} />
                  </div>
                  <span className="text-lg text-gray-500">All Courses</span>
                </div>
                {/* <div className="flex items-center justify-center py-8 text-gray-500">
                      <img src={'https://ims-traktor.web.app/img/no-events.25d14767.svg'} className="w-[60%]"/>
                </div> */}
                {(dashboardData?.CourseDataList || []).map((data, index) => (
                    <div className="border grid grid-cols-4 py-6 px-1 mt-3 gap-4 rounded bg-white">
                          <div className="col-span-2 flex justify-between item-center">
                                <EllipsisVerticalIcon size={20} className="text-gray-500"/>
                                <span className="sm:text-xs bg-[#8DC63F] flex items-center text-white rounded-full px-2"><button onClick={() => navigate(`/chapters/${data.course_id}`)}>View Chapters</button></span>
                          </div>
                          <div className="col-span-2 flex justify-end items-center gap-4">
                              <span className="sm:text-sm rounded-full px-2 font-semibold text-gray-500">{data?.course_name}</span>
                          </div>
                    </div>
                ))}
              </div>
                <div className="border bg-white rounded-sm p-3 flex-1 overflow-y-auto"
                style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                }}
                >
                  <div className="flex gap-4 items-center mb-2">
                    <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                      <NotepadText size={21} />
                    </div>
                    <span className="text-lg text-gray-500">Recent Activity</span>
                  </div>
                  <div className="flex items-center justify-center py-8 text-gray-500">
                        <img src={'https://ims-traktor.web.app/img/no-events.25d14767.svg'} className="w-[60%]"/>
                  </div>
                </div>
              </div>
        </div>
        )}
        {dashboardState == "users" && (
          <UsersA APIS={dashboardData?.BatchPerUserList}/>
        )}
        {dashboardState == "courses" && (
          <CourseA />
        )}
        {/* {dashboardState == "batches" && (
          <BatchA />
        )} */}
      </div>
    </div> 
  </div>
);
}
export default AdminDashboard;