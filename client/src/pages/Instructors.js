import React, { useState, useEffect } from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import {
  ArrowUpWideNarrow,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  X,
} from "lucide-react";
import IMAGE_URL from "../API/imageUrl";
import GetIntructorsAPI from "../API/GetIntructorsAPI";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Select, MenuItem, TablePagination, FormControl, TextField } from "@mui/material";
import DeleteInstructorToast from "../utils/deleteInstructorToast";
import TagBatch from "../components/TagBatch";
import GetBatchesAPI from "../API/GetBatchesAPI";
import updateInstructorAPI from "../API/UpdateInstructorAPI";
import CustomCloseButton from "../utils/CustomCloseButton";
import { toast } from "react-toastify";
function Instructors() {
  // Sidebar state
  const [buttonOpen, setButtonOpen] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  // Data states
  const [instructors, setInstructors] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchItem, setSearchItem] = useState("");

  // Batch expansion state
  const [seeBatches, setSeeBatches] = useState({});

  // Modal states
  const [showTagBatch, setShowTagBatch] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedInstructorEmail, setSelectedInstructorEmail] = useState("");

  const token = localStorage.getItem("user_token");

  // Toggle sidebar
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  // Toggle batch list expand/collapse
  const handleBatchOpen = (index) => {
    setSeeBatches((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch instructors data
  const getData = async (page, limit) => {
    try {
      setLoading(true);
      const result = await GetIntructorsAPI(token, page + 1, limit);
      setInstructors(result.data || []);
      setFilteredUsers(result.data);
      setCount(result.data[0]?.total_count || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch batch list
  const handleBatchAPI = async () => {
    try {
      const result = await GetBatchesAPI(token, 1, 100);
      setBatchList(result.data.rows || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    if (!value) {
      setFilteredUsers(instructors);
    } else {
      const filtered = instructors.filter(
        (instructor) =>
          instructor.user_name?.toLowerCase().includes(value) ||
          instructor.status?.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle batch selection change in modal
  const handleBatchSelectChange = (event) => {
    setSelectedBatches(event.target.value);
  };

  // Handle instructor selection change
  const handleInstructorSelectChange = (event) => {
    const email = event.target.value;
    setSelectedInstructorEmail(email);
    
    // Find the instructor and set their batches
    const instructor = instructors.find(inst => inst.user_email === email);
    if (instructor) {
      const instructorBatchIds = batchList
        .filter((batch) => instructor.batch_names?.includes(batch.batch_name))
        .map((batch) => batch.batch_id);
      setSelectedBatches(instructorBatchIds);
    }
  };

  // Handle edit click - properly set instructor data and batches
  const handleEditClick = (instructor) => {
    setSelectedInstructor({
      user_email: instructor.user_email,
      user_name: instructor.user_name,
      batch_names: instructor.batch_names || [],
      batch_ids: instructor.batch_ids || [],
    });

    // Set instructor email for selection
    setSelectedInstructorEmail(instructor.user_email);

    // Map batch names to batch IDs from batchList
    const instructorBatchIds = batchList
      .filter((batch) => instructor.batch_names?.includes(batch.batch_name))
      .map((batch) => batch.batch_id);

    setSelectedBatches(instructorBatchIds);
    setShowTagBatch(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowTagBatch(false);
    setSelectedInstructor(null);
    setSelectedBatches([]);
    setSelectedInstructorEmail("");
  };

  // Initial data fetch
  useEffect(() => {
    handleBatchAPI();
  }, []);

  useEffect(() => {
    getData(page, rowsPerPage);
  }, [page, rowsPerPage]);
  //
  //console.log(selectedBatches)
  // const [instructorDataUpdate, setInstructorDataUpdate] = useState({
  //   user_id: selectedInstructorEmail,
  //   batch_id: selectedBatches,
  // });
  const instructorDataUpdate = {
    user_id: selectedInstructorEmail,
    batch_id: selectedBatches,
  };
  const handleUpdateInstructorAPICall = async() => {
      try
      {
        let token = localStorage.getItem("user_token");
        const result = await updateInstructorAPI(token, instructorDataUpdate);
        if(result)
        {
            toast.success("Batch Updated", {
                  autoClose: 3000,
                  toastId: "updated-instructor-success",
                  icon: false,
                  closeButton: CustomCloseButton,
            });  
            handleCloseModal();
            getData();
        }
      }
      catch(err)
      {
        console.log(err)
      }
  }
  const decoded = jwtDecode(token);
  if (!decoded.role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        {/* Sidebar */}
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>

        {/* Main Content */}
        <div
          className={`${
            buttonOpen ? "ms-[221px] flex-grow" : "ms-[55.5px] flex-grow"
          }`}
        >
          <div className="bg-gray-100 h-screen">
            <div
              className={`${
                buttonOpen
                  ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                  : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
              }`}
            >
              {/* Breadcrumb */}
              <div className="text-gray-500">Dashboard / Instructors</div>

              {/* Page Title */}
              <div className="mt-5 font-semibold text-xl text-gray-600">
                Instructors
              </div>

              {/* Main Card */}
              <div className="mt-5 bg-white rounded px-8 py-10">
                <div className="font-semibold text-xl text-gray-500">
                  All Instructors
                </div>

                {/* Search and Add Button */}
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
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Batch associated</span>
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
                      <th className="py-2 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: rowsPerPage }).map((_, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 animate-pulse"
                        >
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
                        <tr
                          key={index}
                          className="text-sm text-gray-700 border-b border-gray-200 hover:bg-gray-50 shadow-sm"
                        >
                          <td className="py-2 px-4">
                            <img
                              src={IMAGE_URL + instructor.user_profile_photo}
                              className="w-10 h-10 rounded-full object-cover cursor-pointer"
                              alt="profile"
                            />
                          </td>
                          <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                            <button className="cursor-pointer">
                              {instructor.user_name}
                            </button>
                          </td>
                          <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                            {instructor.batch_names?.length > 0 ? (
                              <div className="flex justify-between items-center gap-2 w-full">
                                <div className="flex flex-col gap-1">
                                  {seeBatches[index] ? (
                                    <div className="flex flex-wrap gap-1">
                                      {instructor.batch_names.map((name, i) => (
                                        <span key={i} className="inline-block">
                                          {name}
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
                                  {seeBatches[index] ? (
                                    <ChevronLeft size={20} />
                                  ) : (
                                    <ChevronRight size={20} />
                                  )}
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
                              {instructor.status === "inactive"
                                ? "Disabled"
                                : "Active"}
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
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left",
                                },
                                transformOrigin: {
                                  vertical: "top",
                                  horizontal: "left",
                                },
                                PaperProps: { style: { marginTop: 8 } },
                              }}
                            >
                              <MenuItem value="view">View</MenuItem>
                              <MenuItem
                                value="edit"
                                onClick={() => handleEditClick(instructor)}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                value="delete"
                                onClick={() => {
                                  DeleteInstructorToast(
                                    instructor.user_email,
                                    getData,
                                    token
                                  );
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
                        <td
                          colSpan={5}
                          className="py-4 px-4 text-center text-gray-500"
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-3">
                  <TablePagination
                    component="div"
                    count={count}
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
      <TagBatch
        isVisible={showTagBatch}
        onClose={handleCloseModal}
        selectedBatches={selectedBatches}
        onBatchesChange={setSelectedBatches}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="font-semibold text-xl text-gray-600">
            Edit Instructor
          </div>
          <button className="text-red-500" onClick={handleCloseModal}>
            <X size={20} />
          </button>
        </div>
        <div>
          <div className="mb-5">
            <FormControl fullWidth size="small">
              <Select
                value={selectedInstructorEmail}
                onChange={handleInstructorSelectChange}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return "Select Instructor";
                  const instructor = instructors.find(inst => inst.user_email === selected);
                  return instructor?.user_name || "Select Instructor";
                }}
              >
                <MenuItem value="" disabled>
                  Select Instructor
                </MenuItem>
                {instructors.map((instructor) => (
                  <MenuItem key={instructor.user_email} value={instructor.user_email}>
                    {instructor.user_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="mb-5">
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={selectedBatches}
                onChange={handleBatchSelectChange}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) return "Select Batch";
                  return selected
                    .map((id) => {
                      const found = batchList.find((b) => b.batch_id === id);
                      return found?.batch_name || "";
                    })
                    .join(", ");
                }}
              >
                {batchList.map((batch) => (
                  <MenuItem key={batch.batch_id} value={batch.batch_id}>
                    {batch.batch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button className="border px-2 py-1 bg-[#8DC63F] text-white" onClick={handleUpdateInstructorAPICall}>Submit</button>
        </div>
      </TagBatch>
    </div>
  );
}

export default Instructors;