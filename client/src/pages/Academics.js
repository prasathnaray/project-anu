// import React, { useState, useEffect, useRef } from "react";
// import NavBar from "../components/navBar";
// import SideBar from "../components/sideBar";
// import { 
//     LayoutDashboard, 
//     BookOpen, 
//     GraduationCap, 
//     Library, 
//     Users, 
//     X, 
//     Eye, 
//     EyeOff, 
//     Mail, 
//     Lock, 
//     Building2, 
//     Phone, 
//     MapPin, 
//     Edit, 
//     Trash2, 
//     MoreVertical,
//     ListFilter,
//     ArrowUpWideNarrow
// } from "lucide-react";
// import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
// import TablePagination from '@mui/material/TablePagination';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import CustomCloseButton from '../utils/CustomCloseButton';
// import { ClipLoader } from "react-spinners";
// import AddScanCenterAPI from "../API/AddScanCenterAPI";

// function Academics() {
//     // Sidebar state
//     const [buttonOpen, setButtonOpen] = useState(true);
    
//     // Pagination states
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [rowCount, setRowCount] = useState(0);
    
//     // Modal states
//     const [openCenterModal, setOpenCenterModal] = useState(false);
//     const [openEditModal, setOpenEditModal] = useState(false);
//     const [openFilterModal, setOpenFilterModal] = useState(false);
    
//     // Loading state
//     const [loading, setLoading] = useState(false);
    
//     // Dropdown state
//     const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
//     const dropdownRefs = useRef({});
    
//     // Search state
//     const [searchItem, setSearchItem] = useState('');
//     const [filteredCenters, setFilteredCenters] = useState([]);
    
//     // Filter state
//     const [filterData, setFilterData] = useState({
//         center_name_filter: '',
//         admin_name_filter: '',
//         center_type_filter: ''
//     });
    
//     // Scan center form data - Updated to match API requirements
//     const [scanCenterData, setScanCenterData] = useState({
//         center_name: '',
//         center_email: '',
//         center_phone: '',
//         center_address: '',
//         status: 'Active'
//     });
    
//     // Edit scan center data
//     const [editCenterData, setEditCenterData] = useState({
//         center_id: '',
//         center_name: '',
//         center_email: '',
//         center_phone: '',
//         center_address: '',
//         admin_name: '',
//         admin_email: '',
//         admin_phone: ''
//     });
    
//     // Scan centers list
//     const [scanCentersList, setScanCentersList] = useState([]);

