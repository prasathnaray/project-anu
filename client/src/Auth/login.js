import React, {useState} from 'react';
import {Mail, LockIcon, Eye, EyeOff} from "lucide-react";
import logo from '../assets/image (3).png';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import LoginAPI from '../API/loginAPI';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomCloseButton from '../utils/CustomCloseButton';
import { PuffLoader,RingLoader, CircleLoader , MoonLoader, ClipLoader} from 'react-spinners';
import ForgotPassword from '../utils/ForgotPassword';
function Login() {
  //icon change for password input
  const [icon, setIcon] = useState(EyeOff);
  const [type, setType] = useState('password');
  const handleToggle = () => {
    if(type==='password')
    {
        setIcon(Eye);
        setType('text');
    }
    else
    {
        setIcon(EyeOff);
        setType('password');
    }
  }
  const[showModal, setShowModal] = useState(false);
  //handle loading
  const [loading, setLoading] = useState(false);
  //const [] = useState([]);
  //navigating when success
  const navigate = useNavigate();
  //handling user input 
  const [userData, setUserData] = useState({
        user_mail:"",
        user_password:""
  });
  //console.log(userData);
   const handleChange = (e) =>{
        const {name, value} = e.target;
        setUserData((prevData)=>({
            ...prevData,
            [name]: value,
        }))
   }
   const handleForgotPassword = () => setShowModal(true);
   //handle Login API
   const handleSubmit = async(e) => {
        e.preventDefault();
        if(!userData.user_mail || !userData.user_password)
        {
            toast.error("please fill all the fields" , {
                autoClose: 3000,
                toastId: 'input-missing',
                icon: false,
                closeButton: CustomCloseButton,
            });
            return;
        }
        setLoading(true);
        try {
            const response = await LoginAPI(userData);
            if (response.data.code === 200) {
              const token = response.data.accessToken;
              localStorage.setItem('user_token', token);
              navigate('/dashboard');
            }
          } catch (err) {
            if (err?.status === 401 || err?.status === 404) {
              toast.error("invalid credentials", {
                toastId: 'invalid-credentials',
                autoClose: 3000,
                icon: false,
                closeButton: CustomCloseButton,
              });
            }
          } finally {
            setLoading(false); 
          }
   }

   ///forgot password input handling
   const [changepassword, setChangePassword] = useState({
        reset_password_mail: ""
   })
   const handleChangePassword = (e) => {
        const {name, value} = e.target;
        setChangePassword((prevData) => ({
            ...prevData,
            [name]: value,
        }));
   }
  //console.log(changepassword);
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="bg-gray-100 flex justify-center items-center">
        <div className="w-[55%] max-w-md">
          <h1 className="text-3xl font-semibold text-gray-700 mb-6">
            Login
          </h1>
          <div className="relative">
                    <input
                        type="text"
                        placeholder="Email address"
                        value={userData.user_mail}
                        onChange={handleChange}
                        name="user_mail"
                        className="rounded px-10 py-3 w-full mb-6 focus:outline-none focus:ring-0"
                    />  
                    <div className="absolute top-3 left-2"><Mail size={24} strokeWidth={2} className="text-gray-400" /></div>
          </div>
          <div className="relative">
                    <input
                        type={type}
                        placeholder="Password"
                        value={userData.user_password}
                        onChange={handleChange}
                        name="user_password"
                        className="rounded px-10 py-3 w-full mb-6 focus:outline-none focus:ring-0"
                    />  
                    <div className="absolute top-3 left-2"><LockIcon size={24} strokeWidth={2} className="text-gray-400" /></div>
                    <button class="absolute top-3 right-2" onClick={handleToggle}>
                    {React.createElement(icon, {
                            size: 24,
                            strokeWidth: 2,
                            className: 'text-gray-400',
                    })}
                    </button>
          </div>
          <button className={`${loading ? ("bg-gray-300 text-gray-500 font-semibold rounded px-5 py-2 text-lg transition-all ease-in-out") : ("bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-10 py-2 font-semibold text-lg transition-all ease-in-out")}`} onClick={handleSubmit} disabled={loading}>
          {/* <span>Login</span> */}
          {loading ? (
                <div>Logging In <ClipLoader color="#8DC63F" size={24} className="ms-2" cssOverride={{ borderWidth: "4px",  }}/></div>
            ) : (
                "Login"
            )}
          </button><br></br><br></br>
          <button className="font-semibold text-blue-500" onClick={handleForgotPassword}>Forgot Password?</button>
        </div>
      </div>
      <div className="flex justify-center items-center border bg-[#8DC63F]">
            <div className="bg-white flex justify-center items-center py-20 rounded-3xl"><img src={logo} className="w-[50%]"/></div>  
      </div>
      <ForgotPassword isVisible={showModal} onClose={() => setShowModal(false)}>
              <div className="text-lg">Reset Password</div>
              <input
                  type="text"
                  placeholder="Enter your email address"
                  value={changepassword.reset_password_mail}
                  onChange={handleChangePassword}
                  name="reset_password_mail"
                  className="rounded px-2 py-3 w-full mb-6 focus:outline-none focus:ring-0 border mt-4"
              />
              <div className="flex justify-end items-center gap-3">
                  <button className="bg-[#8DC63F] hover:bg-[#8DC63F] text-white rounded px-5 py-2 font-semibold transition-all ease-in-out">Reset Passowrd</button>
                  <button className="text-red-500 hover:bg-red-200 px-5 py-2 rounded transition-all ease-in-out" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
      </ForgotPassword>
    </div>
  );
}
//d4a200,fdc500
export default Login;
