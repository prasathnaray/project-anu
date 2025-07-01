import React from 'react'
import SideBar from '../sideBar'
import NavBar from '../navBar'
import { ArrowUpWideNarrow, EllipsisVertical, Menu } from 'lucide-react'

function TraineeList() {
  return (
    <div className={`flex`}>
                <div>
                    <SideBar /> 
                </div>
                <div className="ms-[221px] flex-grow">
                        <div>
                                <NavBar />
                        </div>
                        <div className="bg-gray-100">
                                <div className="px-10 py-8">
                                            <div className="text-gray-500">Dashboard / Trainees</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Trainees</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                <div className="font-semibold text-xl text-gray-500">All Trainees</div>
                                                <div className="grid grid-cols-2 items-center my-5">
                                                        <div className=""><input
                                                            type="text"
                                                            placeholder="Search Trainee"
                                                            name="reset_password_mail"
                                                            className="rounded px-2 py-3 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                        /></div>
                                                        <div className="flex justify-end items-center"><button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-2 font-semibold text-sm transition-all ease-in-out">Add Trainee</button></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm">
                                                                        <th className="py-2 px-4"></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Trainee Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Course</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Module</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {/* Map through the trainee data here */}
                                                                {/* Example row */}
                                                                <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                        <td className="py-2 px-4"><img src="" alt="data" /></td>
                                                                        <td className="py-2 px-4">John Doe</td>
                                                                        <td className="py-2 px-4">UFT</td>
                                                                        <td className="py-2 px-4">SVT</td>
                                                                        <th className="py-2 px-4">jb</th>
                                                                        <th className="py-2 px-4 text-gray-500"><button><EllipsisVertical size={23}/></button></th>
                                                                </tr>
                                                                <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                        <td className="py-2 px-4"><img src="" alt="data" /></td>
                                                                        <td className="py-2 px-4">John Doe</td>
                                                                        <td className="py-2 px-4">UFT</td>
                                                                        <td className="py-2 px-4">SVT</td>
                                                                        <th className="py-2 px-4">jb</th>
                                                                        <th className="py-2 px-4 text-gray-500"><button><EllipsisVertical size={23}/></button></th>
                                                                </tr>
                                                                <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                        <td className="py-2 px-4"><img src="" alt="data" /></td>
                                                                        <td className="py-2 px-4">John Doe</td>
                                                                        <td className="py-2 px-4">UFT</td>
                                                                        <td className="py-2 px-4">SVT</td>
                                                                        <th className="py-2 px-4">jb</th>
                                                                        <th className="py-2 px-4 text-gray-500"><button><EllipsisVertical size={23}/></button></th>
                                                                </tr>
                                                                <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                        <td className="py-2 px-4"><img src="" alt="data" /></td>
                                                                        <td className="py-2 px-4">John Doe</td>
                                                                        <td className="py-2 px-4">UFT</td>
                                                                        <td className="py-2 px-4">SVT</td>
                                                                        <th className="py-2 px-4">jb</th>
                                                                        <th className="py-2 px-4 text-gray-500"><button><EllipsisVertical size={23}/></button></th>
                                                                </tr>
                                                                <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                        <td className="py-2 px-4"><img src="" alt="data" /></td>
                                                                        <td className="py-2 px-4">John Doe</td>
                                                                        <td className="py-2 px-4">UFT</td>
                                                                        <td className="py-2 px-4">SVT</td>
                                                                        <th className="py-2 px-4">jb</th>
                                                                        <th className="py-2 px-4 text-gray-500"><button><EllipsisVertical size={23}/></button></th>
                                                                </tr>
                                                        </tbody>
                                                </table>
                                            </div>
                                </div>
                        </div>
                </div>
    </div>
  )
}

export default TraineeList