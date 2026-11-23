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
import { createPortal } from 'react-dom';
import { X, UserRound, Mail, Phone, CalendarDays, Building2, UsersRound, FileText, Pencil } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import APP_URL from '../API/config';
import { ClipLoader } from 'react-spinners';

const ProfileDetail = ({ icon: Icon, label, value, wide = false }) => (
    <div className={`rounded-2xl border border-[#e8eee6] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(29,57,38,0.035)] ${wide ? 'sm:col-span-2' : ''}`}>
        <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7e6] text-[#4f822b]">
                <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <div className="min-w-0 pt-0.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#829083]">{label}</p>
                <p className="break-words text-sm font-semibold leading-relaxed text-[#243b2c]">{value || 'Not provided'}</p>
            </div>
        </div>
    </div>
);

const ProfileEditField = ({ icon: Icon, label, value, onChange, type = 'text', required = false, placeholder }) => (
    <label className="rounded-2xl border border-[#dbe9d3] bg-white p-4 sm:p-5">
        <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#68846d]">
            <Icon size={16} aria-hidden="true" />{label}
        </span>
        <input type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
            className="w-full rounded-lg border border-[#dbe5d7] bg-[#fbfdf9] px-3 py-2.5 text-sm font-medium text-[#243b2c] outline-none transition focus:border-[#8dc63f] focus:ring-2 focus:ring-[#8dc63f]/20" />
    </label>
);

const toDateInput = (value) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

