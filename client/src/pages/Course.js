// import React, {useState} from 'react'
// import { jwtDecode } from 'jwt-decode'
// import SideBar from '../components/sideBar';
// import { Navigate, Outlet } from 'react-router-dom';
// import NavBar from '../components/navBar';
// import { ArrowUpWideNarrow, EllipsisVertical, EllipsisVerticalIcon, X } from 'lucide-react';
// import AddCourse from '../components/admin/AddCourse';
// import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import SubSideBar from '../components/subSideBar';
// import GetCuriculumAPI from '../API/getCuriculumAPI';
// import CreateCourseAPI from '../API/createCourseAPI';
// import { toast } from 'react-toastify';
// import CustomCloseButton from '../utils/CustomCloseButton';
// import GetCoursesAPI from '../API/GetCoursesAPI';
// import DeleteCourseToast from '../utils/deleteCourseToast';
// import TagCourse from '../components/superadmin/TagCourse';
// import GetAdminsAPI from '../API/getAdminsAPI';
// import TagCourseAPI from '../API/TagCourseAPI';
// function Course() {
//   //button toggle sidebar
//   const [openCourse, setOpenCourse] = useState(false);
//   const [curiculumList, setCuriculumList] = React.useState({})
// //   const [couseList, setCourseList] = React.useState({})
//   const [courseData, setCourseData] = React.useState({
//         course_name: '',
//         curiculum_id: ''
//   })
//   const [adminData, setAdminData] = React.useState({})
//   const [tagCourseState, setTagCourseState] = React.useState({
//         user_id: '',
//         course_id: ''
//   })
//   const handleTagCourse = (e) => {
//         const {name, value} = e.target;
//         setTagCourseState({
//                 ...tagCourseState,
//                 [name]: value,
//         })
//   }
//   console.log(tagCourseState);
//   const fetchAdminData = async() => {
//         try
//         {
//                 const token = localStorage.getItem('user_token')
//                 const result = await GetAdminsAPI(token);
//                 setAdminData(result.data.rows)
//         }
//         catch(err)
//         {
//                 console.log(err)
//         }
//   }
//   const [courseList, setCourseList] = React.useState({})
//   const handleCourse = (e) => {
//         const {name, value} = e.target;
//         setCourseData({
//                ...courseData,
//                 [name]: value,  
//         })
//   }
//   console.log(courseData);
//   const [tagCourse, setTagCourse] = useState(false);
//   const handleClose = () => {
//     setOpenCourse(false);
//     setCourseData({
//         course_name: '',
//         curiculum_id: ''
//     })
//     setTagCourseForm({
//                                 user_id: '',
//                                 course_id: ''
//                         })  
//     setTagCourse(false)
//   }

