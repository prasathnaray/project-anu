// import React, { useEffect, useState } from 'react';
// import SideBar from '../components/sideBar';
// import NavBar from '../components/navBar';
// import { 
//     UserAccountIcon, 
//     Mail01Icon, 
//     SmartPhone01Icon, 
//     Calendar01Icon, 
//     Baby01Icon 
// } from 'hugeicons-react';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import APP_URL from '../API/config';
// import { ClipLoader } from 'react-spinners';

// function Profile() {
//     const navigate = useNavigate();
//     const [buttonOpen, setButtonOpen] = useState(true);
//     const [loading, setLoading] = useState(true);
//     const [tokData, setTokData] = useState({});
//     const [profileData, setProfileData] = useState({});

//     // Initialize token data
//     useEffect(() => {
//         const token = localStorage.getItem('user_token');
//         if (!token) {
//             navigate('/');
//             return;
//         }
//         try {
//             const decodedToken = jwtDecode(token);
//             setTokData(decodedToken);
//         } catch (error) {
//             console.error('Invalid token:', error);
//             navigate('/');
//         }
//     }, [navigate]);

//     // Fetch profile data
//     const getProfile = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(APP_URL + '/api/v1/profile', {
//                 headers: {    
//                     Authorization: `Bearer ${localStorage.getItem('user_token')}`
//                 }
//             });
//             if (response.data) {
//                 setProfileData(response.data);
//             }
//         } catch (err) {
//             console.error('Failed to fetch profile:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getProfile();
//     }, []);

//     const handleButtonOpen = () => {
//         setButtonOpen(!buttonOpen);
//     };

//     // Get role name
//     const getRoleName = (role) => {
//         const roles = {
//             99: 'Super User',
//             101: 'Admin',
//             102: 'Instructor',
//             103: 'Trainee'
//         };
//         return roles[role] || 'User';
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//             });
//         } catch {
//             return dateString;
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-50">
//             <NavBar />
            
//             <div className="flex flex-grow">
//                 <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                
//                 <div 
//                     className={`${
//                         buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
//                     } flex-grow overflow-y-auto h-[calc(100vh-3rem)] transition-all duration-300`}
//                 >
//                     <div className="max-w-5xl mx-auto p-8">
//                         {/* Page Header */}
//                         {/* <div className="mb-8">
//                             <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
//                             <p className="text-gray-500 mt-1">Manage your account details and information</p>
//                         </div> */}

//                         {loading ? (
//                             <div className="flex justify-center items-center py-20">
//                                 <ClipLoader size={50} color="#8DC63F" />
//                             </div>
//                         ) : (
//                             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                                 {/* Profile Header Section */}
//                                 <div className="bg-gradient-to-r from-[#8DC63F] to-[#7AB52F] px-8 py-10">
//                                     <div className="flex flex-col items-center">
//                                         {/* Profile Picture */}
//                                         <div className="relative mb-4">
//                                             <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
//                                                 <img
//                                                     src={profileData?.data?.profile_picture || "https://ui-avatars.com/api/?name=" + (profileData?.data?.user_name || "User") + "&background=8DC63F&color=fff&size=200"}
//                                                     alt="Profile"
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             </div>
//                                             {/* Edit button overlay - optional */}
//                                             {/* <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
//                                                 <Pencil size={16} className="text-gray-600" />
//                                             </button> */}
//                                         </div>
                                        
//                                         {/* Role Badge */}
//                                         <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
//                                             <span className="text-white font-semibold">
//                                                 Role - {getRoleName(tokData?.role)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Profile Details Section */}
//                                 <div className="px-8 py-10">
//                                     <h2 className="text-xl font-semibold text-gray-800 mb-6">
//                                         Profile Details
//                                     </h2>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {/* Name Field */}
//                                         <div className="relative">
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Full Name
//                                             </label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                                                     <UserAccountIcon 
//                                                         size={20} 
//                                                         strokeWidth={2} 
//                                                         className="text-gray-400" 
//                                                     />
//                                                 </div>
//                                                 <input
//                                                     type="text"
//                                                     value={profileData?.data?.user_name || ''}
//                                                     readOnly
//                                                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Email Field */}
//                                         <div className="relative">
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Email Address
//                                             </label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                                                     <Mail01Icon 
//                                                         size={20} 
//                                                         strokeWidth={2} 
//                                                         className="text-gray-400" 
//                                                     />
//                                                 </div>
//                                                 <input
//                                                     type="email"
//                                                     value={profileData?.data?.user_email || ''}
//                                                     readOnly
//                                                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Phone Field */}
//                                         <div className="relative">
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Contact Number
//                                             </label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                                                     <SmartPhone01Icon 
//                                                         size={20} 
//                                                         strokeWidth={2} 
//                                                         className="text-gray-400" 
//                                                     />
//                                                 </div>
//                                                 <input
//                                                     type="text"
//                                                     value={profileData?.data?.user_contact_num || ''}
//                                                     readOnly
//                                                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Date of Birth Field */}
//                                         <div className="relative">
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Date of Birth
//                                             </label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                                                     <Calendar01Icon 
//                                                         size={20} 
//                                                         strokeWidth={2} 
//                                                         className="text-gray-400" 
//                                                     />
//                                                 </div>
//                                                 <input
//                                                     type="text"
//                                                     value={formatDate(profileData?.data?.user_dob) || ''}
//                                                     readOnly
//                                                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Gender Field */}
//                                         <div className="relative">
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Gender
//                                             </label>
//                                             <div className="relative">
//                                                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                                                     <Baby01Icon 
//                                                         size={20} 
//                                                         strokeWidth={2} 
//                                                         className="text-gray-400" 
//                                                     />
//                                                 </div>
//                                                 <input
//                                                     type="text"
//                                                     value={profileData?.data?.user_gender || ''}
//                                                     readOnly
//                                                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent capitalize"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Optional: Coming Soon Section */}
//                                     {/* <div className="mt-10 pt-8 border-t border-gray-200">
//                                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                                             <h3 className="text-lg font-semibold text-blue-900 mb-2">
//                                                 Coming Soon
//                                             </h3>
//                                             <p className="text-blue-700 text-sm">
//                                                 Update password, configure alerts, and customize notification preferences directly from this page.
//                                             </p>
//                                         </div>
//                                     </div> */}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;


