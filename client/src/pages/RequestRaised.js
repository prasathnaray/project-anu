import React from 'react'
import NavBar from '../components/navBar'

function RequestRaised() {
  return (
    <div className={`flex flex-col min-h-screen`}>
             <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                    <NavBar />
             </div>
             <div>
              
             </div>
    </div>
  )
}

export default RequestRaised