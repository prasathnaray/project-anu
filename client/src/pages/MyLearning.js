import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import {
  LayoutDashboard,
  Notebook,
  BookOpen,
  Dumbbell,
  Eye,
  ClipboardCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronDown,
  Play,
  FileText,
  Brain,
  Pencil,
  Ruler,
  Search,
} from 'lucide-react';

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const CERTS = [
  { id: 'btc', label: 'BTC' },
  { id: 'ufc', label: 'UFC' },
];

const MODULES = {
  btc: [
    { id: 'bpd_hc', label: 'BPD & HC',                         done: 2, total: 30 },
    { id: 'ac',     label: 'AC',                                done: 0, total: 30 },
    { id: 'fl',     label: 'FL',                                done: 0, total: 30 },
    { id: 'step6',  label: 'Presentation, Fetus, Cardiac',      done: 0, total: 0,  locked: true },
  ],
  ufc: [
    { id: 'usp',    label: 'Principles of Ultrasound',          done: 0, total: 2 },
    { id: 'probe',  label: 'Probe Movements',                   done: 0, total: 0,  locked: true },
  ],
};

const TYPE_FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'resource',   label: 'Learning Resource' },
  { id: 'practice',   label: 'Practice' },
  { id: 'interpret',  label: 'Image Interpretation' },
  { id: 'test',       label: 'Test' },
];

