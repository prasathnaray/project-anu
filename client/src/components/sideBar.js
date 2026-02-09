import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BookCheck, BookOpen, Calendar, ChevronLeft, ClipboardPenLine, GraduationCap, Scan, School } from 'lucide-react';
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
  ChartRoseIcon,
  WirelessCloudAccessIcon,
} from "hugeicons-react";
import { ChevronRight } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookText, MessageSquareText, User, ChartPie, Notebook} from 'lucide-react';
function SideBar({ handleButtonOpen, buttonOpen }) {
  const navigate = useNavigate();
  const ripple = new MaterialRipple();
  const [tokdata, setTokData] = useState({});
  const token = jwtDecode(localStorage.getItem('user_token'));
  useEffect(() => {
    if (localStorage.getItem('user_token')) { 
    }
    setTokData(token);
  }, []);
  const data = window.location.pathname;
  // console.log(data)
  return (
  <div className={`fixed top-[50px] left-0 h-screen ${
        buttonOpen === false
          ? "md:w-[55px] transition-all"
          : "md:w-[220px] transition-all"
      } sm:w-9 w-9 m-0 flex flex-col text-black border-r-0 border-gray-500 shadow-md bg-white `}>
        <div className="relative">
          <div
            className={`absolute top-20 left-0 ${
              buttonOpen === false ? "left-9" : "left-[185px]"
            } text-md text-[#8DC63F] shadow-lg rounded-2xl px-[5.5px] bg-white border`}
          >
            <button onClick={() => handleButtonOpen()} className="pt-1">
              {buttonOpen === false ? <ChevronRight size={18}/> : <ChevronLeft size={20}/>}
            </button>
          </div>
        </div>
        <div className={`${buttonOpen===false ? "md:px-[4px] pt-4": "md:px-[50px] pt-4"}`}><button><img src={logo} /></button></div>
        <div className="">
            <ul className={`${buttonOpen === false ? "py-3 px-[7px]" : "py-5 px-8"}`}>
              {tokdata.role == 99 && 
              <>
                  <li className={`${data==="/curriculum"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/curriculum" className={`${data==="/curriculum" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><BookCheck size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Curriculum</div></a></li>
                  <li className={`${data==="/certificate"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/certificate" className={`${data==="/certificate" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><Notebook size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Courses</div></a></li>
                  <li className="mb-1 mt-2">
                    <button
                      onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                      onClick={() => navigate("/volume-management")}
                      className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                        ${
                          data === "/volume-management"
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
                      onClick={() => navigate("/academics")}
                      className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                        ${
                          data === "/academics"
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
              {tokdata.role == 103 && 
                  ["dashboard", "course", "schedules", "Queries"].map((route,i) => {
                    const items = [
                      {icon: <LayoutDashboard size={20}/>, label: "Dashboard" },
                      { icon: <CourseIcon size={20}/>, label: "Courses" },
                      {icon: <Calendar size={20}/>, label: "Schedules"},
                      {icon: <ClipboardPenLine size={20}/>, label: "Queries"},
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
              }
              {tokdata.role == 101 && 
              <>
                <li  className="mb-1 mt-2">
                  <button
                    onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                    onClick={() => navigate("/dashboard")}
                    className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${
                        data === "/dashboard"
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
                      ${
                        data === "/batch" || data.startsWith("/batch/")
                          ? "bg-[#8DC63F] text-white"
                          : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                      }`}
                  >
                    <Users size={20} />
                    <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Batch</div>
                  </button>
                </li>
                <li className="mb-1 mt-2">
                  <button
                    onMouseDown={(e) => ripple.create(e, "dark", "circle")} 
                    onClick={() => navigate("/instructors")}
                    className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${
                        data === "/instructors" || data.startsWith('/instructor')
                          ? "bg-[#8DC63F] text-white"
                          : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                      }`}
                  >
                    <ClipboardPenLine size={20} />
                    <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Instructors</div>
                  </button>
                </li>
                <li className="mb-1 mt-2">
                  <button
                    onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                    onClick={() => navigate("/trainees")}
                    className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${
                        data === "/trainees" || data.startsWith("/trainee")
                          ? "bg-[#8DC63F] text-white"
                          : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                      }`}
                  >
                    <GraduationCap size={20} />
                    <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Trainees</div>
                  </button>
                </li>
                <li  className="mb-1 mt-2">
                  <button
                    onMouseDown={(e) => ripple.create(e, "dark", "circle")}
                    onClick={() => navigate("/schedules")}
                    className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${
                        data === "/schedules"
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
                      ${
                        data === "/certificate" ||
                        data.startsWith("/chapters/") ||
                        data.startsWith("/module/") ||
                        data.startsWith("/cert-course/")||
                        data.startsWith("/resource/")
                          ? "bg-[#8DC63F] text-white"
                          : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                      }`}
                  >
                    <Notebook size={20} />
                    <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Certification</div>
                  </button>
                </li>
                {/* <li className="mb-1 mt-2">
                  <button
                    onMouseDown={(e) => ripple.create(e, "dark", "circle")} 
                    onClick={() => navigate("/vrspace")}
                    className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
                      ${
                        data === "/vrspace"
                          ? "bg-[#8DC63F] text-white"
                          : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
                      }`}
                  >
                    <WirelessCloudAccessIcon size={20} />
                    <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Streams</div>
                  </button>
                </li> */}
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
                <li
                  className={`fixed bottom-0 left-0 flex items-center ${
                    buttonOpen ? "justify-center" : "justify-center"
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
          ${
            data === "/dashboard"
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
          ${
            data === "/batch" || data.startsWith("/batch/")
              ? "bg-[#8DC63F] text-white"
              : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
          }`}
      >
        <Users size={20} />
        <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Batch</div>
      </button>
    </li>

    <li className="mb-1 mt-2">
      <button
        onMouseDown={(e) => ripple.create(e, "dark", "circle")}
        onClick={() => navigate("/trainees")}
        className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${
            data === "/trainees" || data.startsWith("/trainee")
              ? "bg-[#8DC63F] text-white"
              : "text-gray-500 hover:bg-[#8DC63F] hover:text-white"
          }`}
      >
        <Users size={20} />
        <div className={`${buttonOpen === false ? "hidden" : "text-md"}`}>Trainees</div>
      </button>
    </li>

    <li className="mb-1 mt-2">
      <button
        onMouseDown={(e) => ripple.create(e, "dark", "circle")}
        onClick={() => navigate("/certificate")}
        className={`w-full text-left flex items-center gap-5 p-[10px] rounded-xl transition-all duration-200 
          ${
            data == "/certificate"
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
          ${
            data === "/volume-management"
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
            </ul> 
        </div>
  </div>
  )
}
export default SideBar;