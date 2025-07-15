import React, {useState} from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import { ArrowUpWideNarrow, ChevronLeft, ChevronRight } from "lucide-react";
import IMAGE_URL from "../API/imageUrl";
function Instructors(){
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
    let token = localStorage.getItem('user_data');
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
                                <div className="px-10 py-8 w-full max-w-[1800px] mx-auto">
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