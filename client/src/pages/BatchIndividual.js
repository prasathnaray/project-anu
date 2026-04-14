// import React from 'react'
// import { Navigate, useNavigate, useParams } from 'react-router-dom'
// import NavBar from '../components/navBar';
// import SideBar from '../components/sideBar';
// import { ArrowLeft01Icon } from 'hugeicons-react';
// import { ArrowLeftIcon, ArrowUpWideNarrow } from 'lucide-react';
// import BasicPie from '../charts/PieChart';
// import TraineeInsRatio from '../charts/TraineeInsRatio';
// import BatchProfileAPI from '../API/BatchProfileAPI';
// import getMonthYear from '../utils/DateChange';
// import { jwtDecode } from 'jwt-decode';
// // import useParams  from 'react-router-dom';
// function BatchIndividual() {
//   const data = useParams();
//   const {batch_id} = useParams()
//   console.log(data)
//   const [buttonOpen, setButtonOpen] = React.useState(true);
//     const handleButtonOpen = () => {
//         setButtonOpen(!buttonOpen);
//     };
//     const navigate = useNavigate();
//     console.log(batch_id)

//     const [batchProfileData, setBatchProfileData] = React.useState([])
//     const handleIndBatchAPICall = async(batch_id) => {
//         try
//         {
//                 let token = localStorage.getItem('user_token')
//                 const result = await BatchProfileAPI(token, batch_id);
//                 setBatchProfileData(result.data);
//         }
//         catch(err)
//         {
//                 console.log(err.message)
//         }
//     }
//     React.useEffect(() => {
//         handleIndBatchAPICall(batch_id)
//     }, [])

//     const traineeCount = batchProfileData.filter(user => user.user_role === "103").length;
//     const instructorCount = batchProfileData.filter(user => user.user_role === "102").length

//     const batchName = [...new Set(batchProfileData.map(batch_name => batch_name.batch_name).filter(Boolean))][0];
//     const batchStarted = [...new Set(batchProfileData.map(batch_start_date => batch_start_date.batch_start_date).filter(Boolean))][0];
//     const batchEnded = [...new Set(batchProfileData.map(batch_start_date => batch_start_date.batch_end_date).filter(Boolean))][0];
//     console.log(batchName);
//     let token = localStorage.getItem('user_token');
//     const decoded = jwtDecode(token);
//         if (!decoded.role) {
//                 return <Navigate to="/" replace />;
//         }
//   return (
//     <div className={`flex flex-col min-h-screen`}>
//             <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//                         <NavBar />
//             </div>
//             <div className="flex flex-grow pt-12">
//                     <div className="">
//                             <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
//                     </div>
//                     <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
//                             <div className="bg-gray-100">
//                                     <div className="p-2 flex justify-between items-center border-b bg-white">
//                                         <div className="flex justify-between items-center gap-10"><span className="">Batch Profile</span> <span className="text-xs"> {batch_id}</span></div>
//                                         <div className="flex gap-2 text-sm">
//                                                 <div className="text-[#8DC63F]"><button onClick={() => navigate('/dashboard')}>Home</button></div>
//                                                 <div>/</div>
//                                                 <div>Batch Profile</div>
//                                         </div>
//                                     </div>
//                                     <div className="">
//                                         <div className="grid grid-cols-3 gap-3 m-3">
//                                                 <div className="col-span-2 bg-white">
//                                                         <div className="p-2 flex justify-between items-center">
//                                                                 <div className="text-xl">Batch Info</div>
//                                                                 <div><button className="bg-[#8DC63F] p-1 text-white rounded px-2">Edit</button></div>
//                                                         </div>
//                                                         <div className="flex justify-between items-center gap-6 mx-10">
//                                                                 <div className="mt-8">
//                                                                         <div className="text-sm">Name</div>
//                                                                         <div className="font-semibold">{batchName}</div>
//                                                                 </div>
//                                                                 <div className="mt-8">
//                                                                         <div className="text-sm">Starting date</div>
//                                                                         <div className="font-semibold">{getMonthYear(batchStarted)}</div>
//                                                                 </div>
//                                                                 <div className="mt-8">
//                                                                         <div className="text-sm">Ending on</div>
//                                                                         <div className="font-semibold">{getMonthYear(batchEnded)}</div>
//                                                                 </div>
//                                                            {/* <TraineeInsRatio trainee={traineeCount} instructor={instructorCount}/>      */}
//                                                         </div>
//                                                 </div>
//                                                 {jwtDecode(localStorage.getItem('user_token')).role == 101 && (
//                                                         <div className="col-span-1 bg-white">
//                                                                 <div className="p-2">Instructor vs Trainee Ratio</div>
//                                                                 <div>
//                                                                         <TraineeInsRatio trainee={traineeCount} instructor={instructorCount}/>     
//                                                                 </div>
//                                                         </div>
//                                                 )} 
//                                         </div>
//                                         <div className="m-3 bg-white p-2">
//                                                 <div className="text-lg m-3">
//                                                         <div>Instructor Profile</div>
//                                                 </div>
//                                                 <div>
//                                                         <table className="w-full text-left border-collapse">
//                                                                 <thead>
//                                                                         <tr className="border-b border-gray-300 shadow-sm text-sm">
//                                                                                 <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"></th>
//                                                                                 <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2"><div>Instructor Name </div><button className=""><ArrowUpWideNarrow size={20}/></button></th>
//                                                                                 {decoded.role == 99 || decoded.role == 101 && (<th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Last Login time</span><button className=""><ArrowUpWideNarrow size={20} /></button></div></th>)}
//                                                                                 {decoded.role == 99 || decoded.role == 101 && (<th className="py-2 px-4 text-[#8DC63F]"><div className="flex items-center gap-2"><span>Actions</span></div></th>) }
//                                                                         </tr>
//                                                                 </thead>
//                                                                 <tbody className="text-sm">
//                                                                          <td className="py-2 px-4">
//                                                                                 <img
//                                                                                 //src={IMAGE_URL + instructor.user_profile_photo}
//                                                                                         className="w-10 h-10 rounded-full object-cover cursor-pointer"
//                                                                                         alt="profile"
//                                                                                 />
//                                                                         </td>
//                                                                         <td>sdfsa</td>
//                                                                         <td>saldj</td>       
//                                                                 </tbody>
//                                                         </table>
//                                                 </div>
//                                         </div>
//                                     </div>
//                             </div>
//                     </div>                                              
//             </div>
//     </div>
//   )
// }
// export default BatchIndividual
import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowUpWideNarrow } from 'lucide-react';
import TraineeInsRatio from '../charts/TraineeInsRatio';
import BatchProfileAPI from '../API/BatchProfileAPI';
import getMonthYear from '../utils/DateChange';
import { jwtDecode } from 'jwt-decode';

