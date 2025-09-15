import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { useParams } from 'react-router-dom';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Plus, X } from 'lucide-react';
import CollapsibleTable from '../components/CourseTable';
import EnhancedTable from '../components/CourseTable';
import CreateModule from '../components/superadmin/CreateModule'
import GetCoursesAPI from '../API/GetCoursesAPI';
function CourseInd() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
  const [openModule, setOpenModule] = React.useState(false)
  const handleClose = () => {
        setOpenModule(false)
  }
  //process api data here 
  const [moduleData, setModuleData] = React.useState({
        module_name: '',
        course_name: ''
  })
  const handleChange = () => {
        
  }
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
 console.log(courseData)
  React.useEffect(() => {
        courseDataCall()
        console.log(courseData);
  }, [])
  const url = useParams();
  console.log(url)
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  if (decoded.role != 99) {
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
                                    <div className={`${buttonOpen ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="text-gray-500">Course / Module - {url.course_id}</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Associated Modules</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10">
                                                        <div className="font-semibold">
                                                                <IconButton size="md" color="success" className="bg-green-200" onClick={() => setOpenModule(true)}>
                                                                            <Plus className="h-6 w-6" />
                                                                </IconButton>
                                                        </div>
                                                        <div className="mt-10">
                                                            {/* <EnhancedTable /> */}
                                                        </div>
                                            </div>
                                    </div>
                                </div>
                        </div>
            </div>
            <CreateModule isVisible={openModule} onClose={handleClose}>
                        <div className="flex justify-between items-center">
                                        <div>Create Module</div>
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
                label="Module Name"
                //onChange={handleCourse}
                name="module_name"
                //value={courseData.course_name}
              />
            </div>
            <div>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="batch-select-label">
                  Select Course
                </InputLabel>
                <Select
                  labelId="batch-select-label"
                  name="curiculum_id"
                  label="Select Course"
                  //onChange={handleCourse}
                  //value={courseData.curiculum_id}
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
              //onClick={CreatCourse}
            >
              Save
            </button>
          </div>
            </CreateModule>
    </div>
  )
}

export default CourseInd