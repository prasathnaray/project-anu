import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MenuItem, TextField } from '@mui/material';
import { ClipboardList, RefreshCcw, RotateCcw } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { CreateReattDataAPI, GetReattDataAPI } from '../API/ReattDataAPI';
import GetCoursesAPI from '../API/GetCoursesAPI';
import GetLearningModuleByIdAPI from '../API/GetLearningModuleByIdAPI';
import getResourceBylmandrtAPI from '../API/getResourceBylmandrtAPI';

const RESOURCE_TYPE = 'Test';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const emptyForm = {
  certificate_id: '',
  course_id: '',
  unit_name: '',
  resource_type: RESOURCE_TYPE,
  resource_id: '',
  max_reattempt_count: '',
};

const emptyFilters = {
  uploaded_by: '',
  certificate_id: '',
  course_id: '',
  unit_name: '',
  resource_type: '',
  resource_id: '',
  max_reattempt_count: '',
};

function ReattData() {
  const token = localStorage.getItem('user_token');
  const decoded = token ? jwtDecode(token) : {};
  const userRole = Number(decoded.role);
  const [buttonOpen, setButtonOpen] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [reattData, setReattData] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [learningModules, setLearningModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [optionLoading, setOptionLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const hasFilters = useMemo(
    () => Object.values(filters).some((value) => String(value || '').trim() !== ''),
    [filters]
  );

  const fetchReattData = useCallback(async (nextFilters = emptyFilters) => {
    setListLoading(true);
    try {
      const response = await GetReattDataAPI(nextFilters);
      setReattData(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load reattempt data.');
      setReattData([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const courseOptions = useMemo(() => {
    const courseMap = new Map();

    learningModules.forEach((module) => {
      if (!module.course_name || !UUID_PATTERN.test(String(module.learning_module_id || ''))) {
        return;
      }

      if (!courseMap.has(module.course_name)) {
        courseMap.set(module.course_name, {
          label: module.course_name,
          value: module.learning_module_id,
        });
      }
    });

    return Array.from(courseMap.values());
  }, [learningModules]);

  const courseNameById = useMemo(() => {
    const map = new Map();

    learningModules.forEach((module) => {
      if (module.learning_module_id && module.course_name) {
        map.set(module.learning_module_id, module.course_name);
      }
    });

    return map;
  }, [learningModules]);

  const selectedCourseName = courseNameById.get(formData.course_id) || '';

  const unitOptions = useMemo(() => {
    const unitMap = new Map();

    learningModules
      .filter((module) => !selectedCourseName || module.course_name === selectedCourseName)
      .filter((module) => module.learning_module_id && module.unit_name)
      .forEach((module) => {
        if (!unitMap.has(module.unit_name)) {
          unitMap.set(module.unit_name, {
            label: module.unit_name,
            value: module.unit_name,
            learning_module_id: module.learning_module_id,
          });
        }
      });

    return Array.from(unitMap.values());
  }, [learningModules, selectedCourseName]);

  const selectedUnit = useMemo(
    () => unitOptions.find((unit) => unit.value === formData.unit_name),
    [formData.unit_name, unitOptions]
  );

  const fetchCertificates = useCallback(async () => {
    setOptionLoading(true);
    try {
      const response = await GetCoursesAPI(token);
      setCertificates(Array.isArray(response.data?.result) ? response.data.result : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load certificates.');
      setCertificates([]);
    } finally {
      setOptionLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReattData(emptyFilters);
    fetchCertificates();
  }, [fetchCertificates, fetchReattData]);

  useEffect(() => {
    if (!formData.certificate_id) {
      setLearningModules([]);
      setResources([]);
      return;
    }

    const fetchDependentOptions = async () => {
      setOptionLoading(true);
      try {
        const learningResponse = await GetLearningModuleByIdAPI(token, formData.certificate_id);
        setLearningModules(Array.isArray(learningResponse.data) ? learningResponse.data : []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to load certificate courses.');
        setLearningModules([]);
      } finally {
        setOptionLoading(false);
      }
    };

    fetchDependentOptions();
  }, [formData.certificate_id, token]);

  useEffect(() => {
    if (!selectedUnit?.learning_module_id) {
      setResources([]);
      return;
    }

    const fetchTestResources = async () => {
      setResourceLoading(true);
      try {
        const response = await getResourceBylmandrtAPI(token, selectedUnit.learning_module_id, RESOURCE_TYPE);
        setResources(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to load test resources.');
        setResources([]);
      } finally {
        setResourceLoading(false);
      }
    };

    fetchTestResources();
  }, [selectedUnit?.learning_module_id, token]);

  if (userRole !== 99) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleButtonOpen = () => setButtonOpen((prev) => !prev);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'certificate_id' ? { course_id: '', unit_name: '', resource_id: '', resource_type: RESOURCE_TYPE } : {}),
      ...(name === 'course_id' ? { unit_name: '', resource_id: '', resource_type: RESOURCE_TYPE } : {}),
      ...(name === 'unit_name' ? { resource_id: '', resource_type: RESOURCE_TYPE } : {}),
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearForm = () => {
    setFormData(emptyForm);
    setLearningModules([]);
    setResources([]);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    fetchReattData(emptyFilters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.certificate_id || !formData.course_id || !formData.unit_name || !formData.resource_type || !formData.resource_id || formData.max_reattempt_count === '') {
      toast.error('Certificate, course, unit, resource, and max re-attempt count are required.');
      return;
    }

    if (!UUID_PATTERN.test(formData.course_id.trim())) {
      toast.error('Please select a valid course. Course ID must be a UUID.');
      return;
    }

    const maxReattemptCount = Number(formData.max_reattempt_count);
    if (!Number.isInteger(maxReattemptCount) || maxReattemptCount < 0) {
      toast.error('Max re-attempt count must be a non-negative integer.');
      return;
    }

    const payload = {
      certificate_id: formData.certificate_id.trim(),
      course_id: formData.course_id.trim(),
      unit_name: formData.unit_name.trim(),
      resource_type: RESOURCE_TYPE,
      resource_id: formData.resource_id.trim(),
      max_reattempt_count: maxReattemptCount,
    };

    setSubmitLoading(true);
    try {
      await CreateReattDataAPI(payload);
      toast.success('Reattempt data created successfully.');
      setFormData((prev) => ({
        ...emptyForm,
        certificate_id: prev.certificate_id,
        course_id: prev.course_id,
        unit_name: prev.unit_name,
      }));
      fetchReattData(filters);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create reattempt data.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shortId = (value) => (value ? `${value.slice(0, 8)}...${value.slice(-4)}` : '-');

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
            <div>Reattempt Data</div>
            <div className="flex gap-2 text-sm">
              <div className="text-[#8DC63F]">Home</div>
              <div>/</div>
              <div>Reattempt Data</div>
            </div>
          </div>

          <div className="m-5 grid grid-cols-1 xl:grid-cols-[430px_1fr] gap-5">
            <div className="bg-white border rounded shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="font-semibold text-gray-800">Create Reattempt</div>
                <RotateCcw className="text-[#8DC63F]" size={22} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 gap-4">
                <TextField
                  select
                  fullWidth
                  required
                  size="small"
                  label="Certificate"
                  name="certificate_id"
                  value={formData.certificate_id}
                  onChange={handleFormChange}
                  disabled={optionLoading && certificates.length === 0}
                >
                  <MenuItem value="">Select Certificate</MenuItem>
                  {certificates.map((certificate) => (
                    <MenuItem key={certificate.certificate_id} value={certificate.certificate_id}>
                      {certificate.certificate_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  required
                  size="small"
                  label="Course"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleFormChange}
                  disabled={!formData.certificate_id || optionLoading}
                >
                  <MenuItem value="">Select Course</MenuItem>
                  {courseOptions.map((course) => (
                    <MenuItem key={course.value} value={course.value}>
                      {course.label}
                    </MenuItem>
                  ))}
                </TextField>
                {formData.certificate_id && !optionLoading && courseOptions.length === 0 && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    No courses found for this certificate.
                  </div>
                )}
                <TextField
                  select
                  fullWidth
                  required
                  size="small"
                  label="Unit"
                  name="unit_name"
                  value={formData.unit_name}
                  onChange={handleFormChange}
                  disabled={!formData.course_id || optionLoading}
                >
                  <MenuItem value="">Select Unit</MenuItem>
                  {unitOptions.map((unit) => (
                    <MenuItem key={`${unit.learning_module_id}-${unit.value}`} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Resource Type"
                  name="resource_type"
                  value={RESOURCE_TYPE}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  select
                  fullWidth
                  required
                  size="small"
                  label="Resource"
                  name="resource_id"
                  value={formData.resource_id}
                  onChange={handleFormChange}
                  disabled={!formData.unit_name || resourceLoading}
                >
                  <MenuItem value="">Select Resource</MenuItem>
                  {resources.map((resource) => (
                    <MenuItem key={resource.resource_id} value={resource.resource_id}>
                      {resource.resource_name}
                    </MenuItem>
                  ))}
                </TextField>

                {formData.unit_name && !resourceLoading && resources.length === 0 && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    No Test resources found for this course and unit.
                  </div>
                )}

                <TextField
                  fullWidth
                  required
                  size="small"
                  type="number"
                  label="Max Re-attempt Count"
                  name="max_reattempt_count"
                  value={formData.max_reattempt_count}
                  onChange={handleFormChange}
                  inputProps={{ min: 0, step: 1 }}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                    onClick={handleClearForm}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 text-sm bg-[#8DC63F] text-white rounded disabled:opacity-60 min-w-[130px]"
                  >
                    {submitLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border rounded shadow-sm min-w-0">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={20} className="text-[#8DC63F]" />
                    <div>
                      <div className="font-semibold text-gray-800">Reattempts</div>
                      <div className="text-xs text-gray-500 mt-1">{reattData.length} record(s)</div>
                    </div>
                  </div>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                    onClick={() => fetchReattData(filters)}
                    disabled={listLoading}
                  >
                    <RefreshCcw size={15} />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-3 mt-4">
                  <TextField
                    fullWidth
                    size="small"
                    label="Uploaded By"
                    name="uploaded_by"
                    value={filters.uploaded_by}
                    onChange={handleFilterChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Certificate ID"
                    name="certificate_id"
                    value={filters.certificate_id}
                    onChange={handleFilterChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Course ID"
                    name="course_id"
                    value={filters.course_id}
                    onChange={handleFilterChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Unit"
                    name="unit_name"
                    value={filters.unit_name}
                    onChange={handleFilterChange}
                  />
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Resource Type"
                    name="resource_type"
                    value={filters.resource_type}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value={RESOURCE_TYPE}>{RESOURCE_TYPE}</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    size="small"
                    label="Resource ID"
                    name="resource_id"
                    value={filters.resource_id}
                    onChange={handleFilterChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Max Count"
                    name="max_reattempt_count"
                    value={filters.max_reattempt_count}
                    onChange={handleFilterChange}
                    inputProps={{ min: 0, step: 1 }}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                    onClick={handleClearFilters}
                    disabled={!hasFilters && !listLoading}
                  >
                    Clear Filters
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm bg-[#8DC63F] text-white rounded disabled:opacity-60"
                    onClick={() => fetchReattData(filters)}
                    disabled={listLoading}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 font-semibold">Uploaded By</th>
                      <th className="px-4 py-3 font-semibold">Certificate</th>
                      <th className="px-4 py-3 font-semibold">Course</th>
                      <th className="px-4 py-3 font-semibold">Unit</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Resource</th>
                      <th className="px-4 py-3 font-semibold">Max Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listLoading ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-10 text-center">
                          <ClipLoader color="#8DC63F" size={28} />
                        </td>
                      </tr>
                    ) : reattData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-10 text-center text-sm text-gray-500">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      reattData.map((item) => (
                        <tr key={item.reatt_id} className="border-b text-sm text-gray-700 hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.created_at)}</td>
                          <td className="px-4 py-3">{item.uploaded_by || '-'}</td>
                          <td className="px-4 py-3 font-mono text-xs" title={item.certificate_id}>
                            {shortId(item.certificate_id)}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs" title={item.course_id}>
                            {shortId(item.course_id)}
                          </td>
                          <td className="px-4 py-3">{item.unit_name || '-'}</td>
                          <td className="px-4 py-3">{item.resource_type || '-'}</td>
                          <td className="px-4 py-3 font-mono text-xs" title={item.resource_id}>
                            {shortId(item.resource_id)}
                          </td>
                          <td className="px-4 py-3">{item.max_reattempt_count ?? '-'}</td>
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

export default ReattData;