//    const GetCoursesList = async() => {
//         try
//         {
//                 const token = localStorage.getItem('user_token');
//                 const result = await GetCoursesAPI(token);
//                 setCourseList(result.data.result);
//         }
//         catch(err)
//         {
//                 console.log(err)
//         }
//   }
//     const CreatCourse = async() => {
//         try
//         {
//                 const token = localStorage.getItem('user_token');
//                 const response = await CreateCourseAPI(token, courseData);
//                 if(response)
//                 {
//                         toast.success("Course Created" , {
//                                 autoClose: 3000,
//                                 toastId: 'course-inserted',
//                                 icon: false,
//                                 closeButton: CustomCloseButton,
//                         }); 
//                         handleClose();
//                         GetCoursesList();
//                 }
//         }
//         catch(err)
//         {
//                 console.log(err)
//         }
//   }
//   const [buttonOpen, setButtonOpen] = useState(true);
//   const handleButtonOpen = () => {
//       setButtonOpen(!buttonOpen);
//   };
//   const GetCuriculumList = async(e) => {
//     try
//     {
//       const token = localStorage.getItem('user_token');
//       const result = await GetCuriculumAPI(token);
//       setCuriculumList(result.data.result);
//     }
//     catch(err)
//     {
//       console.log(err)
//     }
//   }
//   const handleDelete = async(course_id) => {
//         try
//         {
//                 const token = localStorage.getItem('user_token');
//                 DeleteCourseToast(course_id, () => GetCoursesList(), token);
//         }
//         catch(err)
//         {
//               if(err?.response?.status == 403)
//                 {
//                         toast.error("please login again" , {
//                                 autoClose: 3000,
//                                 toastId: 'login-again',
//                                 icon: false,
//                                 closeButton: CustomCloseButton,
//                         });
//                 }
//         }
//   }
//             const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
//             const dropdownRefs = React.useRef({});  
//             const toggleDropdown = (index) => {
//                 setOpenDropdownIndex(openDropdownIndex === index ? null : index);
//             };
//             const [tagCourseForm, setTagCourseForm] = React.useState({
//                 user_id: '',
//                 course_id: ''
//             })
//             const handleCourseTag = (e) => {
//                 const {name, value} = e.target;
//                 setTagCourseForm({
//                         ...tagCourseForm,
//                         [name]: value,
//                 })
//             }
//             const tagCousesubmit = async() => {
//                 try
//                 {
//                         const token = localStorage.getItem('user_token')
//                         const response = await TagCourseAPI(token, tagCourseForm);
//                         //console.log(response);
//                         if(response.data.error?.code === "23505")
//                         {
//                              toast.error("data already exists", {
//                                         autoClose: 3000,
//                                         icon: false,
//                                         toastId: 'already-exits',
//                                         closeButton: CustomCloseButton,
//                                 });   
//                                 handleClose();
//                                 GetCoursesList();
//                         }
//                         else{
//                             toast.success("Successfully tagged");    
//                             handleClose();        
//                         }             
//                 }
//                 catch(err)
//                 {
//                         if(err?.response?.status == 403)
//                         {
//                                 toast.error("please login again" , {
//                                         autoClose: 3000,
//                                         toastId: 'login-again',
//                                         icon: false,
//                                         closeButton: CustomCloseButton,
//                                 });
//                         }
//                         else if(err?.response?.data?.code == '23505')
//                         {
//                                 toast.error("data already exists", {
//                                         autoClose: 3000,
//                                         icon: false,
//                                         toastId: 'already-exits',
//                                         closeButton: CustomCloseButton,
//                                 });
//                                 handleClose()
//                         }
//                 }
//             }
//             React.useEffect(() => {
//       const handleClickOutside = (event) => {
//                         const isClickInside = Object.values(dropdownRefs.current).some(ref =>
//                         ref && ref.contains(event.target)
//                         );
                
//                         if (!isClickInside) {
//                         setOpenDropdownIndex(null);
//                         }
//                 };
//                 document.addEventListener("mousedown", handleClickOutside);
//                 return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);
//   React.useEffect(() => {
//         GetCuriculumList();
//   }, [])
//   React.useEffect(() => {
//         GetCoursesList()
//   }, [])
//   React.useEffect(() => {
//         fetchAdminData();
//   }, [])

//   React.useEffect(() => {
//         console.log(adminData)
//   }, [adminData])