const RESOURCES = {
  bpd_hc: [
    // Learning Resources
    { id: 'r1',  name: 'Transthalamic Plane',                    type: 'resource',  topic: 'Fetal Head',          done: false },
    { id: 'r2',  name: 'Bi-Parietal Diameter',                   type: 'resource',  topic: 'Fetal Head',          done: false },
    { id: 'r3',  name: 'Head Circumference',                     type: 'resource',  topic: 'Fetal Head',          done: false },
    { id: 'r4',  name: 'Significance',                           type: 'resource',  topic: 'Fetal Head',          done: false },
    { id: 'r5',  name: 'Anatomical Landmarks and Significance',  type: 'resource',  topic: 'Anatomical Landmarks',done: true  },
    { id: 'r6',  name: 'Mind Sparks - Anatomical Landmarks',     type: 'resource',  topic: 'Anatomical Landmarks',done: false },
    { id: 'r7',  name: 'How To Image The Plane',                 type: 'resource',  topic: 'Imaging the Plane',   done: true  },
    { id: 'r8',  name: 'Mind Sparks - Probe Movements',          type: 'resource',  topic: 'Imaging the Plane',   done: false },
    { id: 'r9',  name: 'How To Acquire The Transthalamic Plane', type: 'resource',  topic: 'Imaging the Plane',   done: false },
    { id: 'r10', name: 'Mind Sparks - Picture Pick',             type: 'resource',  topic: 'Imaging the Plane',   done: false },
    { id: 'r11', name: 'How To Measure BPD',                     type: 'resource',  topic: 'Measurements',        done: false },
    { id: 'r12', name: 'How To Measure HC',                      type: 'resource',  topic: 'Measurements',        done: false },
    { id: 'r13', name: 'Image Diagnosis',                        type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'r14', name: 'Percentile Chart & Significance',        type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'r15', name: 'BPD Chart',                              type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'r16', name: 'HC Chart',                               type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'r17', name: 'Mind Sparks - Chart Interpretation',     type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'r18', name: 'Picture Pick',                           type: 'resource',  topic: 'OB Boosters',         done: false },
    { id: 'r19', name: 'True / False',                           type: 'resource',  topic: 'OB Boosters',         done: false },
    { id: 'r20', name: 'Wordsearch',                             type: 'resource',  topic: 'OB Boosters',         done: false },
    // Practice
    { id: 'p1',  name: 'Practice 1',                             type: 'practice',  topic: '',                    done: false },
    { id: 'p2',  name: 'Practice 2',                             type: 'practice',  topic: '',                    done: false },
    { id: 'p3',  name: 'Practice 3',                             type: 'practice',  topic: '',                    done: false },
    { id: 'p4',  name: 'Practice 4',                             type: 'practice',  topic: '',                    done: false },
    // Image Interpretation
    { id: 'i1',  name: 'Find the Image',                         type: 'interpret', topic: '',                    done: false },
    { id: 'i2',  name: 'Annotation 1',                           type: 'interpret', topic: '',                    done: false },
    { id: 'i3',  name: 'Annotation 2',                           type: 'interpret', topic: '',                    done: false },
    { id: 'i4',  name: 'Measurement',                            type: 'interpret', topic: '',                    done: false },
    // Test
    { id: 't1',  name: 'Test 1',                                 type: 'test',      topic: '',                    done: false },
    { id: 't2',  name: 'Test 2',                                 type: 'test',      topic: '',                    done: false },
  ],
  ac: [
    { id: 'ac_r1',  name: 'Transabdominal plane',                              type: 'resource',  topic: 'Fetal abdomen',       done: false },
    { id: 'ac_r2',  name: 'Abdominal circumference',                           type: 'resource',  topic: 'Fetal abdomen',       done: false },
    { id: 'ac_r3',  name: 'Significance',                                      type: 'resource',  topic: 'Fetal abdomen',       done: false },
    { id: 'ac_r4',  name: 'Anatomical landmarks of the transabdominal plane',  type: 'resource',  topic: 'Anatomical landmarks',done: false },
    { id: 'ac_r5',  name: 'Geometric shapes of key landmarks',                 type: 'resource',  topic: 'Anatomical landmarks',done: false },
    { id: 'ac_r6',  name: 'Mind Sparks - Anatomical Landmarks',                type: 'resource',  topic: 'Anatomical landmarks',done: false },
    { id: 'ac_r7',  name: 'How to acquire the transabdominal plane',           type: 'resource',  topic: 'Imaging the plane',   done: false },
    { id: 'ac_r8',  name: 'Mind Sparks - Probe movements',                     type: 'resource',  topic: 'Imaging the plane',   done: false },
    { id: 'ac_r9',  name: 'Mind Sparks - Picture pick',                        type: 'resource',  topic: 'Imaging the plane',   done: false },
    { id: 'ac_r10', name: 'How to measure AC',                                 type: 'resource',  topic: 'Measurement',         done: false },
    { id: 'ac_r11', name: 'Mind Sparks - Picture Pick',                        type: 'resource',  topic: 'Measurement',         done: false },
    { id: 'ac_r12', name: 'Image Diagnosis',                                   type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'ac_r13', name: 'Percentile Charts & Significance',                  type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'ac_r14', name: 'AC chart',                                          type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'ac_r15', name: 'Mind Sparks - Chart Interpretation',               type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'ac_r16', name: 'Crossword puzzle',                                  type: 'resource',  topic: 'OB Boosters',         done: false },
    { id: 'ac_r17', name: 'True/False',                                        type: 'resource',  topic: 'OB Boosters',         done: false },
    { id: 'ac_r18', name: 'Picture Pick',                                      type: 'resource',  topic: 'OB Boosters',         done: false },
    { id: 'ac_r19', name: 'Plane Acquisition Challenges',                      type: 'resource',  topic: 'Plane Acquisition',   done: false },
    { id: 'ac_r20', name: 'Common Measurement Errors',                         type: 'resource',  topic: 'Plane Acquisition',   done: false },
    { id: 'ac_p1',  name: 'Practice 1',  type: 'practice',  topic: '', done: false },
    { id: 'ac_p2',  name: 'Practice 2',  type: 'practice',  topic: '', done: false },
    { id: 'ac_p3',  name: 'Practice 3',  type: 'practice',  topic: '', done: false },
    { id: 'ac_p4',  name: 'Practice 4',  type: 'practice',  topic: '', done: false },
    { id: 'ac_i1',  name: 'Find the Image',  type: 'interpret', topic: '', done: false },
    { id: 'ac_i2',  name: 'Annotation 1',    type: 'interpret', topic: '', done: false },
    { id: 'ac_i3',  name: 'Annotation 2',    type: 'interpret', topic: '', done: false },
    { id: 'ac_i4',  name: 'Measurement',     type: 'interpret', topic: '', done: false },
    { id: 'ac_t1',  name: 'Test 1', type: 'test', topic: '', done: false },
    { id: 'ac_t2',  name: 'Test 2', type: 'test', topic: '', done: false },
  ],
  fl: [
    { id: 'fl_r1',  name: 'Femur',                                               type: 'resource',  topic: 'Fetal Femur',         done: false },
    { id: 'fl_r2',  name: 'Femur diaphysis',                                     type: 'resource',  topic: 'Fetal Femur',         done: false },
    { id: 'fl_r3',  name: 'Significance',                                        type: 'resource',  topic: 'Fetal Femur',         done: false },
    { id: 'fl_r4',  name: 'Anatomical landmarks of the femur diaphysis plane',   type: 'resource',  topic: 'Anatomical landmarks',done: false },
    { id: 'fl_r5',  name: 'Geometric shapes of key landmarks',                   type: 'resource',  topic: 'Anatomical landmarks',done: false },
    { id: 'fl_r6',  name: 'Mind Sparks - Anatomical Landmarks',                  type: 'resource',  topic: 'Anatomical landmarks',done: false },
    { id: 'fl_r7',  name: 'How to acquire the femur diaphysis plane',            type: 'resource',  topic: 'Imaging the plane',   done: false },
    { id: 'fl_r8',  name: 'Mind Sparks - Probe movements',                       type: 'resource',  topic: 'Imaging the plane',   done: false },
    { id: 'fl_r9',  name: 'Mind Sparks - Picture pick',                          type: 'resource',  topic: 'Imaging the plane',   done: false },
    { id: 'fl_r10', name: 'How to measure FL',                                   type: 'resource',  topic: 'Measurement',         done: false },
    { id: 'fl_r11', name: 'MindSparks - Picture Pick',                           type: 'resource',  topic: 'Measurement',         done: false },
    { id: 'fl_r12', name: 'Plane Acquisition Challenges',                        type: 'resource',  topic: 'Plane Acquisition',   done: false },
    { id: 'fl_r13', name: 'Common Measurement Errors',                           type: 'resource',  topic: 'Plane Acquisition',   done: false },
    { id: 'fl_r14', name: 'Image Diagnosis',                                     type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'fl_r15', name: 'Percentile Charts & Significance',                    type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'fl_r16', name: 'AC chart',                                            type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'fl_r17', name: 'Mind Sparks - Chart Interpretation',                 type: 'resource',  topic: 'Image Diagnosis',     done: false },
    { id: 'fl_r18', name: 'Crossword puzzle', type: 'resource', topic: 'OB Boosters', done: false },
    { id: 'fl_r19', name: 'True/False',        type: 'resource', topic: 'OB Boosters', done: false },
    { id: 'fl_r20', name: 'Picture Pick',      type: 'resource', topic: 'OB Boosters', done: false },
    { id: 'fl_p1',  name: 'Practice 1',  type: 'practice',  topic: '', done: false },
    { id: 'fl_p2',  name: 'Practice 2',  type: 'practice',  topic: '', done: false },
    { id: 'fl_p3',  name: 'Practice 3',  type: 'practice',  topic: '', done: false },
    { id: 'fl_p4',  name: 'Practice 4',  type: 'practice',  topic: '', done: false },
    { id: 'fl_i1',  name: 'Find the Image',  type: 'interpret', topic: '', done: false },
    { id: 'fl_i2',  name: 'Annotation 1',    type: 'interpret', topic: '', done: false },
    { id: 'fl_i3',  name: 'Annotation 2',    type: 'interpret', topic: '', done: false },
    { id: 'fl_i4',  name: 'Measurement',     type: 'interpret', topic: '', done: false },
    { id: 'fl_t1',  name: 'Test 1', type: 'test', topic: '', done: false },
    { id: 'fl_t2',  name: 'Test 2', type: 'test', topic: '', done: false },
  ],
  usp: [
    { id: 'usp_r1', name: 'Ultrasound Wave Physics', type: 'resource', topic: '', done: false },
    { id: 'usp_t1', name: 'Test 1',                  type: 'test',     topic: '', done: false },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const TYPE_META = {
  resource:  { label: 'Learning Resource',     icon: BookOpen,       color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  practice:  { label: 'Practice',              icon: Dumbbell,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
  interpret: { label: 'Image Interpretation',  icon: Eye,            color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  test:      { label: 'Test',                  icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
};

const TOPIC_ICONS = {
  'Fetal Head':          Brain,
  'Anatomical Landmarks': Search,
  'Anatomical landmarks': Search,
  'Imaging the Plane':   Eye,
  'Imaging the plane':   Eye,
  'Measurements':        Ruler,
  'Measurement':         Ruler,
  'Image Diagnosis':     FileText,
  'OB Boosters':         Play,
  'Fetal abdomen':       Brain,
  'Plane Acquisition':   FileText,
  'Fetal Femur':         Brain,
};

function ResourceIcon({ type }) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
      <Icon size={16} className={meta.color} />
    </div>
  );
}

function ResourceTypeBadge({ type }) {
  const meta = TYPE_META[type];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}>
      {meta.label}
    </span>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

function ResourceRow({ r }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border bg-white cursor-pointer
        transition-all hover:shadow-sm group
        ${r.done ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]' : 'border-gray-200 hover:border-[#8DC63F]/50'}`}
    >
      <ResourceIcon type={r.type} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate
          ${r.done ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-[#8DC63F]'}`}>
          {r.name}
        </p>
      </div>

      <ResourceTypeBadge type={r.type} />

      {r.done ? (
        <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
          <CheckCircle2 size={16} className="fill-[#8DC63F] text-white" />
          <span className="text-[11px] font-semibold">Done</span>
        </div>
      ) : (
        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
      )}
    </div>
  );
}

function MyLearning() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const [activeCert,   setActiveCert]   = React.useState('btc');
  const [activeModule, setActiveModule] = React.useState('bpd_hc');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [search,       setSearch]       = React.useState('');
  const [openTopics,   setOpenTopics]   = React.useState({});

  const toggleTopic = (key) =>
    setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

  let token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (!decoded.role) return <Navigate to="/" replace />;

  const modules   = MODULES[activeCert] || [];
  const allRes    = RESOURCES[activeModule] || [];

  const filtered = allRes.filter(r => {
    const matchType   = activeFilter === 'all' || r.type === activeFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const activeModMeta = modules.find(m => m.id === activeModule);
  const doneCount     = allRes.filter(r => r.done).length;
  const totalCount    = allRes.length;
  const pct           = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  // Group: LR items → keyed by topic; Practice/Interpret/Test → keyed by their type string
  const grouped = filtered.reduce((acc, r) => {
    const key = r.type === 'resource'
      ? (r.topic || 'Learning Resource')   // LR always bucketed by topic
      : r.type;                             // others bucketed by type
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const handleCertChange = (certId) => {
    setActiveCert(certId);
    const firstUnlocked = (MODULES[certId] || []).find(m => !m.locked);
    setActiveModule(firstUnlocked?.id || MODULES[certId]?.[0]?.id || '');
    setActiveFilter('all');
    setSearch('');
    setOpenTopics({});
  };

  const handleModuleChange = (mod) => {
    if (mod.locked) return;
    setActiveModule(mod.id);
    setActiveFilter('all');
    setSearch('');
    setOpenTopics({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">

        {/* ── Sidebar ── */}
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>

        {/* ── Main content ── */}
        <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow`}>

          {/* Breadcrumb */}
          <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border-b text-sm">
            <LayoutDashboard size={15} />
            Dashboard /
            <Notebook size={15} />
            <span className="text-gray-500 font-medium">My Learning</span>
          </div>

          <div className="p-5">

            {/* ── Cert tabs ── */}
            <div className="flex items-center gap-3 mb-5">
              {CERTS.map(cert => (
                <button
                  key={cert.id}
                  onClick={() => handleCertChange(cert.id)}
                  className={`px-5 py-1.5 rounded-2xl border text-sm font-medium cursor-pointer transition-colors
                    ${activeCert === cert.id
                      ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
                      : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
                    }`}
                >
                  {cert.label}
                </button>
              ))}
            </div>

            {/* ── 3-col grid ── */}
            <div className="grid grid-cols-3 gap-5">

              {/* ── Col 1 · Module list ── */}
              <div className="col-span-1 border rounded-xl bg-white p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

                <div className="flex flex-col gap-2">
                  {modules.map(mod => {
                    const isActive = activeModule === mod.id;
                    const modPct   = mod.total ? Math.round((mod.done / mod.total) * 100) : 0;

                    return (
                      <button
                        key={mod.id}
                        onClick={() => handleModuleChange(mod)}
                        disabled={mod.locked}
                        className={`w-full text-left p-3 rounded-lg border transition-all
                          ${mod.locked
                            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                            : isActive
                              ? 'border-[#8DC63F] bg-[#8DC63F]/5 cursor-pointer'
                              : 'border-gray-200 hover:border-[#8DC63F] hover:bg-[#8DC63F]/5 cursor-pointer'
                          }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-sm font-medium ${isActive ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
                            {mod.label}
                          </span>
                          {mod.locked
                            ? <Lock size={13} className="text-gray-400" />
                            : <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
                                {mod.done}/{mod.total}
                              </span>
                          }
                        </div>

                        {/* Progress bar */}
                        {!mod.locked && (
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
                              style={{ width: `${modPct}%` }}
                            />
                          </div>
                        )}
                        {mod.locked && (
                          <p className="text-[10px] text-gray-400 mt-0.5">Coming soon</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Module progress summary */}
                {activeModMeta && !activeModMeta.locked && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-500">{activeModMeta.label}</span>
                      <span className="text-xs font-semibold text-[#8DC63F]">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#8DC63F] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">{doneCount} of {totalCount} resources completed</p>
                  </div>
                )}
              </div>

              {/* ── Col 2-3 · Resource list ── */}
              <div className="col-span-2">

                {/* Filter row + search */}
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {TYPE_FILTERS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-3 py-1.5 rounded-2xl border text-xs font-medium cursor-pointer transition-colors
                          ${activeFilter === f.id
                            ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
                            : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
                          }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#8DC63F] w-48 transition-colors"
                    />
                  </div>
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 border rounded-xl bg-white">
                    <BookOpen size={36} className="mb-3 text-gray-300" />
                    <p className="text-sm font-medium">No resources found</p>
                    <p className="text-xs mt-1">Try adjusting your filter or search</p>
                  </div>
                )}

                {/* ── Grouped resource cards (accordion for LR topics) ── */}
                {Object.entries(grouped).map(([topic, items]) => {

                  // Practice / Image Interpretation / Test → render flat with a type header
                  const isTypeBucket = items[0]?.type !== 'resource';
                  if (isTypeBucket) {
                    const meta = TYPE_META[items[0].type];
                    const Icon = meta.icon;
                    return (
                      <div key={topic} className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={13} className={meta.color} />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {meta.label}
                          </span>
                          <div className="flex-1 h-px bg-gray-100" />
                          <span className="text-[10px] text-gray-400">{items.length}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {items.map(r => <ResourceRow key={r.id} r={r} />)}
                        </div>
                      </div>
                    );
                  }

                  // Learning Resources with a topic → accordion
                  const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
                  const isOpen    = !!openTopics[topic];
                  const topicDone = items.filter(r => r.done).length;

                  return (
                    <div key={topic} className="mb-3">
                      {/* Accordion header */}
                      <button
                        onClick={() => toggleTopic(topic)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
                          ${isOpen
                            ? 'border-[#8DC63F] bg-[#8DC63F]/5'
                            : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
                          }`}
                      >
                        {/* Topic icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                          ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <TopicIcon size={15} />
                        </div>

                        {/* Label */}
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-semibold transition-colors
                            ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
                            {topic}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {topicDone}/{items.length} completed
                          </p>
                        </div>

                        {/* Mini progress bar */}
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
                          <div
                            className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
                            style={{ width: `${items.length ? Math.round((topicDone / items.length) * 100) : 0}%` }}
                          />
                        </div>

                        {/* Chevron */}
                        {isOpen
                          ? <ChevronDown size={16} className="text-[#8DC63F] flex-shrink-0 transition-transform" />
                          : <ChevronRight size={16} className="text-gray-300 flex-shrink-0 transition-transform" />
                        }
                      </button>

                      {/* Expanded resources */}
                      {isOpen && (
                        <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
                          {items.map(r => <ResourceRow key={r.id} r={r} />)}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
              {/* end col 2-3 */}

            </div>
            {/* end grid */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLearning;