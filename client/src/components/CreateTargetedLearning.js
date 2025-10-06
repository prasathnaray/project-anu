import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { twMerge } from "tailwind-merge";
function CreateTargetedLearning({isVisible, onClose, children}) {
//   const token = jwtDecode('user_token');
  const [buttonOpen, setButtonOpen] = React.useState(false);
  const handleButtonOpen = () => {
      setButtonOpen(!buttonOpen);
  };
    const [shake, setShake] = React.useState(false);
    if (!isVisible) return null;
    const handleWrapperClick = () => {
                setShake(true);
                setTimeout(() => setShake(false), 500);
    };
    return (
        <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xs flex justify-center items-center z-50"
      id="wrapper"
      onClick={handleWrapperClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          "w-[800px] transition-all",
          shake ? "animate-shake" : ""
        )}
      >
        <div className="bg-white p-4 rounded shadow-md">{children}</div>
      </div>
    </div>
    ) 
}
export default CreateTargetedLearning;