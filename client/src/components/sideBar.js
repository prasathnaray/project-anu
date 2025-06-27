import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
// import { CourseIcon } from '@hugeicons-pro/core-stroke-rounded';
import { BookOpen } from 'lucide-react';
import logo from '../assets/image (3).png';
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
  ChartRoseIcon
} from "hugeicons-react";
import { jwtDecode } from 'jwt-decode';
function SideBar() {
  const [tokdata, setTokData] = useState({});
   const token = jwtDecode(localStorage.getItem('user_token'));
  //console.log(token.role);
  useEffect(() => {
    if (localStorage.getItem('user_token')) { 
    }
    setTokData(token);
  }, []);
  console.log(tokdata.role);
  return (
    <div className="fixed top-0 left-0 h-screen md:w-[220px] sm:w-9 w-9 m-0 flex flex-col text-black border-r-0 border-gray-500 shadow-md bg-white">
        <div className="md:px-[50px] pt-4"><img src={logo} /></div>
        <div className="">
            <ul className="py-5 px-8">
              {tokdata.role == 103 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/home" className="flex gap-5"><Mortarboard02Icon size={21}/>Curriculum</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/startups" className="flex gap-5"><CourseIcon size={21}/>Courses</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5"><ChartRoseIcon size={21}/>Analysis</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5"><ChartBarLineIcon size={21}/>Progress</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5"><UserIcon size={21}/>Profile</a></li>
              </>
              }
              {tokdata.role == 101 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/home" className="flex gap-5"><Mortarboard02Icon size={21}/>Intructors</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/startups" className="flex gap-5"><CourseIcon size={21}/>Trainee</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5"><MarketAnalysisIcon size={21}/>Courses</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5"><ChartBarLineIcon size={21}/>Curriculum</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5"><UserIcon size={21}/>Report</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5"><UserIcon size={21}/>Analysis</a></li>
              </>
              }
              {tokdata.role == 102 && 
              <>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/home" className="flex gap-5"><  StudentCardIcon size={21}/>Trainee</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/" className="flex gap-5"><CourseIcon size={21}/>Courses</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/" className="flex gap-5"><MarketAnalysisIcon size={21}/>Reports</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/" className="flex gap-5"><Message01Icon size={21}/>Queries</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/profile" className="flex gap-5"><UserIcon size={21}/>Profile</a></li>
              </>
              }
            </ul> 
        </div>
  </div>
  )
}
export default SideBar;