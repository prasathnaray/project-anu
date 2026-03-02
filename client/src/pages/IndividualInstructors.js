import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, GraduationCap, User } from 'lucide-react';
import GetInsAnalysisAPI from '../API/GetInsAnalysisAPI';
import getMonthYear from '../utils/DateChange';

function IndividualInstructors() {
    let {people_id} = useParams();
    let token = localStorage.getItem('user_token');
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    /// get inst data 
    const [insData, setInsData] = React.useState(null)
    const getInstructorDataCall = async() => {
        try
        {
            let token = localStorage.getItem('user_token');
            const response = await GetInsAnalysisAPI(token, people_id)
            if (response.data && response.data.length > 0) {
                    setInsData(response.data[0]);
            }
        }
        catch(err)
        {
            if (err.response?.status === 401 || err.response?.status === 403) {
                     localStorage.removeItem('user_token');
                     window.location.href = '/'; // Redirect to login
            }
        }
    }
    React.useEffect(() => {
        getInstructorDataCall();
    }, [])
    console.log(insData);
    if (!token) {
                    return <Navigate to="/" replace />;
    }
    const decoded = jwtDecode(token);
    if (decoded.role != 101 && decoded.role != 102) {
                    return <Navigate to="/" replace />;
    }

    // Parse associated_batches JSON if it's a string
    const associatedBatches = insData?.associated_batches
        ? (typeof insData.associated_batches === 'string'
            ? JSON.parse(insData.associated_batches)
            : insData.associated_batches)
        : [];

    // Parse active_batches_with_people JSON if it's a string
    const activeBatchesWithPeople = insData?.active_batches_with_people
        ? (typeof insData.active_batches_with_people === 'string'
            ? JSON.parse(insData.active_batches_with_people)
            : insData.active_batches_with_people)
        : [];

    // Merge active people count into associated batches
    const batchTableData = associatedBatches.map(batch => {
        const activeBatch = activeBatchesWithPeople.find(ab => ab.batch_id === batch.batch_id);
        return {
            ...batch,
            active_people_count: activeBatch?.active_people_count ?? 0
        };
    });

  return (
    <div className={`flex flex-col min-h-screen`}>
          <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                  <NavBar />
          </div>
          <div className="flex flex-grow pt-12">
                  <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                  </div>
                  <div 
                      className={`${
                        buttonOpen === true
                          ? "ms-[221px] flex-grow"
                          : "ms-[55.5px] flex-grow"
                      } `}
                  >
                    <div className="bg-gray-100 min-h-screen">
                              <div className="p-2 flex justify-between items-center border-b bg-white">
                                <div>Profile</div>
                                <div className="flex gap-2 text-sm">
                                  <div className="text-[#8DC63F]">
                                    <button>Home</button>
                                  </div>
                                  <div>/</div>
                                  <div>Instructor</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-5 mx-7 py-4">
                                  <div className="col-span-2">
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="bg-white shadow-sm rounded-sm p-6 border-t border-t-4 border-[#8DC63F]">
                                                  <div className="flex justify-between items-center">
                                                      <span>
                                                          <div className=""><User size={30}/></div>
                                                      </span>
                                                      <span className="">
                                                          <div className="flex justify-center items-center mb-2 text-lg">{insData?.active_trainees || 0}</div>
                                                          <div className="text-sm">Active Trainees</div>
                                                      </span>
                                                  </div>
                                          </div>
                                          <div className="bg-white shadow-sm rounded-sm p-6 border-t border-t-4 border-[#8DC63F]">
                                                  <div className="flex justify-between items-center">
                                                      <span>
                                                          <div className=""><User size={30}/></div>
                                                      </span>
                                                      <span className="">
                                                          <div className="flex justify-center items-center mb-2 text-lg">{insData?.total_trainees || 0}</div>
                                                          <div className="text-sm">Trainees Trained</div>
                                                      </span>
                                                  </div>
                                          </div>
                                          <div className="bg-white shadow-sm rounded-sm p-6 border-t border-t-4 border-[#8DC63F]">
                                                  <div className="flex justify-between items-center">
                                                      <span>
                                                          <div className=""><GraduationCap size={30}/></div>
                                                      </span>
                                                      <span className="">
                                                          <div className="flex justify-center items-center mb-2 text-lg">{insData?.active_batches || 0}</div>
                                                          <div className="text-sm">Batches Active</div>
                                                      </span>
                                                  </div>
                                          </div>
                                          <div className="bg-white shadow-sm rounded-sm p-6 border-t border-t-4 border-[#8DC63F]">
                                              <div className="flex justify-between items-center">
                                                      <span>
                                                          <div className=""><GraduationCap size={30}/></div>
                                                      </span>
                                                      <span className="">
                                                          <div className="flex justify-center items-center mb-2 text-lg">{insData?.total_batches || 0}</div>
                                                          <div className="text-sm">Batches Trained</div>
                                                      </span>
                                                </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-span-2 bg-white">
                                        <div className="p-4">Profile Details</div>
                                        <div className="grid grid-cols-2 px-4">
                                              <div className="text-center mt-2">
                                                  <div className="flex justify-center items-center">
                                                      <img
                                                        src={`https://rnrnzmqtvcyqhpakynls.supabase.co/storage/v1/object/public/projectanu/${insData?.user_profile_photo}`}
                                                        alt="Profile"
                                                        className="mb-4 hover:opacity-80 border-4 border-[#8DC63F] w-24 h-24 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
                                                      />
                                                  </div>
                                                  <div className="mt-1 text-lg">{insData?.instructor_name}</div>
                                                  <div className="text-sm text-gray-500">Instructor</div>
                                              </div>
                                              <div className="">
                                                  <div className="text-center">Last Login Activity</div>
                                                  <div className="text-center">
                                                        {insData?.last_login ? 
                                                            new Date(insData.last_login).toLocaleString('en-IN', {
                                                                timeZone: 'Asia/Kolkata'
                                                            })
                                                            : 'No login data'
                                                        }
                                                  </div>
                                              </div>
                                        </div>
                                  </div>
                              </div>

                              {/* ===== BATCH TABLE SECTION ===== */}
                              <div className="mx-7 py-4">
                                   <div className="bg-white rounded px-8 py-10">
                                        <div className="font-semibold text-xl text-gray-500 flex justify-between items-center">
                                            <div>Associated Batches</div>
                                        </div>
                                        <table className="w-full text-left border-collapse mt-5">
                                            <thead>
                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                    <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                                                        <div>Batch Name</div>
                                                        <button><ArrowUpWideNarrow size={20}/></button>
                                                    </th>
                                                    <th className="py-2 px-4 text-[#8DC63F]">
                                                        <div className="flex items-center gap-2">
                                                            <span>Start date</span>
                                                            <button><ArrowUpWideNarrow size={20}/></button>
                                                        </div>
                                                    </th>
                                                    <th className="py-2 px-4 text-[#8DC63F]">
                                                        <div className="flex items-center gap-2">
                                                            <span>End date</span>
                                                            <button><ArrowUpWideNarrow size={20}/></button>
                                                        </div>
                                                    </th>
                                                    <th className="py-2 px-4 text-[#8DC63F]">
                                                        <div className="flex items-center gap-2">
                                                            <span>No.of Active Trainees</span>
                                                            <button><ArrowUpWideNarrow size={20}/></button>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {batchTableData.length > 0 ? (
                                                    batchTableData.map((batch, index) => (
                                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                            <td className="py-2 px-4 font-semibold text-gray-500">
                                                                <a href={`/batch/${batch.batch_id}`}>{batch.batch_name}</a>
                                                            </td>
                                                            <td className="py-2 px-4 font-semibold text-gray-500">
                                                                {batch.batch_start_date ? getMonthYear(batch.batch_start_date) : '—'}
                                                            </td>
                                                            <td className="py-2 px-4 font-semibold text-gray-500">
                                                                {batch.batch_end_date ? getMonthYear(batch.batch_end_date) : 'Ongoing'}
                                                            </td>
                                                            <th className="py-2 px-4 font-semibold text-gray-500">
                                                                {batch.active_people_count ?? 0}
                                                            </th>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                                                            No data found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                   </div>                      
                              </div>
                    </div>
                  </div>
          </div>
    </div>
  )
}
export default IndividualInstructors;