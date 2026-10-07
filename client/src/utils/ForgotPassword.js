import React from 'react'

function ForgotPassword({isVisible, onClose, children}) {
  if(!isVisible) return null;
  const handleClose = (e) => {
       if(e.target.id === 'wrapper') onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-5 backdrop-blur-sm" id="wrapper" onClick={handleClose}>
            <div className="w-full max-w-[500px]">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)] sm:p-7">
                        {children}
                    </div>
            </div>
    </div>
  )
}
export default ForgotPassword
