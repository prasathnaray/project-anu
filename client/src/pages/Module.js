import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, Plus, X } from 'lucide-react';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CreateModule from '../components/superadmin/CreateModule';
import GetModuleApi from '../API/GetModuleAPI';
import getChapterAPI from '../API/getChapterAPI';
function Module() {
  const [openModule, setOpenModule] = React.useState(false);
  const handleClose = () => {
        setOpenModule(false)
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
 React.useEffect(() => {
    chapterAPiCalls(url);
    //console.log(chapterData);
 }, [])
 console.log(chapterData);
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
                    <tr className="text-sm text-gray-700">
                      <td className="py-2 px-4 text-[#8DC63F] font-semibold border-b-2">
                        <a href="/resource">Module 1</a>
                      </td>
                      <td className="py-2 px-4 text-gray-600 font-medium border-b-2">
                        In Progress
                      </td>
                    </tr>
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
                        //onChange={handleModuleChange}
                        name="module_name"
                        //value={chapterData.chapter_name}
                      />
                    </div>
                    <div>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="batch-select-label">
                          Select Chapter
                        </InputLabel>
                        <Select
                          labelId="batch-select-label"
                          name="course_id"
                          label="Select Chapter"
                        //   onChange={handleModuleChange}
                        //   value={chapterData.course_id}
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
                    >
                      Save
                    </button>
                </div>
      </CreateModule>
    </div>
  )
}
export default Module;