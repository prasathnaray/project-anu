import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useParams } from "react-router-dom";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import { ArrowUpWideNarrow, CheckCircle } from "lucide-react";

function Resource() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  // Decode token
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99) {
    return <Navigate to="/" replace />;
  }

  // Placeholder data for now
  const resources = [
    { resource_id: 1, resource_name: "Learning Resource", is_completed: false },
    { resource_id: 2, resource_name: "Practice 1", is_completed: true },
    { resource_id: 3, resource_name: "Practice 2", is_completed: false },
    { resource_id: 4, resource_name: "Image Interpretation", is_completed: false },
    { resource_id: 5, resource_name: "Test", is_completed: false },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />

        {/* Main Content */}
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen pt-12">
            <div
              className={`${
                buttonOpen
                  ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                  : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
              }`}
            >
              {/* Breadcrumb */}
              <div className="text-gray-500">Course / Chapters / Modules / Resources</div>
              <div className="mt-5 font-semibold text-xl text-gray-600">
                Learning Resources
              </div>

              {/* Table for resources */}
              <div className="mt-5 bg-white rounded px-8 py-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Resource</div>
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.resource_id} className="text-sm text-gray-700">
                        <td className="py-2 px-4 border-b-2">{r.resource_name}</td>
                        <td className="py-2 px-4 border-b-2">
                          {r.is_completed ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle size={16} /> Completed
                            </div>
                          ) : (
                            <span className="text-gray-400">Pending</span>
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
      </div>
    </div>
  );
}

export default Resource;