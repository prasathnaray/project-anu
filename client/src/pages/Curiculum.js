import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow, BookOpen, EllipsisVertical, GraduationCap, Search, UsersRound, X } from 'lucide-react';
import CurriculumCreation from '../components/superadmin/CuriculumCreation';
import AddCuriculumAPI from '../API/AddCuriculumAPI';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import CustomCloseButton from '../utils/CustomCloseButton';
import GetCuriculumAPI from '../API/getCuriculumAPI';
import DeleteCuriculumToast from '../utils/deleteCuriculumtoast';
import { ClipLoader } from 'react-spinners';
function Curiculam() {
  const navigate = useNavigate();
  const token = jwtDecode(localStorage.getItem('user_token'));
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [curiculumList, setCuriculumList] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [curriculumData, setCurriculumData] = React.useState({
      curiculum_name: ''
  })
  const [openCuriculum, setOpenCuriculum] = React.useState(false);
  const handleChange = (e) => {
      const {name, value} = e.target;
      setCurriculumData({
            ...curriculumData,
            [name]: value,
      });
  }
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  const handleClose = (e) => {
        setOpenCuriculum(false);
        setCurriculumData({
            curiculum_name: ''
        })
  }
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
  const dropdownRefs = React.useRef({});  
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(dropdownRefs.current).some(ref =>
        ref && ref.contains(event.target)
      );
      if (!isClickInside) {
        setOpenDropdownIndex(null);
      }
   } 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  const createCuriculum = async(e) => {
    e.preventDefault();
    try
    {
        const token = localStorage.getItem('user_token');
        console.log(token);
        const response = await AddCuriculumAPI(token, curriculumData);
        if(response?.data?.code === 200)
        {
              toast.success("Curiculum Created" , {
                                                        autoClose: 3000,
                                                        toastId: 'success-batch-inserted',
                                                        icon: false,
                                                        closeButton: CustomCloseButton,
              }); 
              handleClose();
              GetCuriculumList();
        }
    }
    catch(err)
    {
        console.log(err)
    }
  }
  const GetCuriculumList = async(e) => {
    try
    {
      const token = localStorage.getItem('user_token');
      const result = await GetCuriculumAPI(token);
      setCuriculumList(result.data.result);
    }
    catch(err)
    {
      console.log(err)
    }
  }
  const DeleteCuriculum = (curiculum_id) => {
    try
    {
      const token = localStorage.getItem('user_token');
      DeleteCuriculumToast(curiculum_id, () => GetCuriculumList(), token)
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
      GetCuriculumList();
  }, [])
  const list = Array.isArray(curiculumList) ? curiculumList : [];
  const filteredCuriculumList = list.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase().trim();
    return (
      (item?.curiculum_nam && item.curiculum_nam.toLowerCase().includes(term)) ||
      (item?.curiculum_id && item.curiculum_id.toLowerCase().includes(term))
    );
  });
  const totalCourses = list.reduce((total, item) => total + Number(item?.total_courses || 0), 0);
  const totalCentres = list.reduce((total, item) => total + Number(item?.total_centres || 0), 0);
  if(!token.role == 99)
  {
     return <Navigate to="/" replace/>
  }
  return (
      <div className="flex min-h-screen flex-col bg-slate-50">
              <div>
                   <NavBar />
              </div>
              <div className="flex flex-grow">
                    <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>  
                    </div>
                    <main className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(141,198,63,0.13),_transparent_32%),#f8fafc] h-[calc(100vh-3rem)] transition-all`}>
                              <div className="mx-auto w-full max-w-[1600px] px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
                                      <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#8DC63F]/20 bg-gradient-to-br from-[#f4faea] via-white to-white px-5 py-5 shadow-[0_14px_40px_-30px_rgba(72,104,30,0.5)] sm:px-7 sm:py-6">
                                        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[18px] border-[#8DC63F]/10" />
                                        <div className="pointer-events-none absolute -bottom-16 right-28 h-28 w-28 rounded-full bg-[#8DC63F]/[0.06] blur-2xl" />
                                        <div className="relative flex flex-wrap items-end justify-between gap-4">
                                        <div>
                                          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            <span>Super admin</span><span className="text-[#8DC63F]">/</span><span>Curriculum</span>
                                          </div>
                                          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Curriculum library</h1>
                                          <p className="mt-1 text-sm text-slate-500">Manage learning paths, courses and centre associations.</p>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full border border-[#8DC63F]/25 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#638f25] shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#8DC63F] shadow-[0_0_0_4px_rgba(141,198,63,0.16)]" />{token?.role == 99 ? 'Super Admin Workspace' : 'Admin Workspace'}</div>
                                        </div>
                                      </div>

                                      <div className="mb-6 grid gap-4 sm:grid-cols-3">
                                        {[
                                          { label: 'Total curriculums', value: list.length, icon: BookOpen },
                                          { label: 'Courses associated', value: totalCourses, icon: GraduationCap },
                                          { label: 'Centres associated', value: totalCentres, icon: UsersRound },
                                        ].map(({ label, value, icon: Icon }) => (
                                          <div key={label} className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_-22px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-0.5 hover:border-[#8DC63F]/30 hover:shadow-[0_16px_35px_-24px_rgba(72,104,30,0.55)]">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8DC63F]/12 text-[#719f2c] transition group-hover:bg-[#8DC63F] group-hover:text-white"><Icon size={21} /></div>
                                            <div><div className="text-2xl font-bold text-slate-800">{value}</div><div className="text-xs font-medium text-slate-500">{label}</div></div>
                                          </div>
                                        ))}
                                      </div>

                                      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_45px_-28px_rgba(15,23,42,0.45)]">
                                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                          <div><h2 className="text-lg font-bold text-slate-800">All curriculums</h2><p className="mt-1 text-xs text-slate-500">{filteredCuriculumList.length} of {list.length} records shown</p></div>
                                          <button onClick={() => setOpenCuriculum(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8DC63F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#78ac32] focus:outline-none focus:ring-4 focus:ring-[#8DC63F]/20"><span className="text-lg leading-none">+</span> Create curriculum</button>
                                        </div>
                                        <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
                                          <div className="relative max-w-md">
                                            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" placeholder="Search by curriculum name or ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8DC63F] focus:bg-white focus:ring-4 focus:ring-[#8DC63F]/10" />
                                          </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                                <table className="w-full min-w-[720px] text-left">
                                                    <thead className=''>
                                                                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500">
                                                                        <th className="px-5 py-3.5 font-semibold sm:px-7"><div className="flex items-center gap-2">Curriculum name <ArrowUpWideNarrow size={15} className="text-[#8DC63F]" /></div></th>
                                                                        <th className="px-4 py-3.5 font-semibold"><div className="flex items-center gap-2">Courses associated <ArrowUpWideNarrow size={15} className="text-[#8DC63F]" /></div></th>
                                                                        <th className="px-4 py-3.5 font-semibold"><div className="flex items-center gap-2">Centres associated <ArrowUpWideNarrow size={15} className="text-[#8DC63F]" /></div></th>
                                                                        <th className="px-4 py-3.5 font-semibold">Actions</th>
                                                                </tr>
                                                    </thead>
                                                    <tbody>
                                                          {filteredCuriculumList.length > 0 ? (
                                                                filteredCuriculumList.map((data, index) => (
                                                                  <tr key={index} className="border-b border-slate-100 transition hover:bg-[#8DC63F]/[0.035]">
                                                                    <td className="px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8DC63F]/10 text-[#719f2c]"><BookOpen size={17} /></div><div><div className="font-semibold text-slate-700">{data?.curiculum_nam || 'N/A'}</div><div className="mt-0.5 text-xs text-slate-400">ID: {data?.curiculum_id || '—'}</div></div></div>
                                                                    </td>
                                                                    <td className="px-4 py-4"><span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#8DC63F]/12 px-2.5 py-1 text-sm font-semibold text-[#638f25]">
                                                                      {data?.total_courses !== undefined && data?.total_courses !== null ? data.total_courses : 0}
                                                                    </span>
                                                                    </td>
                                                                    <td className="px-4 py-4"><span className="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
                                                                      {data?.total_centres !== undefined && data?.total_centres !== null ? data.total_centres : 0}
                                                                    </span>
                                                                    </td>
                                                                    <td className="relative px-4 py-4">
                                                                        <button aria-label={`Actions for ${data?.curiculum_nam || 'curriculum'}`} onClick={() => toggleDropdown(index)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                                                                          <EllipsisVertical size={20} />
                                                                        </button>
                                                                        {openDropdownIndex === index && (
                                                                          <div
                                                                            ref={(el) => (dropdownRefs.current[index] = el)}
                                                                            className="absolute right-4 top-11 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_16px_35px_-12px_rgba(15,23,42,0.3)]"
                                                                          >
                                                                            <button className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { setOpenDropdownIndex(null); navigate('/certificate'); }}>View</button>
                                                                            <button className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50" onClick={() => { setOpenDropdownIndex(null); DeleteCuriculum(data?.curiculum_id); }}>Delete</button>
                                                                            <button className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { setOpenDropdownIndex(null); navigate('/trainees'); }}>Tag trainees</button>
                                                                            <button className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { setOpenDropdownIndex(null); navigate('/certificate'); }}>Add course</button>
                                                                            <button className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => { setOpenDropdownIndex(null); navigate('/instructors'); }}>Tag instructors</button>
                                                                          </div>
                                                                        )}
                                                                    </td>
                                                                  </tr>
                                                                ))
                                                              ) : list.length > 0 ? (
                                                                <tr>
                                                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                                                                    No curriculum found
                                                                  </td>
                                                                </tr>
                                                              ) : (
                                                                <tr>
                                                                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                                                                    <ClipLoader color="#8DC63F" size={24} className="ms-2" cssOverride={{ borderWidth: "4px",  }}/>
                                                                  </td>
                                                                </tr>
                                                             )}

                                                    </tbody>
                                                </table>
                                        </div>
                                      </section>
                              </div>
                    </main>
                    </div>
              <CurriculumCreation isVisible={openCuriculum} onClose={handleClose}>
                        <div className="p-1">
                                    <div className="flex items-start justify-between gap-5">
                                                  <div><div className="text-lg font-bold text-slate-800">Create curriculum</div><p className="mt-1 text-sm text-slate-500">Add a new learning path to your library.</p></div>
                                                  <button onClick={handleClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"><X size={19}/></button>
                                    </div>
                                    <div className="mt-5">
                                            <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ minHeight: "35px" }}  
                                                    id="outlined-basic"
                                                    label="Curriculum name"
                                                    name="curiculum_name"
                                                    onChange={handleChange}
                                                    value={curriculumData.curiculum_name}
                                            />
                                    </div>
                                    <div className="flex justify-end items-end mt-5">
                                              <button className="rounded-lg bg-[#8DC63F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#78ac32]" onClick={createCuriculum}>Save curriculum</button>
                                    </div>
                        </div>
              </CurriculumCreation>
      </div>
  )
}
export default Curiculam;
