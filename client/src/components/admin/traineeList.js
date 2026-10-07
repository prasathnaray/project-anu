// import React, { useEffect, useRef, useState } from "react";
// import { TablePagination } from "@mui/material";
// import SideBar from "../sideBar";
// import NavBar from "../navBar";
// import {
//   ArrowUpWideNarrow,
//   ChevronLeft,
//   ChevronRight,
//   EllipsisVertical,
//   User,
//   UserRound,
// } from "lucide-react";
// import TraineeListAPI from "../../API/TraineeListAPI";
// import IMAGE_URL from "../../API/imageUrl";
// import axios from "axios";
// import showDisableConfirmToast from "../../utils/showDisableConfirmToast";
// import showEnableConfirmToast from "../../utils/showEnableConfirmToast";
// import DeleteTraineeToast from "../../utils/deleteTraineeToast";
// import { useNavigate } from "react-router-dom";
// function TraineeList() {
//   const token = localStorage.getItem("user_token");
//   const navigate = useNavigate();
//   const [traineeList, setTraineeList] = useState([]);
//   const [count, setCount] = useState(0);
//   const [buttonOpen, setButtonOpen] = useState(true);
//   const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
//   const dropdownRefs = useRef({});
//   const [searchQuery, setSearchQuery] = useState("");
//  //pagination
//  const [page, setPage] = useState(0);
//  const [rowsPerPage, setRowsPerPage] = useState(5);
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const [loading, setLoading] = React.useState("");
//   const handleTraineeList = async (page, limit) => {
//     try {
//       setLoading(true)
//       const response = await TraineeListAPI(page + 1, limit);
//       setTraineeList(response.data.rows || []);
//       setCount(response.data.rows[0]?.total_count || 0);
//     } catch (error) {
//       console.error("Error fetching trainee list:", error);
//     }
//     finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     handleTraineeList(page, rowsPerPage);
//   }, [page, rowsPerPage]);

//   // close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isClickInside = Object.values(dropdownRefs.current).some(
//         (ref) => ref && ref.contains(event.target)
//       );
//       if (!isClickInside) {
//         setOpenDropdownIndex(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleDropdown = (index) => {
//     setOpenDropdownIndex(openDropdownIndex === index ? null : index);
//   };

//   const handleButtonOpen = () => {
//     setButtonOpen(!buttonOpen);
//   };


//   // 🔍 filter trainees by name, email, or batch
//   const filteredTrainees = traineeList.filter((trainee) =>
//     trainee.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     trainee.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     trainee.batch_name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   return (
//     <div className={`flex flex-col min-h-screen`}>
//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>
//       <div className="flex flex-grow pt-12">
//         <div>
//           <SideBar
//             handleButtonOpen={handleButtonOpen}
//             buttonOpen={buttonOpen}
//           />
//         </div>
//         <div
//           className={`${
//             buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
//           } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
//         >
//           <div>
//             <div className="bg-gray-100">
//               <div
//                 className={`${
//                   buttonOpen
//                     ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
//                     : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
//                 }`}
//               >
//                 <div className="text-gray-500">Dashboard / Trainees</div>
//                 <div className="mt-5 font-semibold text-xl text-gray-600">
//                   Trainees
//                 </div>
//                 <div className="mt-5 bg-white rounded px-8 py-10">
//                   <div className="font-semibold text-xl text-gray-500">
//                     All Trainees
//                   </div>
//                   <div className="grid grid-cols-2 items-center my-5">
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="Search Trainee"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
//                       />
//                     </div>
//                     <div className="flex justify-end items-center">
//                       <a
//                         href="/trainee/add"
//                         className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out"
//                       >
//                         Add Trainee
//                       </a>
//                     </div>
//                   </div>

