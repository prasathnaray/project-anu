import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
function TraineeIndividual() {
    const navigate = useNavigate();
    const { people_id } = useParams();
    const [buttonOpen, setButtonOpen] = React.useState(true);
        const handleButtonOpen = () => {
            setButtonOpen(!buttonOpen);
        };
  return (
    <div classNam={`flex flex-col min-h-screen`}>
        <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                <NavBar />
        </div>
        <div className="flex flex-grow pt-12">
                <div>
                        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                </div>
                <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                            <div className='bg-gray-100'>
                                    <div className="p-2 flex justify-between items-center border-b bg-white">
                                                <div>Profile</div>
                                                <div className="flex gap-2 text-sm">
                                                        <div className="text-[#8DC63F]"><button onClick={() => navigate('/dashboard')}>Home</button></div>
                                                        <div>/</div>
                                                        <div>User Profile</div>
                                                </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 mx-7">
                                              <div className="col-span-1 p-4 bg-white shadow mt-4 border-t-2 border-[#8DC63F]">
                                                       <div className="flex justify-center items-center mt-10">
                                                                <img src="https://adminlte.io/themes/v3/dist/img/user4-128x128.jpg" alt="Profile" className="w-100 rounded-full mb-4 hover:opacity-80 hover:cursor-pointer border-4 border-[#8DC63F]" />
                                                       </div>
                                                       <div className="text-center text-lg">John Doe</div>
                                                       <div className="text-center mt-2 text-gray-500">Trainee</div>    
                                              </div>
                                              <div className="col-span-3 p-4 bg-white shadow mt-4">
                                                      
                                              </div>
                                    </div>
                            </div>
                </div>
        </div>
    </div>
  )
}

export default TraineeIndividual