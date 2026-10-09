import React, { useEffect, useState } from 'react';
import { Award, BarChart, BookCheck, BookOpen, Calendar, ChevronLeft, ClipboardPenLine, GraduationCap, RotateCcw, Scan, School, UsersRound, Video } from 'lucide-react';
import logo from '../assets/image (3).png';
import MaterialRipple from "material-ripple-effects";
import {
  Notification03Icon,
  UserSharingIcon,
  Megaphone01Icon,
  Search02Icon,
  UserSettings01Icon,
  Logout01Icon,
  CourseIcon,
  MarketAnalysisIcon,
  Mortarboard02Icon,
  ChartBarLineIcon,
  UserIcon,
  Message01Icon,
  StudentCardIcon,
  Presentation01Icon,
  ChartRoseIcon,
} from "hugeicons-react";
import { ChevronRight } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookText, MessageSquareText, User, ChartPie, Notebook, Network } from 'lucide-react';
function SideBar({ handleButtonOpen, buttonOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ripple = new MaterialRipple();
  const [tokdata, setTokData] = useState({});
  const token = jwtDecode(localStorage.getItem('user_token'));
  useEffect(() => {
    if (localStorage.getItem('user_token')) {
    }
    setTokData(token);
  }, []);
  const data = location.pathname;
  const roleName = { 99: "Super Admin", 101: "Admin", 102: "Instructor", 103: "Learner" }[tokdata.role] || "LMS User";
  const isCoursePath = data === "/certificate" ||
    data.startsWith("/chapters/") ||
    data.startsWith("/module/") ||
    data.startsWith("/cert-course/") ||
    data.startsWith("/resource/");
  // console.log(data)
  return (
    <div className={`lms-sidebar fixed left-0 top-[50px] z-40 flex h-[calc(100vh-3rem)] flex-col overflow-visible border-r border-[#e1ead8] bg-[#fbfdf9] text-slate-800 shadow-[10px_0_35px_-24px_rgba(72,104,30,0.45)] backdrop-blur-xl transition-all duration-300 ${buttonOpen === false
        ? "w-[55px] max-md:-translate-x-full md:translate-x-0"
        : "w-[270px] translate-x-0 md:w-[220px]"
      }`}>
      <div className="relative">
        <div
          className={`absolute top-20 left-0 ${buttonOpen === false ? "left-9" : "left-[185px]"
            } z-50 rounded-full border border-[#cfe3bb] bg-white p-1 text-[#719f2c] shadow-[0_8px_18px_-8px_rgba(72,104,30,0.45)] transition hover:scale-105`}
        >
          <button onClick={() => handleButtonOpen()} aria-label={buttonOpen === false ? "Expand sidebar" : "Collapse sidebar"} className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-[#8DC63F]/10">
            {buttonOpen === false ? <ChevronRight size={16} /> : <ChevronLeft size={17} />}
          </button>
        </div>
      </div>
      <div className={`${buttonOpen === false ? "md:px-[5px] pt-5" : "md:px-[14px] pt-5"} border-b border-[#e5eee0] pb-5`}>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          title="ANU Learning Hub"
          aria-label="ANU Learning Hub"
          className="w-full flex justify-center transition hover:opacity-80 cursor-pointer"
        >
          <img src={logo} alt="ANU Learning Hub" className="w-full h-auto max-h-10 object-contain" />
        </button>
        {buttonOpen !== false && (
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            title="ANU Learning Hub"
            aria-label="ANU Learning Hub"
            className="mt-4 w-full flex items-center gap-2 rounded-2xl border border-[#dfead5] bg-white pl-2.5 pr-8 py-2 text-left shadow-[0_8px_18px_-16px_rgba(72,104,30,0.55)] transition hover:bg-[#f6faf1] hover:border-[#cfe3bb] cursor-pointer"
          >
            <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-xl bg-[#edf6df] text-[#719f2c]">
              <GraduationCap size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold tracking-tight text-slate-700 whitespace-nowrap overflow-visible">
                ANU Learning Hub
              </div>
              <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.03em] text-[#719f2c] whitespace-nowrap">
                Learning workspace
              </div>
            </div>
          </button>
        )}
      </div>
      <style>{`
        .lms-sidebar ul button { border: 1px solid transparent; border-radius: 14px; color: #64746a !important; transition: background-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease; }
        .lms-sidebar ul button:hover:not([class*=" bg-[#8DC63F]"]) { background: #ffffff !important; border-color: #e0ead8; color: #638f25 !important; transform: translateX(2px); box-shadow: 0 7px 18px -16px rgba(72,104,30,.7); }
        .lms-sidebar ul button[class*=" bg-[#8DC63F]"] { background: #eef8e5 !important; border-color: #d4e9bd; color: #527a1f !important; box-shadow: 0 9px 22px -17px rgba(72,104,30,.75); position: relative; }
        .lms-sidebar ul button[class*=" bg-[#8DC63F]"]::before { content: ""; position: absolute; left: -1px; top: 8px; bottom: 8px; width: 3px; border-radius: 0 6px 6px 0; background: #8DC63F; box-shadow: 0 0 12px rgba(141,198,63,.4); }
        .lms-sidebar ul button[class*=" bg-[#8DC63F]"] svg { color: #719f2c; }
        .lms-sidebar ul button:focus-visible { outline: 3px solid rgba(141, 198, 63, .28); outline-offset: 2px; }
        .lms-sidebar ul { scrollbar-width: thin; scrollbar-color: #d6e5c6 transparent; }
        @media (max-width: 767px) {
          [class*="ms-[221px]"], [class*="ms-[55.5px]"] { margin-left: 0 !important; }
          .lms-sidebar { height: calc(100vh - 3rem); }
          .lms-sidebar::after { content: ""; position: fixed; inset: 0; z-index: -1; background: rgba(15, 23, 42, .18); pointer-events: none; }
        }
      `}</style>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={`${buttonOpen === false ? "hidden" : "px-7 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#789383]"}`}>Navigation</div>
        <ul className={`${buttonOpen === false ? "py-3 px-[7px]" : "py-4 px-7"}`}>

          {tokdata.role == 99 &&
            <>
              <li className={`${buttonOpen === false ? "hidden" : "mb-2 mt-1 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#789383]"}`}>Learning operations</li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/dashboard")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 ${
                    data === "/dashboard"
                      ? "bg-[#8DC63F] text-white shadow-[0_8px_18px_-10px_rgba(99,143,37,0.9)] ring-1 ring-[#8DC63F]/20"
                      : "text-gray-500 hover:translate-x-0.5 hover:bg-[#8DC63F]/10 hover:text-[#638f25]"
                  }`}
                >
                  <LayoutDashboard size={20} />
                  <div className={`${buttonOpen === false ? 'hidden' : 'text-md'}`}>Dashboard</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/curriculum")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 ${
                    data === "/curriculum"
                      ? "bg-[#8DC63F] text-white shadow-[0_8px_18px_-10px_rgba(99,143,37,0.9)] ring-1 ring-[#8DC63F]/20"
                      : "text-gray-500 hover:translate-x-0.5 hover:bg-[#8DC63F]/10 hover:text-[#638f25]"
                  }`}
                >
                  <BookOpen size={20} />
                  <div className={`${buttonOpen === false ? 'hidden' : 'text-md'}`}>Curriculum</div>
                </button>
              </li>
              <li className={`${buttonOpen === false ? "hidden" : "mb-2 mt-5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#789383]"}`}>Content & delivery</li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/certificate")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 ${
                    isCoursePath
                      ? "bg-[#8DC63F] text-white shadow-[0_8px_18px_-10px_rgba(99,143,37,0.9)] ring-1 ring-[#8DC63F]/20"
                      : "text-gray-500 hover:translate-x-0.5 hover:bg-[#8DC63F]/10 hover:text-[#638f25]"
                  }`}
                >
                  <Award size={22} strokeWidth={2.2} className="shrink-0" />
                  <div className={`${buttonOpen === false ? 'hidden' : 'text-md'}`}>Certifications</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/volume-management")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                        ${data === "/volume-management"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <MessageSquareText size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Volumes</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/course-mapping")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200
                        ${data === "/course-mapping"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <Network size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Course Mapping</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/reatt-data")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200
                        ${data === "/reatt-data"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <RotateCcw size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Reattempts</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/academics")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                        ${data === "/academics"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <School size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Academics</div>
                </button>
              </li>
            </>
          }
          {/* {tokdata.role == 103 && 
                  ["dashboard", "schedules", "Queries", "Batch"].map((route,i) => {
                    const items = [
                      {icon: <LayoutDashboard size={20}/>, label: "Dashboard" },
                      // { icon: <CourseIcon size={20}/>, label: "Certificates" },
                      {icon: <Calendar size={20}/>, label: "Schedules"},
                      {icon: <ClipboardPenLine size={20}/>, label: "Queries"},
                      {icon: <Users size={20}/>, label: "Batch"},
                    ];
                    return (
                      <li key={route}
                        className={`${data===`/${route}` 
                          ? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-2 mt-2' 
                          : 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-2 mt-2'}`}
                        onMouseDown={(e) => ripple.create(e,"dark","circle")}
                      >
                        <a href={`/${route}`} className={`${data===`/${route}` ? 'text-white flex gap-5' : 'flex justify-between items-center gap-5 text-gray-500'}`}>
                          {items[i].icon}
                          <div className={`${buttonOpen === false ? 'hidden' : 'text-md'}`}>
                            {items[i].label}
                          </div>
                        </a>
                      </li>
                    )
                  })
              } */}

          {/* the above features are for role 103 below is the updated one */}
          {tokdata.role == 103 &&
            ["dashboard", "my-learning", "schedules", "Queries", "Batch", "vrspace"].map((route, i) => {
              const items = [
                { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                { icon: <BookOpen size={20} />, label: "My Learning" },
                // {icon:  <BarChart size={20}/>, label: "My Progress" },
                { icon: <Calendar size={20} />, label: "Schedules" },
                { icon: <ClipboardPenLine size={20} />, label: "Queries" },
                { icon: <UsersRound size={20} />, label: "Batch" },
                { icon: <Video size={20} />, label: "Streams" },
              ];
              // const isActive = data === `/${route}` || data.startsWith(`/${route}/`);
              const isActive =
                data.toLowerCase() === `/${route.toLowerCase()}` ||
                data.toLowerCase().startsWith(`/${route.toLowerCase()}/`);
              return (
                <li key={route} className="mb-2 mt-2">
                  <button
                    onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                    onClick={() => navigate(`/${route}`)}
                    className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200
                          ${isActive
                        ? "bg-[#8DC63F] text-white"
                        : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                      }`}
                  >
                    {items[i].icon}
                    <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>
                      {items[i].label}
                    </div>
                  </button>
                </li>
              );
            })
          }
          {tokdata.role == 101 &&
            <>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/dashboard")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/dashboard"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <LayoutDashboard size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Dashboard</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/batch")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/batch" || data.startsWith("/batch/")
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <UsersRound size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Batch</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/instructors")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/instructors" || data.startsWith('/instructor')
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <Presentation01Icon size={20} strokeWidth={1.8} className="shrink-0" />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Instructors</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/trainees")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/trainees" || data.startsWith("/trainee")
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <StudentCardIcon size={20} strokeWidth={1.8} className="shrink-0" />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Trainees</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/schedules")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/schedules"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <Calendar size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Schedules</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/certificate")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/certificate" ||
                      data.startsWith("/chapters/") ||
                      data.startsWith("/module/") ||
                      data.startsWith("/cert-course/") ||
                      data.startsWith("/resource/")
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <Award size={22} strokeWidth={2.2} className="shrink-0" />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Certifications</div>
                </button>
              </li>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/vrspace")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${data === "/vrspace"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <Video size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Streams</div>
                </button>
              </li>
              {/* <li className="mb-1 mt-2">
                      <button
                        onMouseDown={(e) => ripple.create(e, "dark", "circle")} 
                        onClick={() => navigate("/reports")}
                        className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                          ${
                            data === "/reports"
                              ? "bg-[#8DC63F] text-white"
                              : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                          }`}
                      >
                        <ChartPie size={20} />
                          <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Reports</div>
                      </button>
                </li> */}
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/volume-management")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 ${data === "/volume-management" ? "bg-[#8DC63F] text-white" : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <MessageSquareText size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Volumes</div>
                </button>
              </li>
              <li
                className={`fixed bottom-0 left-0 flex items-center ${buttonOpen ? "justify-center" : "justify-center"
                  } mb-2`}
              >
              </li>
            </>
          }
          {/* {tokdata.role == 102 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><button onClick={() => navigate(`/dashboard`)} className="flex gap-5 text-gray-500 hover:text-white"><LayoutDashboard size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Dashboard</div></button></li>
                <li className={`${data==="/batch" || data.startsWith("/batch/") ? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/batch" className={` ${data==="/batch" || data.startsWith('/batch/') ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><Users size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Batch</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/trainees" className="flex gap-5 text-gray-500 hover:text-white"><Users size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Trainees</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/course" className="flex gap-5 text-gray-500 hover:text-white"><BookText size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Courses</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/reports" className="flex gap-5 text-gray-500 hover:text-white"><ChartPie size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Reports</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><button onClick={() => navigate("/volume-management")} className="flex gap-5 text-gray-500 hover:text-white"><MessageSquareText size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Volumes</div></button></li>
              </>
              } */}
          {tokdata.role == 102 &&
            <>
              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/dashboard")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${data === "/dashboard"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <LayoutDashboard size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Dashboard</div>
                </button>
              </li>

              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/batch")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${data === "/batch" || data.startsWith("/batch/")
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <UsersRound size={20} strokeWidth={1.8} className="shrink-0" />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Batch</div>
                </button>
              </li>

              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/trainees")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${data === "/trainees" || data.startsWith("/trainee")
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <StudentCardIcon size={20} strokeWidth={1.8} className="shrink-0" />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Trainees</div>
                </button>
              </li>

              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/certificate")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${data == "/certificate"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <BookText size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Certifications</div>
                </button>
              </li>

              {/* <li className="mb-1 mt-2">
      <button
        onMouseDown={(e) => ripple.create(e, "dark", "circle")}
        onClick={() => navigate("/reports")}
        className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${
            data === "/reports"
              ? "bg-[#8DC63F] text-white"
              : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
          }`}
      >
        <ChartPie size={20} />
        <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Reports</div>
      </button>
    </li> */}

              <li className="mb-1 mt-2">
                <button
                  onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                  onClick={() => navigate("/volume-management")}
                  className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${data === "/volume-management"
                      ? "bg-[#8DC63F] text-white"
                      : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                    }`}
                >
                  <MessageSquareText size={20} />
                  <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Volumes</div>
                </button>
              </li>
            </>
          }
          {[99, 101].includes(Number(tokdata.role)) && (
            <li className="mb-1 mt-2">
              <button
                onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                onClick={() => navigate("/custom-course")}
                className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200
        ${data === "/custom-course"
                    ? "bg-[#8DC63F] text-white"
                    : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                  }`}
              >
                <BookOpen size={20} />
                <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>SVT Course</div>
              </button>
            </li>
          )}
          {[99, 103].includes(Number(tokdata.role)) && (
            <li className="mb-1 mt-2">
              <button
                onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                onClick={() => navigate("/course-access")}
                className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 ${data === "/course-access" ? "bg-[#8DC63F] text-white" : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                  }`}
              >
                <BookOpen size={20} />
                <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>
                  {Number(tokdata.role) === 103 ? "Assigned Courses" : "Content Access"}
                </div>
              </button>
            </li>
          )}
        </ul>
      </div>
      {buttonOpen !== false && (
        <div className="border-t border-[#e5eee0] px-5 py-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#dfead5] bg-white px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf6df] text-xs font-bold text-[#719f2c]">{roleName.charAt(0)}</div>
            <div className="min-w-0"><div className="text-xs font-bold text-slate-700">{roleName}</div><div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-[#8DC63F]" />Active workspace</div></div>
          </div>
        </div>
      )}
    </div>
  )
}
export default SideBar;
