import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import IMAGE_URL from "../API/imageUrl";
import TraineeProfileAPI from "../API/TraineeProfileAPI";
import HalfDonut from "../charts/ResourceCompletion";
import StreakHeatmap from "../charts/StreaksChart";
import { jwtDecode } from "jwt-decode";
import TraineeCompletionTable from "../components/admin/TraineeCompletionTable";
import { UserRound } from "lucide-react";

function TraineeIndividual() {
  const navigate = useNavigate();
  const { people_id } = useParams();
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [profile, setProfile] = React.useState(false);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  // ✅ Proper initial state shape to avoid undefined errors
  const [individualTraineeProfile, setIndividualTraineeProfile] =
    React.useState({
      data: [],
      instructors: [],
    });

  // ✅ API call
  let [loading, setLoading] = React.useState(false);
  const handleApiCall = async (people_id) => {
    try {
      setLoading(true);
      // const token = localStorage.getItem('user_token');
      const response = await TraineeProfileAPI(people_id);
      setIndividualTraineeProfile(response.data);
    } catch (error) {
      console.error("Error fetching trainee profile:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleApiCall(people_id);
  }, [people_id]);

  // ✅ Loading guard
  // if (!individualTraineeProfile?.data?.length) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-gray-500">
  //       Loading profile...
  //     </div>
  //   );
  // }

  // ✅ Safe computed values using optional chaining
  const data = individualTraineeProfile.data;
  const counts = {
    img:
      [
        ...new Set(data.map((item) => item.user_profile_photo).filter(Boolean)),
      ][0] || "",
    name:
      [...new Set(data.map((item) => item.user_name).filter(Boolean))][0] ||
      "Unknown",
    desig:
      [...new Set(data.map((item) => item.user_role).filter(Boolean))][0] ===
      "103"
        ? "Trainee"
        : "Instructor",
    total_courses_enrolled: new Set(data.map((item) => item.certificate_id)),
    total_chapters_associated: new Set(
      data.map((chapter) => chapter.chapter_id).filter((id) => id !== null)
    ),
    resources_completed: data.filter((item) => item.is_completed === true)
      .length,
  };

  let token = localStorage.getItem("user_token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 102) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        {/* Sidebar */}
        <div>
          <SideBar
            handleButtonOpen={handleButtonOpen}
            buttonOpen={buttonOpen}
          />
        </div>

        {/* Main Content */}
        <div
          className={`${
            buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
          } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
        >
          <div className="bg-gray-100">
            {/* Header */}
            <div className="p-2 flex justify-between items-center border-b bg-white">
              <div>Profile</div>
              <div className="flex gap-2 text-sm">
                <div className="text-[#8DC63F]">
                  <button onClick={() => navigate("/dashboard")}>Home</button>
                </div>
                <div>/</div>
                <div>User Profile</div>
              </div>
            </div>
            <div className="p-2 flex justify-between items-center border-b bg-white">
              <button
                className={`text-sm cursor-pointer p-1 px-2 rounded ${
                  profile
                    ? "bg-[#8DC63F] text-white transition-all"
                    : "bg-transparent text-black"
                }`}
                onClick={() => setProfile(!profile)}
              >
                Completed Modules
              </button>
            </div>

            {!profile ? (
              // 👇 Your full profile section when profile === false
              <>
                {/* Profile Section */}
                <div className="grid grid-cols-4 gap-3 mx-7">
                  {/* Left Card */}
                  <div className="col-span-1 p-4 bg-white shadow mt-4 border-t-2 border-[#8DC63F]">
                    <div className="flex justify-center items-center mt-10">
                      {loading ? (
                        <div className="w-5 h-5 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <img
                          src={IMAGE_URL + `${counts.img}`}
                          alt="Profile"
                          className="mb-4 hover:opacity-80 border-4 border-[#8DC63F] w-24 h-24 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
                        />
                          // <UserRound size={20} className="text-[#8DC63F]" />
                      )}
                    </div>
                    <div className="text-center text-lg">
                      {loading ? (
                        <div className="text-gray-300">Loading</div>
                      ) : (
                        counts.name
                      )}
                    </div>
                    <div className="text-center mt-2 text-gray-500">
                      {counts.desig}
                    </div>

                    <div className="border-t mt-6 pt-1 mb-2">
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-gray-600 font-semibold">
                          Total Certificates enrolled
                        </div>
                        <div>{counts.total_courses_enrolled.size}</div>
                      </div>
                    </div>

                    {/* <div className="border-t mt-6 pt-1 mb-2">
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-gray-600 font-semibold">
                          Total chapter access
                        </div>
                        <div>{counts.total_chapters_associated.size}</div>
                      </div>
                    </div> */}

                    <div className="border-t mt-6 pt-2 mb-2">
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-gray-600 font-semibold">
                          Total resources completed
                        </div>
                        <div>{counts.resources_completed}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Charts */}
                  <div className="col-span-3 p-4 bg-white shadow mt-4 transition-all duration-500">
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
                              <th className="py-2 px-4 text-[#8DC63F]">
                                Batch Name
                              </th>
                              <th className="py-2 px-4 text-[#8DC63F]">
                                Instructor Count
                              </th>
                              <th className="py-2 px-4 text-[#8DC63F]">
                                Instructors
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(individualTraineeProfile.instructors || []).map(
                              (batch, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <td className="py-2 px-4">
                                    {batch.batch_name}
                                  </td>
                                  <td className="py-2 px-4">
                                    {batch.instructor_count}
                                  </td>
                                  <td className="py-2 px-4">
                                    <ul className="list-disc ml-5">
                                      {batch.instructors.map((inst, i) => (
                                        <li key={i}>{inst}</li>
                                      ))}
                                    </ul>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submissions */}
                <div className="p-4 bg-white shadow mt-4 mx-7 transition-all duration-500">
                  <div className="mb-2 text-lg text-gray-600">Submissions</div>
                  <StreakHeatmap data={individualTraineeProfile.data} />
                </div>
              </>
            ) : (
                   <TraineeCompletionTable ApiData={individualTraineeProfile}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraineeIndividual;