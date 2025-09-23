import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useParams } from "react-router-dom";
import NavBar from "../components/navBar";
import SideBar from "../components/sideBar";
import { ArrowUpWideNarrow, Plus, X, CheckCircle } from "lucide-react";
import { FormControl, IconButton, InputLabel, Select, TextField } from "@mui/material";
import CreateModule from "../components/superadmin/CreateModule";
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";
import axios from "axios";
import getResourceAPI from "../API/GetResourceAPI";
import CreateResourceApi from "../API/createResourcesAPI";

function Resource() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  // popup state
  const [openResource, setOpenResource] = React.useState(false);
  const handleClose = () => {
    setOpenResource(false);
    setResourceData({
      resource_name: "",
      module_id: url.module_id, // auto assign from URL
    });
  };

  // get module_id from URL params
  const url = useParams();

  const [resourceData, setResourceData] = React.useState({
    resource_name: "",
    module_id: url.module_id, // ensure correct mapping
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData({
      ...resourceData,
      [name]: value,
    });
  };

  // create resource API call
  const createResourceAPI = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await CreateResourceApi(token, resourceData);
      if (response)
      {
          toast.success("Resource Created", {
            autoClose: 3000,
            toastId: "resource-created",
            closeButton: CustomCloseButton,
          });
          handleClose();
          getResources();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create resource");
    }
  };

  // fetch resources (dummy for now, replace with API later)
  const [resources, setResources] = React.useState([]);
  const getResources = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await getResourceAPI(token, url.module_id);
      setResources(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getResources();
  }, []);

  // decode token
  const token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (decoded.role != 101 && decoded.role != 99 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />

        {/* Main Content */}
        <div className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow`}>
          <div className="bg-gray-100 h-screen pt-12">
            <div
              className={`${
                buttonOpen
                  ? "px-[130px] py-4 w-full max-w-[1800px] mx-auto"
                  : "px-[200px] py-4 w-full max-w-[1800px] mx-auto"
              }`}
            >
              {/* Breadcrumb */}
              <div className="text-gray-500">Course / Chapters / Modules / Resources</div>
              <div className="mt-5 font-semibold text-xl text-gray-600">
                Learning Resources
              </div>

              {/* Table + Add Button */}
              <div className="mt-5 bg-white rounded px-8 py-10">
                <div className="flex justify-start mb-4">
                  <IconButton
                    size="md"
                    color="success"
                    className="bg-green-200"
                    onClick={() => setOpenResource(true)}
                  >
                    <Plus className="h-6 w-6" />
                  </IconButton>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Resource</div>
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                      <th className="py-2 px-4 text-[#8DC63F]">No. of Trainees Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.resource_id} className="text-sm text-gray-700">
                        <td className="py-2 px-4 border-b-2">{r.resource_name}</td>
                        {/* <td className="py-2 px-4 border-b-2">
                          {r.trainee_completed}
                        </td> */}
                        <td className="py-2 px-4 border-b-2">
                          {decoded.role == 103 ? (
                            r.is_completed ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle size={16} /> Completed
                              </div>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )
                          ) : (
                            <span>{r.trainee_completed || 0}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateModule isVisible={openResource} onClose={handleClose}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Create New Resource</div>
          <IconButton onClick={handleClose}>
            <X className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              id="outlined-basic"
              label="Resource Name"
              onChange={handleChange}
              name="resource_name"
              value={resourceData.resource_name}
            />
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-[#8DC63F] px-3 py-2 text-white"
            onClick={createResourceAPI}
          >
            Save
          </button>
        </div>
      </CreateModule>
    </div>
  );
}

export default Resource;