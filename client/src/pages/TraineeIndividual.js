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
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  // ✅ Proper initial state shape to avoid undefined errors
  const [individualTraineeProfile, setIndividualTraineeProfile] = React.useState({
    data: [],
    instructors: []
  });

  // ✅ API call
  const handleApiCall = async (people_id) => {
    try {
      const token = localStorage.getItem('user_token');
      const response = await TraineeProfileAPI(token, people_id);
      setIndividualTraineeProfile(response.data);
    } catch (error) {
      console.error('Error fetching trainee profile:', error);
    }
  };

  React.useEffect(() => {
    handleApiCall(people_id);
  }, [people_id]);

  // ✅ Loading guard
  if (!individualTraineeProfile?.data?.length) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  // ✅ Safe computed values using optional chaining
  const data = individualTraineeProfile.data;
  const counts = {
    img: [...new Set(data.map(item => item.user_profile_photo).filter(Boolean))][0] || "",
    name: [...new Set(data.map(item => item.user_name).filter(Boolean))][0] || "Unknown",
    desig: [...new Set(data.map(item => item.user_role).filter(Boolean))][0] === "103" ? "Trainee" : "Instructor",
    total_courses_enrolled: new Set(data.map(item => item.course_id)),
    total_chapters_associated: new Set(data.map(chapter => chapter.chapter_id).filter(id => id !== null)),
    resources_completed: data.filter(item => item.is_completed === true).length
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        {/* Sidebar */}
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>

        {/* Main Content */}
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
          <div className='bg-gray-100'>
            {/* Header */}
            <div className="p-2 flex justify-between items-center border-b bg-white">
              <div>Profile</div>
              <div className="flex gap-2 text-sm">
                <div className="text-[#8DC63F]"><button onClick={() => navigate('/dashboard')}>Home</button></div>
                <div>/</div>
                <div>User Profile</div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-4 gap-3 mx-7">
              {/* Left Card */}
              <div className="col-span-1 p-4 bg-white shadow mt-4 border-t-2 border-[#8DC63F]">
                <div className="flex justify-center items-center mt-10">
                  <img
                    src={IMAGE_URL + `${counts.img}`}
                    alt="Profile"
                    className="mb-4 hover:opacity-80 border-4 border-[#8DC63F] w-24 h-24 rounded-full cursor-pointer"
                  />
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

              {/* Right Side: Charts */}
              <div className="col-span-3 p-4 bg-white shadow mt-4">
                <div className="text-gray-600 text-lg mb-3 flex justify-between items-center">
                        <div>Resources Statistics</div>
                        <div>Batch association</div>  
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-12">
                    <HalfDonut dataa={individualTraineeProfile?.data} />
                  </div>
                        <div className="border shadow mt-4 mx-7">
                                        <table className="w-full text-left border-collapse">
                                                <thead>
                                                        <tr className="border-b border-gray-300 bg-gray-100">
                                                                <th className="py-2 px-4 text-[#8DC63F]">Batch Name</th>
                                                                <th className="py-2 px-4 text-[#8DC63F]">Instructor Count</th>
                                                                <th className="py-2 px-4 text-[#8DC63F]">Instructors</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                {(individualTraineeProfile.instructors || []).map((batch, idx) => (
                                                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-2 px-4">{batch.batch_name}</td>
                                                        <td className="py-2 px-4">{batch.instructor_count}</td>
                                                        <td className="py-2 px-4">
                                                        <ul className="list-disc ml-5">
                                                        {batch.instructors.map((inst, i) => (
                                                                <li key={i}>{inst}</li>
                                                        ))}
                                                        </ul>
                                                        </td>
                                                        </tr>
                                                ))}
                                                </tbody>
                                        </table>
                        </div>
                </div>
              </div>
            </div>

            {/* Submissions - FIX: Pass only the data array */}
            <div className="p-4 bg-white shadow mt-4 mx-7">
              <div className="mb-2 text-lg text-gray-600">Submissions</div>
              <div className="">
                <StreakHeatmap data={individualTraineeProfile.data} />
              </div>
            </div>
            {/* Instructors Associated - FIX: Properly render the nested structure */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TraineeIndividual;