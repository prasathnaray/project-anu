import React, { useState } from 'react';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import { MoreVertical, X } from 'lucide-react';
import UploadVol from '../components/Instructors/UploadVol';
import { TextField, Menu, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import VolumeUploadAPI from '../API/volumeUpload';
import ClipLoader from 'react-spinners/ClipLoader';
import GetVolInsAPI from '../API/GetVolInsAPI';

function VolumeList() {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [fileName, setFileName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);

  const handleClick = () => fileInputRef.current.click();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setFileName(file.name);
    }
  };

  const [buttonOpen, setButtonOpen] = useState(true);
  const [openUploadVol, setOpenUploadVol] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    volume_name: '',
    volume_type: '',
    volume_fetal_presentation: '',
    volume_ga: '',
    file: null,
  });
  const [volumesDatumm, setVolumesDatumm] = useState([]);

  const handleAPICall = async () => {
    try {
      const result = await GetVolInsAPI();
      console.log(result.data);
      setVolumesDatumm(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    handleAPICall();
  }, []);

  let decoded = jwtDecode(localStorage.getItem('user_token'));
  if (decoded.role != 102 && decoded.role != 103) {
    return <Navigate to="/" replace />;
  }

  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const handleClose = () => {
    setOpenUploadVol(!openUploadVol);
    setFormData({
      volume_name: '',
      volume_type: '',
      volume_fetal_presentation: '',
      volume_ga: '',
      file: null,
    });
    setFileName("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { volume_name, volume_type, volume_fetal_presentation, volume_ga, file } = formData;
    if (!volume_name || !volume_type || !volume_fetal_presentation || !volume_ga || !file) {
      toast.error('Please fill all fields and select a file.');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('user_token');
      const data = new FormData();
      data.append('volume_name', volume_name);
      data.append('volume_type', volume_type);
      data.append('volume_fetal_presentation', volume_fetal_presentation);
      data.append('volume_ga', volume_ga);
      data.append('file', file);
      const response = await VolumeUploadAPI(token, data);
      if (response.status === 200 || response.status === 201) {
        toast.success('Volume uploaded successfully!');
        setOpenUploadVol(false);
        setFormData({
          volume_name: '',
          volume_type: '',
          volume_fetal_presentation: '',
          volume_ga: '',
          file: null,
        });
        setFileName("");
        handleAPICall(); // Refresh the list
      } else {
        toast.error(response.data?.error || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      toast.error(err.response?.data?.error || 'Something went wrong while uploading.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, volume) => {
    setAnchorEl(event.currentTarget);
    setSelectedVolume(volume);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVolume(null);
  };

  const handleRequestConversion = () => {
    if (selectedVolume) {
      toast.info(`Requesting conversion for ${selectedVolume.volume_name}`);
    }
    handleMenuClose();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>
      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        <div
          className={`${
            buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
          } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
        >
          <div className="p-2 flex justify-between items-center border-b bg-white">
            <div>Volume List</div>
            <div className="flex gap-2 text-sm">
              <div className="text-[#8DC63F]">
                <button onClick={() => navigate('/dashboard')}>Home</button>
              </div>
              <div>/</div>
              <div>Volume Management</div>
            </div>
          </div>
          <div className="m-5 bg-white border-b">
            <div className="flex justify-end items-center p-4">
              <button
                className="px-2 p-1 bg-[#8DC63F] text-white rounded text-sm"
                onClick={() => setOpenUploadVol(true)}
              >
                Upload Volume
              </button>
            </div>
            <div className="m-5 bg-white border rounded shadow-sm">
              <table className="min-w-full text-left">
                <thead className="bg-gray-100 text-sm text-gray-600 border-b">
                  <tr>
                    <th className="py-2 px-4 font-semibold">Volume ID</th>
                    <th className="py-2 px-4 font-semibold">Volume Name</th>
                    <th className="py-2 px-4 font-semibold">Status</th>
                    <th className="py-2 px-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        <ClipLoader
                          color="#8DC63F"
                          size={24}
                          cssOverride={{ borderWidth: '4px' }}
                        />
                      </td>
                    </tr>
                  ) : volumesDatumm.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No volumes found
                      </td>
                    </tr>
                  ) : (
                    volumesDatumm.map((volume) => (
                      <tr key={volume.volume_id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium text-[#8DC63F]">
                          {volume.volume_id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-2 px-4 font-medium">{volume.volume_name}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            volume.status 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {volume.status ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-medium">
                          <button 
                            className="text-[#8DC63F] hover:bg-gray-100 rounded p-1"
                            onClick={(e) => handleMenuOpen(e, volume)}
                          >
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MUI Menu Component */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleRequestConversion}>
          Convert
        </MenuItem>
      </Menu>

      <UploadVol isVisible={openUploadVol} onClose={handleClose}>
        <>
          <div className="flex justify-between items-center">
            <div className="font-medium">Upload Volume</div>
            <button
              className="text-red-400 hover:bg-red-100 hover:rounded p-1 transition-all"
              onClick={handleClose}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5 mt-3">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Volume Name"
                name="volume_name"
                value={formData.volume_name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Volume Type"
                name="volume_type"
                value={formData.volume_type}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Fetal Presentation"
                name="volume_fetal_presentation"
                value={formData.volume_fetal_presentation}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="GA"
                name="volume_ga"
                value={formData.volume_ga}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                name="file"
              />
              <TextField
                label="Upload File"
                variant="outlined"
                value={fileName}
                fullWidth
                size="small"
                sx={{ minHeight: '35px' }}
                onClick={handleClick}
                InputProps={{
                  readOnly: true,
                  style: { cursor: "pointer" }
                }}
              />
            </div>

            <div className="mt-4 flex justify-end items-center">
              <button
                type="submit"
                className="bg-[#8DC63F] p-1 px-3 text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </>
      </UploadVol>
    </div>
  );
}

export default VolumeList;