//   ///main Layout
//   let token = localStorage.getItem('user_token');
//   const decoded = jwtDecode(token);
//   if (decoded.role != 101 && decoded.role != 99) {
//     return <Navigate to="/" replace />;
//   }
//   return (
//     <div className={`flex flex-col min-h-screen`}>
//             <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//                     <NavBar />
//                     {/* <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/> */}
//             </div>
//             <div className="flex flex-grow">
//                     <div className="">
//                           <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
//                     </div>
//                     <div className={`${buttonOpen === true ? "ms-[221px] flex-grow" : "ms-[55.5px] flex-grow"} `}>
//                               <div className="bg-gray-100 h-screen pt-12">
//                                                 <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
//                                                       <div className="text-gray-500">Dashboard / Course</div>
//                                                       <div className="mt-5 font-semibold text-xl text-gray-600">Course</div>
//                                                       <div className="mt-5 bg-white rounded px-8 py-10">
//                                                           <div className="font-semibold text-xl text-gray-500">All courses</div>
//                                                           <div className="grid grid-cols-2 items-center my-5">
//                                                               <div className="">
//                                                                 <input
//                                                                   type="text"
//                                                                   placeholder="Search courses"
//                                                                   name="reset_password_mail"
//                                                                   className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
//                                                                 />
//                                                               </div>
//                                                               {jwtDecode(localStorage.getItem('user_token')).role == 99 && (
//                                                                         <div className="flex justify-end items-center"><button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out" onClick={() => setOpenCourse(true)}>Add Course</button></div>
//                                                               )}
//                                                           </div>
//                                                           <table className="w-full text-left border-collapse">
//                                                                     <thead>
//                                                                           <tr className="border-b border-gray-300 shadow-sm">
//                                                                                   <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Course Name</div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
//                                                                                   <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Course availability</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
//                                                                                   {/* <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Batch associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th> */}
//                                                                                   <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Action</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
//                                                                           </tr>
//                                                                     </thead>
//                                                                     <tbody>
//                                                                         {Array.isArray(courseList) && courseList.length > 0 ? (
//                                                                         courseList.map((data, index) => (
//                                                                         <tr className="text-sm text-gray-700" key={index}>
//                                                                                 <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">{data?.course_name}</td>
//                                                                                 <td className="py-2 px-4 text-gray-600 font-medium border-b-2">{data?.access_status === true ? ( <span className="px-2 py-1 bg-green-100 animate duration-0.3 blink text-sm">Approved</span> ): (<span className="px-2 py-1 bg-red-100 text-sm">Request</span>)}</td>
//                                                                                 <td className="py-2 px-4 font-semibold border-b-2">
//                                                                                                 {/* <button onClick={() => handleDelete(data.course_id)}><EllipsisVerticalIcon size={20}/></button> */}
//                                                                                                  <button onClick={() => toggleDropdown(index)}><EllipsisVertical size={24} /></button>
//                                                                                                                                                                                         {openDropdownIndex === index && (
//                                                                                                                                                                                                 <div
//                                                                                                                                                                                                  ref={(el) => (dropdownRefs.current[index] = el)}
//                                                                                                                                                                                                 className={`absolute right-18 mt-1 w-22 bg-white border border-gray-200 rounded shadow-md z-10
//                                                                                                                                                                                                         transition-all ease-in-out duration-500 origin-top-right
//                                                                                                                                                                                                         ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
//                                                                                                                                                                                                 `} 
//                                                                                                                                                                                                 >
//                                                                                                                                                                                                                 <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded">View</button>
//                                                                                                                                                                                                                 <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded" onClick={() => handleDelete(data.course_id)}>Delete</button>
//                                                                                                                                                                                                                 {jwtDecode(localStorage.getItem('user_token')).role == 99 && (
//                                                                                                                                                                                                                         <button
//                                                                                                                                                                                                                         className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded"
//                                                                                                                                                                                                                         onClick={() => setTagCourse(true)}
//                                                                                                                                                                                                                         >
//                                                                                                                                                                                                                         Tag Course
//                                                                                                                                                                                                                         </button>
//                                                                                                                                                                                                                 )}
//                                                                                                                                                                                                                 {jwtDecode(localStorage.getItem('user_token')).role == 101 && (
//                                                                                                                                                                                                                         <button
//                                                                                                                                                                                                                                 className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded"
//                                                                                                                                                                                                                                 //onClick={() => }
//                                                                                                                                                                                                                         >
//                                                                                                                                                                                                                                 Request
//                                                                                                                                                                                                                         </button>
//                                                                                                                                                                                                                 )}
//                                                                                                                                                                                                                 {/* <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => showDisableConfirmToast(trainee.user_email, handleTraineeList, token, statusUpdate)}>{trainee.status === "inactive"? "Enable": "Disable"}</button> */}
                                                                                                
//                                                                                                                                                                                                 </div>
//                                                                                                                                                                                         )}
//                                                                                 </td>
//                                                                         </tr>
//                                                                         ))
//                                                                         ) : (
//                                                                         <tr>
//                                                                                                 <td colSpan={4} className="py-4 text-center text-gray-500">No courses available</td>
//                                                                         </tr>
//                                                                         )}
//                                                                     </tbody>

