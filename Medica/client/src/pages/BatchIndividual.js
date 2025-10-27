import React from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { ArrowLeft01Icon } from 'hugeicons-react';
import { ArrowLeftIcon } from 'lucide-react';
import BasicPie from '../charts/PieChart';
function BatchIndividual() {
  const data = useParams();
  console.log(data)
  const [buttonOpen, setButtonOpen] = React.useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };
  return (
    <div className={`flex flex-col min-h-screen`}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                        <NavBar />
            </div>
            <div className="flex flex-grow">
                    <div className="">
                            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                    </div>
                    <div className={`${buttonOpen === true ? "ms-[221px] flex-grow" : "ms-[55.5px] flex-grow"} `}>
                            <div className="bg-gray-100 h-screen pt-12">
                                    <div className={`${buttonOpen === true ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto" : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"}`}>
                                                      <div className="text-gray-500 flex items-center justify-start gap-5 mt-10">
                                                                    <button><ArrowLeftIcon size={20}/></button>
                                                                    <div className="">Batch Profile</div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                                    <div className="bg-white p-3 mt-10">
                                                                        <div className="text-gray-500">Trainees & Instructors Ratio</div>
                                                                        <BasicPie />
                                                                    </div>
                                                        </div>
                                    </div>
                            </div>
                    </div>                                              
            </div>
    </div>
  )
}
export default BatchIndividual