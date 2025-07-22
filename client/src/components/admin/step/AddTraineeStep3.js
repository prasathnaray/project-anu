import React, { useRef, useState } from 'react';
import { Button, TextField } from '@mui/material';

function AddTraineeStep3({ handleChange, handleInputData }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Display file name in TextField
    }
    handleChange(event); // Pass file to parent handler
  };

  return (
    <div className="mt-7 grid grid-cols-1 gap-5">
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          name="trainee_dp"
        />
        <TextField
          label="Upload File"
          variant="outlined"
          value={fileName}
          fullWidth
          size="small" sx={{ minHeight: '35px' }}
          onClick={handleClick}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>

      <div className="relative">
        <textarea
          id="confirmPassword"
          className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer"
          placeholder=" "
          onChange={handleChange}
          value={handleInputData.description}
          name="description"
        />
        <label
          htmlFor="confirmPassword"
          className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 
            peer-focus:px-2 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Description
        </label>
      </div>
    </div>
  );
}

export default AddTraineeStep3;