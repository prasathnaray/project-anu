import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, EllipsisVertical, X } from 'lucide-react';
import CurriculumCreation from '../components/superadmin/CuriculumCreation';
import AddCuriculumAPI from '../API/AddCuriculumAPI';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import CustomCloseButton from '../utils/CustomCloseButton';
function Curiculam() {
  const token = jwtDecode(localStorage.getItem('user_token'));
  const [buttonOpen, setButtonOpen] = React.useState(false);
  const [curriculumData, setCurriculumData] = React.useState({
      curiculum_name: ''
  })
  const [openCuriculum, setOpenCuriculum] = React.useState(false);
  const handleChange = (e) => {
      const {name, value} = e.target;
      setCurriculumData({
            ...openCuriculum,
            [name]: value,
      });
  }
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  const handleClose = (e) => {
        setOpenCuriculum(false);
        setCurriculumData({
            curiculum_name: ''
        })
  }
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
  const dropdownRefs = React.useRef({});  
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(dropdownRefs.current).some(ref =>
        ref && ref.contains(event.target)
      );
      if (!isClickInside) {
        setOpenDropdownIndex(null);
      }
   } 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  console.log(curriculumData);
  const createCuriculum = async(e) => {
    e.preventDefault();
    try
    {
        const token = localStorage.getItem('user_token');
        console.log(token);
        const response = await AddCuriculumAPI(token, curriculumData);
        if(response?.data?.code === 200)
        {
              toast.success("Curiculum Created" , {
                                                        autoClose: 3000,
                                                        toastId: 'success-batch-inserted',
                                                        icon: false,
                                                        closeButton: CustomCloseButton,
              }); 
              handleClose();
        }
    }
    catch(err)
    {
        console.log(err)
    }
  }
  if(!token.role == 99)
  {
     return <Navigate to="/" replace/>
  }
  return (
      <div className={`flex flex-col min-h-screen`}>
              <div>
                   <NavBar />
              </div>
              <div className="flex flex-grow">
                    <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>  
                    </div>
                    <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div>
                                  <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                      <div className="text-gray-600">Curiculum / All Curiculum</div>
                                      <div className="mt-5 font-semibold text-xl text-gray-600">Curiculum</div>
                                      <div className="mt-5 bg-white rounded px-8 py-10">
                                              <div className="font-semibold text-xl text-gray-500">All Curiculam</div>
                                              <div className="grid grid-cols-2 items-center my-5">
                                                        <div className="">
                                                              <input
                                                                  type="text"
                                                                  placeholder="Search Curriculum"
                                                                  className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                              />
                                                        </div>
                                                        <div className="flex justify-end items-center"><button onClick={() => setOpenCuriculum(true)} className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out">Create Curiculam</button></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                    <thead className=''>
                                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Curiculum Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Total Courses Asscoiated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Total Centres Associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>
                                                                </tr>
                                                    </thead>
                                                    <tbody>
                                                          <tr className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">sc</td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">scv</td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">sc</td>
                                                                    <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                            <button onClick={() => toggleDropdown()}><EllipsisVertical size={24} /></button>
                                                                    </td>
                                                          </tr>
                                                    </tbody>
                                                </table>
                                      </div>
                                  </div>
                            </div>
                    </div>
              </div>
              <CurriculumCreation isVisible={openCuriculum} onClose={handleClose}>
                        <div className="">
                                    <div className="flex justify-between items-center gap-5">
                                                  <div>Create Curiculum</div>
                                                  <button  onClick={handleClose} className="hover:bg-red-100 p-1 hover:text-gray-700 rounded"><X size={20}/></button>
                                    </div>
                                    <div className="mt-5">
                                            <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ minHeight: "35px" }}  
                                                    id="outlined-basic"
                                                    label="Curiculum Name"
                                                    name="curiculum_name"
                                                    onChange={handleChange}
                                                    value={curriculumData.curiculum_name}
                                            />
                                    </div>
                                    <div className="flex justify-end items-end mt-5">
                                              <button className="bg-[#8DC63F] px-3 py-2 text-white" onClick={createCuriculum}>Save</button>
                                    </div>
                        </div>
              </CurriculumCreation>
      </div>
  )
}
export default Curiculam;