import React, {useState} from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import { ArrowUpWideNarrow, ChevronLeft, ChevronRight } from "lucide-react";
import CreateBatch from "../components/admin/CreateBatch";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const CustomDateInput = React.forwardRef(({ value, onClick, onChange }, ref) => (
  <div className="relative w-full mt-5">
    <input
      ref={ref}
      onClick={onClick}
      value={value}
      readOnly
      placeholder=" "
      className="peer w-full px-2.5 pt-3 pb-2.5 text-sm text-gray-900 border border-gray-300 rounded-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <label
      className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                        peer-focus:px-2 
                                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                       peer-focus:text-blue-600

                                        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    >
      End Date
    </label>
  </div>
));
function Batch()  {
        const [openBatch, setOpenBatch] = useState(false);
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const handleClose = () => setOpenBatch(false);
        const [buttonOpen, setButtonOpen] = useState(true);
        const handleButtonOpen = () => {
                setButtonOpen(!buttonOpen);
        };
        const token = localStorage.getItem('user_token')
        if (!token) {
                        return <Navigate to="/" replace />;
        }
        const decoded = jwtDecode(token);
        if (decoded.role != 101 && decoded.role != 102) {
                        return <Navigate to="/" replace />;
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
                        <div className="bg-gray-100 h-screen">
                                <div className="px-[130px] py-8 w-full max-w-[1800px] mx-auto">
                                            <div className="text-gray-500">Dashboard / Batch</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Batches</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                <div className="font-semibold text-xl text-gray-500">All Batches</div>
                                                <div className="grid grid-cols-2 items-center my-5">
                                                        <div className=""><input
                                                            type="text"
                                                            placeholder="Search Batch"
                                                            name="reset_password_mail"
                                                            className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                        /></div>
                                                        <div className="flex justify-end items-center"><button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out" onClick={() => setOpenBatch(true)}>Create Batch</button></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                        <th className="py-2 px-4"></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Batch Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Start date</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>End date</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Instructor associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>
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
                <CreateBatch isVisible={openBatch} onClose={handleClose}>
                    <div className="flex justify-between items-center">
                        <div className="text-lg">Create Batch</div>
                        <div><button onClick={handleClose} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
                    </div>
                    <div className="relative mt-5">
                        <input
                        type="text"
                        id="Name"
                        className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                        placeholder=" "
                        name="trainee_name"
                        />
                        <label
                        htmlFor="Name"
                        className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                        peer-focus:px-2 
                                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                       peer-focus:text-blue-600

                                        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                        Batch Name
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="relative mt-5">
                                <input
                                type="text"
                                id="Name"
                                className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
                                placeholder=" "
                                name="trainee_name"
                                />
                                <label
                                htmlFor="Name"
                                className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                                peer-focus:px-2 
                                                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                peer-focus:text-blue-600
                                                rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                >
                                Start Date
                                </label>
                        </div>
                        <div className="relative">
                                        <DatePicker
                                                id="endDate"
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                customInput={<CustomDateInput />}
                                                // popperPlacement="bottom-start"      
                                        />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end items-center">
                        <button className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white">Save</button>
                    </div>
                </CreateBatch>
    </div>
    )
}
export default Batch;