function BatchIndividual() {
    const { batch_id } = useParams();
    const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => setButtonOpen(!buttonOpen);
    const navigate = useNavigate();

    const [batchInfo, setBatchInfo] = React.useState({});
    const [instructors, setInstructors] = React.useState([]);
    const [trainees, setTrainees] = React.useState([]);
    const [counts, setCounts] = React.useState({ instructorCount: 0, traineeCount: 0 });

    //     const handleIndBatchAPICall = async (batch_id) => {
    //         try {
    //             let token = localStorage.getItem('user_token');
    //             const result = await BatchProfileAPI(token, batch_id);
    //             const { batchInfo, instructors, trainees, instructorCount, traineeCount } = result.data;
    //             setBatchInfo(batchInfo);
    //             setInstructors(instructors);
    //             setTrainees(trainees);
    //             setCounts({ instructorCount, traineeCount });
    //         } catch (err) {
    //             console.log(err.message);
    //         }
    //     };
    const handleIndBatchAPICall = async (batch_id) => {
        try {
            let token = localStorage.getItem('user_token');
            const result = await BatchProfileAPI(token, batch_id);
            //console.log('API result:', result); // check what's coming back

            const data = result?.data;
            if (!data) return; // guard against empty response

            setBatchInfo(data.batchInfo || null);
            setInstructors(data.instructors || []);
            setTrainees(data.trainees || []);
            setCounts({
                instructorCount: data.instructorCount || 0,
                traineeCount: data.traineeCount || 0
            });
        } catch (err) {
            console.log(err.message);
        }
    };
    React.useEffect(() => {
        handleIndBatchAPICall(batch_id);
    }, []);

    let token = localStorage.getItem('user_token');
    const decoded = jwtDecode(token);
    const visibleInstructors = decoded.role == 102 ? instructors.filter(i => i.user_email == decoded.user_mail) : instructors;
    if (!decoded.role) {
        return <Navigate to="/" replace />;
    }

    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                <NavBar />
            </div>
            <div className="flex flex-grow pt-12">
                <div className="">
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                </div>
                <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                    <div className="bg-gray-100">

                        {/* Header */}
                        <div className="p-2 flex justify-between items-center border-b bg-white">
                            <div className="flex justify-between items-center gap-10">
                                <span>Batch Profile</span>
                                <span className="text-xs">{batch_id}</span>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <div className="text-[#8DC63F]">
                                    <button onClick={() => navigate('/dashboard')}>Home</button>
                                </div>
                                <div>/</div>
                                <div>Batch Profile</div>
                            </div>
                        </div>

                        <div className="">
                            {/* Batch Info + Ratio */}
                            <div className="grid grid-cols-3 gap-3 m-3">
                                <div className={`${decoded.role == 99 || decoded.role == 101 ? 'col-span-2' : 'col-span-3'} bg-white`}>
                                    <div className="p-2 flex justify-between items-center">
                                        <div className="text-xl">Batch Info</div>
                                        {decoded.role == 99 || decoded.role == 101 ? (
                                            <div>
                                                <button className="bg-[#8DC63F] p-1 text-white rounded px-2">Edit</button>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="flex justify-between items-center gap-6 mx-10">
                                        <div className="mt-8">
                                            <div className="text-sm">Name</div>
                                            <div className="font-semibold">{batchInfo?.batch_name}</div>
                                        </div>
                                        <div className="mt-8">
                                            <div className="text-sm">Starting date</div>
                                            <div className="font-semibold">{getMonthYear(batchInfo?.batch_start_date)}</div>
                                        </div>
                                        <div className="mt-8">
                                            <div className="text-sm">Ending on</div>
                                            <div className="font-semibold">{getMonthYear(batchInfo?.batch_end_date)}</div>
                                        </div>
                                    </div>
                                </div>

                                {decoded.role == 101 && (
                                    <div className="col-span-1 bg-white">
                                        <div className="p-2">Instructor vs Trainee Ratio</div>
                                        <div>
                                            <TraineeInsRatio trainee={counts.traineeCount} instructor={counts.instructorCount} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Instructor Profile Table */}
                            <div className="m-3 bg-white p-2">
                                <div className="text-lg m-3">
                                    <div>Instructor Profile</div>
                                </div>
                                <div>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                <th className="py-2 px-4 text-[#8DC63F]">
                                                    <div className="flex items-center gap-2">
                                                        <div>Name</div>
                                                        <button><ArrowUpWideNarrow size={20} /></button>
                                                    </div>
                                                </th>
                                                <th className="py-2 px-4 text-[#8DC63F]">
                                                    <div className="flex items-center gap-2">
                                                        <div>Registered at</div>
                                                        <button><ArrowUpWideNarrow size={20} /></button>
                                                    </div>
                                                </th>
                                                <th className="py-2 px-4 text-[#8DC63F]">
                                                    <div className="flex items-center gap-2">
                                                        <span>Last Logged In</span>
                                                        <button><ArrowUpWideNarrow size={20} /></button>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {visibleInstructors.length > 0 ? (
                                                visibleInstructors.map((instructor, index) => (
                                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-2 px-4">
                                                            <div className="font-medium">{instructor.full_name || '—'}</div>
                                                            <div className="text-xs text-gray-400">{instructor.user_email}</div>
                                                        </td>
                                                        <td className="py-2 px-4 text-gray-600">
                                                            {formatDateTime(instructor.user_created_at)}
                                                        </td>
                                                        {(decoded.role == 99 || decoded.role == 101 || decoded.role == 102 || decoded.role == 103) && (
                                                            <td className="py-2 px-4 text-gray-600">
                                                                {formatDateTime(instructor.last_login)}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="py-6 text-center text-gray-400">
                                                        No instructors found for this batch.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {decoded.role == 103 && (
                                <div className="m-3 bg-white p-2">
                                    <div className="text-lg m-3">
                                        <div>Associated Certificates</div>
                                    </div>
                                    <div>
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-300 shadow-sm text-sm">
                                                    <th className="py-2 px-4 text-[#8DC63F]">
                                                        <div className="flex items-center gap-2">
                                                            <div>Certificate Name</div>
                                                            <button><ArrowUpWideNarrow size={20} /></button>
                                                        </div>
                                                    </th>
                                                    <th className="py-2 px-4 text-[#8DC63F]">
                                                        <div className="flex items-center gap-2">
                                                            <div>Status</div>
                                                            <button><ArrowUpWideNarrow size={20} /></button>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {batchInfo?.certificate?.certificate_id ? (
                                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-2 px-4">
                                                            <div className="font-medium">{batchInfo.certificate.certificate_name || '—'}</div>
                                                            {/* <div className="text-xs text-gray-400">{batchInfo.certificate.certificate_id}</div> */}
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                batchInfo.certificate.certificate_status === 'issued'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {batchInfo.certificate.certificate_status || 'pending'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2" className="py-6 text-center text-gray-400">
                                                            No certificates associated with this batch.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        )}                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BatchIndividual;