//                   {/* Table */}
//                   <table className="w-full text-left border-collapse">
//                     <thead>
//                       <tr className="border-b border-gray-300 shadow-sm">
//                         <th className="py-2 px-4"></th>
//                         <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
//                           <div>Trainee Name</div>
//                           <button>
//                             <ArrowUpWideNarrow size={20} />
//                           </button>
//                         </th>
//                         <th className="py-2 px-4 text-[#8DC63F]">
//                           <div className="flex items-center gap-2">
//                             <span>Batch</span>
//                             <button>
//                               <ArrowUpWideNarrow size={20} />
//                             </button>
//                           </div>
//                         </th>
//                         <th className="py-2 px-4 text-[#8DC63F]">
//                           <div className="flex items-center gap-2">
//                             <span>Status</span>
//                             <button>
//                               <ArrowUpWideNarrow size={20} />
//                             </button>
//                           </div>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//   {loading ? (
//     // Show 5 loading rows (matching rowsPerPage)
//     Array.from({ length: rowsPerPage }).map((_, index) => (
//       <tr key={index} className="border-b border-gray-200 animate-pulse">
//         <td className="py-2 px-4">
//           <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//         </td>
//         <td className="py-2 px-4">
//           <div className="h-4 bg-gray-300 rounded w-24"></div>
//         </td>
//         <td className="py-2 px-4">
//           <div className="h-4 bg-gray-300 rounded w-32"></div>
//         </td>
//         <td className="py-2 px-4">
//           <div className="h-4 bg-gray-300 rounded w-16"></div>
//         </td>
//         <td className="py-2 px-4"></td>
//       </tr>
//     ))
//   ) : filteredTrainees.length > 0 ? (
//     filteredTrainees.map((trainee, index) => (
//       <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
//         <td className="py-2 px-4">
//           <img
//             src={IMAGE_URL + trainee.user_profile_photo}
//             className="w-10 h-10 rounded-full cursor-pointer"
//             alt="profile"
//             onError={(e) => (e.currentTarget.src = "/default-profile.png")}
//           />
//           {/* <UserRound size={20} className="text-[#8DC63F]" /> */}
//         </td>
//         <td className="py-2 px-4 text-[#8DC63F] font-semibold">
//           <button onClick={() => navigate(`/trainee/${trainee.people_id}`)}>{trainee.user_name}</button>
//         </td>
//         <td className="py-2 px-4 font-semibold text-[#8DC63F]">
//           {trainee.batch_name}
//         </td>
//         <td className="py-2 px-4 font-normal">
//           <div
//             className={`inline-block px-3 py-1 rounded text-sm ${
//               trainee.status === "inactive"
//                 ? "bg-red-100 animate-pulse text-red-600 font-semibold rounded-full"
//                 : "text-green-600 bg-green-100 animate-pulse font-semibold rounded-full"
//             }`}
//           >
//             {trainee.status === "inactive" ? "Disabled" : "Active"}
//           </div>
//         </td>
//         <td className="py-2 px-4 relative">
//           <button
//             onClick={() => toggleDropdown(index)}
//             className="text-gray-500"
//           >
//             <EllipsisVertical size={23} />
//           </button>
//           {openDropdownIndex === index && (
//             <div
//               ref={(el) => (dropdownRefs.current[index] = el)}
//               className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow-md z-10"
//             >
//               <button className="block w-full text-left px-4 py-3 hover:bg-gray-50">
//                 View
//               </button>
//               {trainee.status === "inactive" ? (
//                 <button
//                   className="block w-full text-left px-4 py-3 hover:bg-gray-50"
//                   onClick={() =>
//                     showEnableConfirmToast(
//                       trainee.user_email,
//                       handleTraineeList,
//                       token,
//                       "active"
//                     )
//                   }
//                 >
//                   Enable
//                 </button>
//               ) : (
//                 <button
//                   className="block w-full text-left px-4 py-3 hover:bg-gray-50"
//                   onClick={() =>
//                     showDisableConfirmToast(
//                       trainee.user_email,
//                       handleTraineeList,
//                       token,
//                       "inactive"
//                     )
//                   }
//                 >
//                   Disable
//                 </button>
//               )}
//               <button
//                 onClick={() =>
//                   DeleteTraineeToast(trainee.user_email, handleTraineeList, token)
//                 }
//                 className="block w-full text-left px-4 py-3 hover:bg-gray-50"
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
//         No data found
//       </td>
//     </tr>
//   )}
// </tbody>
//                   </table>

