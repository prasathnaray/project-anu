import React from 'react'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { Activity, Award, CheckCircle, Download, DownloadIcon, GraduationCap, LayoutDashboard, Users } from 'lucide-react';
import BasicPie from '../charts/PieChart';
import VolumeChart from '../charts/VolumeChart';
import getDashboardAPI from '../API/dashboardAPI';
import BatchProgressBarChart from '../charts/BatchProgressBarChart';

function TutorDashboard() {
    const [dateTime, setDateTime] = React.useState("");
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const [apiData, setApiData] = React.useState({});
    
    const fetchDashboardData = async() => {
        try
        {
            let response = await getDashboardAPI();
            setApiData(response.data);
        }
        catch(err)
        {
            console.log(err)
        }
    }
    React.useEffect(() => {
        fetchDashboardData();
    }, [])
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
                    <div className="p-6">
                        <div className="grid grid-cols-4 gap-6">
                            {/* Left Column: General Stats & Progress */}
                            <div className="col-span-3 space-y-6">
                                <div className="bg-white rounded p-6 shadow-md">
                                    <div className="text-xl flex gap-2 items-center">
                                           <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                                                <LayoutDashboard size={21} />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-700">Instructor Dashboard</span>
                                    </div>

                                    <div className="p-4 bg-[#8DC63F] mt-4 rounded text-white flex justify-between items-center shadow-inner">
                                        <div>
                                            <div className="font-semibold text-xl">
                                                Welcome Back, {sessionStorage.getItem('user_name') || 'Instructor'}.
                                            </div>
                                            <div className="mt-2 text-sm opacity-90">Monitor your trainees' progress and batch performance.</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-mono">{dateTime}</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-6">
                                           <div className="bg-gradient-to-br from-white to-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="text-gray-500 text-sm font-medium">Assigned Trainees</div>
                                                        <div className="flex justify-between items-end mt-2">
                                                            <div className="text-4xl font-bold text-gray-800">{apiData?.totalTrainees || 0}</div>
                                                            <div className="text-[#8DC63F] bg-green-50 p-2 rounded-lg"><Users size={32} /></div>
                                                        </div>
                                            </div>
                                           <div className="bg-gradient-to-br from-white to-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="text-gray-500 text-sm font-medium">Active Batches</div>
                                                        <div className="flex justify-between items-end mt-2">
                                                            <div className="text-4xl font-bold text-gray-800">{apiData?.totalBatches || 0}</div>
                                                            <div className="text-[#8DC63F] bg-green-50 p-2 rounded-lg"><GraduationCap size={32} /></div>
                                                        </div>
                                           </div>
                                           <div className="bg-gradient-to-br from-white to-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="text-gray-500 text-sm font-medium">Volumes Converted</div>
                                                        <div className="flex justify-between items-end mt-2">
                                                            <div className="text-4xl font-bold text-gray-800">{apiData?.totalVolumes || 0}</div>
                                                            <div className="text-[#8DC63F] bg-green-50 p-2 rounded-lg"><CheckCircle size={32} /></div>
                                                        </div>
                                           </div>
                                    </div>
                                </div>

                                {/* Batch Progress Chart */}
                                <div className="bg-white rounded p-6 shadow-md">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                                            <Activity size={20} />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-700">Batch Completion Progress (%)</h2>
                                    </div>
                                    <div className="h-[320px]">
                                        <BatchProgressBarChart batchData={apiData?.batchProgress || []} />
                                    </div>
                                </div>

                                {/* Recent Activity Table */}
                                <div className="bg-white rounded p-6 shadow-md">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
                                            <Activity size={20} />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-700">Recent Trainee Activity</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainee</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {(apiData?.recentActivity || []).length > 0 ? (
                                                    apiData.recentActivity.map((activity, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{activity.user_name}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{activity.resource_name}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(activity.updated_at).toLocaleDateString()} {new Date(activity.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-4 py-10 text-center text-gray-400 text-sm">No recent activity found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Volume Stats & Top Trainees */}
                            <div className="col-span-1 space-y-6">
                                <div className="bg-white rounded p-6 shadow-md h-fit">
                                      <div className="flex items-center gap-2 mb-4">
                                          <div className="p-2 bg-orange-50 text-orange-600 rounded-full">
                                              <Activity size={18} />
                                          </div>
                                          <h2 className="text-md font-semibold text-gray-700">Volume Stats</h2>
                                      </div>
                                      <div className="flex justify-center">
                                            <VolumeChart APIData={apiData?.volumeSizes || []} />
                                      </div>
                                </div>

                                <div className="bg-white rounded p-6 shadow-md h-fit">
                                      <div className="flex items-center gap-2 mb-4">
                                          <div className="p-2 bg-yellow-50 text-yellow-600 rounded-full">
                                              <Award size={18} />
                                          </div>
                                          <h2 className="text-md font-semibold text-gray-700">Top Trainees</h2>
                                      </div>
                                      <div className="space-y-4">
                                            {(apiData?.topTrainees || []).length > 0 ? (
                                                apiData.topTrainees.map((trainee, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-xs ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-400'}`}>
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-gray-800 truncate w-24">{trainee.user_name}</div>
                                                                <div className="text-[10px] text-gray-500 truncate w-24">{trainee.user_email}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-bold text-[#8DC63F]">{trainee.completed_count}</div>
                                                            <div className="text-[10px] text-gray-400 uppercase">Modules</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 text-gray-400 text-sm italic">No data yet</div>
                                            )}
                                      </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TutorDashboard;