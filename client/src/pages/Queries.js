import React, {useState, useEffect} from "react";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import QueriesView from "../components/admin/QueriesView";

function Queries(){
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
                    : "ms-[85.5px] flex-grow"
                    } `}>
                        <div>
                            <NavBar />
                        </div>
                        <QueriesView />
                </div>
        </div>
    )
}
export default Queries;