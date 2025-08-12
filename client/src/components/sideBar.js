import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BookCheck, BookOpen, ChevronLeft, ClipboardPenLine, GraduationCap } from 'lucide-react';
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
} from "hugeicons-react";
import { ChevronRight } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import { LayoutDashboard, Users, BookText, MessageSquareText, User, ChartPie, Notebook} from 'lucide-react';
function SideBar({ handleButtonOpen, buttonOpen }) {
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
                  <li className={`${data==="/course"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/course" className={`${data==="/course" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><Notebook size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Courses</div></a></li>
              </>
              }
              {tokdata.role == 103 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/home" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><Mortarboard02Icon size={26}/>Curriculum</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/courses" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><CourseIcon size={26}/>Courses</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/analysis" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><ChartRoseIcon size={26}/>Analysis</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/progress" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><ChartBarLineIcon size={26}/>Progress</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><UserIcon size={26}/>Profile</a></li>
              </>
              }
              {tokdata.role == 101 && 
              <>
                <li className={`${data==="/dashboard"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/dashboard" className={` ${data==="/dashboard" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><LayoutDashboard size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Dashboard</div></a></li>
                <li className={`${data==="/batch" || data.startsWith("/batch/") ? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/batch" className={` ${data==="/batch" || data.startsWith('/batch/') ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><Users size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Batch</div></a></li>
                <li className={`${data==="/instructors"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/instructors" className={`${data==="/instructors" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><ClipboardPenLine size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Instructors</div></a></li>
                <li className={`${data==="/trainees"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/trainees" className={`${data==="/trainees" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><GraduationCap size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Trainees</div></a></li>
                <li className={`${data==="/course"? 'bg-[#8DC63F] rounded-xl p-[10px] text-white mb-1 mt-2': 'flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-[10px] hover:text-white mb-1 mt-2'}`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/course" className={`${data==="/course" ? 'text-white flex gap-5': 'flex gap-5 text-gray-500'}`}><Notebook size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Courses</div></a></li>
              </>
              }
              {tokdata.role == 102 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/dashboard" className="flex gap-5 text-gray-500 hover:text-white"><LayoutDashboard size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Dashboard</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/trainees" className="flex gap-5 text-gray-500 hover:text-white"><Users size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Trainees</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/courses" className="flex gap-5 text-gray-500 hover:text-white"><BookText size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Courses</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/reports" className="flex gap-5 text-gray-500 hover:text-white"><ChartPie size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Reports</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/queries" className="flex gap-5 text-gray-500 hover:text-white"><MessageSquareText size={20}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Queries</div></a></li>
              </>
              }
            </ul> 
        </div>
  </div>
  )
}
export default SideBar;