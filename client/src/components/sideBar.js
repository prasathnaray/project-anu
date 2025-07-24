import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BookOpen, ChevronLeft, ClipboardPenLine, GraduationCap } from 'lucide-react';
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
import { LayoutDashboard, Users, BookText, MessageSquareText, User, ChartPie } from 'lucide-react';
function SideBar({ handleButtonOpen, buttonOpen }) {
  const ripple = new MaterialRipple();
  const [tokdata, setTokData] = useState({});
  const token = jwtDecode(localStorage.getItem('user_token'));
  useEffect(() => {
    if (localStorage.getItem('user_token')) { 
    }
    setTokData(token);
  }, []);
  return (
  <div className={`fixed top-0 left-0 h-screen ${
        buttonOpen === false
          ? "md:w-[85px] transition-all"
          : "md:w-[220px] transition-all"
      } sm:w-9 w-9 m-0 flex flex-col text-black border-r-0 border-gray-500 shadow-md bg-white `}>
        <div className="relative">
          <div
            className={`absolute top-20 left-0 ${
              buttonOpen === false ? "left-14" : "left-[185px]"
            } text-md text-[#8DC63F] shadow-lg rounded-2xl px-[5.5px] bg-white border`}
          >
            <button onClick={() => handleButtonOpen()} className="pt-1">
              {/* <FontAwesomeIcon
                icon={buttonOpen === false ? faChevronRight : faChevronLeft}
              /> */}
              {buttonOpen === false ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
            
            </button>
            {/* {'>'} */}
  
          </div>
        </div>
        <div className={`${buttonOpen===false ? "md:px-[20px] pt-4": "md:px-[50px] pt-4"}`}><img src={logo} /></div>
        <div className="">
            <ul className={`${buttonOpen === false ? "py-5 px-[23px]" : "py-5 px-8"}`}>
              {tokdata.role == 103 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/home" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><Mortarboard02Icon size={26}/>Curriculum</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/startups" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><CourseIcon size={26}/>Courses</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><ChartRoseIcon size={26}/>Analysis</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><ChartBarLineIcon size={26}/>Progress</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5" onMouseDown={(e) => ripple.create(e, "dark", "circle")}><UserIcon size={26}/>Profile</a></li>
              </>
              }
              {tokdata.role == 101 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/dashboard" className="flex gap-5 text-gray-500 hover:text-white" ><LayoutDashboard size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Dashboard</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/instructors" className="flex gap-5 text-gray-500 hover:text-white"><ClipboardPenLine size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Instructors</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/trainees" className="flex gap-5 text-gray-500 hover:text-white"><GraduationCap size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Trainees</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `} onMouseDown={(e) => ripple.create(e, "dark", "circle")}><a href="/batch" className="flex gap-5 text-gray-500 hover:text-white"><Users size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Batch</div></a></li>
                {/* <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5"><UserIcon size={21}/>Report</a></li> */}
                {/* <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5"><UserIcon size={21}/>Analysis</a></li> */}
              </>
              }
              {tokdata.role == 102 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/dashboard" className="flex gap-5 text-gray-500 hover:text-white"><LayoutDashboard size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Dashboard</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/trainees" className="flex gap-5 text-gray-500 hover:text-white"><Users size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Trainees</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/" className="flex gap-5 text-gray-500 hover:text-white"><BookText size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Courses</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/" className="flex gap-5 text-gray-500 hover:text-white"><ChartPie size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Reports</div></a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/queries" className="flex gap-5 text-gray-500 hover:text-white"><MessageSquareText size={24}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Queries</div></a></li>
                {/* <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5"><User size={26}/><div className={`${buttonOpen === false ? 'hidden': 'text-md'}`}>Profile</div></a></li> */}
              </>
              }
            </ul> 
        </div>
  </div>
  )
}
export default SideBar;