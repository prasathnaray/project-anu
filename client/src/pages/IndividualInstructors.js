import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { GraduationCap, User } from 'lucide-react';
import GetInsAnalysisAPI from '../API/GetInsAnalysisAPI';
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
                    <div className="bg-gray-100 h-screen">
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
                                                          <div className="text-sm">Batches Traineed</div>
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
                                                  <div className="mt-1 text-lg">Akil Senthil</div>
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
                    </div>
                  </div>
          </div>
    </div>
  )
}

export default IndividualInstructors;