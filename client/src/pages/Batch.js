import React, {useState, useEffect, useRef} from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";
import { ArrowUpWideNarrow, ChevronLeft, ChevronRight, EllipsisVertical, LayoutDashboard, ListFilter, Notebook, Pen, Pencil, SlidersHorizontal } from "lucide-react";
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
import CreateTargetedLearning from "../components/CreateTargetedLearning";
import TraineeListAPI from "../API/TraineeListAPI";
import GetCoursesAPI from "../API/GetCoursesAPI";
import getChapterAPI from "../API/getChapterAPI";
import GetModuleApi from "../API/GetModuleAPI";
import getResourceAPI from "../API/GetResourceAPI";
import GetResourcesModuleIdsAPI from "../API/GetResourcesModuleIdsAPI";
import CreateTargetedLearningAPI from "../API/CreateTargetedLearningAPI";
import GetTarLearningAPI from "../API/GetTarLearningAPI";
import DeleteTargetedLearningAPI from "../API/DeleteTargetedLearningAPI";
import TLToast from "../utils/TLToast";
import FilterBatch from "../components/admin/FilterBatch";
import filterBatchAPI from "../API/filterBatchAPI";
import GetCertificateByCurAPI from "../API/GetCertificateByCurAPI";
import EditBatch from "../components/EditBatchTime";
import UpdateBatchAPI from "../API/UpdateBatchAPI.js";
import { ClipLoader } from "react-spinners";
import GetLearningModuleByIdAPI from "../API/GetLearningModuleByIdAPI.js";
import getResourceBylmandrtAPI from "../API/getResourceBylmandrtAPI.js";

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
        const [filterData, setFilterData] = useState({
                         batch_name_filter: "",
                         instructor_name_filter: "",
        });
        const handleFilterChange = (e) => {
                const { name, value } = e.target;
                setFilterData({
                        ...filterData,
                        [name]: value,
                });
        }
        console.log(filterData);
        const token = localStorage.getItem('user_token')
        const [openBatch, setOpenBatch] = useState(false);
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [page, setPage] = React.useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(5);
        const [rowCount, setRowCount] = useState(0);
        const [corList, setCorList] = useState({});
        const [openTargetedLearning, setTargetedLearning] = React.useState(false);

        /// batch search options
                        
        //
        const handleChangePage = (event, newPage) => {
                setPage(newPage);
        };
        const handleChangeRowsPerPage = (event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
        };

        const [batchCus, setBatchCus] = useState(true);
        console.log(batchCus);
        const [traineeState, setTraineeState] = React.useState([])
        const TraineesListAPICall = async() => {
                        // if(jwtDecode(localStorage.getItem("user_token")).role!=101)
                        // {
                        //         return;
                        // }
                        try
                        {
                                let token = localStorage.getItem("user_token")
                                const response = await TraineeListAPI(token);
                                setTraineeState([...response.data.rows]);
                                // console.log(response);
                        }
                        catch(err)
                        {
                                console.log(err);
                        }
                }
                //console.log(traineeState)
        const handleClose = () => {
                setTargetedLearning(false)
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
                setTargetedLearningState({
                        tar_name: "",
                        curiculum_id: "",
                        course_id: "",
                        chapter_id: "",
                        module_id: [],
                        resources_id: [],
                        trainee_id: [],
                        start_date: "",
                        end_date: ""
                })
                handleTarList();
                //TraineesListAPICall();

        };
        const [openFilter, setOpenFilter] = useState(false);
        const handleCloseFilter = () => {
                setOpenFilter(!openFilter);
                setFilterData({
                                batch_name_filter: "",
                                instructor_name_filter: "",     
                })
        }
        
        //filter batch api calls
        const filterBatchCall = async(e) => {
                e.preventDefault();
                if (!filterData.batch_name_filter && !filterData.instructor_name_filter) {
                                toast.error("At least one filter must be filled", {
                                                autoClose: 3000,
                                                toastId: 'filter-batch',
                                                icon: false,
                                                closeButton: CustomCloseButton,
                                        });
                                return;
                }
                try
                {
                        let token = localStorage.getItem('user_token')
                        const response = await filterBatchAPI(token, {
                                batch_name: filterData.batch_name_filter,
                                instructor_name: filterData.instructor_name_filter
                        });
                        setListBatch(response.data.rows);
                        setFilteredUsers(response?.data);
                        setRowCount(response.data.rowCount);
                        handleCloseFilter();
                }
                catch(err)
                {
                        console.log(err)
                }
        }
        //ending of filter batch api calls
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
                certification_data: [],
        });
        //
        const [listBatch, setListBatch] = useState([]);
        const handleChange = (e) => {
        const { name, value } = e.target;
                if (name === "certification_data") {
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
         //edit batch
        const [loading, setLoading] = useState(false);
        const [selectedBatchData, setSelectedBatchData] = useState(null);
        const [editBatch, setEditBatch] = useState(false);
        const [newBatchEdit, setNewBatchEdit] = useState({
                new_batch_name: '',
                new_start_date: null,
                new_end_date: null,
        })
        const handleEditBatch = () => {
                setEditBatch(!editBatch);
                setNewBatchEdit({
                        batch_id:'',
                        new_batch_name: '',
                        new_start_date: null,
                        new_end_date: null
                });
        }
        const handleChangee = (e) => {
        const { name, value } = e.target;
                setNewBatchEdit({
                        ...newBatchEdit,
                        [name]: value,
                });
        };
        const handleUpdateAPICall = async() => {
                try
                {
                        if(!newBatchEdit.new_batch_name || !newBatchEdit.new_start_date || !newBatchEdit.new_end_date)
                        {
                                toast.error("please fill all the fields" , {
                                        autoClose: 3000,
                                        toastId: 'input-missing',
                                        icon: false,
                                        closeButton: CustomCloseButton,
                                });
                        }
                        else{
                                setLoading(true);
                                //const token = localStorage.getItem('user_token');
                                const response = await UpdateBatchAPI(newBatchEdit);
                                if(response)
                                {
                                        toast.success("Batch Updated" , {
                                                autoClose: 3000,
                                                toastId: 'success-batch-updated',
                                                icon: false,
                                                closeButton: CustomCloseButton,
                                        });
                                        handleEditBatch();
                                        BatchesData(token, page, rowsPerPage);
                                }
                        }
                }
                catch(err)
                {
                        console.log(err)
                }
                finally
                {
                        setLoading(false);
                }
        }
        console.log(newBatchEdit);
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
        
        const BatchesData = async(token, page, limit) => {
                        //e.preventDefault()
                        try
                        {
                                setLoading(true);
                                const result = await GetBatchesAPI(token, page + 1, limit);
                                setListBatch(result.data.rows || []);
                                setRowCount(result.data?.rows[0]?.total_count || 0);
                                setFilteredUsers(result.data.rows)
                        }
                        catch(err)
                        {
                                console.log(err)
                        }
                        finally
                        {
                                setLoading(false);
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
                BatchesData(token, page, rowsPerPage);
        }, [page, rowsPerPage])
        const handleSubmit  = async(e) => {
                e.preventDefault();
                const token = localStorage.getItem("user_token");
                try
                {
                        if(!batchData.batch_name || !batchData.batch_start_date || !batchData.batch_end_date || !batchData.curiculum_name || !batchData.certification_data)
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
                        const result = await GetCertificateByCurAPI(token, curiculum_id);
                        //console.log(result.data);
                        setCorList(result.data.result)
                }
                catch(err)
                {
                        console.log(err)
                        setCorList({});
                }
        }
        const [chapterData, setChapterData] = React.useState([]);
        const getLMByCerData = async(course_id) => {
                if(!course_id) return;
                try
                {
                        const token = localStorage.getItem("user_token");
                        const response  = await GetLearningModuleByIdAPI(token, course_id);
                        setChapterData(response.data);
                }
                catch(err)
                {
                        console.log(err)

                }
        }
        const [moduleList, setModuleList] = React.useState('')
        const getModulesbyChapter = async(chapter_id) => {
                if(!chapter_id) return;
                try 
                {
                        const token = localStorage.getItem("user_token");
                        const response = await GetModuleApi(token, chapter_id);
                        setModuleList(response.data.modules)
                }
                catch(err)
                {
                        console.log(err)
                }
        }
        const [resourceList, setResourceList] = React.useState('')
        const getResourceByModule = async(module_id) => {
                if(!module_id) return;
                try
                {
                        const token = localStorage.getItem('user_token');
                        const response = await getResourceAPI(token, module_id);
                        setResourceList(response.data);
                }
                catch(err)
                {
                        console.log(err)
                }
        }
        const [resListData, setresListData] = React.useState([])
        const getResourcewlmandrt = async(learning_module_id, r_type) => {
                try
                {
                        const token = localStorage.getItem('user_token');
                        const response = await getResourceBylmandrtAPI(token, learning_module_id, r_type);
                        setresListData(response.data);
                }
                catch(err)
                {
                        console.log(err)
                }
        }
        console.log(resourceList);
        console.log(corList)
        React.useEffect(() => {
                getCuriculumList()
        }, [])
        ///Target Learning area
                // const [traineeState, setTraineeState] = React.useState({})
                const [targetedLearning, setTargetedLearningState] = React.useState({
                        tar_name: "",
                        curiculum_id: "",
                        certificate_id: "",
                        learning_module_id: "",
                        // module_id: [],
                        resource_type: "",
                        resources_id: [],
                        trainee_id: [],
                        start_date: "",
                        end_date: ""
                })
                console.log(targetedLearning);
                const handleTChange = (e) => {
                        const { name, value } = e.target;
                        if (name === "course_data") {
                                setTargetedLearningState({
                                ...targetedLearning,
                                [name]: Array.isArray(value) ? value.map(String) : value.split(",").map(String),
                                });
                        } 
                        else {
                                setTargetedLearningState({
                                        ...targetedLearning,
                                        [name]: value,
                                });
                                if (name === "curiculum_id" && value) {
                                        getCourseByCurData(value);
                                }
                                if (name === "certificate_id" && value) { 
                                      getLMByCerData(value);
                                }
                                if(name === "learning_module_id" && value)
                                {
                                     getResourceByModule(value)
                                     //getModulesbyChapter(value);
                                }
                                if(name === "resource_type" && value)
                                {
                                        getResourcewlmandrt(targetedLearning.learning_module_id, value)
                                }
                                // if(name === "resources_id" && value)
                                // {
                                            
                                //        // getResourceAPI(value);
                                // }
                        }
                };
                const postTargetedAPICall = async(e) => {
                        e.preventDefault();
                        try
                        {
                                if(!targetedLearning.tar_name|| !targetedLearning.curiculum_id || !targetedLearning.certificate_id || !targetedLearning.learning_module_id || !targetedLearning.resource_type || !targetedLearning.resources_id || !targetedLearning.trainee_id || !targetedLearning.start_date || !targetedLearning.end_date)
                                {
                                         toast.error("please fill all the fields" , {
                                                        autoClose: 3000,
                                                        toastId: 'input-missing',
                                                        icon: false,
                                                        closeButton: CustomCloseButton,
                                        });    
                                }
                                else
                                {
                                        let token = localStorage.getItem('user_token');
                                        const response = await CreateTargetedLearningAPI(token, targetedLearning);
                                        if(response)
                                        {
                                                toast.success("Targeted Learning Initiated" , {
                                                        autoClose: 3000,
                                                        toastId: 'success-tar-created',
                                                        icon: false,
                                                        closeButton: CustomCloseButton,
                                                }); 
                                                handleClose();
                                        }
                                }
                        }
                        catch(err)
                        {
                                console.log(err);
                        }
                }
                // const TraineesListAPICall = async() => {
                //         if(jwtDecode(localStorage.getItem("user_token")).role!=101)
                //         {
                //                 return;
                //         }
                //         try
                //         {
                //                 let token = localStorage.getItem("user_token")
                //                 const response = await TraineeListAPI(token);
                //                 setTraineeState(response.data.rows);
                //                 //console.log(response);
                //         }
                //         catch(err)
                //         {
                //                 console.log(err);
                //         }
                // }
                const deleteTargetedLearningCall = async(targeted_learning_id) => {
                        try
                        {
                                let token = localStorage.getItem('user_token')
                                TLToast(targeted_learning_id, () => handleTarList(), token)
                                // const response = await DeleteTargetedLearningAPI(token, targeted_learning_id);
                                // console.log(response);
                        }
                        catch(err)
                        {
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
                React.useEffect(() => {
                        TraineesListAPICall();
                }, [])
                // React.useEffect(() => {
                //         console.log(traineeState);
                // }, [])
                //console.log(traineeState);
                // resource type
                const safeResourceList = Array.isArray(resourceList) ? resourceList : []; 
                const resourceTypes = Array.from(
                        new Set(
                        safeResourceList
                        .map((r) => r?.resource_type)
                        .filter(Boolean)
                        )
                );



                const [tarList, setTarList] = React.useState([])
                const handleTarList = async() => {
                        try
                        {
                                let token = localStorage.getItem('user_token');
                                const response = await GetTarLearningAPI(token);
                                setTarList(response.data)
                                //console.log(response);
                        }
                        catch(err)
                        {
                                console.log(err)
                        }
                }
                React.useEffect(() => {
                        handleTarList()
                }, [])
        ///
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
                        {/* <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                <button onClick={() => setBatchCus(true)} className="flex justify-between gap-2 items-center bg-[#8DC63F] px-2 py-[2px] rounded cursor-pointer text-gray-100 font-semibold hover:rounded-full transition-all ease-in-out duration-300">
                                  <LayoutDashboard size={15} /> 
                                  <span className="text-[13px]">Batch List</span>
                                </button>
                                <button onClick={() => setBatchCus(false)} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded-full">
                                  <SlidersHorizontal size={15} className="text-gray-600" />
                                  <span className="text-[13px]">Targeted Learning</span>
                                </button>
                        </div> */}
                        <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                        {/* ✅ Batch List Button */}
                        <button
                        onClick={() => setBatchCus(true)}
                        className={`flex justify-between gap-2 items-center px-2 py-[2px] rounded cursor-pointer font-semibold transition-all ease-in-out duration-300
                        ${batchCus
                                ? 'bg-[#8DC63F] text-white hover:rounded-full'
                                : 'text-gray-600 hover:bg-gray-100 hover:rounded-full'
                        }`}
                        >
                        <LayoutDashboard size={15} />
                        <span className="text-[13px]">Batch List</span>
                        </button>

                        {/* ✅ Targeted Learning Button */}
                        <button
                        onClick={() => setBatchCus(false)}
                        className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out
                        ${!batchCus
                                ? 'bg-[#8DC63F] text-white hover:rounded-full'
                                : 'text-gray-600 hover:bg-gray-100 hover:rounded-full'
                        }`}
                        >
                        <SlidersHorizontal size={15} />
                        <span className="text-[13px]">Targeted Learning</span>
                        </button>
                        </div>
                        {batchCus==true ? (
                                <div className="">
                                <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border"><LayoutDashboard size={15} /> Dashboard / <Notebook size={15}/> <span className="text-[15px]">Batch</span></div>
                                <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                            <div className="mt-5 font-semibold text-xl text-gray-600">Batches</div>
                                            <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                <div className="font-semibold text-xl text-gray-500 flex justify-between items-center">
                                                        <div>All Batches</div>
                                                        <div><button className="p-2 rounded-lg active:scale-95  transition-transform duration-100" onClick={() => setOpenFilter(true)}><ListFilter size={20}/></button></div>
                                                </div>
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
                                                                        {decoded.role == 99 || decoded.role == 101 && (<th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Instructor associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>)}
                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                        {decoded.role == 99 || decoded.role == 101 && (<th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>) }
                                                                </tr>
                                                        </thead>
                                                                  {/* <tbody>
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
                                                                                        {listBatch?.role_counts == null ? 0 : listBatch?.role_counts[1]?.count ?? 0}
                                                                                        </th>
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
                                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => deleteSubmit(listBatch.batch_id)}>Delete</button>
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
                                                                                )}
                                                                  </tbody> */}

                                                                  <tbody>
                                                                        {loading ? (
                                                                        // 🔄 LOADING STATE
                                                                        <tr>
                                                                        <td colSpan={6} className="py-8 text-center">
                                                                                <div className="flex justify-center items-center gap-2">
                                                                                <div className="w-5 h-5 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
                                                                                <span className="text-gray-600 font-medium">Loading batches...</span>
                                                                                </div>
                                                                        </td>
                                                                        </tr>
                                                                        ) : filteredUsers.length > 0 ? (
                                                                        // ✅ DATA STATE
                                                                        filteredUsers.map((listBatch, index) => (
                                                                        <tr
                                                                                key={index}
                                                                                className="border-b border-gray-200 hover:bg-gray-50 shadow-sm"
                                                                        >
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                <a href={`/batch/${listBatch.batch_id}`}>{listBatch.batch_name}</a>
                                                                                </td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                {getMonthYear(listBatch.batch_start_date)}
                                                                                </td>
                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                {getMonthYear(listBatch.batch_end_date)}
                                                                                </td>
                                                                                {decoded.role == 99 || decoded.role == 101 && (
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                        {listBatch?.role_counts == null ? 0 : listBatch?.role_counts[0]?.count}
                                                                                </th>
                                                                                )} 
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                {listBatch?.role_counts == null ? 0 : listBatch?.role_counts[1]?.count ?? 0}
                                                                                </th>
                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F] relative">
                                                                                <button onClick={() => toggleDropdown(index)}>
                                                                                <EllipsisVertical size={24} />
                                                                                </button>
                                                                                {openDropdownIndex === index && (
                                                                                <div
                                                                                ref={(el) => (dropdownRefs.current[index] = el)}
                                                                                className={`absolute right-18 mt-1 w-22 bg-white border border-gray-200 rounded shadow-md z-10
                                                                                transition-all ease-in-out duration-500 origin-top-right
                                                                                ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                                                                                >
                                                                                        <button
                                                                                                className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                                                onClick={() => deleteSubmit(listBatch.batch_id)}
                                                                                        >
                                                                                                Delete
                                                                                        </button>
                                                                                        <button
                                                                                                className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                                                onClick={()=> {
                                                                                                        setSelectedBatchData(listBatch);
                                                                                                        setNewBatchEdit({
                                                                                                                batch_id: listBatch.batch_id,
                                                                                                                new_batch_name: listBatch.batch_name,
                                                                                                                new_start_date: listBatch.batch_start_date,
                                                                                                                new_end_date: listBatch.batch_end_date
                                                                                                        });
                                                                                                        setEditBatch(true)
                                                                                                }}
                                                                                        >
                                                                                                Edit
                                                                                        </button>
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
                                                                        )}
                                                                        </tbody>

                                                </table>
                                                <div className="flex justify-end items-center mt-6 gap-10">
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
                                </div>
                        </div>
                        ): (
                                <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                                                <div className="mt-5 font-semibold text-xl text-gray-600">Targeted Learning</div>                                                
                                                                <div className="mt-5 bg-white rounded px-8 py-10 ">
                                                                                <div className="flex justify-end items-center">
                                                                                        {/* <div className="text-bold">Custom Batches</div> */}
                                                                                        <div><button className="p-2 bg-[#8DC63F] rounded-full text-white hover:rounded delay-150 transition ease-in-out duration-150" onClick={() => setTargetedLearning(true)}><Pencil size={15}/></button></div>
                                                                                </div>
                                                                                <div className="mt-5">
                                                                                        <table className="w-full text-left border-collapse">
                                                                                                        <thead>
                                                                                                                <tr className="border-b border-gray-300 shadow-sm text-sm"> 
                                                                                                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Batch Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
                                                                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Start date</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>End date</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                                                        <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>
                                                                                                                        {/* <th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>No.of Trainees associated</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th> */}
                                                                                                                        {decoded.role == 99 || decoded.role == 101 && (<th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>) } 
                                                                                                                </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                        {tarList.length > 0 ? (
                                                                                                        tarList.map((tarList, index) => (
                                                                                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 shadow-sm">
                                                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                                                        <a href={`/batch/${tarList.target_learning_id}`}>{tarList.tar_name}</a>
                                                                                                                </td>
                                                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                                                        {getMonthYear(tarList.start_date)}
                                                                                                                </td>
                                                                                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                                                                                        {getMonthYear(tarList.end_date)}
                                                                                                                </td>
                                                                                                                <th className="py-2 px-4 font-semibold text-[#8DC63F]">
                                                                                                                {/* {                       tarList?.role_counts == null ? 0 : tarList?.role_counts[0]?.count} */}
                                                                                                                        
                                                                                                                                <div className="flex -space-x-2">
                                                                                                                                        {/* {tarList.trainee_id.map((tid, index) => (
                                                                                                                                                <div className="z-40 border-2 border-white rounded-full w-7 h-7 flex items-center justify-center bg-[#8DC63F] text-white text-xs font-semibold cursor-pointer">T</div>
                                                                                                                                        ))} */}

                                                                                                                                        {tarList.trainee_id.map((tid, index) => (
                                                                                                                                                <div key={index} className="relative group">
                                                                                                                                                <div className="z-40 border-2 border-white rounded-full w-7 h-7 flex items-center justify-center bg-[#8DC63F] text-white text-xs font-semibold cursor-pointer">
                                                                                                                                                        T
                                                                                                                                                </div>
                                                                                                                                                {/* Tooltip */}
                                                                                                                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded py-0.5 px-2 whitespace-nowrap shadow-md">
                                                                                                                                                                {tid}
                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                        ))}
                                                                                                                                </div>
                                                                                                                        
                                                                                                                </th>
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
                                                                                                                                                        {decoded.role == 101 && (
                                                                                                                                                                <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded" onClick={() => deleteTargetedLearningCall(tarList.target_learning_id)}>Delete</button>
                                                                                                                                                        )} 
                                                                                                                                                        {/* <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Tag Trainees</button>
                                                                                                                                                        <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Add Course</button>
                                                                                                                                                        <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded">Tag Instructors</button> */}

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
                                                                                                        )}
                                                                                                </tbody>
                                                                                        </table>
                                                                                </div>
                                                                </div>
                                </div>
                        )}    
                </div>
                </div>
                <CreateTargetedLearning isVisible={openTargetedLearning} onClose={handleClose}>
                        <div className="flex justify-between items-center">
                                        <div className="text-lg">Create Targeted Learning</div>
                                        <div><button onClick={handleClose} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
                        </div>
                        <div className="mt-5">
                                <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{ minHeight: "35px"}}
                                        id="outlined-basic"
                                        label="Name"
                                        onChange={handleTChange}
                                        name="tar_name"
                                        value={targetedLearning?.tar_name}
                                />
                        </div> 
                        <div className="mt-5">
                                {/* <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{ minHeight: "35px"}}
                                        id="outlined-basic"
                                        label="Curiculum"
                                        onChange={handleTChange}
                                        name="curiculum_id"
                                        value={targetedLearning?.curiculum_id}
                                /> */}
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
                                onChange={handleTChange}
                                name="curiculum_id"
                                value={targetedLearning?.curiculum_id}
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
                        <div className="mt-5 grid grid-cols-1 items-center gap-4">
                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="program-select-label">Select Certificate</InputLabel>
                              <Select
                                labelId="program-select-label"
                                label="Select Certificate"
                                className=""
                                onChange={handleTChange}
                                name="certificate_id"
                                value={targetedLearning?.certificate_id}
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
                                        {Array.isArray(corList) && corList.length > 0 ? (
                                                corList.map((data, index) => (
                                                        <MenuItem key={index} value={data?.certificate_id}>
                                                                {data?.certificate_name}
                                                        </MenuItem>
                                                ))
                                        ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                        )}
                              </Select>
                            </FormControl>
                           <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="program-select-label">Select Learning Modules</InputLabel>
                              <Select
                                labelId="program-select-label"
                                label="Select Learning Modules"
                                className=""
                                onChange={handleTChange}
                                name="learning_module_id"
                                value={targetedLearning?.learning_module_id}
                                MenuProps={{
                                        disablePortal: false,
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
                                                zIndex: 1300
                                        }
                                        }
                                }}
                              >
                                        {/* {Array.isArray(chapterData) && chapterData.length > 0 ? (
                                                chapterData.map((data, index) => (
                                                        const label = [

                                                        ]
                                                        <MenuItem key={index} value={data?.learning_module_id}>
                                                                {data?.course_name}-{data?.module_name}-{data?.unit_name}
                                                        </MenuItem>
                                                ))
                                        ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                        )} */}
                                        {Array.isArray(chapterData) && chapterData.length > 0 ? (
                                                chapterData.map((data, index) => {
                                                const label = [
                                                        data?.course_name,
                                                        data?.module_name,
                                                        data?.unit_name,
                                                ]
                                                        .filter(Boolean) // removes undefined, null, empty strings
                                                        .join(" - ");

                                                return (
                                                <MenuItem key={index} value={data?.learning_module_id}>
                                                        {label}
                                                </MenuItem>
                                                );
                                        })
                                        ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                        )}
                              </Select>
                            </FormControl>
                            </div>
                            <div className="mt-5">
                                        <FormControl 
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                sx={{minHeight: "35px"}}

                                        >
                                              <InputLabel id="program-select-label">Select Resource Type</InputLabel>
                                              <Select
                                                labelId="program-select-label"
                                                label="Select Resource Type"
                                                name="resource_type"
                                                onChange={handleTChange}
                                                value={targetedLearning?.resource_type || ""}
                                               >
                                                        {/* {Array.isArray(resourceList) && resourceList.length > 0 ? (
                                                                resourceList.map((data, index) => (
                                                                        <MenuItem key={index} value={data?.resource_type}>
                                                                                {data?.resource_type}
                                                                        </MenuItem>
                                                                ))
                                                        ) : (
                                                                <MenuItem disabled>No data found</MenuItem>
                                                        )} */}
                                                        {resourceTypes.length > 0 ? (
                                                                resourceTypes.map((type) => (
                                                                        <MenuItem key={type} value={type}>
                                                                                {type}
                                                                        </MenuItem>
                                                                ))
                                                        ) : (
                                                                <MenuItem disabled>No data found</MenuItem>
                                                        )}
                                               </Select>
                                        </FormControl>
                            </div>
                            <div className="mt-5">
                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="chip-select-label">Select Resources</InputLabel>
                              <Select
                                multiple
                                labelId="chip-select-label"
                                label="Select Resources"
                                className=""
                                onChange={handleTChange}
                                name="resources_id"
                                value={targetedLearning?.resources_id || []}
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
                                                        const module = resListData.find((m) => m.resource_id === id);
                                                        // const label = resource?.resource_type || resource?.resource_name || id;
                                                        return (
                                                        <Chip
                                                                key={id}
                                                                label={module ? module.resource_name : id}
                                                                sx={{ borderRadius: "4px" }}
                                                        />
                                                        );
                                                        })}
                                                </Box>
                                                ) : null 
                                )}
                              >
                                        {Array.isArray(resListData) && resListData.length > 0 ? (
                                                resListData.map((data, index) => {
                                                        const label = [
                                                                data?.resource_name,
                                                                data?.resource_type,
                                                                data?.resource_topic,
                                                        ]
                                                        .filter(Boolean) // removes undefined, null, empty strings
                                                        .join("-");
                                                        return (
                                                                <MenuItem key={index} value={data?.resource_id}>
                                                                        {label}
                                                                </MenuItem>
                                                        );
                        })
                                        ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                        )}
                              </Select>
                            </FormControl>
                            </div>
                                {/* <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{ minHeight: "35px"}}
                                        id="outlined-basic"
                                        label="Resources"
                                        onChange={handleTChange}
                                        name="resources_id"
                                        value={targetedLearning?.resources_id || []}
                                /> */}
                                {/* <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="chip-select-label">Select Resources</InputLabel>
                              <Select
                                multiple
                                labelId="chip-select-label"
                                label="Select Resources"
                                className=""
                                onChange={handleTChange}
                                name="resources_id"
                                value={targetedLearning?.resources_id || []}
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
                                                        const resource = resourceList.find((m) => m.resource_id === id);
                                                        return (
                                                        <Chip
                                                                key={id}
                                                                label={resource ? resource.resource_name : id}
                                                                sx={{ borderRadius: "4px" }}
                                                        />
                                                        );
                                                        })}
                                                </Box>
                                                ) : null 
                                )}
                              >
                                        {Array.isArray(resourceList) && resourceList.length > 0 ? (
                                                resourceList.map((data, index) => (
                                                        <MenuItem key={index} value={data?.resource_id}>
                                                                {data?.resource_name}
                                                        </MenuItem>
                                                ))
                                        ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                        )}
                              </Select>
                            </FormControl> */}
                        <div className="mt-5 relative overflow-visible z-[1200]">
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ minHeight: "35px" }}
                            >
                              <InputLabel id="program-select-label">Choose Trainees</InputLabel>
                              <Select
                                multiple
                                labelId="program-select-label"
                                label="Choose Trainees"
                                className=""
                                onChange={handleTChange}
                                name="trainee_id"
                                value={targetedLearning?.trainee_id || []}
                                MenuProps={{
                                        disablePortal: true, // ← force to portal
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
                                                zIndex: 1600 // must be higher than modal
                                        }
                                        }
                                }}
                                renderValue={(selectedIds) => (
                                         Array.isArray(selectedIds) ? (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                        {selectedIds.map((id) => {
                                                        const trainees = traineeState.find((t) => t.user_email === id);
                                                        return (
                                                        <Chip
                                                                key={id}
                                                                label={trainees ? trainees.user_name : id}
                                                                sx={{ borderRadius: "4px" }}
                                                        />
                                                        );
                                                        })}
                                                </Box>
                                                ) : null 
                                )}
                              >
                                        {Array.isArray(traineeState) && traineeState.length > 0 ? (
                                                traineeState.map((data, index) => (
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
                        <div className="mt-5 grid grid-cols-2 gap-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                                label="Starting Date"
                                                value={
                                                targetedLearning.start_date
                                                        ? dayjs(targetedLearning.start_date)
                                                        : null
                                                }
                                                onChange={(date) => {
                                                        // setStartDate(date);
                                                        setTargetedLearningState(prev => ({ ...prev, start_date: date }));
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
                               <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                                label="End Date"
                                                value={
                                                targetedLearning.end_date
                                                        ? dayjs(targetedLearning.end_date)
                                                        : null
                                                }
                                                onChange={(date) => {
                                                        setTargetedLearningState(prev => ({ ...prev, end_date: date }));
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
                        <div className="mt-5 flex justify-end items-center">
                             <button className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white" onClick={postTargetedAPICall}>Initiate</button>
                        </div>
                </CreateTargetedLearning>    
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
                                        disablePortal: false,
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
                                                zIndex: 1300
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
                                name="certification_data"
                                value={batchData?.certification_data || []}
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
                                                        const course = corList.find((c) => c.certificate_id === id);
                                                        return (
                                                        <Chip
                                                                key={id}
                                                                label={course ? course.certificate_name : id}
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
                                                        <MenuItem key={index} value={data?.certificate_id}>
                                                        {data?.certificate_name}
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
                <FilterBatch isVisible={openFilter} onClose={handleCloseFilter}>
                                <>
                                      <div className="flex justify-between items-center">
                                                <div className="text-lg">Choose to view</div>
                                                <div><button onClick={handleCloseFilter} className="text-red-500 hover:bg-red-50 p-1 hover:rounded"><X size={24}/></button></div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-5 mt-5">
                                                 <TextField
                                                                        id="standard-password-input"
                                                                        label="Batch name"
                                                                        type="text"
                                                                        name="batch_name_filter"
                                                                        value={filterData.batch_name_filter}
                                                                        autoComplete="current-text"
                                                                        variant="standard"
                                                                        onChange={handleFilterChange}
                                                />
                                                <TextField
                                                                        id="standard-password-input"
                                                                        label="Instructor Name"
                                                                        type="text"
                                                                        name="instructor_name_filter"
                                                                        autoComplete="current-text"
                                                                        value={filterData.instructor_name_filter}
                                                                        variant="standard"
                                                                        onChange={handleFilterChange}
                                                />
                                      </div>
                                      <div className="mt-5 flex justify-end items-center gap-4">
                                                        <button className="text-red-600 font-semibold hover:bg-red-50 p-2">Clear</button>
                                                        <button className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white" onClick={filterBatchCall}>Apply</button>
                                      </div>
                                </>
                </FilterBatch>
                <EditBatch isVisible={editBatch} onClose={handleEditBatch}>
                    <div className="flex justify-end items-center gap-2">
                                <button className="text-red-500 hover:bg-red-50 px-2 py-1 rounded" onClick={handleEditBatch}>Close</button>
                                {/* <button className="text-white bg-[#8DC63F] px-2 py-1 rounded" onClick={handleUpdateAPICall}>Update</button> */}
                                <button
                                        className={
                                                loading
                                                ? "bg-gray-300 text-gray-500 font-semibold rounded px-5 py-2 transition-all ease-in-out"
                                                : "bg-[#8DC63F] text-white rounded px-2 py-1 transition-all ease-in-out"
                                        }
                                        onClick={handleUpdateAPICall}
                                        disabled={loading}
                                        >
                                        {loading ? (
                                                <div className="flex items-center gap-2">
                                                        <ClipLoader size={20} cssOverride={{ borderWidth: "4px" }} />
                                                        <span>Updating</span>
                                                </div>
                                        ) : (
                                                "Update"
                                        )}
                                </button>

                    </div>
                    <div className="mt-5">
                        <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ minHeight: "35px" }}
                                id="outlined-basic"
                                label="Batch name"
                                name="new_batch_name"
                                onChange={handleChangee}
                                value={newBatchEdit.new_batch_name}
                        />
                    </div>
                    <div className="flex items-center gap-5 mt-5">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        label="Start Date"
                                        value={
                                        newBatchEdit.new_start_date
                                                ? dayjs(newBatchEdit.new_start_date)
                                                : null
                                        }
                                        onChange={(date) => {
                                                setEndDate(date);
                                                setNewBatchEdit(prev => ({ ...prev, new_start_date: date }));
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        label="End Date"
                                        value={
                                        newBatchEdit.new_end_date
                                                ? dayjs(newBatchEdit.new_end_date)
                                                : null
                                        }
                                        onChange={(date) => {
                                                setEndDate(date);
                                                setNewBatchEdit(prev => ({ ...prev, new_end_date: date }));
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
                </EditBatch>
    </div>
    )
}
export default Batch;