import React from 'react'

function ForgotPassword({isVisible, onClose, children}) {
  if(!isVisible) return null;
  const handleClose = (e) => {
       if(e.target.id === 'wrapper') onClose();
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xs flex justify-center items-center border-md" id="wrapper" onClick={handleClose}>
            <div className="w-[500px]">
                    <div className="bg-white p-4 rounded">
                        {children}
                    </div>
            </div>
    </div>
  )
}
export default ForgotPassword