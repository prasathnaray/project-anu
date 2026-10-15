import React, { useState } from 'react';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import { MoreVertical, Upload, X } from 'lucide-react';
import UploadVol from '../components/Instructors/UploadVol';
import { TextField, Menu, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolumeUploadAPI from '../API/volumeUpload';
import ClipLoader from 'react-spinners/ClipLoader';
import GetVolInsAPI from '../API/GetVolInsAPI';
import volumeConvAPI from '../API/volumeConvAPI';
import GetShadowRecordingCountsAPI from '../API/GetShadowRecordingCountsAPI';
import CustomCloseButton from '../utils/CustomCloseButton';
import UpdateVolumeAPI from '../API/UpdateVolumeAPI';
import volumeDownloadAPI from '../API/volumeDownloadAPI';
import VolumeRecordingDownloads from '../components/Instructors/VolumeRecordingDownloads';
import { uploadVolumePlacementAPI, getVolumePlacementsAPI } from '../API/VolumePlacementAPI';

const MAX_VOLUME_UPLOAD_SIZE_MB = 100;
const MAX_VOLUME_UPLOAD_SIZE_BYTES = MAX_VOLUME_UPLOAD_SIZE_MB * 1024 * 1024;

function VolumeList() {
  const navigate = useNavigate();
  const token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  const userRole = Number(decoded.role);
  const fileInputRef = React.useRef(null);
  const [volumeFiles, setVolumeFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [converting, setConverting] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState(null);
  const [recordingsVolume, setRecordingsVolume] = useState(null);

  const isVolFile = (file) => {
    if (!file || !file.name) return false;
    return file.name.toLowerCase().endsWith('.vol');
  };

  const handleFilesSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles = [];
    for (const file of selectedFiles) {
      if (!isVolFile(file)) {
        toast.error(`${file.name}: Only .vol files are allowed.`);
        continue;
      }
      if (file.size > MAX_VOLUME_UPLOAD_SIZE_BYTES) {
        toast.error(`${file.name} is too large. Maximum allowed size is ${MAX_VOLUME_UPLOAD_SIZE_MB}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    setVolumeFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}`));
      const newFiles = validFiles.filter((f) => !existingKeys.has(`${f.name}_${f.size}`));
      const combined = [...prev, ...newFiles];
      if (combined.length > 10) {
        toast.warn('You can upload up to 10 volume files. Only the first 10 files were kept.');
        return combined.slice(0, 10);
      }
      return combined;
    });

    e.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    setVolumeFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const [buttonOpen, setButtonOpen] = useState(true);
  const [openUploadVol, setOpenUploadVol] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anatomyFilter, setAnatomyFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [conversionFilter, setConversionFilter] = useState('all');
  const [formData, setFormData] = useState({
    volume_name: '',
    volume_type: '',
    volume_fetal_presentation: '',
    trimester: '',
    volume_ga: '',
    description: '',
    file: null,
  });
  const [volumesDatumm, setVolumesDatumm] = useState([]);
  const [volumeRecordingCounts, setVolumeRecordingCounts] = useState({});
  const [volumePlacements, setVolumePlacements] = useState({});
  const [uploadingJsonVolumeId, setUploadingJsonVolumeId] = useState(null);

  const [openEditVol, setOpenEditVol] = useState(false);
  const [editingVolume, setEditingVolume] = useState(null);
  const [editFormData, setEditFormData] = useState({
    volume_id: '',
    volume_name: '',
    volume_type: '',
    volume_fetal_presentation: '',
    trimester: '',
    volume_ga: '',
    description: '',
  });
  const [editLoading, setEditLoading] = useState(false);

  const handleOpenEdit = (volume) => {
    if (!volume) return;
    setEditingVolume(volume);
    setEditFormData({
      volume_id: volume.volume_id,
      volume_name: volume.volume_name || '',
      volume_type: volume.volume_type || '',
      volume_fetal_presentation: volume.volume_fetal_presentation || '',
      trimester: volume.trimester || '',
      volume_ga: volume.volume_ga || '',
      description: volume.description || '',
    });
    setOpenEditVol(true);
    setAnchorEl(null);
  };

  const handleCloseEdit = () => {
    setOpenEditVol(false);
    setEditingVolume(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { volume_id, volume_name, volume_type, volume_fetal_presentation, trimester, volume_ga, description } = editFormData;
    if (!volume_name || !volume_type || !volume_fetal_presentation || !trimester || !volume_ga || !description) {
      toast.error('Please fill all fields.');
      return;
    }
    try {
      setEditLoading(true);
      const response = await UpdateVolumeAPI(token, editFormData);
      if (response.code === 200 || response.status === 200 || response.message) {
        toast.success('Volume updated successfully!');
        setOpenEditVol(false);
        handleAPICall({ showLoading: false });
      } else {
        toast.error(response.error || response.message || 'Failed to update volume.');
      }
    } catch (err) {
      console.error('Update Error:', err);
      toast.error(err.response?.data?.error || err.message || 'Something went wrong while updating.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleAPICall = React.useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setListLoading(true);
    }
    try {
      const [volumeResult, shadowCountResult, placementsResult] = await Promise.allSettled([
        GetVolInsAPI(),
        GetShadowRecordingCountsAPI(),
        getVolumePlacementsAPI()
      ]);

      if (volumeResult.status === 'rejected') {
        throw volumeResult.reason;
      }

      const result = volumeResult.value;
      const volumes = Array.isArray(result?.data) ? result.data : [];
      const counts = shadowCountResult.status === 'fulfilled' && Array.isArray(shadowCountResult.value?.data)
        ? shadowCountResult.value.data
        : [];
      const placements = placementsResult.status === 'fulfilled' && Array.isArray(placementsResult.value?.data)
        ? placementsResult.value.data
        : [];

      if (shadowCountResult.status === 'rejected') {
        console.error('Failed to load volume recording counts:', shadowCountResult.reason);
      }

      setVolumesDatumm(volumes);
      setVolumeRecordingCounts(
        counts.reduce((acc, item) => ({
          ...acc,
          [item.volume_id]: {
            shadow: Number(item.shadow_recording_count) || 0,
            stepFiles: Array.isArray(item.step_recording_images)
              ? item.step_recording_images
              : (Array.isArray(item.step_recording_files) ? item.step_recording_files : [])
          }
        }), {})
      );
      setVolumePlacements(
        placements.reduce((acc, item) => ({
          ...acc,
          [item.volume_id]: item
        }), {})
      );
    } catch (err) {
      console.log(err);
      if (showLoading) {
        toast.error('Failed to load volumes.');
        setVolumesDatumm([]);
      }
    } finally {
      if (showLoading) {
        setListLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    handleAPICall();
  }, [handleAPICall]);

  const getConversionStatus = React.useCallback((volume) => {
    if (volume?.conversion_completion) return 'completed';
    if (volume?.conversion_process_status) return 'converting';
    return 'pending';
  }, []);

  const hasActiveConversion = React.useMemo(
    () => volumesDatumm.some((volume) => getConversionStatus(volume) === 'converting'),
    [getConversionStatus, volumesDatumm]
  );

  const isImageFile = React.useCallback((fileUrl) => (
    /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(fileUrl || '')
  ), []);

  const handleJsonFileUpload = async (volumeId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      toast.error('Only .json files are allowed.');
      event.target.value = '';
      return;
    }

    try {
      const content = await file.text();
      JSON.parse(content);
    } catch {
      toast.error('Invalid JSON content. File contains malformed JSON.');
      event.target.value = '';
      return;
    }

    try {
      setUploadingJsonVolumeId(volumeId);
      const data = new FormData();
      data.append('volume_id', volumeId);
      data.append('placed_file', file);

      const response = await uploadVolumePlacementAPI(data);
      if (response.status === 200 || response.status === 201) {
        toast.success('JSON file added successfully!');
        const assetUrl = response.data?.assetUrl || response.data?.fileUrl;
        if (assetUrl) {
          setVolumePlacements((prev) => ({
            ...prev,
            [volumeId]: {
              ...(prev[volumeId] || {}),
              volume_id: volumeId,
              placed_url: assetUrl,
            },
          }));
        } else {
          handleAPICall({ showLoading: false });
        }
      } else {
        toast.error(response.data?.message || 'Failed to add JSON file.');
      }
    } catch (err) {
      console.error('JSON Upload Error:', err);
      const errorMsg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || err.response?.data?.error || 'Something went wrong while adding JSON file.';
      toast.error(errorMsg);
    } finally {
      setUploadingJsonVolumeId(null);
      event.target.value = '';
    }
  };

  React.useEffect(() => {
    if (!hasActiveConversion) return undefined;

    const pollId = window.setInterval(() => {
      handleAPICall({ showLoading: false });
    }, 5000);

    return () => window.clearInterval(pollId);
  }, [handleAPICall, hasActiveConversion]);

  const anatomyOptions = React.useMemo(() => (
    [...new Set(
      volumesDatumm
        .map((volume) => volume.volume_type)
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b))
  ), [volumesDatumm]);

  const uploaderName = sessionStorage.getItem('user_name') || decoded.user_mail || '';
  if (![99, 101, 102].includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  const filteredVolumes = volumesDatumm.filter((volume) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery === '' ||
      volume.volume_name?.toLowerCase().includes(normalizedQuery) ||
      volume.volume_id?.toLowerCase().includes(normalizedQuery) ||
      volume.volume_fetal_presentation?.toLowerCase().includes(normalizedQuery) ||
      volume.volume_type?.toLowerCase().includes(normalizedQuery);

    const matchesApproval =
      approvalFilter === 'all' ||
      (approvalFilter === 'approved' && volume.status) ||
      (approvalFilter === 'pending' && !volume.status);

    const matchesAnatomy =
      anatomyFilter === 'all' ||
      volume.volume_type === anatomyFilter;

    const conversionStatus = getConversionStatus(volume);
    const matchesConversion =
      conversionFilter === 'all' ||
      conversionFilter === conversionStatus;

    return matchesSearch && matchesAnatomy && matchesApproval && matchesConversion;
  });

  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const handleClose = () => {
    setOpenUploadVol(!openUploadVol);
    setFormData({
      volume_name: '',
      volume_type: '',
      volume_fetal_presentation: '',
      trimester: '',
      volume_ga: '',
      description: '',
      file: null,
    });
    setVolumeFiles([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      volume_name,
      volume_type,
      volume_fetal_presentation,
      trimester,
      volume_ga,
      description,
    } = formData;

    const validFiles = volumeFiles.filter(Boolean);

    if (!volume_name || !volume_type || !volume_fetal_presentation || !trimester || !volume_ga || !description) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (validFiles.length === 0) {
      toast.error('Please upload at least one volume file.');
      return;
    }

    try {
      setLoading(true);

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const data = new FormData();
        const currentName = validFiles.length === 1 ? volume_name : `${volume_name} (${i + 1})`;
        data.append('volume_name', currentName);
        data.append('volume_type', volume_type);
        data.append('volume_fetal_presentation', volume_fetal_presentation);
        data.append('trimester', trimester);
        data.append('volume_ga', volume_ga);
        data.append('description', description);
        data.append('file', file);

        try {
          const response = await VolumeUploadAPI(token, data);
          if (response.status === 200 || response.status === 201) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (uploadErr) {
          console.error(`Error uploading volume ${i + 1}:`, uploadErr);
          failureCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          validFiles.length === 1
            ? 'Volume uploaded successfully!'
            : `${successCount} volume(s) uploaded successfully!${failureCount > 0 ? ` (${failureCount} failed)` : ''}`
        );
        setOpenUploadVol(false);
        setFormData({
          volume_name: '',
          volume_type: '',
          volume_fetal_presentation: '',
          trimester: '',
          volume_ga: '',
          description: '',
          file: null,
        });
        setVolumeFiles([]);
        handleAPICall();
      } else {
        toast.error('Failed to upload volume(s). Please try again.');
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

  const handleDownload = async (volume, fileType) => {
    const key = `${volume.volume_id}:${fileType}`;
    setDownloadingKey(key);
    try {
      const response = await volumeDownloadAPI(volume.volume_id, fileType);
      const { url, filename } = response.data;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to download volume file.');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleDownloadJson = async (volume) => {
    const key = `${volume.volume_id}:json`;
    setDownloadingKey(key);
    try {
      const response = await volumeDownloadAPI(volume.volume_id, 'json');
      const { url, filename } = response.data;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${volume.volume_name || 'placement'}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      const fallbackUrl = volumePlacements[volume.volume_id]?.placed_url;
      if (fallbackUrl) {
        try {
          const res = await fetch(fallbackUrl);
          if (!res.ok) throw new Error('Fetch failed');
          const blob = await res.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${(volume.volume_name || 'placement').replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(blobUrl);
        } catch {
          const link = document.createElement('a');
          link.href = fallbackUrl;
          link.target = '_blank';
          link.download = `${volume.volume_name || 'placement'}.json`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      } else {
        toast.error('Unable to download JSON file.');
      }
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleRequestConversion = async () => {
    if (!selectedVolume) return;

    try {
      setConverting(true);
      //toast.info(`Requesting conversion for ${selectedVolume.volume_name}...`);
      
      const response = await volumeConvAPI(selectedVolume.volume_id);
      
      if (response.status === 200 || response.status === 201) {
        const volumeId = selectedVolume.volume_id;
        setVolumesDatumm((previousVolumes) => previousVolumes.map((volume) => (
          volume.volume_id === volumeId
            ? { ...volume, conversion_process_status: true, conversion_completion: false }
            : volume
        )));
        toast.success(`Conversion Started!`, {
          autoClose: 3000,
          toastId: 'convert-success',
          icon: false,
          closeButton: CustomCloseButton
        });
        handleAPICall({ showLoading: false }); // Refresh the list to show updated status
      } else {
        //toast.error(response.data?.error || 'Conversion failed. Please try again.');
        toast.error("Conversion failed. Please try again." , {
              autoClose: 3000,
              toastId: 'convert-again',
              icon: false,
              closeButton: CustomCloseButton
        });
      }
    } catch (err) {
      console.error('Conversion Error:', err);
      toast.error(err.response?.data?.error || 'Something went wrong during conversion.');
    } finally {
      setConverting(false);
      handleMenuClose();
    }
  };
  console.log("token", jwtDecode(token).role);
  return (
    <div className="flex flex-col min-h-screen">
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
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:flex-1 md:max-w-5xl">
                <TextField
                  fullWidth
                  size="small"
                  label="Search volumes"
                  placeholder="Search by ID, name, or anatomy type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Anatomy Type"
                  value={anatomyFilter}
                  onChange={(e) => setAnatomyFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {anatomyOptions.map((anatomyType) => (
                    <MenuItem key={anatomyType} value={anatomyType}>
                      {anatomyType}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Approval Status"
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Conversion Status"
                  value={conversionFilter}
                  onChange={(e) => setConversionFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="converting">Converting</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </TextField>
              </div>
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
                    <th className="py-2 px-4 font-semibold">Fetal Presentation</th>
                    {userRole !== 99 && (
                      <th className="py-2 px-4 font-semibold">Approval Status</th>
                    )}
                    <th className="py-2 px-4 font-semibold">Conversion Status</th>
                    <th className="py-2 px-4 font-semibold">JSON File</th>
                    <th className="py-2 px-4 font-semibold">Download</th>
                    <th className="py-2 px-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading ? (
                    <tr>
                      <td colSpan={userRole === 99 ? 7 : 8} className="py-4 text-center text-gray-500">
                        <ClipLoader
                          color="#8DC63F"
                          size={24}
                          cssOverride={{ borderWidth: '4px' }}
                        />
                      </td>
                    </tr>
                  ) : filteredVolumes.length === 0 ? (
                    <tr>
                      <td colSpan={userRole === 99 ? 7 : 8} className="py-4 text-center text-gray-500">
                        No volumes found
                      </td>
                    </tr>
                  ) : (
                    filteredVolumes.map((volume) => {
                      const conversionStatus = getConversionStatus(volume);
                      const volumeProcessing = conversionStatus === 'converting';
                      return (
                      <tr key={volume.volume_id} className={`text-sm text-gray-700 border-b hover:bg-gray-50 ${volumeProcessing ? 'bg-yellow-50' : ''}`}>
                        <td className="py-2 px-4 font-medium text-[#8DC63F]">
                          {volume.volume_id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-2 px-4 font-medium">{volume.volume_name}</td>
                        <td className="py-2 px-4">
                          {volume.volume_fetal_presentation || volume.fetal_presentation ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {volume.volume_fetal_presentation || volume.fetal_presentation}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        {userRole !== 99 && (
                          <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            volume.status 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {volume.status ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        )}
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            conversionStatus === 'completed'
                              ? 'bg-green-100 text-green-700' 
                              : conversionStatus === 'converting'
                                ? 'bg-yellow-100 text-yellow-700 animate-pulse'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {conversionStatus === 'completed' ? (
                              'Completed'
                            ) : conversionStatus === 'converting' ? (
                              <span className="inline-flex items-center gap-2">
                                <ClipLoader
                                  color="#A16207"
                                  size={12}
                                  cssOverride={{ borderWidth: '2px' }}
                                />
                                Converting...
                              </span>
                            ) : (
                              'Pending'
                            )}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {volumePlacements[volume.volume_id]?.placed_url && (
                              <button
                                type="button"
                                onClick={() => handleDownloadJson(volume)}
                                disabled={downloadingKey === `${volume.volume_id}:json`}
                                className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 disabled:opacity-50"
                                title="Download JSON file"
                              >
                                {downloadingKey === `${volume.volume_id}:json` ? 'Downloading…' : 'Download JSON'}
                              </button>
                            )}
                            <label className={`cursor-pointer px-2 py-1 rounded text-xs inline-flex items-center gap-1.5 transition-colors ${
                              uploadingJsonVolumeId === volume.volume_id
                                ? 'opacity-60 cursor-not-allowed bg-gray-100 text-gray-500'
                                : volumePlacements[volume.volume_id]?.placed_url
                                  ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300'
                                  : 'bg-[#8DC63F] text-white hover:bg-[#7cb336]'
                            }`}>
                              <input
                                type="file"
                                accept=".json,application/json"
                                className="hidden"
                                disabled={uploadingJsonVolumeId === volume.volume_id}
                                onChange={(e) => handleJsonFileUpload(volume.volume_id, e)}
                              />
                              {uploadingJsonVolumeId === volume.volume_id ? (
                                <>
                                  <ClipLoader color="#6B7280" size={10} cssOverride={{ borderWidth: '2px' }} />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <span>{volumePlacements[volume.volume_id]?.placed_url ? 'Replace JSON' : '+ Add JSON'}</span>
                              )}
                            </label>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex flex-wrap gap-2">
                            {volume.volume_file && (
                              <button type="button" onClick={() => handleDownload(volume, 'source')}
                                disabled={Boolean(downloadingKey)}
                                className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50">
                                {downloadingKey === `${volume.volume_id}:source` ? 'Preparing…' : 'Source file'}
                              </button>
                            )}
                            {volume.conversion_completion && volume.output_file && (
                              <button type="button" onClick={() => handleDownload(volume, 'converted')}
                                disabled={Boolean(downloadingKey)}
                                className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50">
                                {downloadingKey === `${volume.volume_id}:converted` ? 'Preparing…' : 'Converted file'}
                              </button>
                            )}
                            <button type="button" onClick={() => setRecordingsVolume(volume)}
                              className="px-2 py-1 rounded text-xs bg-purple-50 text-purple-700 hover:bg-purple-100">
                              Recording files
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-4 font-medium">
                          <button 
                            className="text-[#8DC63F] hover:bg-gray-100 rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={(e) => handleMenuOpen(e, volume)}
                            disabled={converting || volumeProcessing}
                          >
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    )})
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
        <MenuItem 
          onClick={handleRequestConversion}
          disabled={converting || getConversionStatus(selectedVolume) !== 'pending'}
        >
          {/* {converting ? 'Converting...' : 'Convert'} */}
              {converting || getConversionStatus(selectedVolume) === 'converting' ? 'Converting...' : getConversionStatus(selectedVolume) === 'completed' ? 'Already Converted' : 'Convert'}
        </MenuItem>
        <MenuItem onClick={() => handleOpenEdit(selectedVolume)}>
            Edit
        </MenuItem>
      </Menu>
      <VolumeRecordingDownloads volume={recordingsVolume} onClose={() => setRecordingsVolume(null)} />
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
          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-1">
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
                label="Anatomy Type"
                name="volume_type"
                value={formData.volume_type}
                onChange={handleChange}
              />
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label="Fetal Presentation"
                name="volume_fetal_presentation"
                value={formData.volume_fetal_presentation}
                onChange={handleChange}
              >
                <MenuItem value="">Select Fetal Presentation</MenuItem>
                <MenuItem value="Cephalic_left">Cephalic_left</MenuItem>
                <MenuItem value="Cephalic_right">Cephalic_right</MenuItem>
                <MenuItem value="Breech_left">Breech_left</MenuItem>
                <MenuItem value="Breech_right">Breech_right</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label="Trimester"
                name="trimester"
                value={formData.trimester}
                onChange={handleChange}
              >
                <MenuItem value="">Select Trimester</MenuItem>
                <MenuItem value="First Trimester">First Trimester</MenuItem>
                <MenuItem value="Second Trimester">Second Trimester</MenuItem>
                <MenuItem value="Third Trimester">Third Trimester</MenuItem>
              </TextField>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Gestational Age"
                name="volume_ga"
                type="number"
                value={formData.volume_ga}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Uploader Name"
                value={uploaderName}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                size="small"
                label="Case Details"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>

            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFilesSelect}
                accept=".vol"
                multiple
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#8DC63F] bg-[#8DC63F]/10 hover:bg-[#8DC63F]/15 text-[#527a1f] py-3 px-4 rounded-lg transition-colors cursor-pointer"
              >
                <Upload size={18} />
                <span className="text-sm font-semibold">
                  {volumeFiles.length === 0
                    ? 'Upload Volume (Add up to 10 .vol files)'
                    : `Add More Volume Files (${volumeFiles.length}/10 selected)`}
                </span>
              </button>

              {volumeFiles.length > 0 && (
                <div className="mt-2.5 max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                  {volumeFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-gray-500">{idx + 1}.</span>
                        <span className="truncate" title={file.name}>{file.name}</span>
                        <span className="text-gray-400 text-[10px] shrink-0">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-gray-400 hover:text-red-500 p-0.5 ml-2 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Edit Volume Modal */}
      <UploadVol isVisible={openEditVol} onClose={handleCloseEdit}>
        <>
          <div className="flex justify-between items-center">
            <div className="font-medium">Edit Volume</div>
            <button
              className="text-red-400 hover:bg-red-100 hover:rounded p-1 transition-all"
              onClick={handleCloseEdit}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-2 gap-5 mt-3">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Volume Name"
                name="volume_name"
                value={editFormData.volume_name}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Anatomy Type"
                name="volume_type"
                value={editFormData.volume_type}
                onChange={handleEditChange}
              />
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label="Fetal Presentation"
                name="volume_fetal_presentation"
                value={editFormData.volume_fetal_presentation}
                onChange={handleEditChange}
              >
                <MenuItem value="">Select Fetal Presentation</MenuItem>
                <MenuItem value="Cephalic_left">Cephalic_left</MenuItem>
                <MenuItem value="Cephalic_right">Cephalic_right</MenuItem>
                <MenuItem value="Breech_left">Breech_left</MenuItem>
                <MenuItem value="Breech_right">Breech_right</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label="Trimester"
                name="trimester"
                value={editFormData.trimester}
                onChange={handleEditChange}
              >
                <MenuItem value="">Select Trimester</MenuItem>
                <MenuItem value="First Trimester">First Trimester</MenuItem>
                <MenuItem value="Second Trimester">Second Trimester</MenuItem>
                <MenuItem value="Third Trimester">Third Trimester</MenuItem>
              </TextField>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Gestational Age"
                name="volume_ga"
                type="number"
                value={editFormData.volume_ga}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Uploader Name"
                value={uploaderName}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                size="small"
                label="Case Details"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                className="col-span-2"
              />
            </div>

            <div className="mt-4 flex justify-end items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8DC63F] p-1 px-3 text-white rounded text-sm disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </>
      </UploadVol>
    </div>
  );
}

export default VolumeList;
