import React, {useState} from "react"; 
import { twMerge } from "tailwind-merge";
function CreateBatch({isVisible,  onClose, children}){
    const [shake, setShake] = useState(false);
    if (!isVisible) return null;
    // const handleClose = (e) => {
    //     if(e.target.id === 'wrapper') onClose();
    // }
    const handleWrapperClick = () => {
                setShake(true);
                setTimeout(() => setShake(false), 500); // Reset after animation duration
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
          "w-[700px] transition-all",
          shake ? "animate-shake" : ""
        )}
      >
        <div className="bg-white p-4 rounded shadow-md">{children}</div>
      </div>
    </div>
    ) 
}
export default CreateBatch;