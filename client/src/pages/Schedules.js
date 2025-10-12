import React from 'react'
import {jwtDecode} from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { LayoutDashboard, List, Notebook, SlidersHorizontal } from 'lucide-react';
import Calendar  from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import GetTarLearningAPI from '../API/GetTarLearningAPI';
function Schedules() {
    //eventchange in calender 
    const [view, setView] = React.useState('month')
    const [events, setEvents] = React.useState([]);
    const [buttonOpen, setButtonOpen] = React.useState(true);
        const handleButtonOpen = () => {
                setButtonOpen(!buttonOpen);
        };
        const [tarList, setTarList] = React.useState([])
        const handleTarList = async() => {
                try
                {
                         let token = localStorage.getItem('user_token')
                         const response = await GetTarLearningAPI(token);
                         const data = response.data;
                        const formattedEvents = data.map((item) => ({
                                id: item.target_learning_id,
                                calendarId: "1",
                                title: item.tar_name,
                                category: "time",
                                start: item.start_date,
                                end: item.end_date,
                        }));
                        setTarList(data);
                        setEvents(formattedEvents);
                         //console.log(response);
                }
                catch(err)
                {
                        console.log(err)
                }
        }
          React.useEffect(() => {
                         handleTarList();
          }, []);
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
                        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                                <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px] hover:underline hover:underline-offset-4"><a href={`/course`}>Course</a></span> / <List size={15}/> <a href={`${localStorage.getItem('last_page_visited')}`} className="text-[15px] hover:underline hover:underline-offset-4">Chapters</a></div>
                                <div className="bg-gray-100">
                                                <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                                        <button onClick={() => setView('month')} className="flex justify-between gap-2 items-center bg-[#8DC63F] px-2 py-[2px] rounded cursor-pointer text-gray-100 font-semibold hover:rounded-full transition-all ease-in-out duration-300">
                                                        <LayoutDashboard size={15} /> 
                                                                <span className="text-[13px]">Monthly</span>
                                                        </button>
                                                        <button onClick={() => setView('week')} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded-full">
                                                        <SlidersHorizontal size={15} className="text-gray-600" />
                                                                <span className="text-[13px]">Weekly</span>
                                                        </button>
                                                </div>
                                                <div className="px-2 py-2">
                                                                         <Calendar 
                                                                                view={view} 
                                                                                height="700px"
                                                                                usageStatistics={false} 
                                                                                calendars=
                                                                                {[
                                                                                                { id: '1', name: 'Work', color: '#ffffff', bgColor: '#9e5fff' },
                                                                                ]}
                                                                                 events={events}
                                                                        />
                                                </div>
                                </div>     
                        </div>
                </div>
    </div>
  )
}
export default Schedules;