//                   <TablePagination
//                     component="div"
//                     count={count} // total rows, or total from backend
//                     page={page}
//                     onPageChange={handleChangePage}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     rowsPerPageOptions={[5, 10, 25]}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>  
//     </div>
//   );
// }

// export default TraineeList;
import React, { useEffect, useRef, useState } from "react";
import { TablePagination, Select, MenuItem, FormControl } from "@mui/material";
import SideBar from "../sideBar";
import NavBar from "../navBar";
import {
  EllipsisVertical,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import TraineeListAPI from "../../API/TraineeListAPI";
import showDisableConfirmToast from "../../utils/showDisableConfirmToast";
import showEnableConfirmToast from "../../utils/showEnableConfirmToast";
import DeleteTraineeToast from "../../utils/deleteTraineeToast";
import { useNavigate } from "react-router-dom";
import GetBatchesAPI from "../../API/GetBatchesAPI";
import UpdateTraineeAPI from "../../API/UpdateTraineeAPI"; // create this API similar to updateInstructorAPI
import CustomCloseButton from "../../utils/CustomCloseButton";
import { toast } from "react-toastify";
import TagBatch from "../TagBatch"; // reuse the same modal wrapper

function TraineeList() {
  const token = localStorage.getItem("user_token");
  const navigate = useNavigate();

  // Data states
  const [traineeList, setTraineeList] = useState([]);
  const [count, setCount] = useState(0);
  const [batchList, setBatchList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sidebar
  const [buttonOpen, setButtonOpen] = useState(true);

  // Dropdown
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRefs = useRef({});

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [selectedTraineeEmail, setSelectedTraineeEmail] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(""); // single batch for trainee

  // ─── Pagination handlers ───────────────────────────────────────────────────
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ─── Fetch trainees ────────────────────────────────────────────────────────
  const handleTraineeList = async (pg = page, limit = rowsPerPage) => {
    try {
      setLoading(true);
      const response = await TraineeListAPI(pg + 1, limit);
      setTraineeList(response.data.rows || []);
      setCount(response.data.rows[0]?.total_count || 0);
    } catch (error) {
      console.error("Error fetching trainee list:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch batches ─────────────────────────────────────────────────────────
  const handleBatchAPI = async () => {
    try {
      const result = await GetBatchesAPI(token, 1, 100);
      setBatchList(result.data.rows || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleBatchAPI();
  }, []);

  useEffect(() => {
    handleTraineeList(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // ─── Outside click closes custom dropdown ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );
      if (!isClickInside) setOpenDropdownIndex(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  // ─── Edit handlers ─────────────────────────────────────────────────────────
  const handleEditClick = (trainee) => {
    setSelectedTrainee(trainee);
    setSelectedTraineeEmail(trainee.user_email);

    // Find matching batch id
    const matchedBatch = batchList.find(
      (b) => b.batch_name === trainee.batch_name
    );
    setSelectedBatch(matchedBatch ? matchedBatch.batch_id : "");

    setShowEditModal(true);
    setOpenDropdownIndex(null); // close action dropdown
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedTrainee(null);
    setSelectedTraineeEmail("");
    setSelectedBatch("");
  };

  const handleTraineeSelectChange = (event) => {
    const email = event.target.value;
    setSelectedTraineeEmail(email);
    const trainee = traineeList.find((t) => t.user_email === email);
    if (trainee) {
      const matchedBatch = batchList.find(
        (b) => b.batch_name === trainee.batch_name
      );
      setSelectedBatch(matchedBatch ? matchedBatch.batch_id : "");
    }
  };

  const handleUpdateTrainee = async () => {
    try {
      const payload = {
        user_id: selectedTraineeEmail,
        batch_id: selectedBatch,
      };
      const result = await UpdateTraineeAPI(token, payload);
      //let result = 'hello';
      if (result) {
        toast.success("Trainee batch updated", {
          autoClose: 3000,
          toastId: "updated-trainee-success",
          icon: false,
          closeButton: CustomCloseButton,
        });
        handleCloseModal();
        handleTraineeList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ─── Search filter ─────────────────────────────────────────────────────────
  const filteredTrainees = traineeList.filter(
    (trainee) =>
      trainee.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.batch_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} min-w-0 flex-grow overflow-y-auto bg-[#f6f9f3] h-[calc(100vh-3rem)]`}>
          <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-12">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789383]">Workspace / People</div>
              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Trainees</h1>
                  <p className="mt-1 text-sm text-slate-500">Manage learners, batches, and access status from one place.</p>
                </div>
                <a href="/trainee/add" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#8DC63F] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(99,143,37,.9)] transition hover:-translate-y-0.5 hover:bg-[#7caf35]">
                  <UserPlus size={17} /> Add trainee
                </a>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[#e1ead8] bg-white shadow-[0_18px_50px_-35px_rgba(72,104,30,.55)] sm:rounded-3xl">
                <div className="flex flex-col gap-3 border-b border-[#edf2e9] px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
                  <div><h2 className="text-lg font-bold text-slate-800">Trainee directory</h2><p className="mt-1 text-sm text-slate-500">A complete view of your learner community.</p></div>
                  <div className="relative w-full md:max-w-xs">
                    <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search name, email, or batch" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} className="w-full rounded-xl border border-[#dfead5] bg-[#fbfdf9] py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8dc63f] focus:ring-4 focus:ring-[#8dc63f]/10" />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full border-collapse text-left md:min-w-[720px]">
                  <thead className="bg-[#fbfdf9]">
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="w-14 px-4 py-3"></th>
                      <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#719f2c] sm:px-4">
                        <div>Trainee Name</div>
                      </th>
                      <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#719f2c] sm:px-4">
                        <div className="flex items-center gap-2">
                          <span>Batch</span>
                        </div>
                      </th>
                      <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#719f2c] sm:px-4">
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                        </div>
                      </th>
                      <th className="w-14 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: rowsPerPage }).map((_, index) => (
                        <tr key={index} className="animate-pulse border-b border-[#edf2e9]">
                          <td className="px-4 py-3"><div className="h-9 w-9 rounded-xl bg-[#edf2e8]"></div>
                          </td>
                          <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-[#edf2e8]"></div>
                          </td>
                          <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-[#edf2e8]"></div>
                          </td>
                          <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-[#edf2e8]"></div>
                          </td>
                          <td className="px-4 py-3"></td>
                        </tr>
                      ))
                    ) : filteredTrainees.length > 0 ? (
                      filteredTrainees.map((trainee, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#edf2e9] text-sm text-slate-700 transition hover:bg-[#fbfdf9]"
                        >
                          <td className="px-4 py-3">
                            <img
                              src={trainee.user_profile_photo || "/default-profile.png"}
                              className="h-9 w-9 rounded-xl border border-[#dfead5] object-cover shadow-sm sm:h-10 sm:w-10"
                              alt="profile"
                              onError={(e) =>
                                (e.currentTarget.src = "/default-profile.png")
                              }
                            />
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <button
                              className="text-left font-bold text-slate-800 transition hover:text-[#719f2c]"
                              onClick={() =>
                                navigate(`/trainee/${trainee.people_id}`)
                              }
                            >
                              <span className="block">{trainee.user_name || "Unnamed trainee"}</span><span className="mt-0.5 block max-w-[260px] truncate text-xs font-medium text-slate-400">{trainee.user_email}</span>
                            </button>
                          </td>
                          <td className="px-3 py-3 font-semibold text-slate-600 sm:px-4">
                            <span className="rounded-lg bg-[#f1f7e9] px-2.5 py-1.5 text-xs font-bold text-[#719f2c]">{trainee.batch_name || "Unassigned"}</span>
                          </td>
                          <td className="px-3 py-3 font-normal sm:px-4">
                            <div
                              className={`inline-block px-3 py-1 rounded text-sm ${
                                trainee.status === "inactive"
                                  ? "bg-rose-50 text-rose-600 font-semibold rounded-full border border-rose-100"
                                  : "text-[#5f9222] bg-[#eff8e5] font-semibold rounded-full border border-[#d9edc2]"
                              }`}
                            >
                              {trainee.status === "inactive" ? "Disabled" : "Active"}
                            </div>
                          </td>

                          {/* ── Action dropdown (MUI Select like Instructors) ── */}
                          <td className="relative px-4 py-3">
                            <Select
                              displayEmpty
                              variant="standard"
                              disableUnderline
                              IconComponent={() => null}
                              className="text-sm text-[#8DC63F] bg-transparent cursor-pointer"
                              renderValue={() => (
                                  <button className="rounded-lg p-2 text-gray-500 transition hover:bg-[#eef7e5] hover:text-[#719f2c]">
                                    <EllipsisVertical size={20} />
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
                              <MenuItem
                                value="view"
                                onClick={() =>
                                  navigate(`/trainee/${trainee.people_id}`)
                                }
                              >
                                View
                              </MenuItem>
                              <MenuItem
                                value="edit"
                                onClick={() => handleEditClick(trainee)}
                              >
                                Edit
                              </MenuItem>
                              {trainee.status === "inactive" ? (
                                <MenuItem
                                  value="enable"
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
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  value="disable"
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
                                </MenuItem>
                              )}
                              <MenuItem
                                value="delete"
                                onClick={() =>
                                  DeleteTraineeToast(
                                    trainee.user_email,
                                    handleTraineeList,
                                    token
                                  )
                                }
                              >
                                Delete
                              </MenuItem>
                            </Select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-12 text-center text-slate-500"
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-[#edf2e9] px-2 sm:px-5">
                  <TablePagination
                    component="div"
                    count={count}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={{
                      ".MuiTablePagination-toolbar": { minHeight: 64, paddingLeft: 0, paddingRight: 0, flexWrap: "wrap", gap: 1 },
                      ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { color: "#718096", fontSize: "0.78rem" },
                      ".MuiTablePagination-select": { color: "#526b48" },
                      ".MuiTablePagination-actions button": { color: "#719f2c" },
                    }}
                  />
                </div>
              </div>
        </div>
      </div>
      </div>

      {/* ── Edit Trainee Modal ─────────────────────────────────────────────── */}
      <TagBatch
        isVisible={showEditModal}
        onClose={handleCloseModal}
        selectedBatches={selectedBatch ? [selectedBatch] : []}
        onBatchesChange={(val) =>
          setSelectedBatch(Array.isArray(val) ? val[val.length - 1] : val)
        }
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="font-semibold text-xl text-gray-600">
            Edit Trainee
          </div>
          <button className="text-red-500" onClick={handleCloseModal}>
            <X size={20} />
          </button>
        </div>

        {/* Trainee selector */}
        <div className="mb-5">
          <FormControl fullWidth size="small">
            <Select
              value={selectedTraineeEmail}
              onChange={handleTraineeSelectChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) return "Select Trainee";
                const trainee = traineeList.find(
                  (t) => t.user_email === selected
                );
                return trainee?.user_name || "Select Trainee";
              }}
            >
              <MenuItem value="" disabled>
                Select Trainee
              </MenuItem>
              {traineeList.map((trainee) => (
                <MenuItem key={trainee.user_email} value={trainee.user_email}>
                  {trainee.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Batch selector (single select for trainees) */}
        <div className="mb-5">
          <FormControl fullWidth size="small">
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) return "Select Batch";
                const found = batchList.find((b) => b.batch_id === selected);
                return found?.batch_name || "Select Batch";
              }}
            >
              <MenuItem value="" disabled>
                Select Batch
              </MenuItem>
              {batchList.map((batch) => (
                <MenuItem key={batch.batch_id} value={batch.batch_id}>
                  {batch.batch_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-5">
          <button
            className="border px-4 py-1 bg-[#8DC63F] text-white rounded"
            onClick={handleUpdateTrainee}
          >
            Submit
          </button>
        </div>
      </TagBatch>
    </div>
  );
}

export default TraineeList;
