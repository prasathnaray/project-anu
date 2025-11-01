// import React from 'react'
// import {jwtDecode} from 'jwt-decode';
// import { Navigate, useNavigate } from 'react-router-dom';
// import NavBar from '../components/navBar';
// import SideBar from '../components/sideBar';
// import { LayoutDashboard, List, Notebook, SlidersHorizontal } from 'lucide-react';
// import Calendar  from '@toast-ui/react-calendar';
// import '@toast-ui/calendar/dist/toastui-calendar.min.css';
// import GetTarLearningAPI from '../API/GetTarLearningAPI';
// import GetIndTargetedLearning from '../API/GetIndTargetedLearning';
// function Schedules() {
//     //eventchange in calender 
//     const [view, setView] = React.useState('month')
//     const [events, setEvents] = React.useState([]);
//     const [buttonOpen, setButtonOpen] = React.useState(true);
//         const handleButtonOpen = () => {
//                 setButtonOpen(!buttonOpen);
//         };
//         const [tarList, setTarList] = React.useState([])
//         const handleTarList = async() => {
//                 if(jwtDecode(localStorage.getItem('user_token')).role != 101)
//                 {
//                         return;
//                 }
//                 try
//                 {
//                          let token = localStorage.getItem('user_token')
//                          const response = await GetTarLearningAPI(token);
//                          const data = response.data;
//                         const formattedEvents = data.map((item) => ({
//                                 id: item.target_learning_id,
//                                 calendarId: "1",
//                                 title: item.tar_name,
//                                 category: "time",
//                                 start: item.start_date.split("T")[0] + 'T00:00:00',
//                                 // end: new Date(item.end_date).toISOString().slice(0, 16),
//                                 end: item.end_date.split("T")[0] + 'T23:59:59',
//                                 isAllDay: true,
//                                 category: "allday",
//                         }));
//                         setTarList(data);
//                         setEvents(formattedEvents);
//                          //console.log(response);
//                 }
//                 catch(err)
//                 {
//                         console.log(err)
//                 }
//         }

//         const handleIndTarList = async() => {
//                 if(jwtDecode(localStorage.getItem('user_token')).role != 103)
//                 {
//                         return;
//                 }
//                 try
//                 {
//                          let token = localStorage.getItem('user_token')
//                          const response = await GetIndTargetedLearning(token);
//                          const data = response.data.result;
//                         const formattedEvents = data.map((item) => ({
//                                 id: item.target_learning_id,
//                                 calendarId: "1",
//                                 title: item.tar_name,
//                                 category: "time",
//                                 start: item.start_date.split("T")[0] + 'T00:00:00',
//                                 // end: new Date(item.end_date).toISOString().slice(0, 16),
//                                 end: item.end_date.split("T")[0] + 'T23:59:59',
//                                 isAllDay: true,
//                                 category: "allday",
//                         }));
//                         setTarList(data);
//                         setEvents(formattedEvents);
//                          //console.log(response);
//                 }
//                 catch(err)
//                 {
//                         console.log(err)
//                 }
//         }
//           React.useEffect(() => {
//                 handleIndTarList()
//           }, [])
//           React.useEffect(() => {
//                 handleTarList();
//           }, []);
//     let token = localStorage.getItem('user_token');
//     const navigate = useNavigate();
//     if (!token) {
//         return <Navigate to="/" replace />;
//     }
//     const decoded = jwtDecode(token);
//     if (decoded.role != 101 && decoded.role != 102 && decoded.role !=103 ) {
//         return <Navigate to="/" replace />;
//     }
//   return (
//     <div className={`flex flex-col min-h-screen`}>
//                 <div>
//                         <NavBar />
//                 </div>
//                 <div className="flex flex-grow">
//                         <div>
//                                 <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>
//                         </div>
//                         <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
//                                 <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px] hover:underline hover:underline-offset-4"><button onClick={() => {navigate('/batch')}}>batch</button></span></div>
//                                 <div className="bg-gray-100">
//                                                 <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
//                                                         <button onClick={() => setView('month')} className="flex justify-between gap-2 items-center bg-[#8DC63F] px-2 py-[2px] rounded cursor-pointer text-gray-100 font-semibold hover:rounded-full transition-all ease-in-out duration-300">
//                                                         <LayoutDashboard size={15} /> 
//                                                                 <span className="text-[13px]">Monthly</span>
//                                                         </button>
//                                                         <button onClick={() => setView('week')} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded-full">
//                                                         <SlidersHorizontal size={15} className="text-gray-600" />
//                                                                 <span className="text-[13px]">Weekly</span>
//                                                         </button>
//                                                 </div>
//                                                 <div className="px-2 py-2">
//                                                                          <Calendar 
//                                                                                 view={view} 
//                                                                                 height="700px"
//                                                                                 usageStatistics={false} 
//                                                                                 calendars=
//                                                                                 {[
//                                                                                                 { id: '1', name: 'Work', color: '#ffffff', bgColor: '#9e5fff' },
//                                                                                 ]}
//                                                                                  events={events}
//                                                                         />
//                                                 </div>
//                                 </div>     
//                         </div>
//                 </div>
//     </div>
//   )
// }
// export default Schedules;

