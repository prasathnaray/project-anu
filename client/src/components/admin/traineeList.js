import React, { useEffect, useRef, useState } from "react";
import { TablePagination } from "@mui/material";
import SideBar from "../sideBar";
import NavBar from "../navBar";
import {
  ArrowUpWideNarrow,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  User,
  UserRound,
} from "lucide-react";
import TraineeListAPI from "../../API/TraineeListAPI";
import IMAGE_URL from "../../API/imageUrl";
import axios from "axios";
import showDisableConfirmToast from "../../utils/showDisableConfirmToast";
import showEnableConfirmToast from "../../utils/showEnableConfirmToast";
import DeleteTraineeToast from "../../utils/deleteTraineeToast";
import { useNavigate } from "react-router-dom";
function TraineeList() {
  const token = localStorage.getItem("user_token");
  const navigate = useNavigate();
  const [traineeList, setTraineeList] = useState([]);
  const [count, setCount] = useState(0);
  const [buttonOpen, setButtonOpen] = useState(true);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
 //pagination
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [loading, setLoading] = React.useState("");
  const handleTraineeList = async (page, limit) => {
    try {
      setLoading(true)
      const response = await TraineeListAPI(page + 1, limit);
      setTraineeList(response.data.rows || []);
      setCount(response.data.rows[0]?.total_count || 0);
    } catch (error) {
      console.error("Error fetching trainee list:", error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleTraineeList(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );
      if (!isClickInside) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };


  // 🔍 filter trainees by name, email, or batch
  const filteredTrainees = traineeList.filter((trainee) =>
    trainee.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainee.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainee.batch_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className={`flex flex-col min-h-screen`}>
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>
      <div className="flex flex-grow pt-12">
        <div>
          <SideBar
            handleButtonOpen={handleButtonOpen}
            buttonOpen={buttonOpen}
          />
        </div>
        <div
          className={`${
            buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
          } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
        >
          <div>
            <div className="bg-gray-100">
              <div
                className={`${
                  buttonOpen
                    ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                    : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
                }`}
              >
                <div className="text-gray-500">Dashboard / Trainees</div>
                <div className="mt-5 font-semibold text-xl text-gray-600">
                  Trainees
                </div>
                <div className="mt-5 bg-white rounded px-8 py-10">
                  <div className="font-semibold text-xl text-gray-500">
                    All Trainees
                  </div>
                  <div className="grid grid-cols-2 items-center my-5">
                    <div>
                      <input
                        type="text"
                        placeholder="Search Trainee"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                      />
                    </div>
                    <div className="flex justify-end items-center">
                      <a
                        href="/trainee/add"
                        className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out"
                      >
                        Add Trainee
                      </a>
                    </div>
                  </div>

                  {/* Table */}
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 shadow-sm">
                        <th className="py-2 px-4"></th>
                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                          <div>Trainee Name</div>
                          <button>
                            <ArrowUpWideNarrow size={20} />
                          </button>
                        </th>
                        <th className="py-2 px-4 text-[#8DC63F]">
                          <div className="flex items-center gap-2">
                            <span>Batch</span>
                            <button>
                              <ArrowUpWideNarrow size={20} />
                            </button>
                          </div>
                        </th>
                        <th className="py-2 px-4 text-[#8DC63F]">
                          <div className="flex items-center gap-2">
                            <span>Status</span>
                            <button>
                              <ArrowUpWideNarrow size={20} />
                            </button>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
  {loading ? (
    // Show 5 loading rows (matching rowsPerPage)
    Array.from({ length: rowsPerPage }).map((_, index) => (
      <tr key={index} className="border-b border-gray-200 animate-pulse">
        <td className="py-2 px-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </td>
        <td className="py-2 px-4">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </td>
        <td className="py-2 px-4">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="py-2 px-4">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="py-2 px-4"></td>
      </tr>
    ))
  ) : filteredTrainees.length > 0 ? (
    filteredTrainees.map((trainee, index) => (
      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
        <td className="py-2 px-4">
          {/* <img
            src={IMAGE_URL + trainee.user_profile_photo}
            className="w-10 h-10 rounded-full cursor-pointer"
            alt="profile"
            onError={(e) => (e.currentTarget.src = "/default-profile.png")}
          /> */}
          <UserRound size={20} className="text-[#8DC63F]" />
        </td>
        <td className="py-2 px-4 text-[#8DC63F] font-semibold">
          <button onClick={() => navigate(`/trainee/${trainee.people_id}`)}>{trainee.user_name}</button>
        </td>
        <td className="py-2 px-4 font-semibold text-[#8DC63F]">
          {trainee.batch_name}
        </td>
        <td className="py-2 px-4 font-normal">
          <div
            className={`inline-block px-3 py-1 rounded text-sm ${
              trainee.status === "inactive"
                ? "bg-red-100 animate-pulse text-red-600 font-semibold rounded-full"
                : "text-green-600 bg-green-100 animate-pulse font-semibold rounded-full"
            }`}
          >
            {trainee.status === "inactive" ? "Disabled" : "Active"}
          </div>
        </td>
        <td className="py-2 px-4 relative">
          <button
            onClick={() => toggleDropdown(index)}
            className="text-gray-500"
          >
            <EllipsisVertical size={23} />
          </button>
          {openDropdownIndex === index && (
            <div
              ref={(el) => (dropdownRefs.current[index] = el)}
              className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow-md z-10"
            >
              <button className="block w-full text-left px-4 py-3 hover:bg-gray-50">
                View
              </button>
              {trainee.status === "inactive" ? (
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-gray-50"
                  onClick={() =>
                    showEnableConfirmToast(
                      trainee.user_email,
                      handleTraineeList,
                      token,
                      "active"
                    )
                  }
                >
                  Enable
                </button>
              ) : (
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-gray-50"
                  onClick={() =>
                    showDisableConfirmToast(
                      trainee.user_email,
                      handleTraineeList,
                      token,
                      "inactive"
                    )
                  }
                >
                  Disable
                </button>
              )}
              <button
                onClick={() =>
                  DeleteTraineeToast(trainee.user_email, handleTraineeList, token)
                }
                className="block w-full text-left px-4 py-3 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
        No data found
      </td>
    </tr>
  )}
</tbody>
                  </table>

                  <TablePagination
                    component="div"
                    count={count} // total rows, or total from backend
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default TraineeList;