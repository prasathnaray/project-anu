import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
// import { CourseIcon } from '@hugeicons-pro/core-stroke-rounded';
import { BookOpen } from 'lucide-react';
import logo from '../assets/image (3).png';
function SideBar() {
  return (
    <div className="fixed top-0 left-0 h-screen md:w-[220px] sm:w-9 w-9 m-0 flex flex-col text-black border-r-0 border-gray-500 shadow-md bg-white">
        <div className="md:px-[50px] pt-4"><img src={logo} /></div>
        <div className="">
            <ul className="py-5 px-8">
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 mt-2`}><a href="/home" className="flex gap-5">Curriculum</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2`}><a href="/startups" className="flex gap-5">Courses</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5">Analysis</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5">Progress</a></li>
                <li className={`flex gap-5 hover:bg-[#8DC63F] hover:rounded-xl p-2 hover:text-white mb-2 `}><a href="/startups" className="flex gap-5">Module</a></li>
                {/* <li className={`flex gap-5 hover:bg-[#45C74D] hover:rounded-xl p-2 hover:text-white mb-2 ${currentPath == "/mentors" && "bg-[#45C74D] text-white rounded-xl"}`}><a href="/mentors" className="flex gap-5"><FaChalkboardTeacher size={20}/>Mentors</a></li>
                <li className={`flex gap-5 hover:bg-[#45C74D] hover:rounded-xl p-2 hover:text-white mb-2 ${currentPath == "/mentorship" && "bg-[#45C74D] text-white rounded-xl"}`}><a href="/mentorship" className="flex gap-5"><FaBookOpen size={20}/>Mentorships</a></li>
                <li className={`flex gap-5 hover:bg-[#45C74D] hover:rounded-xl p-2 hover:text-white mb-2 ${currentPath == "/events" && "bg-[#45C74D] text-white rounded-xl"}`}><a href="/events" className="flex gap-5"><FaRegCalendarCheck size={20} />Events</a></li>
                <li className={`flex gap-5 hover:bg-[#45C74D] hover:rounded-xl p-2 hover:text-white mb-2 ${currentPath == "/connections" && "bg-[#45C74D] text-white rounded-xl"}`}><a href="/connections" className="flex gap-5"><FaPeopleGroup size={20} />Connections</a></li>
                <li className={`flex gap-5 hover:bg-[#45C74D] hover:rounded-xl p-2 hover:text-white mb-2 ${currentPath == "/reports" && "bg-[#45C74D] text-white rounded-xl"}`}><a href="/reports" className="flex gap-5"><FaRegFile size={20} />Reports</a></li> */}
            </ul>
        </div>
  </div>
  )
}
export default SideBar;