import logo from './logo.svg';
import './App.css';
import React from 'react';
import RoutesPath from './routes/route';
import { ToastContainer, toast, Slide, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  React.useEffect(() => {
      const handleContextmenu = e => {
          e.preventDefault()
      }
      document.addEventListener('contextmenu', handleContextmenu)
      return function cleanup() {
          document.removeEventListener('contextmenu', handleContextmenu)
      }
  }, [])
  return (
    <div>
      <RoutesPath />
      <ToastContainer 
          position="top-center"
          hideProgressBar={true}
          autoClose={3000}
          closeOnClick
          pauseOnHover
          draggable
          transition={Zoom}
          theme="colored"
      />
    </div>
  );
}

export default App;
