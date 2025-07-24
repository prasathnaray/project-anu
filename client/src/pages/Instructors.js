import React, {useState, useEffect} from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import { ArrowBigDownIcon, ArrowUpWideNarrow, ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import IMAGE_URL from "../API/imageUrl";
import GetIntructorsAPI from "../API/GetIntructorsAPI";
import { ChevronDown } from 'lucide-react';
// import IMAGE_URL from "../API/imageUrl";
function Instructors(){
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
    let token = localStorage.getItem('user_data');
    const [instructors, setInstructors] = useState('')
    const getData = async() => {
        try
        {   
            let token = localStorage.getItem('user_token');
            const result = await GetIntructorsAPI(token);
            setInstructors(result.data);
        }
        catch(err)
        {
            console.log(err)
        }
    }
    useEffect(() => {
        getData()
        // console.log(instructors);
    }, [])
    return (
        <div className={'flex'}>
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
                <div className="bg-gray-100">
                            <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="text-gray-500">Dashboard / Instructors</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Instructors</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                <div className="font-semibold text-xl text-gray-500">All Instructors</div>
                                                <div className="grid grid-cols-2 items-center my-5">
                                                        <div className=""><input
                                                            type="text"
                                                            placeholder="Search Instructor"
                                                            name="reset_password_mail"
                                                            className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                        /></div>
                                                        <div className="flex justify-end items-center"><a href="/instructor/add" className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out">Add Instructor</a></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm">
                                                                        <th className="py-2 px-4"></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Instructor Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Course</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Status</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {instructors.length > 0 ? (
                                                                    instructors.map((instructor, index) => (
                                                                        <tr key={index} className="text-sm text-gray-700">
                                                                        <td className="border-b-2"><img src={IMAGE_URL+instructor.user_profile_photo} className="w-10 cursor-pointer"/></td>
                                                                        <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">{instructor.user_name}</td>
                                                                        <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">dad</td>
                                                                        <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">{instructor.batch_id.length>1 ? (<div className="flex justify-between items-center">{instructor.batch_id[0]}<button><ChevronDown size={24}/></button></div>): (<div>{instructor.batch_id}</div>)}</td>
                                                                        <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                                                                                                <div className={`inline-block px-3 py-1 rounded text-sm ${instructor.status === "inactive" ? "bg-red-100 animate-pulse text-red-600 font-semibold rounded-full" : "text-green-600 bg-green-100 animate-pulse font-semibold rounded-full"}`}>
                                                                                                        {instructor.status === "inactive" && <div>Disabled</div>}
                                                                                                        {instructor.status === "active" && <div>Active</div>}
                                                                                                </div>
                                                                        </td>
                                                                        <td>                                                                        
                                                                            <div className="py-2 px-4 text-[#8DC63F]"><button className="text-gray-500"><EllipsisVertical size={23} /></button></div>
                                                                        </td>
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
export default Instructors;