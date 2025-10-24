import React from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
function TraineeIndividual() {
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
                                    <div className="grid grid-cols-2 gap-1 mx-2">
                                              <div className="col-span-1 p-4 bg-white shadow mt-4">
                                                       <div>My Progress</div>
                                                        
                                              </div>
                                              <div className="col-span-1 p-4 bg-white shadow mt-4">
                                                      
                                              </div>
                                    </div>
                            </div>
                </div>
        </div>
    </div>
  )
}

export default TraineeIndividual