import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { LayoutDashboard, Notebook, SlidersHorizontal, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import GetTarLearningAPI from '../API/GetTarLearningAPI';
import GetIndTargetedLearning from '../API/GetIndTargetedLearning';

function Schedules() {
  const [view, setView] = React.useState('month');
  const [events, setEvents] = React.useState([]);
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const calendarRef = React.useRef();
  const navigate = useNavigate();

  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const handleTarList = async () => {
    if (jwtDecode(localStorage.getItem('user_token')).role != 101) return;
    try {
      const token = localStorage.getItem('user_token');
      const response = await GetTarLearningAPI(token);
      const data = response.data;
      const formattedEvents = data.map((item) => ({
        id: item.target_learning_id,
        calendarId: '1',
        title: item.tar_name,
        start: item.start_date.split('T')[0] + 'T00:00:00',
        end: item.end_date.split('T')[0] + 'T23:59:59',
        isAllDay: true,
        category: 'allday',
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  const handleIndTarList = async () => {
    if (jwtDecode(localStorage.getItem('user_token')).role != 103) return;
    try {
      const token = localStorage.getItem('user_token');
      const response = await GetIndTargetedLearning(token);
      const data = response.data.result;
      const formattedEvents = data.map((item) => ({
        id: item.target_learning_id,
        calendarId: '1',
        title: item.tar_name,
        start: item.start_date.split('T')[0] + 'T00:00:00',
        end: item.end_date.split('T')[0] + 'T23:59:59',
        isAllDay: true,
        category: 'allday',
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    handleIndTarList();
    handleTarList();
  }, []);

  let token = localStorage.getItem('user_token');
  if (!token) return <Navigate to="/" replace />;
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 102 && decoded.role !=103) {
      return <Navigate to="/" replace />;
  }

  // 🔹 Navigate calendar
  const handlePrev = () => {
    const calendar = calendarRef.current.getInstance();
    calendar.prev();
    setCurrentDate(new Date(calendar.getDate()));
  };

  const handleNext = () => {
    const calendar = calendarRef.current.getInstance();
    calendar.next();
    setCurrentDate(new Date(calendar.getDate()));
  };

  const handleToday = () => {
    const calendar = calendarRef.current.getInstance();
    calendar.today();
    setCurrentDate(new Date());
  };

  // 🔹 Event click handler
  const handleEventClick = (info) => {
    const { title, start, end } = info.event;
    alert(
      `📚 ${title}\n\n🕒 Start: ${new Date(start.d.d).toLocaleString()}\n🕒 End: ${new Date(end.d.d).toLocaleString()}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-grow">
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        <div
          className={`${
            buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
          } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
        >
          <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
            <LayoutDashboard size={15} /> Dashboard / <Notebook size={15} />{' '}
            <span className="text-[15px] hover:underline hover:underline-offset-4">
              <button onClick={() => navigate('/batch')}>batch</button>
            </span>
          </div>

          {/* 🔹 Calendar Toolbar */}
          <div className="flex justify-between items-center bg-white px-4 py-3 border-b">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Today
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              {currentDate.toLocaleString('en-us', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                  view === 'month'
                    ? 'bg-[#8DC63F] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <CalendarDays size={15} /> Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                  view === 'week'
                    ? 'bg-[#8DC63F] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal size={15} /> Week
              </button>
            </div>
          </div>

          {/* 🔹 Calendar */}
          <div className="px-3 py-3 bg-gray-100">
            <Calendar
              ref={calendarRef}
              height="700px"
              usageStatistics={false}
              view={view}
              calendars={[
                { id: '1', name: 'Targeted Learning', color: '#fff', bgColor: '#8DC63F' },
              ]}
              events={events}
              onClickSchedule={handleEventClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;