import React, { useEffect, useState } from 'react'
import SideBar from '../components/sideBar';
import NavBar from '../components/navBar';
import { Mail, Pencil, User2Icon } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import { UserAccountIcon, Mail01Icon, PhoneOff01Icon, SmartPhone01Icon, Calendar01Icon, Baby01Icon } from 'hugeicons-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import APP_URL from '../API/config';
function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('user_token');
  const decodedToken = jwtDecode(token);
  const [tokData, setTokData] = useState({})
  if (!decodedToken) {
    navigate('/');
  }
  useEffect(() => {
    if (localStorage.getItem('user_token')) {
      setTokData(decodedToken);
    }
  }, []);
const [profileData, setProfileData] = useState({})
  const getProfile = async () => {
    try {
        const response = await axios.get(APP_URL + '/api/v1/profile', {
            headers: {    
              Authorization: `Bearer ${localStorage.getItem('user_token')}`
            }
        });
        //console.log(response.data.data.user_name)
        if(response){
            setProfileData(response.data);
        }
    }
    catch(err)
    {
        console.error(err);
    }
  }
  useEffect(() => {
    getProfile(); 
    console.log(profileData.data)
  }, []);
  useEffect(()=> {
    console.log(profileData);
  }, [profileData])
  //console.log(tokData.role);
  return (
    <div class={`flex`}>
        <div> 
            <SideBar /> 
        </div>  
        <div className="ms-[221px] flex-grow">
                <div>
                    <NavBar />
                </div>
               <div className="p-4">
                      <div className="grid grid-cols-3 mx-5">
                        <div className="border p-5 rounded-md border-gray-200 shadow-md col-span-2">
                          <div className="text-lg flex justify-between items-center text-xl">
                               <div>Profile Details</div>
                          </div>
                          <div className="mt-4 px-5">
                            <div className="flex justify-center items-center py-4">
                              <div className="w-20 h-20">
                                <img
                                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBlPlpTtK_z4wQ4W74DmV5pxpZYatxBAmzrg&s"
                                  alt=""
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                            </div>
                            <div className="flex justify-center items-center">Role -  {tokData?.role == 103 && <span>Trainee</span>} {tokData?.role == 99 && <span>Super User</span>} {tokData?.role == 102 && <span>Instructor</span>} {tokData?.role == 101 && <span>Admin</span>}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                               <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            name="user_name"
                                            className="rounded-2xl px-10 py-3 w-full focus:outline-[#8DC63F] focus:ring-0 border"
                                            value={profileData?.data?.user_name || ''}
                                            readOnly
                                        />  
                                        <div className="absolute top-3 left-2 "><UserAccountIcon size={24} strokeWidth={2} className="text-gray-400" /></div>
                              </div>
                              <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            name="user_email"
                                            value={profileData?.data?.user_email || ''}
                                            className="rounded-2xl px-10 py-3 w-full focus:outline-[#8DC63F] focus:ring-0 border"
                                        />  
                                        <div className="absolute top-3 left-2"><Mail01Icon size={24} strokeWidth={2} className="text-gray-400" /></div>
                              </div>
                              <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Contact Number"
                                            name="user_contact_num"
                                            value={profileData?.data?.user_contact_num || ''}
                                            className="rounded-2xl px-10 py-3 w-full focus:outline-[#8DC63F] focus:ring-0 border"
                                        />  
                                        <div className="absolute top-3 left-2"><SmartPhone01Icon size={24} strokeWidth={2} className="text-gray-400" /></div>
                              </div>
                              <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Date of Birth"
                                            name="user_dob"
                                            value={profileData?.data?.user_contact_num || ''}
                                            className="rounded-2xl px-10 py-3 w-full focus:outline-[#8DC63F] focus:ring-0 border"
                                        />  
                                        <div className="absolute top-3 left-2"><Calendar01Icon size={24} strokeWidth={2} className="text-gray-400" /></div>
                              </div>
                              <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Gender"
                                            name="user_gender"
                                            value={profileData?.data?.user_gender || ''}
                                            className="rounded-2xl px-10 py-3 w-full focus:outline-[#8DC63F] focus:ring-0 border"
                                        />  
                                        <div className="absolute top-3 left-2"><Baby01Icon size={24} strokeWidth={2} className="text-gray-400" /></div>
                              </div>
                          </div>
                        </div>
                      </div>
                </div>
        </div>
    </div>
  )
}

export default Profile