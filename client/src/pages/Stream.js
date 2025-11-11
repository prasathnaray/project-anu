import React from 'react'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ArrowUpWideNarrow, EllipsisVertical, EyeIcon } from 'lucide-react';
import $ from "jquery";
import IvsSubscriber from '../components/testComp';
function Stream() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  const token = localStorage.getItem('user_token');
  const [participantInfo, setParticipantInfo] = React.useState([]);
  console.log(participantInfo);
  const tokDecoded = jwtDecode(token);
  console.log(tokDecoded.role == 101);
    const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
    const dropdownRefs = React.useRef({});  
    const toggleDropdown = (index) => {
      setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        const isClickInside = Object.values(dropdownRefs.current).some(ref =>
          ref && ref.contains(event.target)
        );
        if (!isClickInside) {
          setOpenDropdownIndex(null);
        }
     } 
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
});
React.useEffect(() => {
  // force lity to bind events after component mounts
  $(document).on("click", "[data-lity]", function (e) {
    e.preventDefault();
    // Lity will automatically handle opening the modal
  });
}, []);
    const streams = [
    { id: 1, deviceName: "Laptop A", deviceId: "12345", status: "Active" }
    ];

  if(!tokDecoded.role)
  {
     return <Navigate to="/" replace/>
  }
  return (
    <div className={`flex flex-col min-h-screen`}>
        <div className="">
                    <NavBar />
        </div>
        <div className="flex flex-grow">
                <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>
                </div>  
                {tokDecoded.role == 103 && (
                  <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div>
                                <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="text-gray-600">Stream / All Stream</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">My Streams</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10">
                                                        <div className="font-semibold text-xl text-gray-500 mb-10">My Streams</div>
                                                        {/* <div className="grid grid-cols-2 items-center my-5">
                                                                <div className="">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search Curriculum"
                                                                        className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                                    />
                                                                </div>
                                                        </div> */}
                                                        <table className="w-full text-left border-collapse">
                                                                    <thead className=''>
                                                                        <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                                <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Device Name</div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                                <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Device Id</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Status</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                            {streams.map((stream, index) => (
                                                                                <tr key={stream.id} className="border-b">
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">{stream.deviceName}</td>
                                                                                <td className="py-2 px-4">{stream.deviceId}</td>
                                                                                <td className="py-2 px-4">
                                                                                    {stream.status === "Active" ? (
                                                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full animate-blink">
                                                                                                    Active
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                                                                                            {stream.status}
                                                                                            </span>
                                                                                        )}
                                                                                </td>
                                                                                <td className="py-2 px-4 relative">
                                                                                    <button onClick={() => toggleDropdown(index)}>
                                                                                    <EllipsisVertical size={24} />
                                                                                    </button>
                                                                                    {openDropdownIndex === index && (
                                                                                    <div
                                                                                        ref={(el) => (dropdownRefs.current[index] = el)}
                                                                                        className={`absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-md z-10
                                                                                        transition-all ease-in-out duration-200 origin-top-right
                                                                                        ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                                                                                        `}
                                                                                    >
                                                                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-50"><a href="https://www.youtube.com/watch?v=ScMzIvxBSi4" data-lity>View</a></button>
                                                                                    </div>
                                                                                    )}
                                                                                </td>
                                                                                </tr>
                                                                            ))}
                                                                            </tbody>

                                                        </table>
                                            </div>
                                </div>
                            </div>
                </div>
                )}

                {tokDecoded.role == 101 && (
                  <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                        <div>
                                <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                          <div className="text-gray-600">Stream / All Stream</div>
                                           <div className="mt-5 font-semibold text-xl text-gray-600">All Streams</div>
                                           <div className="mt-5 bg-white rounded px-8 py-10">
                                                        <div className="font-semibold text-xl text-gray-500 mb-10">My Streams</div>
                                                        <table className="w-full text-left border-collapse">
                                                                    <thead className=''>
                                                                        <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                                <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Device Name</div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                                <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Device Id</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                            {Array.isArray(participantInfo)
                                                                                ? participantInfo.map((stream, index) => (
                                                                                    <tr key={index}>
                                                                                      <td>{stream.id}</td>
                                                                                      <td>{stream.userId}</td>
                                                                                    </tr>
                                                                                  ))
                                                                                : participantInfo
                                                                                ? (
                                                                                    <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                                      <td className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">{participantInfo.id}</td>
                                                                                      <td className="py-2 px-4 text-[#8DC63F]">{participantInfo.userId}</td>
                                                                                      <td>
                                                                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-50"><a href="http://localhost:3000/video" data-lity><EyeIcon size={20} /></a></button>
                                                                                      </td>
                                                                                    </tr>
                                                                                  )
                                                                                : null}    
                                                                    </tbody>
                                                        </table>
                                            </div>
                                </div>
                        </div>
                  </div>
                )}
        </div>
        <div id="ivs-player" style={{ display: "none" }}>
              <IvsSubscriber onParticipantUpdate={setParticipantInfo} />
        </div>  
    </div>
  )
}

export default Stream;