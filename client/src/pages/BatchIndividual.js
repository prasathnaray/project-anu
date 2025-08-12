import React from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
function BatchIndividual() {
  const data = useParams();
  console.log(data)
  const [buttonOpen, setButtonOpen] = React.useState(false);
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

                            </div>
                    </div>                                              
            </div>
    </div>
  )
}

export default BatchIndividual