//                                                           </table>
//                                                       </div>
//                                                 </div>

//                               </div>
//                     </div>
//             </div>
//             <AddCourse isVisible={openCourse} onClose={handleClose}>
//                   <>
//                       <div className="flex justify-between items-center">
//                               <div>Add Course</div>
//                               <div><button onClick={handleClose} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-5 mt-5">
//                                 <div> 
//                                       <TextField 
//                                               fullWidth
//                                               variant="outlined"
//                                               size="small"
//                                               sx={{ minHeight: "35px" }}
//                                               id="outlined-basic"
//                                               label="Course Name"
//                                               onChange={handleCourse}
//                                               name="course_name"
//                                               value={courseData.course_name}
//                                       />
//                                 </div>
//                                 <div> 
//                                       <FormControl
//                                         fullWidth
//                                         variant="outlined"
//                                         size="small"
//                                         sx={{ minHeight: "35px" }}
//                                         >
//                                         <InputLabel id="batch-select-label">Select Curiculum</InputLabel>
//                                         <Select
//                                         labelId="batch-select-label"
//                                         name="curiculum_id"
//                                         label="Select curiculum"
//                                         onChange={handleCourse}
//                                         value={courseData.curiculum_id}
//                                         >
//                                                                                         {Array.isArray(curiculumList) && curiculumList.length > 0 ? (
//                                                                                                curiculumList.map((data, index) => (
//                                                                                                        <MenuItem key={index} value={data?.curiculum_id}>
//                                                                                                        {data?.curiculum_nam}
//                                                                                                        </MenuItem>
//                                                                                                ))
//                                                                                        ) : (
//                                                                                                <MenuItem disabled>No data found</MenuItem>
//                                                                                        )}
//                                         </Select>
//                                         </FormControl>
//                                 </div>
//                       </div>
//                       <div className="flex justify-end item-center mt-5">
//                                                 <button className="bg-[#8DC63F] px-3 py-2 text-white" onClick={CreatCourse}>Save</button>                                                
//                       </div>
//                   </>
//             </AddCourse>
//             <TagCourse isVisible={tagCourse} onClose={handleClose}>
//                         <>
//                                 <div className="flex justify-between items-center">
//                                         <div>Tag Course</div>
//                                         <div><button onClick={handleClose} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-5 mt-5">
//                                 <div> 
//                                       <FormControl
//                                         fullWidth
//                                         variant="outlined"
//                                         size="small"
//                                         sx={{ minHeight: "35px" }}
//                                         >
//                                         <InputLabel id="user-select-label">Select User</InputLabel>
//                                         <Select
//                                         labelId="user-select-label"
//                                         name="user_id"
//                                         label="Select User"
//                                         onChange={handleCourseTag}
//                                         value={tagCourseForm.user_id}
//                                         >
//                                                 {Array.isArray(adminData) && adminData.length > 0 ? (
//                                                         adminData.map((data, index) => (
//                                                                 <MenuItem key={index} value={data?.user_email}>
//                                                                 {data?.user_name}
//                                                                 </MenuItem>
//                                                         ))
//                                                 ) : (
//                                                         <MenuItem disabled>No data found</MenuItem>
//                                                 )}
//                                         </Select>
//                                         </FormControl>
//                                 </div>
//                                 <div> 
//                                       <FormControl
//                                         fullWidth
//                                         variant="outlined"
//                                         size="small"
//                                         sx={{ minHeight: "35px" }}
//                                         >
//                                         <InputLabel id="batch-select-label">Select course</InputLabel>
//                                         <Select
//                                         labelId="course-select-label"
//                                         name="course_id"
//                                         label="Select course"
//                                         onChange={handleCourseTag}
//                                         value={tagCourseForm.course_id}
//                                         >
//                                                 {Array.isArray(courseList) && courseList.length > 0 ? (
//                                                         courseList.map((data, index) => (
//                                                                 <MenuItem key={index} value={data?.course_id}>
//                                                                 {data?.course_name}
//                                                                 </MenuItem>
//                                                         ))
//                                                 ) : (
//                                                         <MenuItem disabled>No data found</MenuItem>
//                                                 )}
//                                         </Select>
//                                         </FormControl>
//                                 </div>
//                       </div>
//                       <div className="flex justify-end item-center mt-5">
//                                 <button className="bg-[#8DC63F] px-3 py-2 text-white" onClick={tagCousesubmit}>Save</button>                                                
//                       </div>
//                         </>
//             </TagCourse>
//     </div>
//   )
// }

