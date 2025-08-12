import React, {useState, useEffect} from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import { ArrowBigDownIcon, ArrowUpWideNarrow, ChevronLeft, ChevronRight, ChevronUp, EllipsisVertical } from "lucide-react";
import IMAGE_URL from "../API/imageUrl";
import GetIntructorsAPI from "../API/GetIntructorsAPI";
import { ChevronDown } from 'lucide-react';
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {Select, MenuItem} from '@mui/material';
import DeleteInstructorToast from "../utils/deleteInstructorToast";
// import IMAGE_URL from "../API/imageUrl";
function Instructors(){
    const [buttonOpen, setButtonOpen] = useState(false);
    const [seeBatches, setSeeBatches] = useState({});
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
    //batch open
    const handleBatchOpen = (index) => {
        setSeeBatches(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    console.log(seeBatches);
    let token = localStorage.getItem('user_token');
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
    }, [])
    const decoded = jwtDecode(token);
    if (!decoded.role) {
        return <Navigate to="/" replace />;
    }
    return (
        <div className={'flex flex-col min-h-screen'}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                    <NavBar />
            </div>
            <div className="flex flex-grow pt-12">
                                <div>
                                      <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>  
                                </div>
                                <div className={`${
                        buttonOpen === true
                        ? "ms-[221px] flex-grow"
                        : "ms-[55.5px] flex-grow"
                        } `}>
                <div className="bg-gray-100 h-screen">
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
                                                                        {/* <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Course</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th> */}
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Status</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {instructors.length > 0 ? (
                                                                    instructors.map((instructor, index) => (
                                                                        <tr key={index} className="text-sm text-gray-700">
                                                                        <td className="border-b-2"><img src={IMAGE_URL+instructor.user_profile_photo} className="w-10 h-10 rounded-full object-cover cursor-pointer"/></td>
                                                                        <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">{instructor.user_name}</td>
                                                                        {/* <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">dad</td> */}
                                                                        <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2 ">
                                                                        {instructor.batch_names.length > 0 ? (
                                                                            <div className="flex justify-between items-center gap-2 w-full">
                                                                            <div className="flex flex-col gap-1">
                                                                                {seeBatches[index] ? (
                                                                                <div className="flex flex-wrap gap-1 transition-all ease-in-out duration-300">
                                                                                    {instructor.batch_names.map((id, i) => (
                                                                                        // <span>{id}</span>
                                                                                    <span key={i} className="inline-block">{id}{i < instructor.batch_names.length - 1 ? ',' : ''}</span>
                                                                                    ))}
                                                                                </div>
                                                                                ) : (
                                                                                <div>{instructor.batch_names[0]}</div>
                                                                                )}
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleBatchOpen(index)}
                                                                                className="shrink-0 text-gray-500"
                                                                            >
                                                                                {seeBatches[index] ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                                                            </button>
                                                                            </div>
                                                                        ) : (
                                                                            <div>{instructor.batch_id[0]}</div>
                                                                        )}
                                                                        </td>
                                                                        <td  className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                                                                                                <div className={`inline-block px-3 py-1 rounded text-sm ${instructor.status === "inactive" ? "bg-red-100 animate-pulse text-red-600 font-semibold rounded-full" : "text-green-600 bg-green-100 animate-pulse font-semibold rounded-full"}`}>
                                                                                                        {instructor.status === "inactive" && <div>Disabled</div>}
                                                                                                        {instructor.status === "active" && <div>Active</div>}
                                                                                                </div>
                                                                        </td>
                                                                        <td>                                                                        
                                                                            <div className="relative py-2 px-4 text-[#8DC63F]">
                                                                            <Select
                                                                                // value={value}
                                                                                // onChange={onChange}
                                                                                displayEmpty
                                                                                variant="standard"
                                                                                disableUnderline
                                                                                IconComponent={() => null}
                                                                                className="text-sm text-[#8DC63F] bg-transparent cursor-pointer"
                                                                                renderValue={() => (
                                                                                <button className="text-gray-500">
                                                                                    <EllipsisVertical size={23} />
                                                                                </button>
                                                                                )}
                                                                                MenuProps={{
                                                                                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                                                                                transformOrigin: { vertical: "top", horizontal: "left" },
                                                                                PaperProps: {
                                                                                    style: {
                                                                                    marginTop: 8,
                                                                                    },
                                                                                },
                                                                                }}
                                                                            >
                                                                                <MenuItem value="view">View</MenuItem>
                                                                                <MenuItem value="edit">Edit</MenuItem>
                                                                                <MenuItem 
                                                                                    value="delete" 
                                                                                    onClick={() => {
                                                                                        DeleteInstructorToast(
                                                                                            instructor.user_email,
                                                                                            getData,
                                                                                            token
                                                                                        )
                                                                                    }}
                                                                                >Delete
                                                                                </MenuItem>
                                                                                <MenuItem value="disable">Disable</MenuItem>
                                                                            </Select>
                                                                            </div>
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
        </div>
    )
}   
export default Instructors;