import React, { useEffect, useState } from 'react';
import { 
    UserAccountIcon, 
    Mail01Icon, 
    SmartPhone01Icon, 
    Calendar01Icon, 
    Baby01Icon 
} from 'hugeicons-react';
import { X, Edit2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import APP_URL from '../API/config';
import { ClipLoader } from 'react-spinners';

function Profile({ isOpen, onClose }) {
    const [loading, setLoading] = useState(true);
    const [tokData, setTokData] = useState({});
    const [profileData, setProfileData] = useState({});

    // Initialize token data
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('user_token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setTokData(decodedToken);
                    getProfile();
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            }
        }
    }, [isOpen]);

    // Fetch profile data
    const getProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(APP_URL + '/api/v1/profile', {
                headers: {    
                    Authorization: `Bearer ${localStorage.getItem('user_token')}`
                }
            });
            if (response.data) {
                setProfileData(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get role name
    const getRoleName = (role) => {
        const roles = {
            99: 'Super User',
            101: 'Admin',
            102: 'Instructor',
            103: 'Trainee'
        };
        return roles[role] || 'User';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Profile Picture */}
                    <div className="relative bg-gradient-to-br from-[#8DC63F] to-[#6BA62F] px-8 py-8">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>

                        {/* Profile Content */}
                        <div className="flex flex-col items-center pt-6">
                            {/* Profile Picture */}
                            <div className="relative mb-4">
                                <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                    <img
                                        src={profileData?.data?.profile_picture || "https://ui-avatars.com/api/?name=" + (profileData?.data?.user_name || "User") + "&background=8DC63F&color=fff&size=200"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Optional Edit Button */}
                                {/* <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                    <Edit2 size={14} className="text-[#8DC63F]" />
                                </button> */}
                            </div>
                            
                            {/* Name and Role */}
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {profileData?.data?.user_name || 'Loading...'}
                            </h2>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                                <span className="text-white text-sm font-medium">
                                    {getRoleName(tokData?.role)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="px-8 py-6 max-h-[calc(90vh-250px)] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <ClipLoader size={40} color="#8DC63F" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Name Field */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <UserAccountIcon 
                                                size={18} 
                                                strokeWidth={2} 
                                                className="text-gray-400" 
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData?.data?.user_name || ''}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Mail01Icon 
                                                size={18} 
                                                strokeWidth={2} 
                                                className="text-gray-400" 
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileData?.data?.user_email || ''}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Sector/Institution Type */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Institution Type
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData?.data?.institution_type || 'Educational Institute'}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Contact Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <SmartPhone01Icon 
                                                size={18} 
                                                strokeWidth={2} 
                                                className="text-gray-400" 
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData?.data?.user_contact_num || ''}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth Field */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Calendar01Icon 
                                                size={18} 
                                                strokeWidth={2} 
                                                className="text-gray-400" 
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={formatDate(profileData?.data?.user_dob) || ''}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Gender Field */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Baby01Icon 
                                                size={18} 
                                                strokeWidth={2} 
                                                className="text-gray-400" 
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData?.data?.user_gender || ''}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent capitalize"
                                        />
                                    </div>
                                </div>

                                {/* Description/Bio - Full Width */}
                                {profileData?.data?.bio && (
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                            Description
                                        </label>
                                        <textarea
                                            value={profileData?.data?.bio || ''}
                                            readOnly
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none resize-none"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Close
                        </button>
                        {/* Optional Update Button */}
                        {/* <button
                            className="px-6 py-2 bg-[#8DC63F] hover:bg-[#7AB52F] text-white font-medium rounded-lg transition-colors"
                        >
                            Update
                        </button> */}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
}

export default Profile;