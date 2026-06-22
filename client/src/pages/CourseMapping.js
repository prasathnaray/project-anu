import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MenuItem, TextField } from '@mui/material';
import { BookOpenCheck, RefreshCcw } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import GetVolumeDataAPI from '../API/GetVolumeDataAPI';
import GetShadowRecordingsAPI from '../API/GetShadowRecordingsAPI';
import { CreateCourseMappingAPI, GetCourseMappingsAPI } from '../API/CourseMappingAPI';

const TRIMESTERS = ['First Trimester', 'Second Trimester', 'Third Trimester'];
const MODULES = ['Biometry', 'Six Step', '20 + 2 planes'];
const UNITS = ['BPD & HC', 'AC', 'FL'];
const COURSE_TYPES = ['p1', 'p2', 'p3', 'p4', 't1', 't2'];

const emptyForm = {
  volume_id: '',
  trimester: '',
  anatomy_type: '',
  volume_name: '',
  module_name: '',
  course_type: '',
  shadow_recording_id: '',
  step_recording_id: '',
};

const emptyFilters = {
  trimester: '',
  anatomy_type: '',
  module_name: '',
  course_type: '',
  volume_name: '',
};

function CourseMapping() {
  const token = localStorage.getItem('user_token');
  const decoded = token ? jwtDecode(token) : {};
  const userRole = Number(decoded.role);
  const [buttonOpen, setButtonOpen] = useState(true);
  const [volumes, setVolumes] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [volumeLoading, setVolumeLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const selectedVolume = useMemo(
    () => volumes.find((volume) => volume.volume_id === formData.volume_id),
    [volumes, formData.volume_id]
  );

  const trimesterOptions = useMemo(() => {
    const existingTrimesters = volumes
      .map((volume) => volume.trimester?.trim())
      .filter(Boolean);

    const uniqueTrimesters = Array.from(new Set(existingTrimesters));
    return uniqueTrimesters.length > 0 ? uniqueTrimesters : TRIMESTERS;
  }, [volumes]);

  const normalizeUnit = useCallback((value = '') => {
    const unit = UNITS.find((item) => item.toLowerCase() === value.trim().toLowerCase());
    return unit || '';
  }, []);

  const shadowRecordings = useMemo(
    () => recordings.filter((recording) => recording.recording_type?.toLowerCase().includes('shadow')),
    [recordings]
  );

  const stepRecordings = useMemo(
    () => recordings.filter((recording) => recording.recording_type?.toLowerCase().includes('step')),
    [recordings]
  );

  const fetchVolumes = useCallback(async () => {
    setVolumeLoading(true);
    try {
      const response = await GetVolumeDataAPI(token);
      setVolumes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load volumes.');
      setVolumes([]);
    } finally {
      setVolumeLoading(false);
    }
  }, [token]);

  const fetchMappings = useCallback(async (nextFilters = emptyFilters) => {
    setMappingLoading(true);
    try {
      const response = await GetCourseMappingsAPI(nextFilters);
      setMappings(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load course mappings.');
      setMappings([]);
    } finally {
      setMappingLoading(false);
    }
  }, []);

  const fetchRecordings = useCallback(async (volumeId) => {
    if (!volumeId) {
      setRecordings([]);
      return;
    }

    setRecordingLoading(true);
    try {
      const response = await GetShadowRecordingsAPI(volumeId);
      setRecordings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load volume recordings.');
      setRecordings([]);
    } finally {
      setRecordingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolumes();
    fetchMappings(emptyFilters);
  }, [fetchMappings, fetchVolumes]);

  useEffect(() => {
    if (!selectedVolume) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      trimester: selectedVolume.trimester || prev.trimester,
      anatomy_type: normalizeUnit(selectedVolume.volume_type || prev.anatomy_type),
      volume_name: selectedVolume.volume_name || '',
      shadow_recording_id: '',
      step_recording_id: '',
    }));
    fetchRecordings(selectedVolume.volume_id);
  }, [fetchRecordings, normalizeUnit, selectedVolume]);

  if (userRole !== 99) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleButtonOpen = () => setButtonOpen((prev) => !prev);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    fetchMappings(emptyFilters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.trimester || !formData.anatomy_type || !formData.volume_name || !formData.module_name || !formData.course_type) {
      toast.error('Please select volume, module, unit, and course type.');
      return;
    }

    const payload = {
      trimester: formData.trimester,
      anatomy_type: formData.anatomy_type,
      volume_name: formData.volume_name,
      module_name: formData.module_name,
      course_type: formData.course_type,
      shadow_recording_id: formData.shadow_recording_id || null,
      step_recording_id: formData.step_recording_id || null,
    };

    setSubmitLoading(true);
    try {
      await CreateCourseMappingAPI(payload);
      toast.success('Course mapping created successfully.');
      setFormData(emptyForm);
      setRecordings([]);
      fetchMappings(filters);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create course mapping.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const shortId = (value) => (value ? value.slice(0, 8).toUpperCase() : '-');

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
            <div>Course Mapping</div>
            <div className="flex gap-2 text-sm">
              <div className="text-[#8DC63F]">Home</div>
              <div>/</div>
              <div>Course Mapping</div>
            </div>
          </div>

          <div className="m-5 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
            <div className="bg-white border rounded shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Create Mapping</div>
                  <div className="text-xs text-gray-500 mt-1">Link a volume to module, unit, course type, and recordings.</div>
                </div>
                <BookOpenCheck className="text-[#8DC63F]" size={22} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 gap-4">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Volume"
                  name="volume_id"
                  value={formData.volume_id}
                  onChange={handleFormChange}
                  disabled={volumeLoading}
                >
                  <MenuItem value="">Select Volume</MenuItem>
                  {volumes.map((volume) => (
                    <MenuItem key={volume.volume_id} value={volume.volume_id}>
                      {volume.volume_name} - {volume.volume_type || 'Unit not set'}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Trimester"
                  name="trimester"
                  value={formData.trimester}
                  onChange={handleFormChange}
                  disabled={volumeLoading}
                >
                  <MenuItem value="">Select Trimester</MenuItem>
                  {trimesterOptions.map((trimester) => (
                    <MenuItem key={trimester} value={trimester}>
                      {trimester}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Module"
                  name="module_name"
                  value={formData.module_name}
                  onChange={handleFormChange}
                >
                  <MenuItem value="">Select Module</MenuItem>
                  {MODULES.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Unit"
                  name="anatomy_type"
                  value={formData.anatomy_type}
                  onChange={handleFormChange}
                >
                  <MenuItem value="">Select Unit</MenuItem>
                  {UNITS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Course Type"
                  name="course_type"
                  value={formData.course_type}
                  onChange={handleFormChange}
                >
                  <MenuItem value="">Select Course Type</MenuItem>
                  {COURSE_TYPES.map((courseType) => (
                    <MenuItem key={courseType} value={courseType}>
                      {courseType}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Shadow Recording"
                  name="shadow_recording_id"
                  value={formData.shadow_recording_id}
                  onChange={handleFormChange}
                  disabled={!formData.volume_id || recordingLoading}
                >
                  <MenuItem value="">No Shadow Recording</MenuItem>
                  {shadowRecordings.map((recording) => (
                    <MenuItem key={recording.recording_id} value={recording.recording_id}>
                      {recording.recording_name || shortId(recording.recording_id)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Step Recording"
                  name="step_recording_id"
                  value={formData.step_recording_id}
                  onChange={handleFormChange}
                  disabled={!formData.volume_id || recordingLoading}
                >
                  <MenuItem value="">No Step Recording</MenuItem>
                  {stepRecordings.map((recording) => (
                    <MenuItem key={recording.recording_id} value={recording.recording_id}>
                      {recording.recording_name || shortId(recording.recording_id)}
                    </MenuItem>
                  ))}
                </TextField>

                {formData.volume_id && !recordingLoading && recordings.length === 0 && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    No recordings found for this volume. You can still create a volume-only mapping.
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                      setFormData(emptyForm);
                      setRecordings([]);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 text-sm bg-[#8DC63F] text-white rounded disabled:opacity-60"
                  >
                    {submitLoading ? 'Creating...' : 'Create Mapping'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border rounded shadow-sm min-w-0">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">Mappings</div>
                    <div className="text-xs text-gray-500 mt-1">{mappings.length} mapping(s) found</div>
                  </div>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                    onClick={() => fetchMappings(filters)}
                    disabled={mappingLoading}
                  >
                    <RefreshCcw size={15} />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-4">
                  <TextField
                    fullWidth
                    size="small"
                    label="Volume Name"
                    name="volume_name"
                    value={filters.volume_name}
                    onChange={handleFilterChange}
                  />
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Trimester"
                    name="trimester"
                    value={filters.trimester}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    {TRIMESTERS.map((trimester) => (
                      <MenuItem key={trimester} value={trimester}>
                        {trimester}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Unit"
                    name="anatomy_type"
                    value={filters.anatomy_type}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    {UNITS.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Module"
                    name="module_name"
                    value={filters.module_name}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    {MODULES.map((module) => (
                      <MenuItem key={module} value={module}>
                        {module}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Course Type"
                    name="course_type"
                    value={filters.course_type}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    {COURSE_TYPES.map((courseType) => (
                      <MenuItem key={courseType} value={courseType}>
                        {courseType}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 text-sm bg-[#8DC63F] text-white rounded"
                      onClick={() => fetchMappings(filters)}
                    >
                      Apply
                    </button>
                    <button
                      className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100 text-sm text-gray-600 border-b">
                    <tr>
                      <th className="py-2 px-4 font-semibold">Mapping ID</th>
                      <th className="py-2 px-4 font-semibold">Volume</th>
                      <th className="py-2 px-4 font-semibold">Trimester</th>
                      <th className="py-2 px-4 font-semibold">Unit</th>
                      <th className="py-2 px-4 font-semibold">Module</th>
                      <th className="py-2 px-4 font-semibold">Course Type</th>
                      <th className="py-2 px-4 font-semibold">Shadow</th>
                      <th className="py-2 px-4 font-semibold">Step</th>
                      <th className="py-2 px-4 font-semibold">Created By</th>
                      <th className="py-2 px-4 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappingLoading ? (
                      <tr>
                        <td colSpan={10} className="py-5 text-center text-gray-500">
                          <ClipLoader color="#8DC63F" size={24} cssOverride={{ borderWidth: '4px' }} />
                        </td>
                      </tr>
                    ) : mappings.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-5 text-center text-gray-500">
                          No course mappings found
                        </td>
                      </tr>
                    ) : (
                      mappings.map((mapping) => (
                        <tr key={mapping.mapping_id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                          <td className="py-2 px-4 font-medium text-[#8DC63F]">{shortId(mapping.mapping_id)}</td>
                          <td className="py-2 px-4 font-medium">{mapping.volume_name}</td>
                          <td className="py-2 px-4">{mapping.trimester}</td>
                          <td className="py-2 px-4">{mapping.anatomy_type}</td>
                          <td className="py-2 px-4">{mapping.module_name}</td>
                          <td className="py-2 px-4">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                              {mapping.course_type}
                            </span>
                          </td>
                          <td className="py-2 px-4">{shortId(mapping.shadow_recording_id)}</td>
                          <td className="py-2 px-4">{shortId(mapping.step_recording_id)}</td>
                          <td className="py-2 px-4">{mapping.created_by_name || mapping.created_by || '-'}</td>
                          <td className="py-2 px-4">{formatDate(mapping.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseMapping;
