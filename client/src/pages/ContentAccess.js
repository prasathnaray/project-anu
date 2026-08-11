import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Plus, ShieldCheck, X } from 'lucide-react';
import { toast } from 'react-toastify';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import {
  addInstitutionAdmin,
  addSuperAdmin,
  createCourse,
  getAssignments,
  getBatchesForAssignments,
  getCourses,
  getInstitutions,
  getMigrationReview,
  getSuperAdmins,
  getMyCourses,
  getTraineesForAssignments,
  migrateCourseMapping,
  replaceAssignments,
  resolveCourseOwnership,
  resolveVolumeOwnership,
  setCourseState,
  setInstitutionAccess
} from '../API/ContentAccessAPI';

const emptyAssignment = { batchIds: [], assignedTraineeIds: [], excludedTraineeIds: [] };

const rowsFrom = (response) => response?.data?.rows || response?.data?.data?.rows || response?.data?.data || [];

function ContentAccess() {
  const navigate = useNavigate();
  const token = localStorage.getItem('user_token');
  const role = Number(jwtDecode(token).role);
  const isSuperAdmin = role === 99;
  const isEditor = [99, 101, 102].includes(role);
  const [buttonOpen, setButtonOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [review, setReview] = useState({ courses: [], volumes: [], courseMappings: [] });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', courseKind: isSuperAdmin ? 'specialized' : 'institution', curriculumId: '' });
  const [assignmentCourse, setAssignmentCourse] = useState(null);
  const [assignment, setAssignment] = useState(emptyAssignment);
  const [distribution, setDistribution] = useState({});
  const [reviewInstitution, setReviewInstitution] = useState({});
  const [adminForm, setAdminForm] = useState({ institutionId: '', user_name: '', user_email: '', user_contact_num: '' });
  const [createdCredential, setCreatedCredential] = useState(null);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [superAdminForm, setSuperAdminForm] = useState({ user_name: '', user_email: '', user_contact_num: '' });

  const load = async () => {
    setLoading(true);
    try {
      const courseResponse = role === 103 ? await getMyCourses() : await getCourses();
      setCourses(courseResponse.data.data || []);
      if (isSuperAdmin) {
        const [institutionResponse, reviewResponse, superAdminResponse] = await Promise.all([getInstitutions(), getMigrationReview(), getSuperAdmins()]);
        setInstitutions(institutionResponse.data.data || []);
        setReview(reviewResponse.data.data || { courses: [], volumes: [], courseMappings: [] });
        setSuperAdmins(superAdminResponse.data.data || []);
      } else if ([101, 102].includes(role)) {
        const [batchResponse, traineeResponse] = await Promise.all([getBatchesForAssignments(), getTraineesForAssignments()]);
        setBatches(rowsFrom(batchResponse));
        setTrainees(rowsFrom(traineeResponse));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load course access data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createNewCourse = async (event) => {
    event.preventDefault();
    try {
      await createCourse({ ...form, curriculumId: form.curriculumId || null });
      toast.success('Course created as a draft.');
      setShowCreate(false);
      setForm({ name: '', courseKind: isSuperAdmin ? 'specialized' : 'institution', curriculumId: '' });
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create course.');
    }
  };

  const changeState = async (course, state) => {
    try {
      await setCourseState(course.certificate_id, state);
      toast.success(`Course moved to ${state}.`);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update course state.');
    }
  };

  const openAssignments = async (course) => {
    try {
      const response = await getAssignments(course.certificate_id);
      setAssignment(response.data.data || emptyAssignment);
      setAssignmentCourse(course);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load assignments.');
    }
  };

  const saveAssignments = async () => {
    try {
      await replaceAssignments(assignmentCourse.certificate_id, assignment);
      toast.success('Assignments saved.');
      setAssignmentCourse(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save assignments.');
    }
  };

  const toggle = (field, value) => {
    setAssignment((current) => ({
      ...current,
      [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value]
    }));
  };

  const saveDistribution = async (course) => {
    const current = distribution[course.certificate_id] || {
      mode: course.visibility_mode,
      institutionIds: course.institution_ids || []
    };
    try {
      await setInstitutionAccess(course.certificate_id, {
        mode: current.mode,
        institutionIds: current.mode === 'selected' ? current.institutionIds : []
      });
      toast.success('Institution visibility updated.');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update visibility.');
    }
  };

  const setDistributionField = (course, patch) => {
    setDistribution((current) => ({
      ...current,
      [course.certificate_id]: {
        mode: course.visibility_mode,
        institutionIds: course.institution_ids || [],
        ...current[course.certificate_id],
        ...patch
      }
    }));
  };

  const resolveReviewCourse = async (courseId, courseKind, institutionId = null) => {
    try {
      await resolveCourseOwnership(courseId, { courseKind, institutionId });
      toast.success('Ownership resolved; the course remains a draft.');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to resolve ownership.');
    }
  };

  const resolveReviewVolume = async (volumeId, ownerScope, institutionId = null) => {
    try {
      await resolveVolumeOwnership(volumeId, { ownerScope, institutionId });
      toast.success('Volume ownership resolved.');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to resolve volume ownership.');
    }
  };

  const migrateLegacyMapping = async (mapping, courseKind) => {
    try {
      await migrateCourseMapping(mapping.mapping_id, { courseKind });
      toast.success('Legacy mapping migrated to a draft course.');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to migrate course mapping.');
    }
  };

  const submitInstitutionAdmin = async (event) => {
    event.preventDefault();
    try {
      const response = await addInstitutionAdmin(adminForm.institutionId, {
        user_name: adminForm.user_name,
        user_email: adminForm.user_email,
        user_contact_num: adminForm.user_contact_num || null
      });
      setCreatedCredential(response.data.data);
      setAdminForm({ institutionId: '', user_name: '', user_email: '', user_contact_num: '' });
      toast.success('Institution administrator created.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add institution administrator.');
    }
  };

  const submitSuperAdmin = async (event) => {
    event.preventDefault();
    try {
      const response = await addSuperAdmin(superAdminForm);
      setCreatedCredential(response.data.data);
      setSuperAdminForm({ user_name: '', user_email: '', user_contact_num: '' });
      toast.success('Super Admin created.');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add Super Admin.');
    }
  };

  const title = role === 103 ? 'Assigned Courses' : isSuperAdmin ? 'Global Content Access' : 'Institution Course Library';
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <SideBar buttonOpen={buttonOpen} handleButtonOpen={() => setButtonOpen(!buttonOpen)} />
      <main className={`${buttonOpen ? 'md:ml-[220px]' : 'md:ml-[55px]'} pt-20 px-5 pb-10 transition-all`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border rounded-lg shadow-sm p-5 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><ShieldCheck className="text-[#8DC63F]" />{title}</h1>
              <p className="text-sm text-gray-500 mt-1">Ownership, publication, institution eligibility, and trainee assignment are enforced separately.</p>
            </div>
            {isEditor && <button onClick={() => setShowCreate(true)} className="bg-[#8DC63F] text-white px-4 py-2 rounded flex gap-2"><Plus size={18} />Create course</button>}
          </div>

          <div className="mt-5 bg-white border rounded-lg shadow-sm overflow-hidden">
            {loading ? <div className="p-8 text-center text-gray-500">Loading courses…</div> : courses.length === 0 ? <div className="p-8 text-center text-gray-500">No courses are currently available.</div> : (
              <div className="divide-y">
                {courses.map((course) => {
                  const currentDistribution = distribution[course.certificate_id] || { mode: course.visibility_mode, institutionIds: course.institution_ids || [] };
                  return <div key={course.certificate_id} className="p-4">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <div className="font-semibold text-gray-800">{course.certificate_name}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{course.course_kind} · {course.publication_status || 'published'} · {course.owner_scope}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role === 103 && <button onClick={() => navigate(`/cert-course/${course.certificate_id}`)} className="border px-3 py-1.5 rounded flex items-center gap-1">Open <ChevronRight size={15} /></button>}
                        {[101, 102].includes(role) && course.publication_status === 'published' && <button onClick={() => openAssignments(course)} className="border px-3 py-1.5 rounded">Assignments</button>}
                        {isEditor && (isSuperAdmin || course.can_edit) && <>
                          {course.publication_status !== 'published' && <button onClick={() => changeState(course, 'publish')} className="bg-[#8DC63F] text-white px-3 py-1.5 rounded">Publish</button>}
                          {course.publication_status === 'published' && <button onClick={() => changeState(course, 'draft')} className="border px-3 py-1.5 rounded">Unpublish</button>}
                          {course.publication_status !== 'archived' && <button onClick={() => changeState(course, 'archive')} className="border border-red-200 text-red-600 px-3 py-1.5 rounded">Archive</button>}
                        </>}
                      </div>
                    </div>
                    {isSuperAdmin && course.course_kind === 'specialized' && <div className="mt-4 bg-gray-50 border rounded p-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <select className="border rounded px-3 py-2" value={currentDistribution.mode || 'none'} onChange={(e) => setDistributionField(course, { mode: e.target.value, institutionIds: [] })}>
                          <option value="none">Unavailable</option><option value="all">All institutions</option><option value="selected">Selected institutions</option>
                        </select>
                        <button onClick={() => saveDistribution(course)} className="border bg-white px-3 py-2 rounded">Save visibility</button>
                      </div>
                      {currentDistribution.mode === 'selected' && <div className="grid md:grid-cols-3 gap-2 mt-3">
                        {institutions.map((institution) => <label key={institution.center_id} className="text-sm flex items-center gap-2"><input type="checkbox" checked={currentDistribution.institutionIds.includes(institution.center_id)} onChange={() => setDistributionField(course, { institutionIds: currentDistribution.institutionIds.includes(institution.center_id) ? currentDistribution.institutionIds.filter((id) => id !== institution.center_id) : [...currentDistribution.institutionIds, institution.center_id] })} />{institution.center_name}</label>)}
                      </div>}
                    </div>}
                  </div>;
                })}
              </div>
            )}
          </div>

          {isSuperAdmin && <section className="mt-6 bg-white border rounded-lg shadow-sm p-5">
            <h2 className="font-semibold text-gray-800">Add institution administrator</h2>
            <form onSubmit={submitInstitutionAdmin} className="grid md:grid-cols-4 gap-3 mt-3">
              <select required className="border rounded px-3 py-2" value={adminForm.institutionId} onChange={(event) => setAdminForm({ ...adminForm, institutionId: event.target.value })}><option value="">Institution…</option>{institutions.map((institution) => <option key={institution.center_id} value={institution.center_id}>{institution.center_name}</option>)}</select>
              <input required className="border rounded px-3 py-2" placeholder="Administrator name" value={adminForm.user_name} onChange={(event) => setAdminForm({ ...adminForm, user_name: event.target.value })} />
              <input required type="email" className="border rounded px-3 py-2" placeholder="Administrator email" value={adminForm.user_email} onChange={(event) => setAdminForm({ ...adminForm, user_email: event.target.value })} />
              <div className="flex gap-2"><input className="border rounded px-3 py-2 min-w-0" placeholder="Phone (optional)" value={adminForm.user_contact_num} onChange={(event) => setAdminForm({ ...adminForm, user_contact_num: event.target.value })} /><button className="bg-[#8DC63F] text-white px-3 rounded">Add</button></div>
            </form>
            {createdCredential && <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-3 text-sm"><strong>Copy this one-time credential now:</strong> {createdCredential.user.user_email} / <code>{createdCredential.temporaryPassword}</code><button className="ml-3 text-red-600" onClick={() => setCreatedCredential(null)}>Dismiss</button></div>}
          </section>}

          {isSuperAdmin && <section className="mt-6 bg-white border rounded-lg shadow-sm p-5">
            <h2 className="font-semibold text-gray-800">Super Admin accounts</h2>
            <div className="flex flex-wrap gap-2 mt-2">{superAdmins.map((admin) => <span key={admin.user_email} className="text-sm border rounded px-2 py-1">{admin.user_name} · {admin.user_email}</span>)}</div>
            <form onSubmit={submitSuperAdmin} className="grid md:grid-cols-4 gap-3 mt-3">
              <input required className="border rounded px-3 py-2" placeholder="Name" value={superAdminForm.user_name} onChange={(event) => setSuperAdminForm({ ...superAdminForm, user_name: event.target.value })} />
              <input required type="email" className="border rounded px-3 py-2" placeholder="Email" value={superAdminForm.user_email} onChange={(event) => setSuperAdminForm({ ...superAdminForm, user_email: event.target.value })} />
              <input className="border rounded px-3 py-2" placeholder="Phone (optional)" value={superAdminForm.user_contact_num} onChange={(event) => setSuperAdminForm({ ...superAdminForm, user_contact_num: event.target.value })} />
              <button className="bg-[#8DC63F] text-white rounded px-3 py-2">Add Super Admin</button>
            </form>
          </section>}

          {isSuperAdmin && (review.courses.length > 0 || review.volumes.length > 0 || review.courseMappings.length > 0) && <section className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h2 className="font-semibold text-amber-900">Migration review ({review.courses.length + review.volumes.length + review.courseMappings.length})</h2>
            <p className="text-sm text-amber-800 mt-1">Legacy content stays hidden until ownership is explicitly resolved.</p>
            <h3 className="font-medium text-amber-900 mt-4">Courses</h3>
            <div className="mt-2 space-y-2">{review.courses.map((course) => <div key={course.certificate_id} className="bg-white border rounded p-3 flex flex-wrap justify-between gap-3"><span>{course.certificate_name}</span><div className="flex flex-wrap gap-2"><button className="border px-2 py-1 rounded" onClick={() => resolveReviewCourse(course.certificate_id, 'core')}>Global core</button><button className="border px-2 py-1 rounded" onClick={() => resolveReviewCourse(course.certificate_id, 'specialized')}>Global specialized</button><select className="border rounded px-2" value={reviewInstitution[`course-${course.certificate_id}`] || ''} onChange={(event) => setReviewInstitution({ ...reviewInstitution, [`course-${course.certificate_id}`]: event.target.value })}><option value="">Institution…</option>{institutions.map((institution) => <option key={institution.center_id} value={institution.center_id}>{institution.center_name}</option>)}</select><button disabled={!reviewInstitution[`course-${course.certificate_id}`]} className="border px-2 py-1 rounded disabled:opacity-50" onClick={() => resolveReviewCourse(course.certificate_id, 'institution', reviewInstitution[`course-${course.certificate_id}`])}>Set institution</button></div></div>)}</div>
            <h3 className="font-medium text-amber-900 mt-4">Volumes</h3>
            <div className="mt-2 space-y-2">{review.volumes.map((volume) => <div key={volume.volume_id} className="bg-white border rounded p-3 flex flex-wrap justify-between gap-3"><span>{volume.volume_name} <small className="text-gray-400">{volume.added_by}</small></span><div className="flex flex-wrap gap-2"><button className="border px-2 py-1 rounded" onClick={() => resolveReviewVolume(volume.volume_id, 'super_admin')}>Global</button><select className="border rounded px-2" value={reviewInstitution[`volume-${volume.volume_id}`] || ''} onChange={(event) => setReviewInstitution({ ...reviewInstitution, [`volume-${volume.volume_id}`]: event.target.value })}><option value="">Institution…</option>{institutions.map((institution) => <option key={institution.center_id} value={institution.center_id}>{institution.center_name}</option>)}</select><button disabled={!reviewInstitution[`volume-${volume.volume_id}`]} className="border px-2 py-1 rounded disabled:opacity-50" onClick={() => resolveReviewVolume(volume.volume_id, 'institution', reviewInstitution[`volume-${volume.volume_id}`])}>Set institution</button></div></div>)}</div>
            <h3 className="font-medium text-amber-900 mt-4">Legacy course mappings</h3>
            <div className="mt-2 space-y-2">{review.courseMappings.map((mapping) => <div key={mapping.mapping_id} className="bg-white border rounded p-3 flex flex-wrap justify-between gap-3"><span>{mapping.course_name || mapping.volume_name}</span><div className="flex gap-2">{mapping.volume_review_required ? <span className="text-sm text-amber-700">Resolve volume first</span> : mapping.owner_scope === 'institution' ? <button className="border px-2 py-1 rounded" onClick={() => migrateLegacyMapping(mapping, 'institution')}>Migrate institution course</button> : <><button className="border px-2 py-1 rounded" onClick={() => migrateLegacyMapping(mapping, 'core')}>Migrate core</button><button className="border px-2 py-1 rounded" onClick={() => migrateLegacyMapping(mapping, 'specialized')}>Migrate specialized</button></>}</div></div>)}</div>
          </section>}
        </div>
      </main>

      {showCreate && <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"><form onSubmit={createNewCourse} className="bg-white rounded-lg shadow-xl p-5 w-full max-w-lg"><div className="flex justify-between"><h2 className="font-semibold">Create course</h2><button type="button" onClick={() => setShowCreate(false)}><X /></button></div><div className="space-y-4 mt-5"><input className="w-full border rounded px-3 py-2" placeholder="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />{isSuperAdmin && <select className="w-full border rounded px-3 py-2" value={form.courseKind} onChange={(e) => setForm({ ...form, courseKind: e.target.value })}><option value="core">Core / preset</option><option value="specialized">Specialized</option></select>}<input className="w-full border rounded px-3 py-2" placeholder="Existing curriculum UUID (optional)" value={form.curriculumId} onChange={(e) => setForm({ ...form, curriculumId: e.target.value })} /><button className="w-full bg-[#8DC63F] text-white py-2 rounded">Create draft</button></div></form></div>}

      {assignmentCourse && <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-3xl max-h-[85vh] overflow-auto"><div className="flex justify-between"><div><h2 className="font-semibold">Assignments</h2><p className="text-sm text-gray-500">{assignmentCourse.certificate_name}</p></div><button onClick={() => setAssignmentCourse(null)}><X /></button></div><div className="grid md:grid-cols-2 gap-6 mt-5"><div><h3 className="font-medium mb-2">Batches</h3>{batches.map((batch) => <label key={batch.batch_id} className="flex gap-2 py-1 text-sm"><input type="checkbox" checked={assignment.batchIds.includes(batch.batch_id)} onChange={() => toggle('batchIds', batch.batch_id)} />{batch.batch_name}</label>)}</div><div><h3 className="font-medium mb-2">Individual overrides</h3>{trainees.map((trainee) => <div key={trainee.user_email} className="border-b py-2 text-sm"><div>{trainee.user_name} <span className="text-gray-400">{trainee.user_email}</span></div><div className="flex gap-4 mt-1"><label><input type="checkbox" checked={assignment.assignedTraineeIds.includes(trainee.user_email)} onChange={() => { toggle('assignedTraineeIds', trainee.user_email); if (assignment.excludedTraineeIds.includes(trainee.user_email)) toggle('excludedTraineeIds', trainee.user_email); }} /> Add</label><label><input type="checkbox" checked={assignment.excludedTraineeIds.includes(trainee.user_email)} onChange={() => { toggle('excludedTraineeIds', trainee.user_email); if (assignment.assignedTraineeIds.includes(trainee.user_email)) toggle('assignedTraineeIds', trainee.user_email); }} /> Exclude</label></div></div>)}</div></div><button onClick={saveAssignments} className="mt-5 bg-[#8DC63F] text-white px-4 py-2 rounded flex gap-2"><Check size={17} />Save assignments</button></div></div>}
    </div>
  );
}

export default ContentAccess;
