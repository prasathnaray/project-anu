import React, {useState} from 'react';
import {Mail, LockIcon, Eye, EyeOff, ArrowRight, CheckCircle2, GraduationCap, ShieldCheck} from "lucide-react";
import logo from '../assets/image (3).png';
import {useNavigate} from "react-router-dom";
import LoginAPI from '../API/loginAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomCloseButton from '../utils/CustomCloseButton';
import { ClipLoader} from 'react-spinners';
import ForgotPassword from '../utils/ForgotPassword';
import ForgotPasswordAPI from '../API/ForgotPasswordAPI';
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
  const [loadingpassword, setPasswordLoading] = useState(false);
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
              localStorage.setItem('isVr', response.data.isVr);
              localStorage.setItem('loginSource', response.data.loginSource);
              localStorage.setItem('device', response.data.device);
              localStorage.setItem('os', response.data.os);
              sessionStorage.setItem('user_name', response.data.name);
              localStorage.setItem('people_id', response.data.people_id);
              navigate('/dashboard');
            }
          } catch (err) {
            if (err?.response?.data?.code === 401 || err?.response?.data?.code === 404) {
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
   const ResetPassword = async(e) => {
          e.preventDefault();
          if(!changepassword.reset_password_mail)
          {
              toast.error("field should not be empty" , {
                  autoClose: 3000,
                  toastId: 'input-missing',
                  icon: false,
                  closeButton: CustomCloseButton,
              });
              return;
          }
          setPasswordLoading(true);
          try
          {
              const result = await ForgotPasswordAPI(changepassword)
              if(result.data.logResponse.code === 200)
              {
                  toast.success("Password request sent." , {
                        autoClose: 3000,
                        toastId: 'request-sent',
                        icon: false,
                        closeButton: CustomCloseButton,
                  });
              }
          }
          catch(err)
          {
            if (err?.response?.data?.code === 500 || err?.response?.data?.code === 404) {
              toast.error("invalid credentials", {
                toastId: 'invalid-credentials',
                autoClose: 3000,
                icon: false,
                closeButton: CustomCloseButton,
              });
            }
          }
          finally
          {
            setPasswordLoading(false);
            setShowModal(false)
          }
   }
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14 xl:px-24">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8DC63F] text-white shadow-sm"><GraduationCap size={21} /></div>
            <div><div className="text-sm font-bold tracking-wide text-slate-800">ANU Learning Hub</div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#719f2c]">LMS portal</div></div>
          </div>

          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8DC63F]/25 bg-[#8DC63F]/[0.08] px-3 py-1.5 text-xs font-semibold text-[#638f25]"><ShieldCheck size={14} /> Secure LMS access</div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage learning, courses and learner progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="user_mail" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail size={18} strokeWidth={2} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="user_mail" type="email" autoComplete="username" placeholder="you@example.com" value={userData.user_mail} onChange={handleChange} name="user_mail" required className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#8DC63F] focus:ring-4 focus:ring-[#8DC63F]/10" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between"><label htmlFor="user_password" className="block text-sm font-semibold text-slate-700">Password</label><button type="button" onClick={handleForgotPassword} className="text-xs font-semibold text-[#719f2c] transition hover:text-[#527a1f]">Forgot password?</button></div>
              <div className="relative">
                <LockIcon size={18} strokeWidth={2} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="user_password" type={type} autoComplete="current-password" placeholder="Enter your password" value={userData.user_password} onChange={handleChange} name="user_password" required className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#8DC63F] focus:ring-4 focus:ring-[#8DC63F]/10" />
                <button type="button" aria-label={type === 'password' ? 'Show password' : 'Hide password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={handleToggle}>{React.createElement(icon, { size: 18, strokeWidth: 2 })}</button>
              </div>
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8DC63F] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_22px_-14px_rgba(99,143,37,0.95)] transition hover:bg-[#78ac32] hover:shadow-[0_16px_28px_-14px_rgba(99,143,37,0.95)] focus:outline-none focus:ring-4 focus:ring-[#8DC63F]/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none" disabled={loading}>
              {loading ? <><span>Signing you in</span><ClipLoader color="#ffffff" size={17} cssOverride={{ borderWidth: "3px" }} /></> : <><span>Sign in to LMS</span><ArrowRight size={17} /></>}
            </button>
          </form>
          <p className="mt-8 text-center text-xs text-slate-400">By continuing, you are accessing a secure learning workspace.</p>
        </div>
      </section>

      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#7eaf37] via-[#8DC63F] to-[#b1d96f] lg:flex lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border-[32px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative w-full max-w-lg px-12 xl:px-20">
          <div className="mb-10 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner"><GraduationCap size={24} /></div><div><div className="text-sm font-bold tracking-wide text-white">ANU Learning Hub</div><div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Learning management system</div></div></div>
          <div className="rounded-[2rem] border border-white/35 bg-white/95 p-8 shadow-[0_30px_70px_-25px_rgba(46,75,15,0.55)] xl:p-10">
            <div className="mb-8 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-50 to-white"><img src={logo} alt="ANU Learning Hub" className="h-auto max-h-20 w-[62%] object-contain" /></div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">One place for better learning.</h2>
            {/* <p className="mt-3 text-sm leading-6 text-slate-500">Coordinate curriculum,  and learner progress from a focused LMS workspace.</p> */}
            <div className="mt-7 space-y-3">
              {['Organise curriculum and course pathways', 'Track learner progress with confidence', 'Keep your learning operations connected'].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-600"><CheckCircle2 size={17} className="shrink-0 text-[#8DC63F]" />{item}</div>)}
            </div>
          </div>
          <div className="mt-7 text-center text-xs font-medium text-white/70">A focused workspace for every learning journey.</div>
        </div>
      </section>
      <ForgotPassword isVisible={showModal} onClose={() => setShowModal(false)}>
              <div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-lg font-bold text-slate-800">Reset password</div><p className="mt-1 text-sm text-slate-500">We’ll send reset instructions to your registered email.</p></div><button type="button" aria-label="Close reset password dialog" className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100" onClick={() => setShowModal(false)}>✕</button></div>
              <label htmlFor="reset_password_mail" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input
                  id="reset_password_mail"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={changepassword.reset_password_mail}
                  onChange={handleChangePassword}
                  name="reset_password_mail"
                  className="mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8DC63F] focus:bg-white focus:ring-4 focus:ring-[#8DC63F]/10"
              />
              <div className="flex justify-end items-center gap-3">
                  <button disabled={loadingpassword} className={`${loadingpassword ? ("cursor-not-allowed rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-500") : ("rounded-xl bg-[#8DC63F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#78ac32]")}`} onClick={ResetPassword}>
                          {loadingpassword ? (
                              <div>Sending <ClipLoader color="#8DC63F" size={24} className="ms-2" cssOverride={{ borderWidth: "4px",  }}/></div>
                          ) : (
                              "Reset Password"
                          )}
                  </button>
                  <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
      </ForgotPassword>
    </div>
  );
}
//d4a200,fdc500
export default Login;
