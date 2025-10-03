import React, {useState, useEffect, useRef} from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import { ArrowUpWideNarrow, ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import CreateBatch from "../components/admin/CreateBatch";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { X } from 'lucide-react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import CreateBatchAPI from "../API/CreateBatchAPI";
import GetBatchesAPI from "../API/GetBatchesAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomCloseButton from '../utils/CustomCloseButton';
import getMonthYear from '../utils/DateChange';
import TablePagination from '@mui/material/TablePagination';
import DeleteBatchAPI from "../API/deleteBatchAPI";
import DeleteToast from "../utils/deleteToast";
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; 
import dayjs from "dayjs";
import GetCuriculumAPI from "../API/getCuriculumAPI";
import GetCoursesByCuriculumAPI from "../API/GetCoursesByCuriculumAPI";
const CustomDateInput = React.forwardRef(({ value, onClick, onChange }, ref) => (
  <div className="relative w-full mt-5">
    <input
      ref={ref}
      onClick={onClick}
      value={value}
      readOnly
      placeholder=" "
      className="peer w-full px-2.5 pt-3 pb-2.5 text-sm text-gray-900 border border-gray-300 rounded-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <label
      className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                        peer-focus:px-2 
                                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                       peer-focus:text-blue-600

                                        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    >
      Start Date
    </label>
  </div>
));

const CustomDateInput2 = React.forwardRef(({ value, onClick, onChange }, ref) => (
  <div className="relative w-full mt-5">
    <input
      ref={ref}
      onClick={onClick}
      value={value}
      readOnly
      placeholder=" "
      className="peer w-full px-2.5 pt-3 pb-2.5 text-sm text-gray-900 border border-gray-300 rounded-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <label
      className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
                                        peer-focus:px-2 
                                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                                        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
                                                       peer-focus:text-blue-600

                                        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    >
      End Date
    </label>
  </div>
));
function Batch()  {
        const token = localStorage.getItem('user_token')
        const [openBatch, setOpenBatch] = useState(false);
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [page, setPage] = React.useState(2);
        const [rowsPerPage, setRowsPerPage] = React.useState(2);
        const [rowCount, setRowCount] = useState(0);
        const [corList, setCorList] = useState({});


        /// batch search options
                        
        //
        const handleChangePage = (event, newPage) => {
                setPage(newPage);
        };
        const handleChangeRowsPerPage = (event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
        };
        const handleClose = () => {
                setOpenBatch(false);
                setStartDate(null);
                setEndDate(null);
                setBatchData({
                                batch_name: '',
                                curiculum_name: '',
                                course_names: [],
                                batch_start_date: null,
                                batch_end_date: null
                });
                setCorList({})
        };
        // delete api 
                const deleteSubmit = async(batch_id) => {
                        try
                        {
                                let tokenn = localStorage.getItem('user_token')
                                DeleteToast(batch_id, () => BatchesData(tokenn), tokenn);
                        }       
                        catch(err)
                        {
                                // console.log()
                                if(err?.response?.status == 403)
                                {
                                        toast.error("please login again" , {
                                                autoClose: 3000,
                                                toastId: 'login-again',
                                                icon: false,
                                                closeButton: CustomCloseButton,
                                        });
                                }
                        }
                }
        //
        const [buttonOpen, setButtonOpen] = useState(true);
        const handleButtonOpen = () => {
                setButtonOpen(!buttonOpen);
        };
        //handling input data
        const [batchData, setBatchData] = useState({
                batch_name: '', 
                batch_start_date: startDate, 
                batch_end_date: endDate,
                curiculum_name: '',
                course_data: [],
        });
        //
        const [listBatch, setListBatch] = useState([]);
        const handleChange = (e) => {
        const { name, value } = e.target;
                if (name === "course_data") {
                        setBatchData({
                        ...batchData,
                        // [name]: typeof value === "string" ? value.split(",") : value,
                        [name]: Array.isArray(value) ? value.map(String) : value.split(",").map(String),
                        });
                } 
                else {
                        setBatchData({
                                ...batchData,
                                [name]: value,
                        });
                        if (name === "curiculum_name" && value) {
                                getCourseByCurData(value);
                        }
                }
        };
         console.log(batchData);
          const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
          const dropdownRefs = useRef({});  
          const toggleDropdown = (index) => {
            setOpenDropdownIndex(openDropdownIndex === index ? null : index);
          };
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
//batch data search
             const [searchItem, setSearchItem] = React.useState('');
             const [filteredUsers, setFilteredUsers] = useState([])

        //
        const BatchesData = async(token) => {
                        //e.preventDefault()
                        try
                        {
                                const result = await GetBatchesAPI(token);
                                setListBatch(result.data.rows);
                                setRowCount(result.data.rowCount);
                                setFilteredUsers(result.data.rows)
                        }
                        catch(err)
                        {
                                console.log(err)
                        }
        }

        const handleSearchChange = (e) => {
                        const value = e.target.value.toLowerCase();
                        setSearchItem(value);

                        if (!value) {
                        setFilteredUsers(listBatch); // show all if search is cleared
                        } else {
                        const filtered = listBatch.filter((batch) =>
                        batch.batch_name?.toLowerCase().includes(value)
                        );
                        setFilteredUsers(filtered);
                        }
        };

        useEffect(() => {
                BatchesData(token)
        }, [])
        const handleSubmit  = async(e) => {
                e.preventDefault();
                const token = localStorage.getItem("user_token");
                try
                {
                        if(!batchData.batch_name || !batchData.batch_start_date || !batchData.batch_end_date || !batchData.curiculum_name || !batchData.course_data)
                        {
                                toast.error("please fill all the fields" , {
                                        autoClose: 3000,
                                        toastId: 'input-missing',
                                        icon: false,
                                        closeButton: CustomCloseButton,
                                });
                        }
                        else{
                                        const response = await CreateBatchAPI(token, batchData);
                                        if(response)
                                        {
                                                toast.success("Batch Created" , {
                                                        autoClose: 3000,
                                                        toastId: 'success-batch-inserted',
                                                        icon: false,
                                                        closeButton: CustomCloseButton,
                                                }); 
                                                handleClose();
                                                BatchesData(token);
                                        }
                        }
                }
                catch(err)
                {
                        if(err.response.data.code)
                        {
                                toast.error("Batch already exist", {
                                        autoClose: 3000,
                                        toastId: 'already-batch-created',
                                        icon: false,
                                        closeButton: CustomCloseButton,
                                })
                        }
                }
        }
        const [curList, setCurList] = useState({});
        const getCuriculumList = async() => {
                try
                {       
                       const TOKEN = localStorage.getItem('user_token')
                       const result = await GetCuriculumAPI(TOKEN);
                        setCurList(result.data.result);
                }
                catch(err)
                {
                        console.log(err)
                }
        }
        const getCourseByCurData = async(curiculum_id) => {
                if (!curiculum_id) return;
                try
                {
                        const token = localStorage.getItem('user_token');
                        const result = await GetCoursesByCuriculumAPI(token, curiculum_id)
                        setCorList(result.result)
                }
                catch(err)
                {
                        console.log(err)
                        setCorList({});
                }
        }
        console.log(corList)
        React.useEffect(() => {
                getCuriculumList()
        }, [])

                //console.log(curList)
        if (!token) {
                        return <Navigate to="/" replace />;
        }
        const decoded = jwtDecode(token);
        if (decoded.role != 101 && decoded.role != 102) {
                        return <Navigate to="/" replace />;
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
                                   <div 
                        className={`${
          buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
        } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                        <div className="">
                                <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="text-gray-500">Dashboard / Batch</div>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Batches</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                <div className="font-semibold text-xl text-gray-500">All Batches</div>
                                                <div className="grid grid-cols-2 items-center my-5">
                                                        <div className=""><input
                                                            type="text"
                                                            placeholder="Search Batch"
                                                            value={searchItem}
                                                            onChange={handleSearchChange}
                                                            className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                                        /></div>
                                                        <div className="flex justify-end items-center"><button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out" onClick={() => setOpenBatch(true)}>Create Batch</button></div>
                                                </div>
                                                <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Batch Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Start date</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>End date</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Instructor associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        {decoded.role == 99 && (<th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>) }
                                                                </tr>
                                                        </thead>
                                                        {/* <tbody> */}
                                                               {/* {listBatch.length > 0 ? (
                                                                        listBatch.map((listBatch, index) => (
                                                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold"><a href={`/batch/${listBatch.batch_id}`}>{listBatch.batch_name}</a></td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">{getMonthYear(listBatch.batch_start_date)}</td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">{getMonthYear(listBatch.batch_end_date)}</td>
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">{listBatch?.role_counts == null && <div>0</div> || listBatch?.role_counts[0]?.count}</th>
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">{listBatch?.role_counts == null && <div>0</div> || listBatch?.role_counts[1]?.count}</th>
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                        <button onClick={() => toggleDropdown(index)}><EllipsisVertical size={24} /></button>
                                                                                        {openDropdownIndex === index && (
                                                                                                <div
                                                                                                 ref={(el) => (dropdownRefs.current[index] = el)}
                                                                                                className={`absolute right-18 mt-1 w-22 bg-white border border-gray-200 rounded shadow-md z-10
                                                                                                        transition-all ease-in-out duration-500 origin-top-right
                                                                                                        ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                                                                                                `} 
                                                                                                >
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">View</button>
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => deleteSubmit(listBatch.batch_id)}>Delete</button>
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Tag Trainees</button>
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Add Course</button>
                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Tag Instructors</button>

                                                                                                </div>
                                                                                        )}
                                                                                </th>
                                                                        </tr>
                                                                        ))
                                                                        ) : (
                                                                        <tr>
                                                                                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                                                                                        No data found
                                                                                </td>
                                                                        </tr>
                                                                  )}   */}

                                                                  <tbody>
                                                                                {filteredUsers.length > 0 ? (
                                                                                filteredUsers.map((listBatch, index) => (
                                                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                                        <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                        <a href={`/batch/${listBatch.batch_id}`}>{listBatch.batch_name}</a>
                                                                                        </td>
                                                                                        <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                        {getMonthYear(listBatch.batch_start_date)}
                                                                                        </td>
                                                                                        <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                        {getMonthYear(listBatch.batch_end_date)}
                                                                                        </td>
                                                                                        <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                        {listBatch?.role_counts == null ? 0 : listBatch?.role_counts[0]?.count}
                                                                                        </th>
                                                                                        <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                        {listBatch?.role_counts == null ? 0 : listBatch?.role_counts[1]?.count}
                                                                                        </th>
                                                                                        <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                        {/* dropdown actions */}
                                                                                        </th>
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

                                                        {/* </tbody> */}
                                                </table>
                                                <div className="flex justify-end items-center mt-6 gap-10">
                                                        <TablePagination 
                                                                component="div"
                                                                count={rowCount}
                                                                page={page}
                                                                onPageChange={handleChangePage}
                                                                rowsPerPage={rowsPerPage}
                                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                        />
                                                </div>
                                            </div>
                                </div>
                        </div>
                </div>
                </div>     
                <CreateBatch isVisible={openBatch} onClose={handleClose}>
                    <div className="flex justify-between items-center">
                        <div className="text-lg">Create Batch</div>
                        <div><button onClick={handleClose} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
                    </div>
                    <div className="mt-5">
                        <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ minHeight: "35px" }}
                                id="outlined-basic"
                                label="Batch name"
                                name="batch_name"
                                onChange={handleChange}
                                value={batchData.batch_name}
                        />
                    </div>
                    <div className="mt-5 relative overflow-visible z-[1200]">
                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="program-select-label">Select Curiculum</InputLabel>
                              <Select
                                labelId="program-select-label"
                                label="Select Curiculum"
                                className=""
                                onChange={handleChange}
                                name="curiculum_name"
                                value={batchData?.curiculum_name}
                                MenuProps={{
                                        disablePortal: false, // ← force to portal
                                        anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                        },
                                        transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                        },
                                        PaperProps: {
                                        style: {
                                                zIndex: 1300 // must be higher than modal
                                        }
                                        }
                                }}
                              >
                                        {Array.isArray(curList) && curList.length > 0 ? (
                                                curList.map((data, index) => (
                                                        <MenuItem key={index} value={data?.curiculum_id}>
                                                                {data?.curiculum_nam}
                                                        </MenuItem>
                                                ))
                                        ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                        )}
                              </Select>
                            </FormControl>
                    </div>
                    <div className="mt-5 relative overflow-visible z-[1200]">
                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="chip-select-label">Select Course</InputLabel>
                              <Select
                                multiple
                                labelId="chip-select-label"
                                label="Select Course"
                                className=""
                                onChange={handleChange}
                                name="course_data"
                                value={batchData?.course_data || []}
                                 MenuProps={{
                                        disablePortal: false, // ← force to portal
                                        anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                        },
                                        transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                        },
                                        PaperProps: {
                                        style: {
                                                zIndex: 2300 // must be higher than modal
                                        }
                                        }
                                }}
                                renderValue={(selectedIds) => (
                                         Array.isArray(selectedIds) ? (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                        {selectedIds.map((id) => {
                                                        const course = corList.find((c) => c.course_id === id);
                                                        return (
                                                        <Chip
                                                                key={id}
                                                                label={course ? course.course_name : id}
                                                                sx={{ borderRadius: "4px" }}
                                                        />
                                                        );
                                                        })}
                                                </Box>
                                                ) : null 
                                )}
                              >
                                        {Array.isArray(corList) && corList.length > 0 ? (
                                                corList.map((data, index) => (
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
                    <div className="grid grid-cols-2 gap-5">
                        <div className="mt-5">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                label="Starting Date"
                                value={
                                batchData.batch_start_date
                                        ? dayjs(batchData.batch_start_date)
                                        : null
                                }
                                onChange={(date) => {
                                        setStartDate(date);
                                        setBatchData(prev => ({ ...prev, batch_start_date: date }));
                                }}
                                slotProps={{
                                textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                        size: "small",
                                        sx: { minHeight: "35px" },
                                },
                                }}
                                />
                              </LocalizationProvider>
                        </div>
                        <div className="mt-5">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                label="End Date"
                                value={
                                batchData.batch_end_date
                                        ? dayjs(batchData.batch_end_date)
                                        : null
                                }
                                onChange={(date) => {
                                        setEndDate(date);
                                        setBatchData(prev => ({ ...prev, batch_end_date: date }));
                                }}
                                slotProps={{
                                textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                        size: "small",
                                        sx: { minHeight: "35px" },
                                },
                                }}
                                />
                              </LocalizationProvider>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end items-center">
                        <button className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white" onClick={handleSubmit}>Save</button>
                    </div>
                </CreateBatch>
    </div>
    )
}
export default Batch;