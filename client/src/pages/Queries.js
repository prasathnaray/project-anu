import React, {useState, useEffect} from "react";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import QueriesView from "../components/admin/QueriesView";
import { LayoutDashboard, Notebook, ArrowUpWideNarrow, EllipsisVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TablePagination from '@mui/material/TablePagination';
import { jwtDecode } from "jwt-decode";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function Queries(){
    const [buttonOpen, setButtonOpen] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [queriesList, setQueriesList] = useState([]);
    const [searchItem, setSearchItem] = useState('');
    const [filteredQueries, setFilteredQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [openCreateQuery, setOpenCreateQuery] = useState(false);
    
    // Query form data
    const [queryData, setQueryData] = useState({
        subject: '',
        certificate_id: '',
        course_id: '',
        module_id: '',
        instructor_id: '',
        message: ''
    });

    // Dropdown data - Replace with your API calls
    const [certificateList, setCertificateList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [instructorList, setInstructorList] = useState([]);
    
    const token = localStorage.getItem('user_token');
    const decoded = token ? jwtDecode(token) : null;

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

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchItem(value);

        if (!value) {
            setFilteredQueries(queriesList);
        } else {
            const filtered = queriesList.filter((query) =>
                query.message?.toLowerCase().includes(value) ||
                query.user_name?.toLowerCase().includes(value)
            );
            setFilteredQueries(filtered);
        }
    };

    const handleQueryChange = (e) => {
        const { name, value } = e.target;
        setQueryData({
            ...queryData,
            [name]: value,
        });

        // Load related data when certificate is selected
        if (name === "certificate_id" && value) {
            // Call API to get courses for this certificate
            // getCoursesByCertificate(value);
        }
        
        // Load modules when course is selected
        if (name === "course_id" && value) {
            // Call API to get modules for this course
            // getModulesByCourse(value);
        }

        // Load instructors when module is selected
        if (name === "module_id" && value) {
            // Call API to get instructors for this module
            // getInstructorsByModule(value);
        }
    };

    const handleClose = () => {
        setOpenCreateQuery(false);
        setQueryData({
            subject: '',
            certificate_id: '',
            course_id: '',
            module_id: '',
            instructor_id: '',
            message: ''
        });
    };

    const handleSubmitQuery = async (e) => {
        e.preventDefault();
        try {
            // Add your API call here to submit the query
            console.log('Query Data:', queryData);
            // await CreateQueryAPI(token, queryData);
            handleClose();
        } catch (err) {
            console.log(err);
        }
    };

    // Load initial data
    useEffect(() => {
        // fetchCertificates();
        // For now, using dummy data
        setCertificateList([
            { certificate_id: 1, certificate_name: "Web Development" },
            { certificate_id: 2, certificate_name: "Data Science" }
        ]);
        
        setCourseList([
            { course_id: 1, course_name: "HTML & CSS" },
            { course_id: 2, course_name: "JavaScript" }
        ]);
        
        setModuleList([
            { module_id: 1, module_name: "Introduction to HTML" },
            { module_id: 2, module_name: "CSS Fundamentals" }
        ]);
        
        setInstructorList([
            { instructor_id: 1, instructor_name: "John Smith" },
            { instructor_id: 2, instructor_name: "Jane Doe" }
        ]);
    }, []);

    // Sample data - replace with your API call
    useEffect(() => {
        // fetchQueries();
        // For now, using dummy data
        const dummyData = [
            {
                query_id: 1,
                user_name: "John Doe",
                message: "How do I reset my password?",
                timestamp: "2024-02-01T10:30:00",
                status: "pending"
            },
            {
                query_id: 2,
                user_name: "Jane Smith",
                message: "Unable to access course materials",
                timestamp: "2024-02-01T11:45:00",
                status: "resolved"
            },
        ];
        setQueriesList(dummyData);
        setFilteredQueries(dummyData);
        setRowCount(dummyData.length);
    }, [page, rowsPerPage]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    //navigation
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col min-h-screen">
            <div>
                <NavBar />
            </div>
            <div className="flex flex-grow">
                <div>
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                </div>
                <div
                    className={`${
                        buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
                    } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
                >
                    <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                        <LayoutDashboard size={15} /> Dashboard / <Notebook size={15} />{' '}
                        <span className="text-[15px]">Queries</span>
                    </div>
                    <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                        <div className="mt-5 font-semibold text-xl text-gray-600">Queries</div>
                        <div className="mt-5 bg-white rounded px-8 py-10">
                            <div className="font-semibold text-xl text-gray-500 flex justify-between items-center">
                                <div>All Queries</div>
                            </div>
                            <div className="grid grid-cols-2 items-center my-5">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search Queries"
                                        value={searchItem}
                                        onChange={handleSearchChange}
                                        className="rounded px-2 py-2 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
                                    />
                                </div>
                                <div className="flex justify-end items-center">
                                    <button 
                                        className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-3 font-semibold text-sm transition-all ease-in-out" 
                                        onClick={() => setOpenCreateQuery(true)}
                                    >
                                        Create Query
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-300 shadow-sm text-sm">
                                        <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                                            <div>User Name</div>
                                            <button><ArrowUpWideNarrow size={20}/></button>
                                        </th>
                                        <th className="py-2 px-4 text-[#8DC63F]">
                                            <div className="flex items-center gap-2">
                                                <span>Message</span>
                                                <button><ArrowUpWideNarrow size={20} /></button>
                                            </div>
                                        </th>
                                        <th className="py-2 px-4 text-[#8DC63F]">
                                            <div className="flex items-center gap-2">
                                                <span>Timestamp</span>
                                                <button><ArrowUpWideNarrow size={20} /></button>
                                            </div>
                                        </th>
                                        <th className="py-2 px-4 text-[#8DC63F]">
                                            <div className="flex items-center gap-2">
                                                <span>Status</span>
                                                <button><ArrowUpWideNarrow size={20} /></button>
                                            </div>
                                        </th>
                                        {decoded?.role == 99 || decoded?.role == 101 && (
                                            <th className="py-2 px-4 text-[#8DC63F]">
                                                <div className="flex items-center gap-2">
                                                    <span>Actions</span>
                                                </div>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <div className="w-5 h-5 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-gray-600 font-medium">Loading queries...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredQueries.length > 0 ? (
                                        filteredQueries.map((query, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-200 hover:bg-gray-50 shadow-sm"
                                            >
                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                    {query.user_name}
                                                </td>
                                                <td className="py-2 px-4 text-gray-700">
                                                    {query.message}
                                                </td>
                                                <td className="py-2 px-4 text-[#8DC63F] font-semibold">
                                                    {formatDateTime(query.timestamp)}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        query.status === 'resolved' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {query.status}
                                                    </span>
                                                </td>
                                                {decoded?.role == 99 || decoded?.role == 101 && (
                                                    <td className="py-2 px-4 font-semibold text-[#8DC63F] relative">
                                                        <button onClick={() => toggleDropdown(index)}>
                                                            <EllipsisVertical size={24} />
                                                        </button>
                                                        {openDropdownIndex === index && (
                                                            <div
                                                                className={`absolute right-18 mt-1 w-22 bg-white border border-gray-200 rounded shadow-md z-10
                                                                transition-all ease-in-out duration-500 origin-top-right
                                                                ${openDropdownIndex === index ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                                                            >
                                                                <button
                                                                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                    onClick={() => {/* handle view */}}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                    onClick={() => {/* handle resolve */}}
                                                                >
                                                                    Mark as Resolved
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                    onClick={() => {/* handle delete */}}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
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
            </div>

            {/* Create Query Modal */}
            {openCreateQuery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <div className="text-lg">Create Query</div>
                            <button onClick={handleClose} className="text-red-500  p-1 hover:rounded">
                                <X size={24}/>
                            </button>
                        </div>
                        
                        <div className="mt-7">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ minHeight: "35px" }}
                                id="outlined-basic"
                                label="Subject"
                                name="subject"
                                value={queryData.subject}
                                onChange={handleQueryChange}
                            />
                        </div>

                        <div className="mt-5">
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ minHeight: "35px" }}
                            >
                                <InputLabel id="certificate-select-label">Select Certificate</InputLabel>
                                <Select
                                    labelId="certificate-select-label"
                                    label="Select Certificate"
                                    name="certificate_id"
                                    value={queryData.certificate_id}
                                    onChange={handleQueryChange}
                                >
                                    {Array.isArray(certificateList) && certificateList.length > 0 ? (
                                        certificateList.map((cert, index) => (
                                            <MenuItem key={index} value={cert.certificate_id}>
                                                {cert.certificate_name}
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
                                <InputLabel id="course-select-label">Select Course</InputLabel>
                                <Select
                                    labelId="course-select-label"
                                    label="Select Course"
                                    name="course_id"
                                    value={queryData.course_id}
                                    onChange={handleQueryChange}
                                >
                                    {Array.isArray(courseList) && courseList.length > 0 ? (
                                        courseList.map((course, index) => (
                                            <MenuItem key={index} value={course.course_id}>
                                                {course.course_name}
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
                                <InputLabel id="module-select-label">Choose Module</InputLabel>
                                <Select
                                    labelId="module-select-label"
                                    label="Choose Module"
                                    name="module_id"
                                    value={queryData.module_id}
                                    onChange={handleQueryChange}
                                >
                                    {Array.isArray(moduleList) && moduleList.length > 0 ? (
                                        moduleList.map((module, index) => (
                                            <MenuItem key={index} value={module.module_id}>
                                                {module.module_name}
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
                                <InputLabel id="instructor-select-label">Associated Instructor</InputLabel>
                                <Select
                                    labelId="instructor-select-label"
                                    label="Associated Instructor"
                                    name="instructor_id"
                                    value={queryData.instructor_id}
                                    onChange={handleQueryChange}
                                >
                                    {Array.isArray(instructorList) && instructorList.length > 0 ? (
                                        instructorList.map((instructor, index) => (
                                            <MenuItem key={index} value={instructor.instructor_id}>
                                                {instructor.instructor_name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No data found</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="mt-5">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                multiline
                                rows={4}
                                id="outlined-basic"
                                label="Message"
                                name="message"
                                value={queryData.message}
                                onChange={handleQueryChange}
                            />
                        </div>
                        
                        <div className="mt-5 flex justify-end items-center">
                            <button 
                                className="bg-[#8DC63F] px-3 py-2 rounded-sm text-white"
                                onClick={handleSubmitQuery}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Queries;