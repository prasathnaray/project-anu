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
import { SlidersHorizontal, CalendarDays, ChevronLeft, ChevronRight, CalendarCheck2 } from 'lucide-react';
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
  const upcomingEvents = [...events]
    .filter((event) => new Date(event.start) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);
  const formatEventDate = (date) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date));

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
    const eventId = info?.event?.id || info?.schedule?.id || info?.id;
    if (eventId) {
      navigate(`/batch/${eventId}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />
      <div className="flex flex-grow">
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        <div
          className={`${
            buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
          } flex-grow overflow-y-auto bg-[#f7f8f5] h-[calc(100vh-3rem)] transition-all`}
        >
          <style>{`
            .lms-schedule-calendar .toastui-calendar-layout { border: 0 !important; border-radius: 10px; overflow: hidden; }
            .lms-schedule-calendar .toastui-calendar-day-name-item { color: #64746a !important; font-weight: 700; }
            .lms-schedule-calendar .toastui-calendar-grid-cell-date { color: #526158 !important; font-weight: 600; }
            .lms-schedule-calendar .toastui-calendar-grid-cell-date.toastui-calendar-grid-cell-date-today { color: #638f25 !important; }
            .lms-schedule-calendar .toastui-calendar-grid-cell-more-events { color: #719f2c !important; font-weight: 700; }
            .lms-schedule-calendar .toastui-calendar-panel-event { border-radius: 7px !important; box-shadow: 0 3px 8px -6px rgba(72,104,30,.75); }
          `}</style>
          <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 xl:px-12">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"><span>LMS workspace</span><span className="text-[#8DC63F]">/</span><span>Schedules</span></div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Schedule</h1><p className="mt-1 text-sm text-slate-500">Plan and review targeted learning activity.</p></div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-[#8DC63F]" />{events.length} scheduled {events.length === 1 ? 'activity' : 'activities'}</div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div><h2 className="text-sm font-bold text-slate-800">Learning calendar</h2><p className="mt-1 text-xs text-slate-500">{currentDate.toLocaleString('en-us', { month: 'long', year: 'numeric' })}</p></div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg border border-slate-200 p-0.5"><button onClick={handlePrev} aria-label="Previous period" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-[#8DC63F]/10 hover:text-[#638f25]"><ChevronLeft size={16} /></button><button onClick={handleToday} className="px-2 text-xs font-semibold text-slate-600 transition hover:text-[#638f25]">Today</button><button onClick={handleNext} aria-label="Next period" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-[#8DC63F]/10 hover:text-[#638f25]"><ChevronRight size={16} /></button></div>
                    <div className="flex rounded-lg bg-slate-100 p-0.5"><button onClick={() => setView('month')} className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${view === 'month' ? 'bg-white text-[#638f25] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><CalendarDays size={13} /> Month</button><button onClick={() => setView('week')} className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${view === 'week' ? 'bg-white text-[#638f25] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><SlidersHorizontal size={13} /> Week</button></div>
                  </div>
                </div>
                <div className="lms-schedule-calendar overflow-x-auto p-2 sm:p-4"><Calendar ref={calendarRef} height="680px" usageStatistics={false} view={view} calendars={[{ id: '1', name: 'Targeted Learning', color: '#fff', bgColor: '#8DC63F' }]} events={events} onClickEvent={handleEventClick} onClickSchedule={handleEventClick} /></div>
              </section>

              <aside className="h-fit rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold text-slate-800">Upcoming learning</h2><p className="mt-1 text-xs text-slate-500">Your next scheduled activities</p></div>
                <div className="divide-y divide-slate-100">
                  {upcomingEvents.length > 0 ? upcomingEvents.map((event) => <button key={event.id} onClick={() => handleEventClick({ event })} className="block w-full px-5 py-4 text-left transition hover:bg-[#8DC63F]/[0.04]"><div className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#8DC63F] ring-4 ring-[#8DC63F]/10" /><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-700">{event.title}</div><div className="mt-1 text-xs text-slate-400">{formatEventDate(event.start)} · Targeted learning</div></div></div></button>) : <div className="px-5 py-10 text-center"><CalendarCheck2 size={22} className="mx-auto mb-3 text-[#8DC63F]" /><p className="text-sm font-semibold text-slate-600">No upcoming activity</p><p className="mt-1 text-xs leading-5 text-slate-400">Scheduled learning will appear here.</p></div>}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;