// export default Course;
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import SideBar from "../components/sideBar";
import { Navigate } from "react-router-dom";
import NavBar from "../components/navBar";
import { ArrowUpWideNarrow, EllipsisVertical, LayoutDashboard, Notebook, SlidersHorizontal, X } from "lucide-react";
import AddCourse from "../components/admin/AddCourse";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import GetCuriculumAPI from "../API/getCuriculumAPI";
import CreateCourseAPI from "../API/createCourseAPI";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import GetCoursesAPI from "../API/GetCoursesAPI";
import DeleteCourseToast from "../utils/deleteCourseToast";
import TagCourse from "../components/superadmin/TagCourse";
import GetAdminsAPI from "../API/getAdminsAPI";
import TagCourseAPI from "../API/TagCourseAPI";
import { ClipLoader } from "react-spinners";
import CourseCustomisation from "../components/CourseCustomisation";

function Course() {
  // Sidebar toggle
  const [openCourse, setOpenCourse] = useState(false);
  const [changeState, setChangeState] = useState(true);
  const handleChangeState = () => {
    setChangeState(!changeState)
  }
  console.log(changeState);
  const [curiculumList, setCuriculumList] = useState([]);
  const [courseData, setCourseData] = useState({
    course_name: "",
    curiculum_id: "",
  });
  const [adminData, setAdminData] = useState([]);
  const [tagCourseState, setTagCourseState] = useState({
    user_id: "",
    course_id: "",
  });

  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // 🔍 for search
  const [searchItem, setSearchItem] = useState("");

  const handleCourse = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleTagCourse = (e) => {
    const { name, value } = e.target;
    setTagCourseState({
      ...tagCourseState,
      [name]: value,
    });
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const result = await GetAdminsAPI(token);
      setAdminData(result.data.rows || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setOpenCourse(false);
    setCourseData({
      course_name: "",
      curiculum_id: "",
    });
    setTagCourseForm({
      user_id: "",
      course_id: "",
    });
    setTagCourse(false);
  };

  const GetCoursesList = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const result = await GetCoursesAPI(token);
      setCourseList(result.data.result || []);
      setFilteredCourses(result.data.result || []); // reset
    } catch (err) {
      console.log(err);
    }
  };

  const CreatCourse = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await CreateCourseAPI(token, courseData);
      if (response) {
        toast.success("Course Created", {
          autoClose: 3000,
          toastId: "course-inserted",
          icon: false,
          closeButton: CustomCloseButton,
        });
        handleClose();
        GetCoursesList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (course_id) => {
    try {
      const token = localStorage.getItem("user_token");
      DeleteCourseToast(course_id, () => GetCoursesList(), token);
    } catch (err) {
      if (err?.response?.status === 403) {
        toast.error("please login again", {
          autoClose: 3000,
          toastId: "login-again",
          icon: false,
          closeButton: CustomCloseButton,
        });
      }
    }
  };
  console.log(courseList);
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  const GetCuriculumList = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const result = await GetCuriculumAPI(token);
      setCuriculumList(result.data.result || []);
    } catch (err) {
      console.log(err);
    }
  };

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRefs = useRef({});
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const [tagCourse, setTagCourse] = useState(false);
  const [tagCourseForm, setTagCourseForm] = useState({
    user_id: "",
    course_id: "",
  });
  const handleCourseTag = (e) => {
    const { name, value } = e.target;
    setTagCourseForm({
      ...tagCourseForm,
      [name]: value,
    });
  };

  const tagCousesubmit = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await TagCourseAPI(token, tagCourseForm);
      if (response.data.error?.code === "23505") {
        toast.error("data already exists", {
          autoClose: 3000,
          icon: false,
          toastId: "already-exits",
          closeButton: CustomCloseButton,
        });
        handleClose();
        GetCoursesList();
      } else {
        toast.success("Successfully tagged");
        handleClose();
      }
    } catch (err) {
      if (err?.response?.status === 403) {
        toast.error("please login again", {
          autoClose: 3000,
          toastId: "login-again",
          icon: false,
          closeButton: CustomCloseButton,
        });
      } else if (err?.response?.data?.code === "23505") {
        toast.error("data already exists", {
          autoClose: 3000,
          icon: false,
          toastId: "already-exits",
          closeButton: CustomCloseButton,
        });
        handleClose();
      }
    }
  };

  // 🔍 Search filter
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    if (!value) {
      setFilteredCourses(courseList);
    } else {
      const filtered = courseList.filter((course) => {
        const nameMatch = course?.course_name
          ?.toLowerCase()
          .includes(value);
        const statusMatch = String(course?.access_status)
          ?.toLowerCase()
          .includes(value);
        return nameMatch || statusMatch;
      });
      setFilteredCourses(filtered);
    }
  };

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  //save the url id in the session
  
  useEffect(() => {
    GetCuriculumList();
    GetCoursesList();
    fetchAdminData();
  }, []);

  // Auth check
  let token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103 && decoded.role != 102) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`flex flex-col min-h-screen`}>
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>
      <div className="flex flex-grow">
        <div>
          <SideBar
            handleButtonOpen={handleButtonOpen}
            buttonOpen={buttonOpen}
          />
        </div>
        <div
          className={`${
            buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
          } flex-grow`}
        >
          <div className="bg-gray-100 h-screen pt-12">
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px]">Course</span></div>
            {/* <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                <button onClick={handleChangeState} className="flex justify-between gap-2 items-center bg-[#8DC63F] px-2 py-[2px] rounded cursor-pointer text-gray-100 font-semibold hover:rounded-full transition-all ease-in-out duration-300">
                  <LayoutDashboard size={15} /> 
                  <span className="text-[13px]">Course List</span>
                </button>
                <button onClick={() => setChangeState(false)} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded-full">
                  <SlidersHorizontal size={15} className="text-gray-600" />
                  <span className="text-[13px]">Customised Courses</span>
                </button>
            </div> */}
            <div
              className={`${
                buttonOpen
                  ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                  : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
              }`}
            >
              <div className="mt-5 font-semibold text-xl text-gray-600">
                Course
              </div>
              <div className="mt-5 bg-white rounded px-8 py-10">
                <div className="font-semibold text-xl text-gray-500">
                  All courses
                </div>
                <div className="grid grid-cols-2 items-center my-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Search courses"
                      value={searchItem}
                      onChange={handleSearchChange}
                      className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                    />
                  </div>
                  {jwtDecode(localStorage.getItem("user_token")).role ==
                    99 && (
                    <div className="flex justify-end items-center">
                      <button
                        className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out"
                        onClick={() => setOpenCourse(true)}
                      >
                        Add Course
                      </button>
                    </div>
                  )}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Course Name</div>
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                                  <div>Batch Name</div>
                                  <button>
                                        <ArrowUpWideNarrow size={20} />
                                  </button>
                        </div>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Course availability</span>
                          <button>
                            <ArrowUpWideNarrow size={20} />
                          </button>
                        </div>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">
                        <div className="flex items-center gap-2">
                          <span>Action</span>
                          <button>
                            <ArrowUpWideNarrow size={20} />
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(filteredCourses) &&
                    filteredCourses.length > 0 ? (
                      filteredCourses.map((data, index) => (
                        <tr
                          className="text-sm text-gray-700"
                          key={index}
                        >
                          <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                            <a href={`/chapters/${data?.course_id}`}>{data?.course_name}</a>
                          </td>
                          <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                              {data?.batch_name}

                          </td>
                          <td className="py-2 px-4 text-gray-600 font-medium border-b-2">
                            {data?.access_status === true ? (
                              <span className="px-2 py-1 bg-green-100 text-sm">
                                Approved
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-sm">
                                Request
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4 font-semibold border-b-2">
                            <button
                              onClick={() => toggleDropdown(index)}
                            >
                              <EllipsisVertical size={24} />
                            </button>
                            {openDropdownIndex === index && (
                              <div
                                ref={(el) =>
                                  (dropdownRefs.current[index] = el)
                                }
                                className={`absolute right-18 mt-1 w-22 bg-white border border-gray-200 rounded shadow-md z-10 transition-all ease-in-out duration-500 origin-top-right ${
                                  openDropdownIndex === index
                                    ? "opacity-100 scale-100 visible"
                                    : "opacity-0 scale-95 invisible"
                                }`}
                              >
                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded">
                                  View
                                </button>
                                {jwtDecode(
                                  localStorage.getItem("user_token")
                                ).role == 99 && (
                                    <button
                                      className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded"
                                      onClick={() => handleDelete(data.course_id)}
                                    >
                                      Delete
                                    </button>
                                )}
                                {jwtDecode(
                                  localStorage.getItem("user_token")
                                ).role == 99 && (
                                  <button
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold hover:rounded"
                                    onClick={() => setTagCourse(true)}
                                  >
                                    Tag Course
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-4 text-center text-gray-500"
                        >
                          <ClipLoader color="#8DC63F" size={24} className="ms-2" cssOverride={{ borderWidth: "4px",  }}/>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      {/* Add Course Modal */}
      <AddCourse isVisible={openCourse} onClose={handleClose}>
        <>
          <div className="flex justify-between items-center">
            <div>Add Course</div>
            <div>
              <button
                onClick={handleClose}
                className="text-red-500 hover:bg-red-50 p-1 hover:rounded"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-5">
            <div>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                id="outlined-basic"
                label="Course Name"
                onChange={handleCourse}
                name="course_name"
                value={courseData.course_name}
              />
            </div>
            <div>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="batch-select-label">
                  Select Curiculum
                </InputLabel>
                <Select
                  labelId="batch-select-label"
                  name="curiculum_id"
                  label="Select curiculum"
                  onChange={handleCourse}
                  value={courseData.curiculum_id}
                >
                  {Array.isArray(curiculumList) &&
                  curiculumList.length > 0 ? (
                    curiculumList.map((data, index) => (
                      <MenuItem
                        key={index}
                        value={data?.curiculum_id}
                      >
                        {data?.curiculum_nam}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex justify-end item-center mt-5">
            <button
              className="bg-[#8DC63F] px-3 py-2 text-white"
              onClick={CreatCourse}
            >
              Save
            </button>
          </div>
        </>
      </AddCourse>

      {/* Tag Course Modal */}
      <TagCourse isVisible={tagCourse} onClose={handleClose}>
        <>
          <div className="flex justify-between items-center">
            <div>Tag Course</div>
            <div>
              <button
                onClick={handleClose}
                className="text-red-500 hover:bg-red-50 p-1 hover:rounded"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-5">
            <div>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="user-select-label">
                  Select User
                </InputLabel>
                <Select
                  labelId="user-select-label"
                  name="user_id"
                  label="Select User"
                  onChange={handleCourseTag}
                  value={tagCourseForm.user_id}
                >
                  {Array.isArray(adminData) && adminData.length > 0 ? (
                    adminData.map((data, index) => (
                      <MenuItem key={index} value={data?.user_email}>
                        {data?.user_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="course-select-label">
                  Select course
                </InputLabel>
                <Select
                  labelId="course-select-label"
                  name="course_id"
                  label="Select course"
                  onChange={handleCourseTag}
                  value={tagCourseForm.course_id}
                >
                  {Array.isArray(courseList) && courseList.length > 0 ? (
                    courseList.map((data, index) => (
                      <MenuItem key={index} value={data?.course_id}>
                        {data?.course_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex justify-end item-center mt-5">
            <button
              className="bg-[#8DC63F] px-3 py-2 text-white"
              onClick={tagCousesubmit}
            >
              Save
            </button>
          </div>
        </>
      </TagCourse>
    </div>
  );
}

export default Course;