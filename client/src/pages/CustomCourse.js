import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MenuItem, TextField } from '@mui/material';
import { ArrowLeft, BookOpenCheck, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { GetClustersAPI, GetClusterRecordingsAPI } from '../API/ClusterAPI';
import { CreateCourseMappingAPI, GetCourseMappingsAPI, TagCustomCourseAPI } from '../API/CourseMappingAPI';
import CustomCloseButton from '../utils/CustomCloseButton';
import AddCourse from '../components/admin/AddCourse';

const CUSTOM_COURSE_MODULE = 'Custom Course';
const COURSE_TYPES = ['Free Scan', 'Single Plane'];
const UNITS = ['BPD & HC', 'AC', 'FL'];

const emptyForm = {
  course_name: '',
  description: '',
  doctor_name: '',
  cluster_id: '',
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
  const [clusters, setClusters] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const recordingRequest = useRef(0);
  const [courses, setCourses] = useState([]);
  const [tagCourse, setTagCourse] = useState(null);
  const [placement, setPlacement] = useState({ certificate_name: 'BTC', unit_name: '' });
  const [tagLoading, setTagLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const location = useLocation();
  const [openCreateCourse, setOpenCreateCourse] = useState(
    Boolean(location.state?.openCreateCourse)
  );
  const [clusterLoading, setClusterLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const shadowRecordings = useMemo(
    () => recordings.filter((recording) => recording.recording_type?.toLowerCase().includes('shadow')),
    [recordings]
  );

  const stepRecordings = useMemo(
    () => recordings.filter((recording) => recording.recording_type?.toLowerCase().includes('step')),
    [recordings]
  );

  const taggedCourses = useMemo(() => courses.filter((course) => course.tagged_unit_name), [courses]);

  const fetchClusters = async () => {
    setClusterLoading(true);
    try {
      const result = await GetClustersAPI();
      setClusters(Array.isArray(result?.data?.data) ? result.data.data : (Array.isArray(result?.data) ? result.data : []));
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to load clusters.');
      setClusters([]);
    } finally {
      setClusterLoading(false);
    }
  };

  const fetchCustomCourses = async () => {
    setListLoading(true);
    try {
      const result = await GetCourseMappingsAPI({ module_name: CUSTOM_COURSE_MODULE });
      setCourses(Array.isArray(result?.data?.data) ? result.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to load custom courses.');
      setCourses([]);
    } finally {
      setListLoading(false);
    }
  };

  const fetchRecordings = async (clusterId) => {
    const requestId = ++recordingRequest.current;
    if (!clusterId) {
      setRecordings([]);
      setRecordingLoading(false);
      return;
    }

    setRecordings([]);
    setRecordingLoading(true);
    try {
      const result = await GetClusterRecordingsAPI(clusterId);
      if (requestId === recordingRequest.current) {
        setRecordings(Array.isArray(result?.data?.data) ? result.data.data : (Array.isArray(result?.data) ? result.data : []));
      }
    } catch (err) {
      if (requestId !== recordingRequest.current) return;
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to load cluster recordings.');
      setRecordings([]);
    } finally {
      if (requestId === recordingRequest.current) setRecordingLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
    fetchCustomCourses();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shadow_recording_id: '',
      step_recording_id: '',
    }));
    fetchRecordings(formData.cluster_id);
  }, [formData.cluster_id]);

  if (![99, 101, 102].includes(userRole)) {
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
    recordingRequest.current += 1;
    setFormData(emptyForm);
    setRecordings([]);
    setRecordingLoading(false);
  };

  const handleClosePopup = () => {
    setOpenCreateCourse(false);
    handleClear();
  };

  const openTagCourse = (course) => {
    setTagCourse(course);
    setPlacement({ certificate_name: 'BTC', unit_name: course.tagged_unit_name || '' });
  };

  const handleTagCourse = async (e) => {
    e.preventDefault();
    if (!placement.unit_name || !tagCourse?.mapping_id) return;
    setTagLoading(true);
    try {
      await TagCustomCourseAPI(tagCourse.mapping_id, placement);
      toast.success('Course tagged successfully.');
      setTagCourse(null);
      fetchCustomCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to tag course.');
    } finally {
      setTagLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course_name || !formData.description || !formData.doctor_name || !formData.cluster_id || !formData.course_type) {
      toast.error('Please fill course name, description, doctor name, cluster, and course type.');
      return;
    }

    const payload = {
      course_name: formData.course_name,
      description: formData.description,
      doctor_name: formData.doctor_name,
      cluster_id: formData.cluster_id,
      module_name: CUSTOM_COURSE_MODULE,
      course_type: formData.course_type,
      shadow_recording_id: formData.shadow_recording_id || null,
      step_recording_id: formData.step_recording_id || null,
    };

    setSubmitLoading(true);
    try {
      const result = await CreateCourseMappingAPI(payload);
      toast.success('Course created successfully.', {
        autoClose: 3000,
        toastId: 'custom-course-created',
        icon: false,
        closeButton: CustomCloseButton,
      });
      handleClear();
      setOpenCreateCourse(false);
      fetchCustomCourses();
      if (userRole !== 99 && result?.data?.data?.mapping_id) {
        openTagCourse(result.data.data);
      }
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
            <div>Customization</div>
            <div className="flex gap-2 text-sm">
              <div className="text-[#8DC63F]">Dashboard</div>
              <div>/</div>
              <div>Customization</div>
            </div>
          </div>

          <div className="m-5 bg-white border rounded shadow-sm">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800 text-lg">Courses</div>
                <div className="text-xs text-gray-500 mt-1">View and create custom courses from your clusters.</div>
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
                    <th className="py-2 px-4 font-semibold">Cluster</th>
                    <th className="py-2 px-4 font-semibold">Course Type</th>
                    <th className="py-2 px-4 font-semibold">Description</th>
                    <th className="py-2 px-4 font-semibold">Tagged As</th>
                    <th className="py-2 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading ? (
                    <tr>
                      <td colSpan={7} className="py-5 text-center text-gray-500">
                        Loading custom courses...
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-5 text-center text-gray-500">
                        No custom courses found
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.mapping_id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium text-[#8DC63F]">{course.course_name || '-'}</td>
                        <td className="py-2 px-4">{course.doctor_name || '-'}</td>
                        <td className="py-2 px-4">{course.cluster_name || course.cluster_id}</td>
                        <td className="py-2 px-4">{course.course_type}</td>
                        <td className="py-2 px-4 max-w-xs truncate">{course.description || '-'}</td>
                        <td className="py-2 px-4">{course.tagged_unit_name ? `${course.tagged_certificate_name} / ${course.tagged_unit_name}` : '-'}</td>
                        <td className="py-2 px-4">
                          {userRole !== 99 && <button className="text-[#8DC63F] font-medium hover:underline" onClick={() => openTagCourse(course)}>
                            {course.tagged_unit_name ? 'Edit Tag' : 'Tag'}
                          </button>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {taggedCourses.length > 0 && (
              <div className="p-5 border-t">
                <h2 className="font-semibold text-gray-800 mb-4">BTC tagged courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {UNITS.map((unit) => (
                    <div key={unit} className="border rounded p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">{unit}</h3>
                      <div className="space-y-2 text-sm">
                        {taggedCourses.filter((course) => course.tagged_unit_name === unit)
                          .map((course) => <div key={course.mapping_id} className="text-[#8DC63F]">{course.course_name}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                label="Cluster"
                name="cluster_id"
                value={formData.cluster_id}
                onChange={handleChange}
                disabled={clusterLoading}
              >
                <MenuItem value="">Select Cluster</MenuItem>
                {clusters.map((cluster) => (
                  <MenuItem key={cluster.cluster_id} value={cluster.cluster_id}>
                    {cluster.cluster_name}
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
                disabled={!formData.cluster_id || recordingLoading}
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
                disabled={!formData.cluster_id || recordingLoading}
              >
                <MenuItem value="">No Step Recording</MenuItem>
                {stepRecordings.map((recording) => (
                  <MenuItem key={recording.recording_id} value={recording.recording_id}>
                    {recording.recording_name || recording.recording_id?.slice(0, 8).toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>

              {formData.cluster_id && !recordingLoading && recordings.length === 0 && (
                <div className="md:col-span-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  No recordings found for this cluster. You can still create the course.
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
          <AddCourse isVisible={Boolean(tagCourse)} onClose={() => setTagCourse(null)}>
            <form onSubmit={handleTagCourse} className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-800">Tag {tagCourse?.course_name || 'Course'}</div>
                <button type="button" onClick={() => setTagCourse(null)} className="text-red-500 p-1"><X size={24} /></button>
              </div>
              <TextField fullWidth size="small" label="Course" value="BTC" InputProps={{ readOnly: true }} />
              <TextField select fullWidth size="small" label="Unit" value={placement.unit_name}
                onChange={(e) => setPlacement((prev) => ({ ...prev, unit_name: e.target.value }))}>
                <MenuItem value="">Select Unit</MenuItem>
                {UNITS.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
              <div className="flex justify-end">
                <button type="submit" disabled={!placement.unit_name || tagLoading}
                  className="px-4 py-2 text-sm bg-[#8DC63F] text-white rounded disabled:opacity-60">
                  {tagLoading ? 'Tagging...' : 'Tag Course'}
                </button>
              </div>
            </form>
          </AddCourse>
        </div>
      </div>
    </div>
  );
}

export default CustomCourse;
