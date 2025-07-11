import React from "react";
import SideBar from "../components/sideBar";
import NavBar from "../components/navBar";

function Instructors(){
    return (
        <div className={'flex'}>
            <div>
                <SideBar />
            </div>
            <div className={`flex flex-grow ms-[221px]`}>
                <NavBar />
            </div>
        </div>
    )
}   
export default Instructors;