//     // Handlers
//     const handleButtonOpen = () => {
//         setButtonOpen(!buttonOpen);
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const handleOpenCenterModal = () => {
//         setOpenCenterModal(true);
//     };

//     const handleCloseCenterModal = () => {
//         setOpenCenterModal(false);
//         setScanCenterData({
//             center_name: '',
//             center_email: '',
//             center_phone: '',
//             center_address: '',
//             status: 'Active'
//         });
//     };

//     const handleOpenEditModal = (center) => {
//         setEditCenterData({
//             center_id: center.center_id,
//             center_name: center.center_name,
//             center_email: center.admin_email,
//             center_phone: center.center_phone,
//             center_address: center.center_address,
//             admin_name: center.admin_name,
//             admin_email: center.admin_email,
//             admin_phone: center.admin_phone || center.center_phone
//         });
//         setOpenEditModal(true);
//     };

//     const handleCloseEditModal = () => {
//         setOpenEditModal(false);
//         setEditCenterData({
//             center_id: '',
//             center_name: '',
//             center_email: '',
//             center_phone: '',
//             center_address: '',
//             admin_name: '',
//             admin_email: '',
//             admin_phone: ''
//         });
//     };

//     const handleOpenFilterModal = () => {
//         setOpenFilterModal(true);
//     };

//     const handleCloseFilterModal = () => {
//         setOpenFilterModal(false);
//         setFilterData({
//             center_name_filter: '',
//             admin_name_filter: '',
//             center_type_filter: ''
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setScanCenterData({
//             ...scanCenterData,
//             [name]: value
//         });
//     };

//     const handleEditChange = (e) => {
//         const { name, value } = e.target;
//         setEditCenterData({
//             ...editCenterData,
//             [name]: value
//         });
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilterData({
//             ...filterData,
//             [name]: value
//         });
//     };

//     const handleSearchChange = (e) => {
//         const value = e.target.value.toLowerCase();
//         setSearchItem(value);

//         if (!value) {
//             setFilteredCenters(scanCentersList);
//         } else {
//             const filtered = scanCentersList.filter((center) =>
//                 center.center_name?.toLowerCase().includes(value) ||
//                 center.admin_name?.toLowerCase().includes(value)
//             );
//             setFilteredCenters(filtered);
//         }
//     };

//     const toggleDropdown = (index) => {
//         setOpenDropdownIndex(openDropdownIndex === index ? null : index);
//     };

//     // API Calls
//     const fetchScanCenters = async (token, page, limit) => {
//         try {
//             setLoading(true);
//             // Replace with your actual API call
//             // const result = await GetScanCentersAPI(token, page + 1, limit);
            
//             // Simulated data for demonstration
//             const mockData = [
//                 {
//                     center_id: 1,
//                     center_name: "MediScan Training Center",
//                     admin_name: "Dr. John Smith",
//                     admin_email: "john@mediscan.com",
//                     center_phone: "+1 234 567 8900",
//                     center_address: "123 Medical Plaza, New York",
//                     total_students: 45,
//                     total_instructors: 8,
//                     status: "Active"
//                 },
//                 {
//                     center_id: 2,
//                     center_name: "UltraSound Academy",
//                     admin_name: "Dr. Sarah Johnson",
//                     admin_email: "sarah@ultrasoundacademy.com",
//                     center_phone: "+1 234 567 8901",
//                     center_address: "456 Health Blvd, California",
//                     total_students: 67,
//                     total_instructors: 12,
//                     status: "Active"
//                 },
//                 {
//                     center_id: 3,
//                     center_name: "Diagnostic Imaging Institute",
//                     admin_name: "Dr. Michael Brown",
//                     admin_email: "michael@diaginstitute.com",
//                     center_phone: "+1 234 567 8902",
//                     center_address: "789 Medical Rd, Texas",
//                     total_students: 32,
//                     total_instructors: 6,
//                     status: "Pending"
//                 }
//             ];

//             setScanCentersList(mockData);
//             setFilteredCenters(mockData);
//             setRowCount(mockData.length);
//         } catch (err) {
//             console.log(err);
//             toast.error("Failed to fetch scan centers", {
//                 autoClose: 3000,
//                 toastId: 'fetch-error',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validation - Updated to match new fields
//         if (!scanCenterData.center_name || !scanCenterData.center_email || 
//             !scanCenterData.center_phone || !scanCenterData.center_address) {
//             toast.error("Please fill all the fields", {
//                 autoClose: 3000,
//                 toastId: 'input-missing',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//             return;
//         }

//         try {
//             setLoading(true);
            
//             const token = localStorage.getItem('user_token');
//             const response = await AddScanCenterAPI(token, scanCenterData);
            
//             // Axios returns data in response.data
//             if (response.status === 200 || response.status === 201) {
//                 toast.success("Scan Center Onboarded Successfully!", {
//                     autoClose: 4000,
//                     toastId: 'success-center-created',
//                     icon: false,
//                     closeButton: CustomCloseButton,
//                 });
                
//                 handleCloseCenterModal();
//                 fetchScanCenters(token, page, rowsPerPage);
//             }
//         } catch (err) {
//             console.error(err);
//             // Axios error response is in err.response.data
//             const errorMessage = err.response?.data?.message || err.message || "Failed to onboard scan center";
//             toast.error(errorMessage, {
//                 autoClose: 3000,
//                 toastId: 'create-error',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!editCenterData.center_name || !editCenterData.center_email || 
//             !editCenterData.center_phone || !editCenterData.center_address || 
//             !editCenterData.admin_name || !editCenterData.admin_email) {
//             toast.error("Please fill all the fields", {
//                 autoClose: 3000,
//                 toastId: 'input-missing',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//             return;
//         }

//         try {
//             setLoading(true);
//             // Replace with your actual API call
//             // const response = await UpdateScanCenterAPI(token, editCenterData);
            
//             toast.success("Scan Center Updated Successfully", {
//                 autoClose: 3000,
//                 toastId: 'success-center-updated',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
            
//             handleCloseEditModal();
//             const token = localStorage.getItem('user_token');
//             fetchScanCenters(token, page, rowsPerPage);
//         } catch (err) {
//             console.log(err);
//             toast.error("Failed to update scan center", {
//                 autoClose: 3000,
//                 toastId: 'update-error',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (center_id) => {
//         if (window.confirm("Are you sure you want to delete this scan center?")) {
//             try {
//                 setLoading(true);
//                 // Replace with your actual API call
//                 // await DeleteScanCenterAPI(token, center_id);
                
//                 toast.success("Scan Center Deleted Successfully", {
//                     autoClose: 3000,
//                     toastId: 'success-center-deleted',
//                     icon: false,
//                     closeButton: CustomCloseButton,
//                 });
                
//                 const token = localStorage.getItem('user_token');
//                 fetchScanCenters(token, page, rowsPerPage);
//             } catch (err) {
//                 console.log(err);
//                 toast.error("Failed to delete scan center", {
//                     autoClose: 3000,
//                     toastId: 'delete-error',
//                     icon: false,
//                     closeButton: CustomCloseButton,
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const handleFilterSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!filterData.center_name_filter && !filterData.admin_name_filter && !filterData.center_type_filter) {
//             toast.error("At least one filter must be filled", {
//                 autoClose: 3000,
//                 toastId: 'filter-error',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//             return;
//         }

//         try {
//             setLoading(true);
//             // Replace with your actual API call
//             // const result = await FilterScanCentersAPI(token, filterData);
            
//             // For demonstration, filter locally
//             const filtered = scanCentersList.filter((center) => {
//                 const matchesName = !filterData.center_name_filter || 
//                     center.center_name.toLowerCase().includes(filterData.center_name_filter.toLowerCase());
//                 const matchesAdmin = !filterData.admin_name_filter || 
//                     center.admin_name.toLowerCase().includes(filterData.admin_name_filter.toLowerCase());
                
//                 return matchesName && matchesAdmin;
//             });
            
//             setFilteredCenters(filtered);
//             setRowCount(filtered.length);
//             handleCloseFilterModal();
//         } catch (err) {
//             console.log(err);
//             toast.error("Failed to apply filter", {
//                 autoClose: 3000,
//                 toastId: 'filter-apply-error',
//                 icon: false,
//                 closeButton: CustomCloseButton,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClearFilter = () => {
//         setFilterData({
//             center_name_filter: '',
//             admin_name_filter: '',
//             center_type_filter: ''
//         });
//         setFilteredCenters(scanCentersList);
//         setRowCount(scanCentersList.length);
//         handleCloseFilterModal();
//     };

//     // Click outside dropdown handler
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             const isClickInside = Object.values(dropdownRefs.current).some(ref =>
//                 ref && ref.contains(event.target)
//             );

//             if (!isClickInside) {
//                 setOpenDropdownIndex(null);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Fetch data on mount and when pagination changes
//     useEffect(() => {
//         const token = localStorage.getItem('user_token');
//         fetchScanCenters(token, page, rowsPerPage);
//     }, [page, rowsPerPage]);

//     return (
//         <div className={`flex flex-col min-h-screen`}>
//             <ToastContainer />
//             <div>
//                 <NavBar />
//             </div>
//             <div className="flex flex-grow">
//                 <div>
//                     <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
//                 </div>
//                 <div 
//                     className={`${
//                         buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
//                     } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
//                 >
//                     {/* Breadcrumb Navigation */}
//                     <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
//                         <LayoutDashboard size={15} /> Dashboard / <Building2 size={15}/> 
//                         <span className="text-[15px]">Scan Centers</span>
//                     </div>

//                     {/* Main Content */}
//                     <div className={`${
//                         buttonOpen === true 
//                             ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" 
//                             : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
//                     }`}>
//                         {/* Page Title */}
//                         <div className="mt-5 font-semibold text-xl text-gray-600">
//                             Academic Management
//                         </div>

//                         {/* Stats Cards */}
//                         <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-6">
//                             <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-gray-500 text-sm">Total Scan Centers</p>
//                                         <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
//                                             {scanCentersList.length}
//                                         </h3>
//                                     </div>
//                                     <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
//                                         <Building2 className="text-[#8DC63F]" size={24} />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-gray-500 text-sm">Active Centers</p>
//                                         <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
//                                             {scanCentersList.filter(s => s.status === "Active").length}
//                                         </h3>
//                                     </div>
//                                     <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
//                                         <GraduationCap className="text-[#8DC63F]" size={24} />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-gray-500 text-sm">Total Trainees</p>
//                                         <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
//                                             {scanCentersList.reduce((acc, center) => acc + (center.total_students || 0), 0)}
//                                         </h3>
//                                     </div>
//                                     <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
//                                         <Users className="text-[#8DC63F]" size={24} />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-gray-500 text-sm">Total Instructors</p>
//                                         <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
//                                             {scanCentersList.reduce((acc, center) => acc + (center.total_instructors || 0), 0)}
//                                         </h3>
//                                     </div>
//                                     <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
//                                         <BookOpen className="text-[#8DC63F]" size={24} />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Scan Centers List Section */}
//                         <div className="mt-8 bg-white rounded-lg px-8 py-10 shadow-sm">
//                             <div className="font-semibold text-xl text-gray-500 flex justify-between items-center mb-6">
//                                 <div>Onboarded Scan Centers</div>
//                                 <div>
//                                     <button 
//                                         className="p-2 rounded-lg active:scale-95 transition-transform duration-100 mr-2" 
//                                         onClick={handleOpenFilterModal}
//                                     >
//                                         <ListFilter size={20}/>
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Search and Create Button */}
//                             <div className="grid grid-cols-2 items-center my-5">
//                                 <div>
//                                     <input
//                                         type="text"
//                                         placeholder="Search Scan Centers"
//                                         value={searchItem}
//                                         onChange={handleSearchChange}
//                                         className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
//                                     />
//                                 </div>
//                                 <div className="flex justify-end items-center">
//                                     <button 
//                                         className="bg-[#8DC63F] hover:bg-[#7AB52F] text-white rounded px-6 py-2 font-semibold text-sm transition-all ease-in-out"
//                                         onClick={handleOpenCenterModal}
//                                     >
//                                         + Onboard Scan Center
//                                     </button>
//                                 </div>
//                             </div>
                            
//                             {/* Scan Centers Table */}
//                             <div className="overflow-x-auto">
//                                 <table className="w-full text-left border-collapse">
//                                     <thead>
//                                         <tr className="border-b border-gray-300 shadow-sm text-sm">
//                                             <th className="py-3 px-4 text-[#8DC63F]">
//                                                 <div className="flex items-center gap-2">
//                                                     <span>Center Name</span>
//                                                     <button><ArrowUpWideNarrow size={20}/></button>
//                                                 </div>
//                                             </th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Admin Name</th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Admin Email</th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Phone</th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Trainees</th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Instructors</th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Status</th>
//                                             <th className="py-3 px-4 text-[#8DC63F]">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {loading ? (
//                                             <tr>
//                                                 <td colSpan={8} className="py-8 text-center">
//                                                     <div className="flex justify-center items-center gap-2">
//                                                         <div className="w-5 h-5 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
//                                                         <span className="text-gray-600 font-medium">Loading scan centers...</span>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ) : filteredCenters.length > 0 ? (
//                                             filteredCenters
//                                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                 .map((center, index) => (
//                                                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
//                                                     <td className="py-3 px-4 text-gray-700 font-semibold">
//                                                         <div className="flex items-center gap-2">
//                                                             <Building2 size={18} className="text-[#8DC63F]" />
//                                                             {center.center_name}
//                                                         </div>
//                                                     </td>
//                                                     <td className="py-3 px-4 text-gray-600">{center.admin_name}</td>
//                                                     <td className="py-3 px-4 text-gray-600">{center.admin_email}</td>
//                                                     <td className="py-3 px-4 text-gray-600">{center.center_phone}</td>
//                                                     <td className="py-3 px-4 text-gray-600 text-center">{center.total_students}</td>
//                                                     <td className="py-3 px-4 text-gray-600 text-center">{center.total_instructors}</td>
//                                                     <td className="py-3 px-4">
//                                                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                                             center.status === 'Active' 
//                                                                 ? 'bg-green-100 text-green-700' 
//                                                                 : 'bg-yellow-100 text-yellow-700'
//                                                         }`}>
//                                                             {center.status}
//                                                         </span>
//                                                     </td>
//                                                     <td className="py-3 px-4 relative">
//                                                         <button 
//                                                             onClick={() => toggleDropdown(index)}
//                                                             className="p-1 hover:bg-gray-100 rounded"
//                                                         >
//                                                             <MoreVertical size={20} className="text-gray-600" />
//                                                         </button>
//                                                         {openDropdownIndex === index && (
//                                                             <div
//                                                                 ref={(el) => (dropdownRefs.current[index] = el)}
//                                                                 className={`absolute right-8 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10
//                                                                     transition-all ease-in-out duration-500 origin-top-right
//                                                                     ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
//                                                                 `}
//                                                             >
//                                                                 <button 
//                                                                     className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
//                                                                     onClick={() => {
//                                                                         // View details logic
//                                                                         console.log("View details", center);
//                                                                     }}
//                                                                 >
//                                                                     <Eye size={16} />
//                                                                     View Details
//                                                                 </button>
//                                                                 <button 
//                                                                     className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
//                                                                     onClick={() => {
//                                                                         handleOpenEditModal(center);
//                                                                         setOpenDropdownIndex(null);
//                                                                     }}
//                                                                 >
//                                                                     <Edit size={16} />
//                                                                     Edit
//                                                                 </button>
//                                                                 <button 
//                                                                     className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
//                                                                     onClick={() => {
//                                                                         handleDelete(center.center_id);
//                                                                         setOpenDropdownIndex(null);
//                                                                     }}
//                                                                 >
//                                                                     <Trash2 size={16} />
//                                                                     Delete
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
//                                                     No scan centers onboarded yet
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* Pagination */}
//                             <div className="flex justify-end items-center mt-6">
//                                 <TablePagination 
//                                     component="div"
//                                     count={rowCount}
//                                     page={page}
//                                     onPageChange={handleChangePage}
//                                     rowsPerPage={rowsPerPage}
//                                     onRowsPerPageChange={handleChangeRowsPerPage}
//                                     rowsPerPageOptions={[5, 10, 25]}
//                                 />
//                             </div>
//                         </div>

//                         {/* Onboard Scan Center Modal - UPDATED */}
//                         {openCenterModal && (
//                             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                                 <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                                     <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//                                         <h2 className="text-xl font-semibold text-gray-800">Onboard New Scan Center</h2>
//                                         <button 
//                                             onClick={handleCloseCenterModal}
//                                             className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
//                                         >
//                                             <X size={24} />
//                                         </button>
//                                     </div>
                                    
//                                     <form onSubmit={handleSubmit} className="p-6">
//                                         {/* Scan Center Information */}
//                                         <div className="mb-6">
//                                             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                                                 <Building2 size={20} className="text-[#8DC63F]" />
//                                                 Scan Center Information
//                                             </h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Name"
//                                                     name="center_name"
//                                                     value={scanCenterData.center_name}
//                                                     onChange={handleChange}
//                                                     required
//                                                     size="small"
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Email"
//                                                     name="center_email"
//                                                     type="email"
//                                                     value={scanCenterData.center_email}
//                                                     onChange={handleChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Phone"
//                                                     name="center_phone"
//                                                     value={scanCenterData.center_phone}
//                                                     onChange={handleChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Address"
//                                                     name="center_address"
//                                                     value={scanCenterData.center_address}
//                                                     onChange={handleChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <MapPin size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                             </div>
//                                             <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
//                                                 <p className="text-sm text-blue-800 flex items-start gap-2">
//                                                     <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                                     </svg>
//                                                     <span>
//                                                         <strong>Auto-Generated Credentials:</strong> Upon submission, login credentials will be automatically generated and sent to the center's email address.
//                                                     </span>
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Action Buttons */}
//                                         <div className="flex justify-end gap-3 pt-4 border-t">
//                                             <button
//                                                 type="button"
//                                                 onClick={handleCloseCenterModal}
//                                                 className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 type="submit"
//                                                 disabled={loading}
//                                                 className={`px-6 py-2 rounded font-semibold transition-colors ${
//                                                     loading 
//                                                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                                                         : 'bg-[#8DC63F] hover:bg-[#7AB52F] text-white'
//                                                 }`}
//                                             >
//                                                 {loading ? (
//                                                     <div className="flex items-center gap-2">
//                                                         <ClipLoader size={16} color="#666" />
//                                                         <span>Processing...</span>
//                                                     </div>
//                                                 ) : (
//                                                     'Onboard Scan Center'
//                                                 )}
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Edit Scan Center Modal */}
//                         {openEditModal && (
//                             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                                 <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//                                     <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//                                         <h2 className="text-xl font-semibold text-gray-800">Edit Scan Center</h2>
//                                         <button 
//                                             onClick={handleCloseEditModal}
//                                             className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
//                                         >
//                                             <X size={24} />
//                                         </button>
//                                     </div>
                                    
//                                     <form onSubmit={handleUpdateSubmit} className="p-6">
//                                         {/* Scan Center Information */}
//                                         <div className="mb-6">
//                                             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                                                 <Building2 size={20} className="text-[#8DC63F]" />
//                                                 Scan Center Information
//                                             </h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Name"
//                                                     name="center_name"
//                                                     value={editCenterData.center_name}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Email"
//                                                     name="center_email"
//                                                     type="email"
//                                                     value={editCenterData.center_email}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Phone"
//                                                     name="center_phone"
//                                                     value={editCenterData.center_phone}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Center Address"
//                                                     name="center_address"
//                                                     value={editCenterData.center_address}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <MapPin size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Admin Information */}
//                                         <div className="mb-6">
//                                             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                                                 <Users size={20} className="text-[#8DC63F]" />
//                                                 Admin Information
//                                             </h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Admin Name"
//                                                     name="admin_name"
//                                                     value={editCenterData.admin_name}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Admin Phone"
//                                                     name="admin_phone"
//                                                     value={editCenterData.admin_phone}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                     InputProps={{
//                                                         startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Admin Email"
//                                                     name="admin_email"
//                                                     type="email"
//                                                     value={editCenterData.admin_email}
//                                                     onChange={handleEditChange}
//                                                     required
//                                                     size="small"
//                                                     className="md:col-span-2"
//                                                     InputProps={{
//                                                         startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Action Buttons */}
//                                         <div className="flex justify-end gap-3 pt-4 border-t">
//                                             <button
//                                                 type="button"
//                                                 onClick={handleCloseEditModal}
//                                                 className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 type="submit"
//                                                 disabled={loading}
//                                                 className={`px-6 py-2 rounded font-semibold transition-colors ${
//                                                     loading 
//                                                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                                                         : 'bg-[#8DC63F] hover:bg-[#7AB52F] text-white'
//                                                 }`}
//                                             >
//                                                 {loading ? (
//                                                     <div className="flex items-center gap-2">
//                                                         <ClipLoader size={16} color="#666" />
//                                                         <span>Updating...</span>
//                                                     </div>
//                                                 ) : (
//                                                     'Update Scan Center'
//                                                 )}
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Filter Modal */}
//                         {openFilterModal && (
//                             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                                 <div className="bg-white rounded-lg w-full max-w-md">
//                                     <div className="px-6 py-4 border-b flex justify-between items-center">
//                                         <h2 className="text-lg font-semibold">Filter Scan Centers</h2>
//                                         <button 
//                                             onClick={handleCloseFilterModal}
//                                             className="text-red-500 hover:bg-red-50 p-1 rounded"
//                                         >
//                                             <X size={24} />
//                                         </button>
//                                     </div>
                                    
//                                     <form onSubmit={handleFilterSubmit} className="p-6">
//                                         <div className="grid grid-cols-1 gap-5">
//                                             <TextField
//                                                 label="Center Name"
//                                                 type="text"
//                                                 name="center_name_filter"
//                                                 value={filterData.center_name_filter}
//                                                 onChange={handleFilterChange}
//                                                 variant="standard"
//                                                 fullWidth
//                                             />
//                                             <TextField
//                                                 label="Admin Name"
//                                                 type="text"
//                                                 name="admin_name_filter"
//                                                 value={filterData.admin_name_filter}
//                                                 onChange={handleFilterChange}
//                                                 variant="standard"
//                                                 fullWidth
//                                             />
//                                         </div>
                                        
//                                         <div className="mt-5 flex justify-end items-center gap-4">
//                                             <button 
//                                                 type="button"
//                                                 onClick={handleClearFilter}
//                                                 className="text-red-600 font-semibold hover:bg-red-50 p-2 rounded"
//                                             >
//                                                 Clear
//                                             </button>
//                                             <button 
//                                                 type="submit"
//                                                 className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white hover:bg-[#7AB52F] transition-colors"
//                                             >
//                                                 Apply
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Academics;


import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import { 
    LayoutDashboard, 
    BookOpen, 
    GraduationCap, 
    Library, 
    Users, 
    X, 
    Eye, 
    EyeOff, 
    Mail, 
    Lock, 
    Building2, 
    Phone, 
    MapPin, 
    Edit, 
    Trash2, 
    MoreVertical,
    ListFilter,
    ArrowUpWideNarrow
} from "lucide-react";
import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomCloseButton from '../utils/CustomCloseButton';
import { ClipLoader } from "react-spinners";
import AddScanCenterAPI from "../API/AddScanCenterAPI";
import GetScanCentersAPI from "../API/GetScanCentersAPI";

function Academics() {
    // Sidebar state
    const [buttonOpen, setButtonOpen] = useState(true);
    
    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    
    // Modal states
    const [openCenterModal, setOpenCenterModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    
    // Loading state
    const [loading, setLoading] = useState(false);
    
    // Dropdown state
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const dropdownRefs = useRef({});
    
    // Search state
    const [searchItem, setSearchItem] = useState('');
    const [filteredCenters, setFilteredCenters] = useState([]);
    
    // Filter state
    const [filterData, setFilterData] = useState({
        center_name_filter: '',
        admin_email_filter: '',
        status_filter: ''
    });
    
    // Scan center form data
    const [scanCenterData, setScanCenterData] = useState({
        center_name: '',
        center_email: '',
        center_phone: '',
        center_address: '',
        status: 'Active'
    });
    
    // Edit scan center data
    const [editCenterData, setEditCenterData] = useState({
        center_id: '',
        center_name: '',
        center_email: '',
        center_phone: '',
        center_address: '',
        admin_user_email: '',
        status: ''
    });
    
    // Scan centers list
    const [scanCentersList, setScanCentersList] = useState([]);

    // Handlers
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenCenterModal = () => {
        setOpenCenterModal(true);
    };

    const handleCloseCenterModal = () => {
        setOpenCenterModal(false);
        setScanCenterData({
            center_name: '',
            center_email: '',
            center_phone: '',
            center_address: '',
            status: 'Active'
        });
    };

    const handleOpenEditModal = (center) => {
        setEditCenterData({
            center_id: center.center_id,
            center_name: center.center_name,
            center_email: center.center_email,
            center_phone: center.center_phone,
            center_address: center.center_address,
            admin_user_email: center.admin_user_email,
            status: center.status
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditCenterData({
            center_id: '',
            center_name: '',
            center_email: '',
            center_phone: '',
            center_address: '',
            admin_user_email: '',
            status: ''
        });
    };

    const handleOpenFilterModal = () => {
        setOpenFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setOpenFilterModal(false);
        setFilterData({
            center_name_filter: '',
            admin_email_filter: '',
            status_filter: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setScanCenterData({
            ...scanCenterData,
            [name]: value
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditCenterData({
            ...editCenterData,
            [name]: value
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterData({
            ...filterData,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchItem(value);

        if (!value) {
            setFilteredCenters(scanCentersList);
        } else {
            const filtered = scanCentersList.filter((center) =>
                center.center_name?.toLowerCase().includes(value) ||
                center.admin_user_email?.toLowerCase().includes(value) ||
                center.center_email?.toLowerCase().includes(value)
            );
            setFilteredCenters(filtered);
        }
    };

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    // API Calls
    const fetchScanCenters = async (token) => {
        try {
            setLoading(true);
            const result = await GetScanCentersAPI(token, page + 1, rowsPerPage);
            
            if (result.status === "success" && result.data) {
                setScanCentersList(result.data);
                setFilteredCenters(result.data);
                setRowCount(result.data.length);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch scan centers", {
                autoClose: 3000,
                toastId: 'fetch-error',
                icon: false,
                closeButton: CustomCloseButton,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!scanCenterData.center_name || !scanCenterData.center_email || 
            !scanCenterData.center_phone || !scanCenterData.center_address) {
            toast.error("Please fill all the fields", {
                autoClose: 3000,
                toastId: 'input-missing',
                icon: false,
                closeButton: CustomCloseButton,
            });
            return;
        }

        try {
            setLoading(true);
            
            const token = localStorage.getItem('user_token');
            const response = await AddScanCenterAPI(token, scanCenterData);
            
            if (response.status === 200 || response.status === 201) {
                toast.success("Scan Center Onboarded Successfully!", {
                    autoClose: 4000,
                    toastId: 'success-center-created',
                    icon: false,
                    closeButton: CustomCloseButton,
                });
                
                handleCloseCenterModal();
                fetchScanCenters(token);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to onboard scan center";
            toast.error(errorMessage, {
                autoClose: 3000,
                toastId: 'create-error',
                icon: false,
                closeButton: CustomCloseButton,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        if (!editCenterData.center_name || !editCenterData.center_email || 
            !editCenterData.center_phone || !editCenterData.center_address) {
            toast.error("Please fill all the fields", {
                autoClose: 3000,
                toastId: 'input-missing',
                icon: false,
                closeButton: CustomCloseButton,
            });
            return;
        }

        try {
            setLoading(true);
            // Replace with your actual API call
            // const response = await UpdateScanCenterAPI(token, editCenterData);
            
            toast.success("Scan Center Updated Successfully", {
                autoClose: 3000,
                toastId: 'success-center-updated',
                icon: false,
                closeButton: CustomCloseButton,
            });
            
            handleCloseEditModal();
            const token = localStorage.getItem('user_token');
            fetchScanCenters(token);
        } catch (err) {
            console.log(err);
            toast.error("Failed to update scan center", {
                autoClose: 3000,
                toastId: 'update-error',
                icon: false,
                closeButton: CustomCloseButton,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (center_id) => {
        if (window.confirm("Are you sure you want to delete this scan center?")) {
            try {
                setLoading(true);
                // Replace with your actual API call
                // await DeleteScanCenterAPI(token, center_id);
                
                toast.success("Scan Center Deleted Successfully", {
                    autoClose: 3000,
                    toastId: 'success-center-deleted',
                    icon: false,
                    closeButton: CustomCloseButton,
                });
                
                const token = localStorage.getItem('user_token');
                fetchScanCenters(token);
            } catch (err) {
                console.log(err);
                toast.error("Failed to delete scan center", {
                    autoClose: 3000,
                    toastId: 'delete-error',
                    icon: false,
                    closeButton: CustomCloseButton,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        
        if (!filterData.center_name_filter && !filterData.admin_email_filter && !filterData.status_filter) {
            toast.error("At least one filter must be filled", {
                autoClose: 3000,
                toastId: 'filter-error',
                icon: false,
                closeButton: CustomCloseButton,
            });
            return;
        }

        try {
            setLoading(true);
            
            // Filter locally based on API data
            const filtered = scanCentersList.filter((center) => {
                const matchesName = !filterData.center_name_filter || 
                    center.center_name.toLowerCase().includes(filterData.center_name_filter.toLowerCase());
                const matchesEmail = !filterData.admin_email_filter || 
                    center.admin_user_email.toLowerCase().includes(filterData.admin_email_filter.toLowerCase());
                const matchesStatus = !filterData.status_filter || 
                    center.status === filterData.status_filter;
                
                return matchesName && matchesEmail && matchesStatus;
            });
            
            setFilteredCenters(filtered);
            setRowCount(filtered.length);
            handleCloseFilterModal();
        } catch (err) {
            console.log(err);
            toast.error("Failed to apply filter", {
                autoClose: 3000,
                toastId: 'filter-apply-error',
                icon: false,
                closeButton: CustomCloseButton,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilter = () => {
        setFilterData({
            center_name_filter: '',
            admin_email_filter: '',
            status_filter: ''
        });
        setFilteredCenters(scanCentersList);
        setRowCount(scanCentersList.length);
        handleCloseFilterModal();
    };

    // Click outside dropdown handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickInside = Object.values(dropdownRefs.current).some(ref =>
                ref && ref.contains(event.target)
            );

            if (!isClickInside) {
                setOpenDropdownIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch data on mount and when pagination changes
    useEffect(() => {
        const token = localStorage.getItem('user_token');
        fetchScanCenters(token);
    }, [page, rowsPerPage]);

    return (
        <div className={`flex flex-col min-h-screen`}>
            <ToastContainer />
            <div>
                <NavBar />
            </div>
            <div className="flex flex-grow">
                <div>
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                </div>
                <div 
                    className={`${
                        buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
                    } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
                >
                    {/* Breadcrumb Navigation */}
                    <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                        <LayoutDashboard size={15} /> Dashboard / <Building2 size={15}/> 
                        <span className="text-[15px]">Scan Centers</span>
                    </div>

                    {/* Main Content */}
                    <div className={`${
                        buttonOpen === true 
                            ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" 
                            : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
                    }`}>
                        {/* Page Title */}
                        <div className="mt-5 font-semibold text-xl text-gray-600">
                            Academic Management
                        </div>

                        {/* Stats Cards */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Scan Centers</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
                                            {scanCentersList.length}
                                        </h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <Building2 className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Active Centers</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
                                            {scanCentersList.filter(s => s.status === "Active").length}
                                        </h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <GraduationCap className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Pending Centers</p>
                                        <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                                            {scanCentersList.filter(s => s.status === "Pending").length}
                                        </h3>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <Building2 className="text-yellow-600" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Recent Additions</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
                                            {scanCentersList.filter(center => {
                                                const createdDate = new Date(center.created_at);
                                                const thirtyDaysAgo = new Date();
                                                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                                return createdDate >= thirtyDaysAgo;
                                            }).length}
                                        </h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <BookOpen className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scan Centers List Section */}
                        <div className="mt-8 bg-white rounded-lg px-8 py-10 shadow-sm">
                            <div className="font-semibold text-xl text-gray-500 flex justify-between items-center mb-6">
                                <div>Onboarded Scan Centers</div>
                                <div>
                                    <button 
                                        className="p-2 rounded-lg active:scale-95 transition-transform duration-100 mr-2" 
                                        onClick={handleOpenFilterModal}
                                    >
                                        <ListFilter size={20}/>
                                    </button>
                                </div>
                            </div>

                            {/* Search and Create Button */}
                            <div className="grid grid-cols-2 items-center my-5">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search Scan Centers"
                                        value={searchItem}
                                        onChange={handleSearchChange}
                                        className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                    />
                                </div>
                                <div className="flex justify-end items-center">
                                    <button 
                                        className="bg-[#8DC63F] hover:bg-[#7AB52F] text-white rounded px-6 py-2 font-semibold text-sm transition-all ease-in-out"
                                        onClick={handleOpenCenterModal}
                                    >
                                        + Onboard Scan Center
                                    </button>
                                </div>
                            </div>
                            
                            {/* Scan Centers Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-300 shadow-sm text-sm">
                                            <th className="py-3 px-4 text-[#8DC63F]">
                                                <div className="flex items-center gap-2">
                                                    <span>Center Name</span>
                                                    <button><ArrowUpWideNarrow size={20}/></button>
                                                </div>
                                            </th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Center Email</th>
                                            {/* <th className="py-3 px-4 text-[#8DC63F]">Admin Email</th> */}
                                            <th className="py-3 px-4 text-[#8DC63F]">Phone</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Address</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Status</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Created At</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={8} className="py-8 text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <div className="w-5 h-5 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-gray-600 font-medium">Loading scan centers...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredCenters.length > 0 ? (
                                            filteredCenters
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((center, index) => (
                                                <tr key={center.center_id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-700 font-semibold">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 size={18} className="text-[#8DC63F]" />
                                                            {center.center_name}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{center.center_email}</td>
                                                    {/* <td className="py-3 px-4 text-gray-600">{center.admin_user_email}</td> */}
                                                    <td className="py-3 px-4 text-gray-600">{center.center_phone}</td>
                                                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={center.center_address}>
                                                        {center.center_address}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            center.status === 'Active' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : center.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {center.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {new Date(center.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="py-3 px-4 relative">
                                                        <button 
                                                            onClick={() => toggleDropdown(index)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                        >
                                                            <MoreVertical size={20} className="text-gray-600" />
                                                        </button>
                                                        {openDropdownIndex === index && (
                                                            <div
                                                                ref={(el) => (dropdownRefs.current[index] = el)}
                                                                className={`absolute right-8 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10
                                                                    transition-all ease-in-out duration-500 origin-top-right
                                                                    ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                                                                `}
                                                            >
                                                                <button 
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                                                    onClick={() => {
                                                                        console.log("View details", center);
                                                                        setOpenDropdownIndex(null);
                                                                    }}
                                                                >
                                                                    <Eye size={16} />
                                                                    View Details
                                                                </button>
                                                                <button 
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                                                    onClick={() => {
                                                                        handleOpenEditModal(center);
                                                                        setOpenDropdownIndex(null);
                                                                    }}
                                                                >
                                                                    <Edit size={16} />
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
                                                                    onClick={() => {
                                                                        handleDelete(center.center_id);
                                                                        setOpenDropdownIndex(null);
                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                                                    No scan centers onboarded yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-end items-center mt-6">
                                <TablePagination 
                                    component="div"
                                    count={rowCount}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />
                            </div>
                        </div>

                        {/* Onboard Scan Center Modal */}
                        {openCenterModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-800">Onboard New Scan Center</h2>
                                        <button 
                                            onClick={handleCloseCenterModal}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="p-6">
                                        {/* Scan Center Information */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <Building2 size={20} className="text-[#8DC63F]" />
                                                Scan Center Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextField
                                                    fullWidth
                                                    label="Center Name"
                                                    name="center_name"
                                                    value={scanCenterData.center_name}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Center Email"
                                                    name="center_email"
                                                    type="email"
                                                    value={scanCenterData.center_email}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Center Phone"
                                                    name="center_phone"
                                                    value={scanCenterData.center_phone}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Center Address"
                                                    name="center_address"
                                                    value={scanCenterData.center_address}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <MapPin size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-sm text-blue-800 flex items-start gap-2">
                                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>
                                                        <strong>Auto-Generated Credentials:</strong> Upon submission, login credentials will be automatically generated and sent to the center's email address.
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={handleCloseCenterModal}
                                                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-6 py-2 rounded font-semibold transition-colors ${
                                                    loading 
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                        : 'bg-[#8DC63F] hover:bg-[#7AB52F] text-white'
                                                }`}
                                            >
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <ClipLoader size={16} color="#666" />
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : (
                                                    'Onboard Scan Center'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Edit Scan Center Modal */}
                        {openEditModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-800">Edit Scan Center</h2>
                                        <button 
                                            onClick={handleCloseEditModal}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleUpdateSubmit} className="p-6">
                                        {/* Scan Center Information */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <Building2 size={20} className="text-[#8DC63F]" />
                                                Scan Center Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextField
                                                    fullWidth
                                                    label="Center Name"
                                                    name="center_name"
                                                    value={editCenterData.center_name}
                                                    onChange={handleEditChange}
                                                    required
                                                    size="small"
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Center Email"
                                                    name="center_email"
                                                    type="email"
                                                    value={editCenterData.center_email}
                                                    onChange={handleEditChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Center Phone"
                                                    name="center_phone"
                                                    value={editCenterData.center_phone}
                                                    onChange={handleEditChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Center Address"
                                                    name="center_address"
                                                    value={editCenterData.center_address}
                                                    onChange={handleEditChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <MapPin size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Admin Email"
                                                    name="admin_user_email"
                                                    type="email"
                                                    value={editCenterData.admin_user_email}
                                                    onChange={handleEditChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Status</InputLabel>
                                                    <Select
                                                        name="status"
                                                        value={editCenterData.status}
                                                        onChange={handleEditChange}
                                                        label="Status"
                                                    >
                                                        <MenuItem value="Active">Active</MenuItem>
                                                        <MenuItem value="Pending">Pending</MenuItem>
                                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={handleCloseEditModal}
                                                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-6 py-2 rounded font-semibold transition-colors ${
                                                    loading 
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                        : 'bg-[#8DC63F] hover:bg-[#7AB52F] text-white'
                                                }`}
                                            >
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <ClipLoader size={16} color="#666" />
                                                        <span>Updating...</span>
                                                    </div>
                                                ) : (
                                                    'Update Scan Center'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Filter Modal */}
                        {openFilterModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg w-full max-w-md">
                                    <div className="px-6 py-4 border-b flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Filter Scan Centers</h2>
                                        <button 
                                            onClick={handleCloseFilterModal}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleFilterSubmit} className="p-6">
                                        <div className="grid grid-cols-1 gap-5">
                                            <TextField
                                                label="Center Name"
                                                type="text"
                                                name="center_name_filter"
                                                value={filterData.center_name_filter}
                                                onChange={handleFilterChange}
                                                variant="standard"
                                                fullWidth
                                            />
                                            <TextField
                                                label="Admin Email"
                                                type="text"
                                                name="admin_email_filter"
                                                value={filterData.admin_email_filter}
                                                onChange={handleFilterChange}
                                                variant="standard"
                                                fullWidth
                                            />
                                            <FormControl fullWidth variant="standard">
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    name="status_filter"
                                                    value={filterData.status_filter}
                                                    onChange={handleFilterChange}
                                                    label="Status"
                                                >
                                                    <MenuItem value="">All</MenuItem>
                                                    <MenuItem value="Active">Active</MenuItem>
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        
                                        <div className="mt-5 flex justify-end items-center gap-4">
                                            <button 
                                                type="button"
                                                onClick={handleClearFilter}
                                                className="text-red-600 font-semibold hover:bg-red-50 p-2 rounded"
                                            >
                                                Clear
                                            </button>
                                            <button 
                                                type="submit"
                                                className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white hover:bg-[#7AB52F] transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Academics;