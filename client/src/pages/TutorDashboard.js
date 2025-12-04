import React from 'react'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { Download, DownloadIcon, GraduationCap } from 'lucide-react';

function TutorDashboard() {
    const [dateTime, setDateTime] = React.useState("");
    const [buttonOpen, setButtonOpen] = React.useState(true);

    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    React.useEffect(() => {
  let timer;

  const updateClock = () => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    setDateTime(`${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`);

    // Align next update exactly to next second boundary
    const msToNextSecond = 1000 - now.getMilliseconds();
    timer = setTimeout(updateClock, msToNextSecond);
  };

  // Start immediately (smooth startup)
  timer = setTimeout(updateClock, 0);

  return () => clearTimeout(timer);
}, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div>
                <NavBar />
            </div>
            <div className="flex flex-grow">
                <div>
                    <SideBar 
                        handleButtonOpen={handleButtonOpen} 
                        buttonOpen={buttonOpen} 
                    />
                </div>
                <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                    <div className="grid grid-cols-4 m-6 gap-3">
                        <div className="bg-white col-span-3 rounded p-6 shadow-md">
                            <div className="text-xl flex justify-between">
                                   <div>Dashboard</div>
                                   <div><button><DownloadIcon size={20} /></button></div>
                            </div>

                            <div className="p-4 bg-[#8DC63F] mt-4 rounded text-white">
                                <div className="font-semibold text-lg">
                                    Good Morning {sessionStorage.getItem('user_name')}, Have a nice day!
                                </div>
                                <div className="mt-5">{dateTime}</div>
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-4">
                                   <div className="border shadow-md">
                                                <div className="p-2 text-lg">Trainees (in total)</div>
                                                <div className="flex justify-between p-2">
                                                    <div className="text-3xl font-bold">150</div>
                                                    <div className="text-[#8DC63F]"><GraduationCap size={40} /></div>
                                                </div>
                                    </div>
                                   <div className="border shadow-md">
                                                <div className="p-2 text-lg">Batches (in total)</div>
                                                <div className="flex justify-between p-2">
                                                    <div className="text-3xl font-bold">150</div>
                                                    <div className="text-[#8DC63F]"><GraduationCap size={40} /></div>
                                                </div>
                                   </div>
                            </div>
                        </div>
                        <div className="rounded col-span-1 bg-white p-6 shadow-md">
                            {/* Additional widgets here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TutorDashboard;