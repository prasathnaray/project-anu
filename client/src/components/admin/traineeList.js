import React, {useEffect, useRef, useState, useParams} from 'react'
import SideBar from '../sideBar'
import NavBar from '../navBar'
import { ArrowUpWideNarrow, CalendarRangeIcon, ChevronLeft, ChevronRight, EllipsisVertical, LockIcon, Mail, Menu, PhoneCallIcon, User } from 'lucide-react'
import TraineeListAPI from '../../API/TraineeListAPI';
import { ArrowLeft01Icon } from 'hugeicons-react';
import AddTrainee from './addTrainee';
import IMAGE_URL from '../../API/imageUrl';
import axios from 'axios';
import showDisableConfirmToast from '../../utils/showDisableConfirmToast';
import showEnableConfirmToast from '../../utils/showEnableConfirmToast';
function TraineeList() {
  const token = localStorage.getItem("user_token");
  const [traineeList, setTraineeList] = useState([]);
  const [count, setCount] = useState(0);
  const[showModal, setShowModal] = useState(false);
  const handleAddTrainee = () => setShowModal(true);
  const dropdownRefs = useRef({});  
  const handleTraineeList = async () => {
        try
        {
                const response = await TraineeListAPI(token);
                console.log(response.data);
                setTraineeList(response.data.rows);
                setCount(response.data.length);
        }
        catch(error)
        {
                console.error("Error fetching trainee list:", error);
        }
  }
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  useEffect(() => {
        handleTraineeList();
  }, []);
  useEffect(() => {
        console.log(count);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(dropdownRefs.current).some(ref =>
        ref && ref.contains(event.target)
      );

      if (!isClickInside) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
  const [disableTrainee, setDisableTrainee] = useState('')
  const handleDisable = async(e) => {
        e.preventDefault();
        try
        {
                const response = await axios.patch(`http://localhost:4004/api/v1/disable-trainee/${disableTrainee}`)
                console.log(response)
        }
        catch(err)
        {
                console.log(err)
        }
  }
  return (
    <div className={`flex`}>
                <div>
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/> 
                </div>
                        <div className={`${
                        buttonOpen === true
                        ? "ms-[221px] flex-grow"
                        : "ms-[85.5px] flex-grow"
                        } `}>
                        <div> 
                                <NavBar />
                       </div>
                        <div className="bg-gray-100 ">
                                        <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="text-gray-500">Dashboard / Trainees</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Trainees</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                <div className="font-semibold text-xl text-gray-500">All Trainees</div>
                                                <div className="grid grid-cols-2 items-center my-5">
                                                        <div className=""><input
                                                            type="text"
                                                            placeholder="Search Trainee"
                                                            name="reset_password_mail"
                                                            className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                        /></div>
                                                        <div className="flex justify-end items-center"><a href="/trainee/add" className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out">Add Trainee</a></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm">
                                                                        <th className="py-2 px-4"></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Trainee Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Course</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Module</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Status</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                 {traineeList.length > 0 ? (
                                                                        traineeList.map((trainee, index) => (
                                                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                                <td className="py-2 px-4">
                                                                                        <img src={IMAGE_URL+`${trainee.user_profile_photo}`} className="w-10 cursor-pointer" alt="sx" />
                                                                                </td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">{trainee.user_name}</td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">UFT</td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">test</td>
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">{trainee.batch_id}</th>
                                                                                <th className={`py-2 px-4 font-normal`}>
                                                                                                <div className={`inline-block px-3 py-1 rounded text-sm ${trainee.status === "inactive" ? "bg-red-100 animate-pulse text-red-600 font-semibold rounded-full" : "text-green-600 bg-green-100 animate-pulse font-semibold rounded-full"}`}>
                                                                                                        {trainee.status === "inactive" && <div>Disabled</div>}
                                                                                                        {trainee.status === "active" && <div>Active</div>}
                                                                                                </div>
                                                                                </th>                                                                                
                                                                                <th className="py-2 px-4">
                                                                                <button onClick={() => toggleDropdown(index)} className="text-gray-500"><EllipsisVertical size={23} /></button>
                                                                                {openDropdownIndex === index && (
                                                                                                <div
                                                                                                 ref={(el) => (dropdownRefs.current[index] = el)}
                                                                                                className={`absolute right-18 mt-1 w-22 bg-white border border-gray-200 rounded shadow-md z-10
                                                                                                        transition-all ease-in-out duration-500 origin-top-right
                                                                                                        ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                                                                                                `} 
                                                                                                >
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">View</button>
                                                                                                                {trainee.status === "inactive"? <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => showEnableConfirmToast(trainee.user_email, handleTraineeList, token, 'active')}>Enable</button>: <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => showDisableConfirmToast(trainee.user_email, handleTraineeList, token, 'inactive')}>Disable</button>}
                                                                                                                {/* <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => showDisableConfirmToast(trainee.user_email, handleTraineeList, token, statusUpdate)}>{trainee.status === "inactive"? "Enable": "Disable"}</button> */}
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Delete</button>

                                                                                                </div>
                                                                                )}
                                                                                </th>
                                                                        </tr>
                                                                        ))
                                                                        ) : (
                                                                        <tr>
                                                                        <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                                                                                No data found
                                                                        </td>
                                                                        </tr>
                                                                  )}
                                                        </tbody>
                                                </table>
                                                <div className="flex justify-end items-center mt-5 gap-2">
                                                                <div className="px-2 pt-1 text-sm hover:bg-[#8DC63F] transition-all ease-in-out hover:text-white"><button><ChevronLeft size={20}/></button></div>
                                                                <div className="border px-2 rounded border-gray-400 text-sm hover:bg-[#8DC63F] transition-all ease-in-out hover:text-white"><button>1</button></div>
                                                                <div className="border px-2 border-gray-400 rounded text-sm hover:bg-[#8DC63F] transition-all ease-in-out hover:text-white"><button>2</button></div>
                                                                <div className="border px-2 border-gray-400 rounded text-sm hover:bg-[#8DC63F] transition-all ease-in-out hover:text-white"><button>3</button></div>
                                                                <div className="border px-2 border-gray-400 rounded text-sm hover:bg-[#8DC63F] transition-all ease-in-out hover:text-white"><button>4</button></div>
                                                                <div className="px-2 pt-1 text-sm hover:bg-[#8DC63F] transition-all ease-in-out hover:text-white"><button><ChevronRight size={20}/></button></div>
                                                </div>
                                            </div>
                                </div>
                        </div>
                </div>
    </div>
  )
}

export default TraineeList