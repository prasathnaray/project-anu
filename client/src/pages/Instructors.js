import React, { useState, useEffect } from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import {
  ArrowUpWideNarrow,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
} from "lucide-react";
import IMAGE_URL from "../API/imageUrl";
import GetIntructorsAPI from "../API/GetIntructorsAPI";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Select, MenuItem, TablePagination } from "@mui/material";
import DeleteInstructorToast from "../utils/deleteInstructorToast";

function Instructors() {

  const navigate = useNavigate();
  //pagination states and handlers starts here
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0); // total number of rows

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  /// pagination states and handlers ends here
  const [buttonOpen, setButtonOpen] = useState(true);
  const [seeBatches, setSeeBatches] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  const token = localStorage.getItem("user_token");

  // toggle sidebar
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  // toggle batch list expand/collapse
  const handleBatchOpen = (index) => {
    setSeeBatches((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
 //loading effect

  const [loading, setLoading] = useState(false);
  // fetch instructors data
  const getData = async (page, limit) => {
    try {
      setLoading(true);
      const result = await GetIntructorsAPI(token,  page + 1, limit);
      setInstructors(result.data || []);
      setFilteredUsers(result.data); // initialize filtered list
      setCount(result.data[0]?.total_count || 0);
    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  };

  // handle search
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    if (!value) {
      setFilteredUsers(instructors); // reset if input cleared
    } else {
      const filtered = instructors.filter(
        (instructor) =>
          instructor.user_name?.toLowerCase().includes(value) ||
          instructor.status?.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    getData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const decoded = jwtDecode(token);
  if (!decoded.role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={"flex flex-col min-h-screen"}>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      {/* Page content */}
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
            <div
              className={` ${
                buttonOpen === true
                  ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                  : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
              }`}
            >
              <div className="text-gray-500">Dashboard / Instructors</div>
              <div className="mt-5 font-semibold text-xl text-gray-600">
                Instructors
              </div>

              <div className="mt-5 bg-white rounded px-8 py-10 ">
                <div className="font-semibold text-xl text-gray-500">
                  All Instructors
                </div>

                {/* Search + Add button */}
                <div className="grid grid-cols-2 items-center my-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Search Instructor"
                      value={searchItem}
                      onChange={handleSearchChange}
                      className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    <a
                      href="/instructor/add"
                      className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out"
                    >
                      Add Instructor
                    </a>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4"></th>
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Instructor Name</div>
                        <button className="">
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Batch associated</span>
                          <button className="">
                            <ArrowUpWideNarrow size={20} />
                          </button>
                        </div>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          <button className="">
                            <ArrowUpWideNarrow size={20} />
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                   <tbody>
                        {loading ? (
                          // Show 5 skeleton rows or as many as rowsPerPage
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
                        ) : filteredUsers.length > 0 ? (
                          filteredUsers.map((instructor, index) => (
                            <tr key={index} className="text-sm text-gray-700 border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                              <td className="py-2 px-4">
                                <img
                                  src={IMAGE_URL + instructor.user_profile_photo}
                                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                  alt="profile"
                                />
                              </td>
                              <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                <button onClick={() => navigate(`/instructor/${instructor.people_id}`)} className="cursor-pointer">{instructor.user_name}</button>
                              </td>
                              <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                {instructor.batch_names.length > 0 ? (
                                  <div className="flex justify-between items-center gap-2 w-full">
                                    <div className="flex flex-col gap-1">
                                      {seeBatches[index] ? (
                                        <div className="flex flex-wrap gap-1">
                                          {instructor.batch_names.map((id, i) => (
                                            <span key={i} className="inline-block">
                                              {id}
                                              {i < instructor.batch_names.length - 1 && ","}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <div>{instructor.batch_names[0]}</div>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleBatchOpen(index)}
                                      className="shrink-0 text-gray-500"
                                    >
                                      {seeBatches[index] ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                  </div>
                                ) : (
                                  <div>-</div>
                                )}
                              </td>
                              <td className="py-2 px-4 font-normal">
                                <div
                                  className={`inline-block px-3 py-1 rounded text-sm ${
                                    instructor.status === "inactive"
                                      ? "bg-red-100 animate-pulse text-red-600 font-semibold rounded-full"
                                      : "text-green-600 bg-green-100 animate-pulse font-semibold rounded-full"
                                  }`}
                                >
                                  {instructor.status === "inactive" ? "Disabled" : "Active"}
                                </div>
                              </td>
                              <td className="py-2 px-4 relative">
                                <Select
                                  displayEmpty
                                  variant="standard"
                                  disableUnderline
                                  IconComponent={() => null}
                                  className="text-sm text-[#8DC63F] bg-transparent cursor-pointer"
                                  renderValue={() => (
                                    <button className="text-gray-500">
                                      <EllipsisVertical size={23} />
                                    </button>
                                  )}
                                  MenuProps={{
                                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                                    transformOrigin: { vertical: "top", horizontal: "left" },
                                    PaperProps: { style: { marginTop: 8 } },
                                  }}
                                >
                                  <MenuItem value="view">View</MenuItem>
                                  <MenuItem value="edit">Edit</MenuItem>
                                  <MenuItem
                                    value="delete"
                                    onClick={() => {
                                      DeleteInstructorToast(instructor.user_email, getData, token);
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                  <MenuItem value="disable">Disable</MenuItem>
                                </Select>
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
                <div className="mt-3">
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

export default Instructors;