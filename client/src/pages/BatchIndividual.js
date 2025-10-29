import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowLeft01Icon } from 'hugeicons-react';
import { ArrowLeftIcon } from 'lucide-react';
import BasicPie from '../charts/PieChart';
import TraineeInsRatio from '../charts/TraineeInsRatio';
import BatchProfileAPI from '../API/BatchProfileAPI';
// import useParams  from 'react-router-dom';
function BatchIndividual() {
  const data = useParams();
  const {batch_id} = useParams()
  console.log(data)
  const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
    const navigate = useNavigate();
    console.log(batch_id)

    const [batchProfileData, setBatchProfileData] = React.useState([])
    const handleIndBatchAPICall = async(batch_id) => {
        try
        {
                let token = localStorage.getItem('user_token')
                const result = await BatchProfileAPI(token, batch_id);
                setBatchProfileData(result.data);
        }
        catch(err)
        {
                console.log(err.message)
        }
    }
    React.useEffect(() => {
        handleIndBatchAPICall(batch_id)
    }, [])

    const traineeCount = batchProfileData.filter(user => user.user_role === "103").length;
    const instructorCount = batchProfileData.filter(user => user.user_role === "102").length
    console.log(batchProfileData);
  return (
    <div className={`flex flex-col min-h-screen`}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                        <NavBar />
            </div>
            <div className="flex flex-grow pt-12">
                    <div className="">
                            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                    </div>
                    <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div className="bg-gray-100">
                                    <div className="p-2 flex justify-between items-center border-b bg-white">
                                        <div className="flex justify-between items-center gap-10"><span className="">Batch Profile</span> <span className="text-xs"> {batch_id}</span></div>
                                        <div className="flex gap-2 text-sm">
                                                <div className="text-[#8DC63F]"><button onClick={() => navigate('/dashboard')}>Home</button></div>
                                                <div>/</div>
                                                <div>Batch Profile</div>
                                        </div>
                                    </div>
                                    <div className="">
                                        {/* <div className={` ${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                                <div className="mt-5 font-semibold text-xl text-gray-600">Batches</div>

                                        </div> */}
                                        <div className="grid grid-cols-3 gap-3 m-3">
                                                <div className="col-span-2 bg-white">
                                                        <div className="p-2">Instructor vs Trainee Ratio</div>
                                                        <div>
                                                           <TraineeInsRatio trainee={traineeCount} instructor={instructorCount}/>     
                                                        </div>
                                                </div>
                                                {/* <div className="col-span-1 bg-white">
                                                        <div>Hello</div>
                                                </div> */}
                                        </div>
                                    </div>
                            </div>
                    </div>                                              
            </div>
    </div>
  )
}
export default BatchIndividual