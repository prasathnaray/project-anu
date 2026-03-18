import React, { useState, useEffect } from "react";
import { getInstructorsPerBatch } from '../API/InstructorsPerBatchAPI';
import { CreateQueryAPI } from '../API/CreateQueryAPI';
import { GetQueriesAPI, UpdateQueryStatusAPI, DeleteQueryAPI } from '../API/GetQueriesAPI';
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import QueriesView from "../components/admin/QueriesView";
import { LayoutDashboard, Notebook, ArrowUpWideNarrow, EllipsisVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TablePagination from '@mui/material/TablePagination';
import { jwtDecode } from "jwt-decode";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function Queries() {
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
        instructor_id: '',
        message: ''
    });

    // Dropdown data
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
    };

    const handleClose = () => {
        setOpenCreateQuery(false);
        setQueryData({
            subject: '',
            instructor_id: '',
            message: ''
        });
    };

    const handleSubmitQuery = async (e) => {
        e.preventDefault();
        try {
            await CreateQueryAPI(token, queryData);
            handleClose();
            fetchQueries();
        } catch (err) {
            console.log(err);
        }
    };

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const response = await GetQueriesAPI(token, page + 1, rowsPerPage);
            if (response?.result) {
                setQueriesList(response.result);
                setFilteredQueries(response.result);
                setRowCount(response.total || 0);
            }
        } catch (err) {
            console.error('Error fetching queries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveQuery = async (query_id) => {
        try {
            await UpdateQueryStatusAPI(token, query_id, 'resolved');
            setOpenDropdownIndex(null);
            fetchQueries();
        } catch (err) {
            console.error('Error resolving query:', err);
        }
    };

    const handleDeleteQuery = async (query_id) => {
        try {
            await DeleteQueryAPI(token, query_id);
            setOpenDropdownIndex(null);
            fetchQueries();
        } catch (err) {
            console.error('Error deleting query:', err);
        }
    };

    // Load initial data
    useEffect(() => {

        // Fetch instructors from API
        const fetchInstructors = async () => {
            try {
                const peopleId = localStorage.getItem('people_id');
                if (peopleId && token) {
                    const response = await getInstructorsPerBatch(peopleId, token);
                    if (response?.result) {
                        const instructorMap = new Map();
                        response.result.forEach(batch => {
                            if (batch.instructors && batch.instructor_emails) {
                                batch.instructor_emails.forEach((email, idx) => {
                                    if (!instructorMap.has(email)) {
                                        instructorMap.set(email, {
                                            instructor_id: email,
                                            instructor_name: batch.instructors[idx] || email
                                        });
                                    }
                                });
                            }
                        });
                        setInstructorList(Array.from(instructorMap.values()));
                    }
                }
            } catch (err) {
                console.error('Error fetching instructors:', err);
            }
        };
        fetchInstructors();
    }, []);

    // Fetch queries from API
    useEffect(() => {
        if (token) {
            fetchQueries();
        }
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
                    className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
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
                                            <button><ArrowUpWideNarrow size={20} /></button>
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
                                                    {formatDateTime(query.created_at)}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${query.status === 'resolved'
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
                                                                    onClick={() => { setOpenDropdownIndex(null); }}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                    onClick={() => handleResolveQuery(query.query_id)}
                                                                >
                                                                    Mark as Resolved
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 font-normal hover:rounded"
                                                                    onClick={() => handleDeleteQuery(query.query_id)}
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
                                <X size={24} />
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