function Profile({ isOpen, onClose }) {
    const [loading, setLoading] = useState(true);
    const [tokData, setTokData] = useState({});
    const [profileData, setProfileData] = useState({});
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [form, setForm] = useState({ user_name: '', user_contact_num: '', user_dob: '', user_gender: '' });

    // Initialize token data
    useEffect(() => {
        if (isOpen) {
            setEditing(false);
            setSaveError('');
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
                const data = response.data.data || {};
                setForm({
                    user_name: data.user_name || '',
                    user_contact_num: formatPhoneWithCountryCode(data.user_contact_num),
                    user_dob: toDateInput(data.user_dob || data.dob),
                    user_gender: data.user_gender || ''
                });
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
    const formatDate = (dateInput) => {
        if (!dateInput || dateInput === 'Invalid Date' || dateInput === 'null') return '';
        if (typeof dateInput === 'object' && !(dateInput instanceof Date) && Object.keys(dateInput).length === 0) return '';
        try {
            let date;
            if (dateInput instanceof Date) {
                date = dateInput;
            } else if (typeof dateInput === 'string') {
                const trimmed = dateInput.trim();
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
                    const parts = trimmed.split('/');
                    date = new Date(parts[2] + '-' + parts[1] + '-' + parts[0]);
                } else {
                    date = new Date(trimmed);
                    if (isNaN(date.getTime())) {
                        date = new Date(trimmed.replace(' ', 'T'));
                    }
                }
            } else {
                date = new Date(dateInput);
            }
            if (!date || isNaN(date.getTime())) return '';
            return date.toLocaleDateString('en-US', { 
                day: '2-digit',
                month: 'short', 
                year: 'numeric' 
            });
        } catch {
            return '';
        }
    };

    const formatPhoneWithCountryCode = (phone) => {
        if (!phone) return '';
        const str = String(phone).trim();
        if (str.startsWith('+')) return str;
        return `+91 ${str}`;
    };

    const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

    const saveProfile = async (event) => {
        event.preventDefault();
        setSaving(true);
        setSaveError('');
        try {
            const response = await axios.patch(APP_URL + '/api/v1/profile', {
                ...form,
                user_name: form.user_name.trim(),
                user_contact_num: form.user_contact_num.trim(),
                user_gender: form.user_gender.trim()
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } });
            setProfileData((current) => ({ ...current, data: { ...current.data, ...response.data.data } }));
            setEditing(false);
        } catch (error) {
            setSaveError(error.response?.data?.message || 'Could not save your changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        const data = profileData?.data || {};
        setForm({
            user_name: data.user_name || '',
            user_contact_num: formatPhoneWithCountryCode(data.user_contact_num),
            user_dob: toDateInput(data.user_dob || data.dob),
            user_gender: data.user_gender || ''
        });
        setSaveError('');
        setEditing(false);
    };

    if (!isOpen) return null;

    const profile = profileData?.data || {};
    const avatarUrl = profile.user_profile_photo || profile.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.user_name || 'User')}&background=DAF0C4&color=315D35&size=200`;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10251b]/65 p-3 backdrop-blur-[3px] sm:p-6" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-title"
                className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-[#f7faf5] shadow-[0_24px_80px_rgba(9,31,17,0.3)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#173e2e] via-[#245c3a] to-[#4e8b38] px-6 pb-7 pt-6 text-white sm:px-9 sm:pb-8">
                    <div className="pointer-events-none absolute -right-12 -top-24 h-60 w-60 rounded-full border-[32px] border-white/10" />
                    <div className="pointer-events-none absolute -bottom-28 right-20 h-48 w-48 rounded-full bg-[#a5ce62]/20 blur-2xl" />
                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9eba8]">Your account</p>
                            <h2 id="profile-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">My profile</h2>
                        </div>
                        <button onClick={onClose} aria-label="Close profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                            <X size={19} aria-hidden="true" />
                        </button>
                    </div>
                    <div className="relative mt-7 flex items-center gap-4 sm:gap-5">
                        <img src={avatarUrl} alt="" className="h-20 w-20 shrink-0 rounded-2xl border-[3px] border-white/80 bg-[#e5f1d8] object-cover shadow-lg sm:h-24 sm:w-24" />
                        <div className="min-w-0">
                            <h3 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{profile.user_name || (loading ? 'Loading profile...' : 'Your profile')}</h3>
                            <p className="mt-1 truncate text-sm text-white/75">{profile.user_email || 'Account details'}</p>
                            <span className="mt-3 inline-flex items-center rounded-full border border-[#d8f3b4]/30 bg-[#d8f3b4]/20 px-3 py-1 text-xs font-semibold text-[#e8ffd4]">
                                {getRoleName(tokData?.role)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-9 sm:py-7">
                    <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-[#203d2d]">Personal information</h3>
                            <p className="mt-1 text-sm text-[#78897a]">{editing ? 'Update your personal details' : 'Your account details at a glance'}</p>
                        </div>
                        {!editing && !loading && <button type="button" onClick={() => setEditing(true)} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d9e7d0] bg-white px-3 py-2 text-sm font-semibold text-[#315c38] transition hover:bg-[#eef7e6] focus:outline-none focus:ring-2 focus:ring-[#8dc63f]">
                            <Pencil size={15} aria-hidden="true" /> Edit
                        </button>}
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-14"><ClipLoader size={38} color="#6ba62f" /></div>
                    ) : editing ? (
                        <form id="profile-edit-form" onSubmit={saveProfile} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <ProfileEditField icon={UserRound} label="Full name" value={form.user_name} onChange={updateField('user_name')} required />
                            <ProfileDetail icon={Mail} label="Email address" value={profile.user_email} />
                            <ProfileDetail icon={Building2} label="Institution" value={profile.institution_name || profile.center_name} />
                            <ProfileEditField icon={Phone} label="Contact number" type="tel" value={form.user_contact_num} onChange={updateField('user_contact_num')} placeholder="+91 98765 43210" />
                            <ProfileEditField icon={CalendarDays} label="Date of birth" type="date" value={form.user_dob} onChange={updateField('user_dob')} />
                            <label className="rounded-2xl border border-[#dbe9d3] bg-white p-4 sm:p-5">
                                <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#68846d]"><UsersRound size={16} aria-hidden="true" />Gender</span>
                                <select value={form.user_gender} onChange={updateField('user_gender')} className="w-full rounded-lg border border-[#dbe5d7] bg-[#fbfdf9] px-3 py-2.5 text-sm font-medium text-[#243b2c] outline-none focus:border-[#8dc63f] focus:ring-2 focus:ring-[#8dc63f]/20">
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </label>
                            {saveError && <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">{saveError}</p>}
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <ProfileDetail icon={UserRound} label="Full name" value={profile.user_name} />
                            <ProfileDetail icon={Mail} label="Email address" value={profile.user_email} />
                            <ProfileDetail icon={Building2} label="Institution" value={profile.institution_name || profile.center_name} />
                            <ProfileDetail icon={Phone} label="Contact number" value={formatPhoneWithCountryCode(profile.user_contact_num)} />
                            <ProfileDetail icon={CalendarDays} label="Date of birth" value={formatDate(profile.user_dob || profile.dob || profileData?.user_dob)} />
                            <ProfileDetail icon={UsersRound} label="Gender" value={{ male: 'Male', female: 'Female', prefer_not_to_say: 'Prefer not to say' }[profile.user_gender] || profile.user_gender} />
                            {profile.bio && <ProfileDetail icon={FileText} label="About" value={profile.bio} wide />}
                        </div>
                    )}
                </div>
                <div className="flex shrink-0 justify-end gap-2 border-t border-[#e8eee6] bg-white px-5 py-4 sm:px-9">
                    {editing ? <>
                        <button type="button" onClick={cancelEdit} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#526958] transition hover:bg-[#f0f5ed] disabled:opacity-50">Cancel</button>
                        <button type="submit" form="profile-edit-form" disabled={saving} className="rounded-xl bg-[#254e34] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3c29] focus:outline-none focus:ring-2 focus:ring-[#8dc63f] focus:ring-offset-2 disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
                    </> : <button onClick={onClose} className="rounded-xl bg-[#254e34] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3c29] focus:outline-none focus:ring-2 focus:ring-[#8dc63f] focus:ring-offset-2">Done</button>}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Profile;
