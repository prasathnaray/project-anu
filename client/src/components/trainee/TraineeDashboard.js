import React, {useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';

function TraineeDashboard() {
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };
  return (
    
    <div className={`flex`}>
                <div>
                    <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/> 
                </div>
                <div className={`${
          buttonOpen === true
            ? "ms-[221px] flex-grow"
            : "ms-[59.5px] flex-grow"
        } `}>
                        <div>
                                <NavBar />
                        </div>
                </div>
    </div>
  )
}

export default TraineeDashboard;