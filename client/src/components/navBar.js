import React, { useMemo,useEffect, useRef, useState } from "react";
import {
  Notification03Icon,
  UserSharingIcon,
  Megaphone01Icon,
  Search02Icon,
  UserSettings01Icon,
  Logout01Icon,
  CircleIcon
} from "hugeicons-react";
import { createClient } from "@supabase/supabase-js";
import { CircleUser, Bell, Search, MessageCircleMore, EllipsisVertical, User2Icon} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import MaterialRipple from "material-ripple-effects";
import { jwtDecode } from "jwt-decode";
import { Badge } from "@mui/material";
import logo from '../assets/image (3).png';
import { supabase } from "../supabaseClient";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import CircleIcon from '@mui/icons-material/Circle';
function NavBar() {
    const tokenRes = jwtDecode(localStorage.getItem("user_token"));
    // console.log(tokenRes)
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

  const [count, setCount] = useState(0);
  const [notify, setNotify] = useState([]);
     const readNotification = async(id) => {
        //const token = localStorage.getItem()
        const {error} = await supabase
          .from('course_availability')
          .update({ access_status: false })
          .eq("course_id", id)
          .eq("user_id", tokenRes.user_mail);
        if (error) {
            console.error("Error marking as read:", error);
        } else {
          setNotify((prev) =>
            prev.map((n) =>
              n.course_id === id ? { ...n, access_status: false } : n
            )
          );
          setCount((prev) => prev - 1);
       }  
  }
  const fetchCount = async () => {
  const {data, count, error } = await supabase
    .from("course_availability")
    // .select("*", { count: "exact", head: true }) 
    .select("course_id, access_status", { count: "exact" }) 
    .eq("user_id", tokenRes.user_mail)
    .is("access_status", true); // only pending (unread)

   if (error) {
      console.error("Error fetching count:", error);
    } else {
      //console.log(count?? 0)
      setCount(count);
      setNotify(data || [])
    }
};

  useEffect(() => {
    fetchCount();

    // Realtime: listen for new availability entries
    const channel = supabase
      .channel("course_availability")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "course_availability" },
        async (payload) => {
          if (payload.new.user_id === tokenRes.user_mail) {
            setCount((prev) => prev + 1);
            await fetchCount();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <div className="navbar dm-sans">
      <nav className="bg-[#8DC63F] shadow-sm border">
        <div className="flex flex-wrap items-center justify-between py-[3px] px-1">
          <div className="flex justify-start items-center ms-3 gap-10">
            <div className="text-white flex justify-between item-center">
              {currentPath === "/reports" && <div>Reports</div>}
              {currentPath === "/dashboard" && <div>Dashboard</div>}
              {currentPath === "/profile" && <div>Profile</div>}
              {currentPath === "/settings" && <div>Settings</div>}
              {currentPath === "/course" && <div>Course</div>}
              {currentPath === "/batch" && <div>Course</div>}
              {currentPath === "/instructors" && <div>Instructors</div>}
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
             {/* <div className="relative md:block">
              <div className="px-2 py-2 ms-3 text-gray-200 hover:text-[#8DC63F]">
                <button className="">
                  <MessageCircleMore size={20} />
                </button>
              </div>
            </div> */}
            <div className="relative md:block">
              <div className="px-2 py-2 ms-3 text-gray-600 hover:text-[#8DC63F]">
                  {tokenRes.role == "99" && <div className="text-sm text-gray-100">Welcome Super Admin </div>}
                  {tokenRes.role == "101" && <div className="text-sm text-white">Welcome Admin</div>}
                  {tokenRes.role == "102" && <div className="text-sm text-white">Welcome Instructor</div>}
              </div>
            </div>
            <div className="relative md:block">
              <div className="px-3 py-2 ms-1 text-gray-200">
                <button className="">
                  <Search size={20} />
                </button>
              </div>
            </div>
            <div className="relative md:block">
              <div className="px-3 py-2 ms-1 text-gray-200">
                <div className="">
                  <button
                    onClick={() => toggleDropdown('notifications')}
                    className="relative"
                  >
                    <Badge badgeContent={`${count}`} color="error">
                      <Bell size={20} />
                    </Badge>
                  </button>
                  {openDropdownIndex === 'notifications' && (
                      <div
                        ref={(el) => (dropdownRefs.current['notifications'] = el)}
                        className="absolute right-0 mt-1 w-[480px] bg-white border border-gray-200 rounded shadow-md z-50 transition-all ease-in-out duration-300"
                      >
                        <div className="p-3 border-b text-gray-700 text-xl">Notifications</div>

                        {notify.length > 0 ? (
                          <ul className="max-h-60 overflow-y-auto">
                            {notify.map((n, idx) => (
                              <li
                                key={idx}
                                className="px-4 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="text-black text-xs">
                                      Course - {n.course_id} has been added
                                  </div>
                                  <button onClick={() => {readNotification(n.course_id)}}>
                                  <IconButton
                                    aria-label="delete"
                                  >
                                      <Badge badgeContent={''} 
                                             color="success"
                                             sx={{
                                              "& .MuiBadge-badge": {
                                                minWidth: "8px",
                                                height: "8px",
                                                padding: 0,
                                                borderRadius: "50%",
                                              },
                                            }}
                                      ></Badge>
                                  </IconButton>
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-gray-500 text-sm">No new notifications</div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
            {/* <div className="relative md:block">
              <div className="px-2 py-2 ms-3 text-gray-600 hover:text-[#8DC63F]">
                <button>
                  <UserSettings01Icon size={21} />
                </button>
              </div>
            </div> */}
            <div className=" ms-1 relative">
              <button onClick={() => toggleDropdown('user-options')} className="text-gray-200 hover:bg-[#8DC63F] p-2 rounded"  onMouseDown={(e) => ripple.create(e, "dark", "circle")}>
                <CircleUser size={20} />
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