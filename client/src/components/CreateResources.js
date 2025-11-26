import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { X } from 'lucide-react';
import React from 'react'
import { twMerge } from "tailwind-merge";
import CreateResourceApi from '../API/createResourcesAPI';
import { toast } from "react-toastify";
import CustomCloseButton from "../utils/CustomCloseButton";

function CreateResources({isVisible,  onClose, learningModuleId}) {
    const [shake, setShake] = React.useState(false);
    const [createResource, setCreateResource] = React.useState({
            learning_module_id: "", 
            resource_type: "", 
            topic : "", 
            resource_name:""
        });
        const handleChange = (e) => {
            const {name, value} = e.target;
            setCreateResource({
              ...createResource, 
              [name]: value
            });
        }
        //console.log(createResource);
        let handleCreateResource = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("user_token");
        let response = await CreateResourceApi(token, createResource);

        console.log(response);

        if (response?.status === 200) {
            toast.success("Created Successfully!", {
                closeButton: CustomCloseButton ,
            });
            onClose(); // close modal after creating
        } else {
            toast.error("Failed to create resource!", {
                closeButton: <CustomCloseButton />,
            });
        }
    } catch (err) {
        console.log(err);
        toast.error("Something went wrong!", {
            closeButton: <CustomCloseButton />,
        });
    }
};
       if (!isVisible) return null; 
    const handleWrapperClick = () => {
                setShake(true);
                setTimeout(() => setShake(false), 500); // Reset after animation duration
    };
    console.log(learningModuleId);

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
        <div className="bg-white p-4 rounded shadow-md">
                <div className="flex justify-between items-center">
                    <h2 className="">Create Resource</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="mt-5">
                                <FormControl fullWidth size="small">
                                    <InputLabel>Unit Name</InputLabel>
                                    <Select
                                        label="Unit Name"
                                        // value={resourceType}
                                        onChange={handleChange}
                                        name="learning_module_id"
                                        // onChange={(e) => setResourceType(e.target.value)}
                                    >
                                        <MenuItem value={learningModuleId.learning_module_id}>{learningModuleId?.unit_name || learningModuleId?.course_name}</MenuItem>
                                    </Select>
                                </FormControl>
                </div>
                <div className="grid grid-cols-2 mt-5 gap-5">
                                {/*type, topic, resource name,   */}
                                <FormControl fullWidth size="small">
                                    <InputLabel>Resource Type</InputLabel>
                                    <Select
                                        label="Resource Type"
                                        onChange={handleChange}
                                        name="resource_type"
                                        // value={resourceType}
                                        // onChange={(e) => setResourceType(e.target.value)}
                                    >
                                        <MenuItem value="Learning Resource">Learning Resource</MenuItem>
                                        <MenuItem value="Practice">Practice</MenuItem>
                                        <MenuItem value="Image Interpretation">Image Interpretation</MenuItem>
                                        <MenuItem value="Test">Test</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Select Topic</InputLabel>
                                    <Select
                                        label="Select Topic"
                                        onChange={handleChange}
                                        name="topic"
                                        // value={courseName}
                                        // onChange={(e) => {
                                        // setCourseName(e.target.value);
                                        // }}
                                    >
                                        {/* {ufcCourses.map((c, i) => ( */}
                                        <MenuItem key={'das'} value="ad">
                                            {/* {c} */}
                                            sf
                                        </MenuItem>
                                         {/* ))} */}
                                    </Select>
                                </FormControl>
                </div>
                <div className="mt-5">
                      <FormControl fullWidth size="small">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Resource Name"
                                        onChange={handleChange}
                                        name="resource_name"
                                        //value={resourceName}
                                        //onChange={(e) => setResourceName(e.target.value)}
                                    />
                        </FormControl>
                </div>
                <div className="mt-5 flex justify-end items-center gap-3">
                        <button
                            className={`px-3 py-2 text-white rounded bg-[#8DC63F] cursor-pointer}`}
                            onClick={handleCreateResource}
                        >
                            Create
                        </button>          
                </div>
        </div>
      </div>
    </div>
  )
}

export default CreateResources;