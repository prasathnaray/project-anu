import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { useParams } from 'react-router-dom';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ArrowUpWideNarrow, EllipsisVertical, LayoutDashboard, List, Notebook, Plus, X } from 'lucide-react';
import CollapsibleTable from '../components/CourseTable';
import EnhancedTable from '../components/CourseTable';
import CreateModule from '../components/superadmin/CreateModule'
import GetCoursesAPI from '../API/GetCoursesAPI';
import CreateModuleApi from '../API/CreateModule';
import CustomCloseButton from "../utils/CustomCloseButton";
import GetModuleApi from '../API/GetModuleAPI'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenderAnalytics from '../charts/PrpgressBar';
import getChapterAPI from '../API/getChapterAPI';
import { ClipLoader } from 'react-spinners';
import StatsDonutChart from '../charts/PrpgressBar';
function Chapters() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
  const [openModule, setOpenModule] = React.useState(false)
  
  //process api data here 
  const [chapterData, setChapterData] = React.useState({
        chapter_name: '',
        course_id: ''
  })
  const handleModuleChange = async(e) => {
        const {name, value} = e.target;
        setChapterData({
          ...chapterData,
          [name]: value,
        })
  }
  const handleClose = () => {
        setOpenModule(false)
        setChapterData({
          chapter_name: '',
          course_id: ''
        })
  }
  console.log(chapterData);
    //fetch course data
  const [courseData, setCourseData] = React.useState({})
  const courseDataCall = async() => {
        try
        {
                const token = localStorage.getItem('user_token')
                const result = await GetCoursesAPI(token)
                setCourseData(result.data.result);
        }
        catch(err)
        {
                console.log(err)
        }
  }
//console.log(courseData)
//get modules by course id
const [moduleList, setModuleList] = React.useState([]);
const urlData = useParams();
console.log(urlData)
const getModuleCall = async(urlData) => {
      try
      {
        const token = localStorage.getItem('user_token');
        const result = await getChapterAPI(token, urlData.course_id)
        setModuleList(result.data)
      }
      catch(err)
      {
        console.log(err)
      }
}
React.useEffect(() => {
    getModuleCall(urlData);
}, [])
React.useEffect(() => {
  console.log(moduleList)
})
 //create module api call
 const createModuleCall = async(e) => {
        e.preventDefault();
        if(!chapterData.chapter_name || !chapterData.course_id)
        {
            toast.error("please fill all the fields" , {
                autoClose: 3000,
                toastId: 'input-missing',
                icon: false,
                closeButton: CustomCloseButton,
            });
            return;
        }
        try
        {
              const token = localStorage.getItem('user_token');
              const result = await CreateModuleApi(token, chapterData);
              if (result)
              {
                toast.success("Module Created", {
                  autoClose: 3000,
                  toastId: "module-created",
                  icon: false,
                  closeButton: CustomCloseButton,
                });
              }
              getModuleCall(urlData);
              handleClose();
        }
        catch(err)
        {
           console.log(err)
        }
 }
  React.useEffect(() => {
        courseDataCall()
        console.log(courseData);
  }, [])
  const url = useParams();
  console.log(url)
  localStorage.setItem('last_page_visited', url.course_id);
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
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
                       <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
                                <div className="bg-gray-100 h-screen pt-12">
                                    <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px] hover:underline hover:underline-offset-4"><a href={`/course`}>Course</a></span> / <List size={15}/> <a href={`${localStorage.getItem('last_page_visited')}`} className="text-[15px] hover:underline hover:underline-offset-4">Chapters</a></div>
                                    <div className={`${buttonOpen ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Learning Modules</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10">
                                                        {decoded.role == 99 && (
                                                                  <div className="font-semibold">
                                                                          <IconButton size="md" color="success" className="bg-green-200" onClick={() => setOpenModule(true)}>
                                                                                      <Plus className="h-6 w-6" />
                                                                          </IconButton>
                                                                  </div>
                                                        )}
                                                        <div className="mt-10">
                                                            {/* <EnhancedTable /> */}
                                                            <table className="w-full text-left border-collapse">
                                                                        <thead>
                                                                          <tr className="border-b border-gray-300 shadow-sm">
                                                                            <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                                                                              <div>Chapter Name</div>
                                                                              <button>
                                                                                <ArrowUpWideNarrow size={20} />
                                                                              </button>
                                                                            </th>
                                                                            <th className="py-2 px-4 text-[#8DC63F]">
                                                                              <div className="flex items-center gap-2">
                                                                                <span>Completion Status</span>
                                                                                <button>
                                                                                  <ArrowUpWideNarrow size={20} />
                                                                                </button>
                                                                              </div>
                                                                            </th>
                                                                            <th className={`${decoded.role == 101 || decoded.role == 103 ?  "hidden" : "py-2 px-4 text-[#8DC63F]"}`}>
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
                                                                          {Array.isArray(moduleList) &&
                                                                          moduleList.length > 0 ? (
                                                                            moduleList.map((data, index) => (
                                                                              <tr
                                                                                className="text-sm text-gray-700"
                                                                                key={index}
                                                                              >
                                                                                {/* <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                                                                                  <a href={`/course/${data?.module_id}`}>{data?.module_name}</a>
                                                                                </td> */}
                                                                                <td className="py-2 px-4 text-[#8Dc63F] font-semibold border-b-2">
                                                                                    <button onClick={() => navigate(`/module/${data?.chapter_id}/${urlData.course_id}`)}>{data?.chapter_name}</button>
                                                                                </td>
                                                                                <td className="py-2 px-4 text-gray-600 font-medium border-b-2">
                                                                                  {decoded.role == 103 ? (
                                                                                    <StatsDonutChart 
                                                                                          completed={parseInt(data.completed_modules_text?.split('/')[0] || 0, 10)}
                                                                                          total={parseInt(data.completed_modules_text?.split('/')[1] || 0, 10)}
                                                                                    />
                                                                                    // <div className="text-gray-600">{data?.completed_modules_text}</div>
                                                                                  ) : (
                                                                                    <StatsDonutChart 
                                                                                                completed={data.users_completed_all || 0}
                                                                                                total={data.total_users || 0} 
                                                                                    />
                                                                                   )}
                                                                                </td>
                                                                                <td className={`${decoded.role == 101 || decoded.role == 103 ?  "hidden" : "py-2 px-4 text-[#8DC63F]"}`}>
                                                                                      ad
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
            </div>
            <CreateModule isVisible={openModule} onClose={handleClose}>
                        <div className="flex justify-between items-center">
                                        <div>Create Chapter</div>
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
                label="Chapter Name"
                onChange={handleModuleChange}
                name="chapter_name"
                value={chapterData.chapter_name}
              />
            </div>
            <div>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="batch-select-label">
                  Select Course
                </InputLabel>
                <Select
                  labelId="batch-select-label"
                  name="course_id"
                  label="Select Course"
                  onChange={handleModuleChange}
                  value={chapterData.course_id}
                >
                  {Array.isArray(courseData) &&
                  courseData.length > 0 ? (
                    courseData.map((data, index) => (
                      <MenuItem
                        key={index}
                        value={data?.course_id}
                      >
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
              onClick={createModuleCall}
            >
              Save
            </button>
          </div>
            </CreateModule>
    </div>
  )
}

export default Chapters;