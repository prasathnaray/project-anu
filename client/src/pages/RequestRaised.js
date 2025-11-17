import React from 'react'
import NavBar from '../components/navBar'
import SideBar from '../components/sideBar'
import { LayoutDashboard, ListTodo, Notebook } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import GetVolumeData from '../API/getVolumeData';
import VolumeApprovalAPI from '../API/VolumeApprovalAPI';
function RequestRaised() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
  };
  //const [appove, setApprove] = React.useState(false);
  const [volumeList, setVolumeList] = React.useState([])
  const handleVolumeDataApi = async() => {
      try
      {
          let token = localStorage.getItem('user_token')
          const response = await GetVolumeData(token);
          setVolumeList(response.data);
      }
      catch(err)
      {
        console.log(err)
      }
  }
  const handleApproval = async() => {
      try
      {
            let token = localStorage.getItem('user_token')
            await VolumeApprovalAPI(token, true)
            handleVolumeDataApi()
      }
      catch(err)
      {
          console.log(err)
      }
  }
  React.useEffect(() => {
      handleVolumeDataApi();
  }, [])
  console.log(volumeList)
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />

        <div
          className={`${
            buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
          } flex-grow`}
        >
          <div className="bg-gray-100 h-screen">
            <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
              <LayoutDashboard size={15} /> Dashboard / <ListTodo size={15} />{" "}
              <span className="text-[15px] hover:underline hover:underline-offset-4">
                <button onClick={() => navigate('/request-raised')}>
                  Requests
                </button>
              </span>
            </div>

            <div className="mt-3 mx-2">
              <div className="bg-white">
                <div className="px-3 py-1 text-lg text-gray-500">
                  {volumeList.length} Request(s) Pending
                </div>

                {/* Render list safely */}
                <div className="p-2">
                  {Array.isArray(volumeList) && volumeList.length > 0 ? (
                    volumeList.map((item, index) => (
                      <div
                        key={index}
                        className="border flex justify-between items-center px-2 mb-2"
                      >
                        <div>{item.volume_name}</div>

                        <div className="text-sm m-3">
                          {volumeList.status ? 'Approved' : 
                            <div className="flex justify-between items-center">
                                  <button className="bg-[#8DC63F] p-2 font-semibold rounded-md text-white" onClick={() => handleApproval}>Approve</button>
                            </div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 px-2 py-3">
                      No Requests Available
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default RequestRaised