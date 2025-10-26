import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import IMAGE_URL from "../API/imageUrl";
import TraineeProfileAPI from '../API/TraineeProfileAPI';
import HalfDonut from '../charts/ResourceCompletion';
import StreakHeatmap from '../charts/StreaksChart';
function TraineeIndividual() {
    const navigate = useNavigate();
    const { people_id } = useParams();
    const [buttonOpen, setButtonOpen] = React.useState(true);
        const handleButtonOpen = () => {
            setButtonOpen(!buttonOpen);
        };

   const [individualTraineeProfile, setIndividualTraineeProfile] = React.useState([]);
   const handleApiCall = async(people_id) => {
        try {
                     let token = localStorage.getItem('user_token');
                     const response = await TraineeProfileAPI(token, people_id);
                     setIndividualTraineeProfile(response.data);
        }
        catch (error) {
                console.error('Error fetching trainee profile:', error);
        }
  }
  React.useEffect(() => {
        handleApiCall(people_id)
  }, [people_id])   
  //const uniqueElements = new Set(individualTraineeProfile.map(item => item.course_id))
  const counts = {
        img: [...new Set(individualTraineeProfile.map(item => item.user_profile_photo).filter(Boolean))][0] || "",
        name: [...new Set(individualTraineeProfile.map(item => item.user_name).filter(Boolean))][0] || "Unknown",
        desig: [...new Set(individualTraineeProfile.map(item => item.user_role).filter(Boolean))][0] === "103" ? "Trainee" : "Instructor",
        total_courses_enrolled: new Set(individualTraineeProfile.map(item => item.course_id)),
        total_chapters_associated: new Set(individualTraineeProfile.map(chapter => chapter.chapter_id).filter(id=> id !== null)),
        resources_completed: individualTraineeProfile.filter(item => item.is_completed == true).length
  }
  console.log(counts);
  return (
    <div classNam={`flex flex-col min-h-screen`}>
        <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                <NavBar />
        </div>
        <div className="flex flex-grow pt-12">
                <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                </div>
                <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div className='bg-gray-100'>
                                    <div className="p-2 flex justify-between items-center border-b bg-white">
                                                <div>Profile</div>
                                                <div className="flex gap-2 text-sm">
                                                        <div className="text-[#8DC63F]"><button onClick={() => navigate('/dashboard')}>Home</button></div>
                                                        <div>/</div>
                                                        <div>User Profile</div>
                                                </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 mx-7">
                                              <div className="col-span-1 p-4 bg-white shadow mt-4 border-t-2 border-[#8DC63F]">
                                                       <div className="flex justify-center items-center mt-10">
                                                                <img src={IMAGE_URL+`${counts.img}`} alt="Profile" className="mb-4 hover:opacity-80 border-4 border-[#8DC63F] w-24 h-24 rounded-full cursor-pointer" />
                                                       </div>
                                                       <div className="text-center text-lg">{counts.name}</div>
                                                       <div className="text-center mt-2 text-gray-500">{counts.desig}</div>

                                                       <div className="border-t mt-6 pt-1 mb-2">
                                                                <div className="flex justify-between items-center pt-2">
                                                                        <div className="text-gray-600 font-semibold">Total courses enrolled</div>        
                                                                        <div>{counts.total_courses_enrolled.size}</div>     
                                                                </div>
                                                       </div>
                                                       <div className="border-t mt-6 pt-1 mb-2">
                                                                <div className="flex justify-between items-center pt-2">
                                                                        <div className="text-gray-600 font-semibold">Total chapter access</div>        
                                                                        <div>{counts.total_chapters_associated.size}</div>     
                                                                </div>
                                                       </div>
                                                       <div className="border-t mt-6 pt-2 mb-2">
                                                                <div className="flex justify-between items-center pt-2">
                                                                        <div className="text-gray-600 font-semibold">Total resources completed</div>        
                                                                        <div>{counts.resources_completed}</div>     
                                                                </div>
                                                       </div>    
                                              </div>
                                              <div className="col-span-3 p-4 bg-white shadow mt-4">
                                                                <div className="text-gray-600 text-lg">Resources statistics</div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                                <div className="p-12"><HalfDonut dataa={individualTraineeProfile}/></div>
                                                                </div>
                                              </div> 
                                    </div>
                                    <div className="p-4 bg-white shadow mt-4 mx-7">
                                          <div className="mb-2 text-lg text-gray-600">Submissions</div>
                                          <div className=""><StreakHeatmap data={individualTraineeProfile}/></div>
                                    </div>
                            </div>
                </div>
        </div>
    </div>
  )
}

export default TraineeIndividual