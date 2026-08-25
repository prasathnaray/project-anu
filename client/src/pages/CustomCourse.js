import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MenuItem, TextField } from '@mui/material';
import { ArrowLeft, BookOpenCheck, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import GetVolInsAPI from '../API/GetVolInsAPI';
import GetShadowRecordingsAPI from '../API/GetShadowRecordingsAPI';
import { CreateCourseMappingAPI, GetCourseMappingsAPI } from '../API/CourseMappingAPI';
import CustomCloseButton from '../utils/CustomCloseButton';
import AddCourse from '../components/admin/AddCourse';

const CUSTOM_COURSE_MODULE = 'SVT Course';
const COURSE_TYPES = ['Free Scan', 'Single Plane'];

const emptyForm = {
  course_name: '',
  description: '',
  doctor_name: '',
  volume_id: '',
  trimester: '',
  anatomy_type: '',
  volume_name: '',
  course_type: '',
  shadow_recording_id: '',
  step_recording_id: '',
};

function CustomCourse() {
  const token = localStorage.getItem('user_token');
  const decoded = token ? jwtDecode(token) : {};
  const userRole = Number(decoded.role);
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = useState(true);
  const [volumes, setVolumes] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [openCreateCourse, setOpenCreateCourse] = useState(false);
  const [volumeLoading, setVolumeLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const selectedVolume = useMemo(
    () => volumes.find((volume) => volume.volume_id === formData.volume_id),
    [formData.volume_id, volumes]
  );

  const shadowRecordings = useMemo(
    () => recordings.filter((recording) => recording.recording_type?.toLowerCase().includes('shadow')),
    [recordings]
  );

  const stepRecordings = useMemo(
    () => recordings.filter((recording) => recording.recording_type?.toLowerCase().includes('step')),
    [recordings]
  );

  const fetchVolumes = async () => {
    setVolumeLoading(true);
    try {
      const result = await GetVolInsAPI();
      setVolumes(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to load volumes.');
      setVolumes([]);
    } finally {
      setVolumeLoading(false);
    }
  };

  const fetchCustomCourses = async () => {
    setListLoading(true);
    try {
      const result = await GetCourseMappingsAPI();
      setCourses(Array.isArray(result?.data?.data) ? result.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to load custom courses.');
      setCourses([]);
    } finally {
      setListLoading(false);
    }
  };

  const fetchRecordings = async (volumeId) => {
    if (!volumeId) {
      setRecordings([]);
      return;
    }

    setRecordingLoading(true);
    try {
      const result = await GetShadowRecordingsAPI(volumeId);
      setRecordings(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to load volume recordings.');
      setRecordings([]);
    } finally {
      setRecordingLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
    fetchCustomCourses();
  }, []);

  useEffect(() => {
    if (!selectedVolume) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      trimester: selectedVolume.trimester || prev.trimester,
      anatomy_type: selectedVolume.volume_type || '',
      volume_name: selectedVolume.volume_name || '',
      shadow_recording_id: '',
      step_recording_id: '',
    }));
    fetchRecordings(selectedVolume.volume_id);
  }, [selectedVolume]);

  if (![99, 101].includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleButtonOpen = () => setButtonOpen((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setRecordings([]);
  };

  const handleClosePopup = () => {
    setOpenCreateCourse(false);
    handleClear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course_name || !formData.description || !formData.doctor_name || !formData.volume_id || !formData.anatomy_type || !formData.volume_name || !formData.course_type) {
      toast.error('Please fill course name, description, doctor name, volume, and course type.');
      return;
    }

    if (!formData.trimester) {
      toast.error('The selected volume does not have trimester information.');
      return;
    }

    const payload = {
      course_name: formData.course_name,
      description: formData.description,
      doctor_name: formData.doctor_name,
      trimester: formData.trimester,
      anatomy_type: formData.anatomy_type,
      volume_name: formData.volume_name,
      module_name: CUSTOM_COURSE_MODULE,
      course_type: formData.course_type,
      shadow_recording_id: formData.shadow_recording_id || null,
      step_recording_id: formData.step_recording_id || null,
    };

    setSubmitLoading(true);
    try {
      await CreateCourseMappingAPI(payload);
      toast.success('Course created successfully.', {
        autoClose: 3000,
        toastId: 'custom-course-created',
        icon: false,
        closeButton: CustomCloseButton,
      });
      handleClear();
      setOpenCreateCourse(false);
      fetchCustomCourses();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to create course.', {
        autoClose: 3000,
        toastId: 'custom-course-error',
        icon: false,
        closeButton: CustomCloseButton,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

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
            <div>SVT Course</div>
            <div className="flex gap-2 text-sm">
              <div className="text-[#8DC63F]">Dashboard</div>
              <div>/</div>
              <div>SVT Course</div>
            </div>
          </div>

          <div className="m-5 bg-white border rounded shadow-sm">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800 text-lg">Courses</div>
                <div className="text-xs text-gray-500 mt-1">View and create custom courses from your mapped volumes.</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-[#8DC63F] text-white rounded"
                  onClick={() => setOpenCreateCourse(true)}
                >
                  <Plus size={15} />
                  Add Course
                </button>
                <BookOpenCheck className="text-[#8DC63F]" size={24} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-100 text-sm text-gray-600 border-b">
                  <tr>
                    <th className="py-2 px-4 font-semibold">Course Name</th>
                    <th className="py-2 px-4 font-semibold">Doctor</th>
                    <th className="py-2 px-4 font-semibold">Volume</th>
                    <th className="py-2 px-4 font-semibold">Trimester</th>
                    <th className="py-2 px-4 font-semibold">Anatomy</th>
                    <th className="py-2 px-4 font-semibold">Module</th>
                    <th className="py-2 px-4 font-semibold">Course Type</th>
                    <th className="py-2 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading ? (
                    <tr>
                      <td colSpan={8} className="py-5 text-center text-gray-500">
                        Loading custom courses...
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-5 text-center text-gray-500">
                        No custom courses found
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.mapping_id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium text-[#8DC63F]">{course.course_name || '-'}</td>
                        <td className="py-2 px-4">{course.doctor_name || '-'}</td>
                        <td className="py-2 px-4">{course.volume_name}</td>
                        <td className="py-2 px-4">{course.trimester}</td>
                        <td className="py-2 px-4">{course.anatomy_type}</td>
                        <td className="py-2 px-4">{course.module_name}</td>
                        <td className="py-2 px-4">{course.course_type}</td>
                        <td className="py-2 px-4 max-w-xs truncate">{course.description || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AddCourse isVisible={openCreateCourse} onClose={handleClosePopup}>
            <>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-800">Create Custom Course</div>
                <button
                  onClick={handleClosePopup}
                  className="text-red-500 hover:bg-red-50 p-1 hover:rounded"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                fullWidth
                size="small"
                label="Course Name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                size="small"
                label="Doctor Name"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                size="small"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                minRows={2}
                className="md:col-span-2"
              />

              <TextField
                select
                fullWidth
                size="small"
                label="Volume"
                name="volume_id"
                value={formData.volume_id}
                onChange={handleChange}
                disabled={volumeLoading}
              >
                <MenuItem value="">Select Volume</MenuItem>
                {volumes.map((volume) => (
                  <MenuItem key={volume.volume_id} value={volume.volume_id}>
                    {volume.volume_name} - {volume.volume_type || 'Anatomy not set'}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                size="small"
                label="Anatomy Type"
                value={formData.anatomy_type}
                InputProps={{ readOnly: true }}
              />

              <TextField
                select
                fullWidth
                size="small"
                label="Course Type"
                name="course_type"
                value={formData.course_type}
                onChange={handleChange}
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
                onChange={handleChange}
                disabled={!formData.volume_id || recordingLoading}
              >
                <MenuItem value="">No Shadow Recording</MenuItem>
                {shadowRecordings.map((recording) => (
                  <MenuItem key={recording.recording_id} value={recording.recording_id}>
                    {recording.recording_name || recording.recording_id?.slice(0, 8).toUpperCase()}
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
                onChange={handleChange}
                disabled={!formData.volume_id || recordingLoading}
              >
                <MenuItem value="">No Step Recording</MenuItem>
                {stepRecordings.map((recording) => (
                  <MenuItem key={recording.recording_id} value={recording.recording_id}>
                    {recording.recording_name || recording.recording_id?.slice(0, 8).toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>

              {formData.volume_id && !recordingLoading && recordings.length === 0 && (
                <div className="md:col-span-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  No recordings found for this volume. You can still create a volume-only course.
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                  onClick={handleClear}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#8DC63F] text-white rounded disabled:opacity-60"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Saving...' : 'Create Course'}
                </button>
              </div>
            </form>
            </>
          </AddCourse>
        </div>
      </div>
    </div>
  );
}

export default CustomCourse;
