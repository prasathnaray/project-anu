import React, { useMemo,useEffect, useRef, useState } from "react";
import {
  Notification03Icon,
  UserSharingIcon,
  Megaphone01Icon,
  Search02Icon,
  UserSettings01Icon,
  Logout01Icon
} from "hugeicons-react";
import { CircleUser, Bell, Search, MessageCircleMore, EllipsisVertical, User2Icon} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import MaterialRipple from "material-ripple-effects";
function NavBar() {
    const ripple = new MaterialRipple();
   const dropdownRefs = useRef({});
  const currentPath = window.location.pathname;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user_token");
    // sessionStorage.removeItem("role");
    navigate("/");
  };
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(dropdownRefs.current).some(ref =>
        ref && ref.contains(event.target)
      );

      if (!isClickInside) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="navbar dm-sans">
      <nav className="bg-white shadow-sm border">
        <div className="flex flex-wrap items-center justify-between py-2 px-1">
          <div className="flex justify-start items-center ms-3">
            <div className="text-black">
              {currentPath === "/reports" && <div>Reports</div>}
              {currentPath === "/dashboard" && <div>Dashboard</div>}
              {currentPath === "/profile" && <div>Profile</div>}
              {currentPath === "/settings" && <div>Settings</div>}
            </div>
          </div>
          <div className="flex md:order-2">
            <button
              type="button"
              data-collapse-toggle="navbar-search"
              aria-controls="navbar-search"
              aria-expanded="false"
              class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Searchh</span>
            </button>
             <div className="relative md:block">
              <div className="px-2 py-2 ms-3 text-gray-600 hover:text-[#8DC63F]">
                <button>
                  <MessageCircleMore size={25} />
                </button>
              </div>
            </div>
            <div className="relative md:block">
              <div className="px-2 py-2 ms-3 text-gray-600 hover:text-[#8DC63F]">
                <button>
                  <Search size={25} />
                </button>
              </div>
            </div>
            <div className="relative md:block">
              <div className="px-3 py-2 ms-3 text-gray-500 hover:text-[#8DC63F]">
                <button className="">
                  <Bell size={25} />
                </button>
              </div>
            </div>
            {/* <div className="relative md:block">
              <div className="px-2 py-2 ms-3 text-gray-600 hover:text-[#8DC63F]">
                <button>
                  <UserSettings01Icon size={21} />
                </button>
              </div>
            </div> */}
            <div className=" ms-3 relative">
              <button onClick={() => toggleDropdown('user-options')} className="text-blue-500 hover:bg-gray-200 p-2 rounded"  onMouseDown={(e) => ripple.create(e, "dark", "circle")}>
                <CircleUser size={25} />
              </button>
              {openDropdownIndex === 'user-options' && (
                <div
                  ref={(el) => (dropdownRefs.current['user-options'] = el)}
                  className="absolute right-0 mt-2 w-22 bg-white border border-gray-200 rounded shadow-md z-50 transition-all ease-in-out duration-300"
                >
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 font-normal" >Profile</button>
                  <button className="block w-full text-left px-4 py-3 hover:bg-gray-50">Settings</button>
                  <button className="block w-full text-left px-4 py-3 hover:bg-gray-50" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
            <button
              data-collapse-toggle="navbar-search"
              type="button"
              class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-search"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-search"
          >
            <div className="relative mt-3 md:hidden">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default NavBar;