import React, {useState} from "react"; 
import { twMerge } from "tailwind-merge";
function CurriculumCreation({isVisible,  onClose, children}){
    const [shake, setShake] = useState(false);
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
          "w-[700px] transition-all",
          shake ? "animate-shake" : ""
        )}
      >
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)] sm:p-6">{children}</div>
      </div>
    </div>
    ) 
}
export default CurriculumCreation;
