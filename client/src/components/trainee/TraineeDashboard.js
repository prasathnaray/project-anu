import React, {useState} from 'react'
import SideBar from '../sideBar';
import NavBar from '../navBar';
import { LayoutDashboard } from 'lucide-react';
import GetModuleApi from '../../API/GetModuleAPI';
import StatsDonutChart from '../../charts/PrpgressBar';
import BasicPie from '../../charts/PieChart';

function TraineeDashboard() {
  const [progressState, setProgressState] = React.useState(false);
  const handleProgress = () => {
    setProgressState(!progressState);
  }
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  const handleApiCall = async () => {
      try
      {
          const token = localStorage.getItem('user_token');
          const result = await GetModuleApi(token);
          console.log(result);
      }
      catch(err)
      {
          console.error(err);
      }
  }

  React.useEffect(() => {

  }, [])
  return (
    <div className={'flex flex-col min-h-screen'}>
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                        <NavBar />
            </div>
            <div className="flex flex-grow pt-12">
                    <div>
                            <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
                    </div>
                    <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
                          <div className="border bg-white px-10 flex justify-start items-center py-4 gap-5">
                                      <button className={`${progressState === true ? 'bg-[#8DC63F] text-white transition-all ease-in-out px-4 py-1 rounded-full font-semibold text-sm': 'bg-gray-200 px-4 py-1 rounded-full font-semibold text-gray-600 text-sm transition-all ease-in-out'} `} onClick={handleProgress}>Progress</button>
                                      {/* <button className="bg-gray-200 px-4 py-1 rounded-full font-semibold text-gray-600 text-sm hover:bg-[#8DC63F] hover:text-white transition-all ease-in-out">My Learning</button> */}
                          </div>
                          <div className="px-10 pt-4">
                                <div className="grid grid-cols-3 gap-5">
                                      <div className="col-span-2 border bg-white">
                                              <div className="ms-[100px]"><BasicPie /></div>
                                      </div>
                                      <div className="bg-white text-md">
                                              <div>Hello</div>
                                      </div>
                                </div>
                          </div>
                    </div>
            </div>
    </div>
  )
}

export default TraineeDashboard;