import React, { useState } from "react";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import { LayoutDashboard, BookOpen, GraduationCap, Library, Users, X, Eye, EyeOff, Mail, Lock, Building2, Phone, MapPin, Edit, Trash2, MoreVertical } from "lucide-react";
import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

function Academics() {
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const [openSchoolModal, setOpenSchoolModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    
    const [schoolData, setSchoolData] = useState({
        school_name: '',
        school_email: '',
        school_password: '',
        school_phone: '',
        school_address: '',
        school_type: '',
        admin_name: '',
        admin_email: '',
        admin_phone: ''
    });

    // Sample schools list (replace with API data)
    const [schoolsList, setSchoolsList] = useState([
        {
            school_id: 1,
            school_name: "Green Valley High School",
            admin_name: "John Smith",
            admin_email: "john@greenvalley.edu",
            school_phone: "+1 234 567 8900",
            school_address: "123 Main St, New York",
            school_type: "High School",
            total_students: 450,
            total_teachers: 35,
            status: "Active"
        },
        {
            school_id: 2,
            school_name: "Tech Academy",
            admin_name: "Sarah Johnson",
            admin_email: "sarah@techacademy.edu",
            school_phone: "+1 234 567 8901",
            school_address: "456 Tech Blvd, California",
            school_type: "College",
            total_students: 1200,
            total_teachers: 85,
            status: "Active"
        },
        {
            school_id: 3,
            school_name: "Sunrise Elementary",
            admin_name: "Michael Brown",
            admin_email: "michael@sunrise.edu",
            school_phone: "+1 234 567 8902",
            school_address: "789 School Rd, Texas",
            school_type: "Elementary",
            total_students: 320,
            total_teachers: 28,
            status: "Pending"
        }
    ]);

    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    const handleOpenSchoolModal = () => {
        setOpenSchoolModal(true);
    };

    const handleCloseSchoolModal = () => {
        setOpenSchoolModal(false);
        setSchoolData({
            school_name: '',
            school_email: '',
            school_password: '',
            school_phone: '',
            school_address: '',
            school_type: '',
            admin_name: '',
            admin_email: '',
            admin_phone: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchoolData({
            ...schoolData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your API call here
        console.log("School Data:", schoolData);
        handleCloseSchoolModal();
    };

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

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
                    } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
                >
                    {/* Breadcrumb Navigation */}
                    <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                        <LayoutDashboard size={15} /> Dashboard / <BookOpen size={15}/> 
                        <span className="text-[15px]">Academics</span>
                    </div>

                    {/* Main Content */}
                    <div className={`${
                        buttonOpen === true 
                            ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" 
                            : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
                    }`}>
                        {/* Page Title */}
                        <div className="mt-5 font-semibold text-xl text-gray-600">
                            Academic Management
                        </div>

                        {/* Stats Cards */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Schools</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">{schoolsList.length}</h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <Building2 className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Active Schools</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
                                            {schoolsList.filter(s => s.status === "Active").length}
                                        </h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <GraduationCap className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Students</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
                                            {schoolsList.reduce((acc, school) => acc + school.total_students, 0)}
                                        </h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <Users className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Teachers</p>
                                        <h3 className="text-2xl font-bold text-[#8DC63F] mt-2">
                                            {schoolsList.reduce((acc, school) => acc + school.total_teachers, 0)}
                                        </h3>
                                    </div>
                                    <div className="bg-[#8DC63F] bg-opacity-10 p-3 rounded-full">
                                        <BookOpen className="text-[#8DC63F]" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schools List Section */}
                        <div className="mt-8 bg-white rounded-lg px-8 py-10 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="font-semibold text-xl text-gray-500">
                                    Onboarded Schools
                                </div>
                                <button 
                                    className="bg-[#8DC63F] hover:bg-[#7AB52F] text-white rounded px-6 py-2 font-semibold text-sm transition-all ease-in-out"
                                    onClick={handleOpenSchoolModal}
                                >
                                    + Onboard School
                                </button>
                            </div>
                            
                            {/* Schools Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-300 shadow-sm text-sm">
                                            <th className="py-3 px-4 text-[#8DC63F]">School Name</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Admin Name</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Admin Email</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Phone</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Type</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Students</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Teachers</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Status</th>
                                            <th className="py-3 px-4 text-[#8DC63F]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schoolsList.length > 0 ? (
                                            schoolsList.map((school, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-700 font-semibold">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 size={18} className="text-[#8DC63F]" />
                                                            {school.school_name}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{school.admin_name}</td>
                                                    <td className="py-3 px-4 text-gray-600">{school.admin_email}</td>
                                                    <td className="py-3 px-4 text-gray-600">{school.school_phone}</td>
                                                    <td className="py-3 px-4 text-gray-600">{school.school_type}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-center">{school.total_students}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-center">{school.total_teachers}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            school.status === 'Active' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {school.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 relative">
                                                        <button 
                                                            onClick={() => toggleDropdown(index)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                        >
                                                            <MoreVertical size={20} className="text-gray-600" />
                                                        </button>
                                                        {openDropdownIndex === index && (
                                                            <div className="absolute right-8 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm">
                                                                    <Eye size={16} />
                                                                    View Details
                                                                </button>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm">
                                                                    <Edit size={16} />
                                                                    Edit
                                                                </button>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600">
                                                                    <Trash2 size={16} />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="py-8 px-4 text-center text-gray-500">
                                                    No schools onboarded yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Onboard School Modal */}
                        {openSchoolModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-800">Onboard New School</h2>
                                        <button 
                                            onClick={handleCloseSchoolModal}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="p-6">
                                        {/* School Information */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <Building2 size={20} className="text-[#8DC63F]" />
                                                School Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextField
                                                    fullWidth
                                                    label="School Name"
                                                    name="school_name"
                                                    value={schoolData.school_name}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                />
                                                <FormControl fullWidth size="small" required>
                                                    <InputLabel>School Type</InputLabel>
                                                    <Select
                                                        name="school_type"
                                                        value={schoolData.school_type}
                                                        onChange={handleChange}
                                                        label="School Type"
                                                    >
                                                        <MenuItem value="Elementary">Elementary School</MenuItem>
                                                        <MenuItem value="Middle School">Middle School</MenuItem>
                                                        <MenuItem value="High School">High School</MenuItem>
                                                        <MenuItem value="College">College</MenuItem>
                                                        <MenuItem value="University">University</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    fullWidth
                                                    label="School Email"
                                                    name="school_email"
                                                    type="email"
                                                    value={schoolData.school_email}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="School Phone"
                                                    name="school_phone"
                                                    value={schoolData.school_phone}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="School Address"
                                                    name="school_address"
                                                    value={schoolData.school_address}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    className="md:col-span-2"
                                                    InputProps={{
                                                        startAdornment: <MapPin size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Admin Credentials */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <Users size={20} className="text-[#8DC63F]" />
                                                Admin Credentials
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextField
                                                    fullWidth
                                                    label="Admin Name"
                                                    name="admin_name"
                                                    value={schoolData.admin_name}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Admin Phone"
                                                    name="admin_phone"
                                                    value={schoolData.admin_phone}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Phone size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Admin Email (Login ID)"
                                                    name="admin_email"
                                                    type="email"
                                                    value={schoolData.admin_email}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Mail size={18} className="text-gray-400 mr-2" />
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Admin Password"
                                                    name="school_password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={schoolData.school_password}
                                                    onChange={handleChange}
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <Lock size={18} className="text-gray-400 mr-2" />,
                                                        endAdornment: (
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="text-gray-400 hover:text-gray-600"
                                                            >
                                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        )
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                * These credentials will be used by the school admin to login to their dashboard
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={handleCloseSchoolModal}
                                                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-[#8DC63F] hover:bg-[#7AB52F] text-white rounded font-semibold transition-colors"
                                            >
                                                Onboard School
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Academics;