import React, {useState, useEffect} from "react";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import QueriesView from "../components/admin/QueriesView";
import { LayoutDashboard, Notebook } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Queries(){
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    //navigation
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen">
                      <NavBar />
                      <div className="flex flex-grow">
                            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                            <div
                            className={`${
                                buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
                            } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
                            >
                               <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                    <LayoutDashboard size={15} /> Dashboard / <Notebook size={15} />{' '}
                                    <span className="text-[15px] hover:underline hover:underline-offset-4">
                                    <button onClick={() => navigate('/batch')}>Queries</button>
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                  <div>
                                        
                                  </div>
                            </div>
                      </div>
        </div>
    )
}
export default Queries;