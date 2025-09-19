import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, EllipsisVertical, Plus, X } from 'lucide-react';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CreateModule from '../components/superadmin/CreateModule';
import GetModuleApi from '../API/GetModuleAPI';
import getChapterAPI from '../API/getChapterAPI';
import ModuleNewAPI from '../API/ModuleNewAPI';
import { toast } from 'react-toastify';
import CustomCloseButton from '../utils/CustomCloseButton';
import { ClipLoader } from 'react-spinners';
function Module() {
  const [openModule, setOpenModule] = React.useState(false);
  const handleClose = () => {
        setOpenModule(false);
        setModuleData({
                  module_name: '',
                  chapter_id: ''
        });
  }
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
 //chapter calls
 const [moduleData, setModuleData] = React.useState({
        module_name: '',
        chapter_id: ''
 })
 const handleChange = (e) => {
    const { name, value } = e.target;
    setModuleData({
      ...moduleData,
      [name]: value,
    });
 }
 const url = useParams();
 console.log(url);
 const [chapterData, setChapterData] = React.useState([]);
 const chapterAPiCalls = async(url) => {
    try
    {
        const token = localStorage.getItem("user_token");
        const response = await getChapterAPI(token, url.course_id);
        setChapterData(response.data);
    }
    catch(err)
    {
        console.log(err);
    }
 }
 const moduleApiCalls = async(moduleData) => {
    try
    {
        const token = localStorage.getItem("user_token");
        const response = await ModuleNewAPI(token, moduleData);
        if(response)
        {
            toast.success("Module Created", {
                  autoClose: 3000,
                  toastId: "module-created",
                  icon: false,
                  closeButton: CustomCloseButton,
            });  
            handleClose();
            getModules()
        }
    }   
    catch(err)
    {
        console.log(err);
    }
 }
 React.useEffect(() => {
    chapterAPiCalls(url);
 }, [])
 const [modCalls, setModCalls] = React.useState([]);
 const getModules = async() => {
    try
    {
        const token = localStorage.getItem("user_token");
        const response = await GetModuleApi(token, url.chapter_id);
        setModCalls(response.data);
        //console.log(response.data);
    }   
    catch(err)
    {
        console.error(err);
    }
 }
 React.useEffect(() => {
    getModules()
 }, [])
 //console.log(chapterData);
  // decode token and restrict access
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>
      <div className="flex flex-grow">
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen pt-12">
            <div className={`${buttonOpen ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
              <div className="text-gray-500">Course / Chapters / Modules</div>
              <div className="mt-5 font-semibold text-xl text-gray-600">Associated Modules</div>
              <div className="mt-5 bg-white rounded px-8 py-10">
                <div className="font-semibold">
                        <IconButton size="md" color="success" className="bg-green-200" onClick={() => setOpenModule(true)}>
                                    <Plus className="h-6 w-6" />
                        </IconButton>
                </div>
                <table className="w-full text-left border-collapse mt-10">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Module Name</div>
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
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(modCalls) &&
                    modCalls.length > 0 ? (
                      modCalls.map((data, index) => (
                        <tr
                          className="text-sm text-gray-700"
                          key={index}
                        >
                          <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                            <a href={`/resource/${data?.module_id}`}>{data?.module_name}</a>
                          </td>
                          <td className="py-2 px-4 text-gray-600 font-medium border-b-2">
                            {/* {data?.access_status === true ? (
                              <span className="px-2 py-1 bg-green-100 text-sm">
                                Approved
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-sm">
                                Request
                              </span>
                            )} */} 
                            "chart"
                          </td>
                          {/* <td className="py-2 px-4 font-semibold border-b-2">
                            <button
                            >
                              <EllipsisVertical size={24} />
                            </button>
                          </td> */}
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
      <CreateModule isVisible={openModule} onClose={handleClose}>
        <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">Create New Module</div>
                <IconButton onClick={handleClose}>
                    <X className="h-6 w-6" />
                </IconButton>
        </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                    <div>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        id="outlined-basic"
                        label="Module Name"
                        onChange={handleChange}
                        name="module_name"
                        value={moduleData.module_name}
                      />
                    </div>
                    <div>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="batch-select-label">
                          Select Chapter
                        </InputLabel>
                        <Select
                          labelId="batch-select-label"
                          name="chapter_id"
                          label="Select Chapter"
                          onChange={handleChange}
                          value={moduleData.chapter_id}
                        >
                          {Array.isArray(chapterData) &&
                          chapterData.length > 0 ? (
                            chapterData.map((data, index) => (
                              <MenuItem
                                key={index}
                                value={data?.chapter_id}
                              >
                                {data?.chapter_name}
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
                      onClick={() => {moduleApiCalls(moduleData); handleClose()}}
                    >
                      Save
                    </button>
                </div>
      </CreateModule>
    </div>
  )
}
export default Module;