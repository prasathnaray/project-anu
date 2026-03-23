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
} from 'lucide-react';

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const CERTS = [
  { id: 'btc', label: 'BTC' },
  { id: 'ufc', label: 'UFC' },
];

const MODULES = {
  btc: [
    { id: 'bpd_hc', label: 'BPD & HC',                    course: 'Second Trimester · Biometry' },
    { id: 'ac',     label: 'AC',                           course: 'Second Trimester · Biometry' },
    { id: 'fl',     label: 'FL',                           course: 'Second Trimester · Biometry' },
    { id: 'step6',  label: 'Presentation, Fetus, Cardiac', course: 'Second Trimester · 6-Step Approach', locked: true },
  ],
  ufc: [
    { id: 'usp',   label: 'Principles of Ultrasound', course: 'Principles of Ultrasound' },
    { id: 'probe', label: 'Probe Movements',          course: 'Probe Movements', locked: true },
  ],
};

const RESOURCES = {
  bpd_hc: [
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
    { id: 'p1',  name: 'Practice 1',    type: 'practice',  topic: '', done: false },
    { id: 'p2',  name: 'Practice 2',    type: 'practice',  topic: '', done: false },
    { id: 'p3',  name: 'Practice 3',    type: 'practice',  topic: '', done: false },
    { id: 'p4',  name: 'Practice 4',    type: 'practice',  topic: '', done: false },
    { id: 'i1',  name: 'Find the Image', type: 'interpret', topic: '', done: false },
    { id: 'i2',  name: 'Annotation 1',   type: 'interpret', topic: '', done: false },
    { id: 'i3',  name: 'Annotation 2',   type: 'interpret', topic: '', done: false },
    { id: 'i4',  name: 'Measurement',    type: 'interpret', topic: '', done: false },
    { id: 't1',  name: 'Test 1', type: 'test', topic: '', done: false },
    { id: 't2',  name: 'Test 2', type: 'test', topic: '', done: false },
  ],
  ac: [
    { id: 'ac_r1',  name: 'Transabdominal plane',                             type: 'resource',  topic: 'Fetal abdomen',        done: false },
    { id: 'ac_r2',  name: 'Abdominal circumference',                          type: 'resource',  topic: 'Fetal abdomen',        done: false },
    { id: 'ac_r3',  name: 'Significance',                                     type: 'resource',  topic: 'Fetal abdomen',        done: false },
    { id: 'ac_r4',  name: 'Anatomical landmarks of the transabdominal plane', type: 'resource',  topic: 'Anatomical landmarks', done: false },
    { id: 'ac_r5',  name: 'Geometric shapes of key landmarks',                type: 'resource',  topic: 'Anatomical landmarks', done: false },
    { id: 'ac_r6',  name: 'Mind Sparks - Anatomical Landmarks',               type: 'resource',  topic: 'Anatomical landmarks', done: false },
    { id: 'ac_r7',  name: 'How to acquire the transabdominal plane',          type: 'resource',  topic: 'Imaging the plane',    done: false },
    { id: 'ac_r8',  name: 'Mind Sparks - Probe movements',                    type: 'resource',  topic: 'Imaging the plane',    done: false },
    { id: 'ac_r9',  name: 'Mind Sparks - Picture pick',                       type: 'resource',  topic: 'Imaging the plane',    done: false },
    { id: 'ac_r10', name: 'How to measure AC',                                type: 'resource',  topic: 'Measurement',          done: false },
    { id: 'ac_r11', name: 'Mind Sparks - Picture Pick',                       type: 'resource',  topic: 'Measurement',          done: false },
    { id: 'ac_r12', name: 'Image Diagnosis',                                  type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'ac_r13', name: 'Percentile Charts & Significance',                 type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'ac_r14', name: 'AC chart',                                         type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'ac_r15', name: 'Mind Sparks - Chart Interpretation',               type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'ac_r16', name: 'Crossword puzzle',             type: 'resource', topic: 'OB Boosters',       done: false },
    { id: 'ac_r17', name: 'True/False',                   type: 'resource', topic: 'OB Boosters',       done: false },
    { id: 'ac_r18', name: 'Picture Pick',                 type: 'resource', topic: 'OB Boosters',       done: false },
    { id: 'ac_r19', name: 'Plane Acquisition Challenges', type: 'resource', topic: 'Plane Acquisition', done: false },
    { id: 'ac_r20', name: 'Common Measurement Errors',    type: 'resource', topic: 'Plane Acquisition', done: false },
    { id: 'ac_p1',  name: 'Practice 1',    type: 'practice',  topic: '', done: false },
    { id: 'ac_p2',  name: 'Practice 2',    type: 'practice',  topic: '', done: false },
    { id: 'ac_p3',  name: 'Practice 3',    type: 'practice',  topic: '', done: false },
    { id: 'ac_p4',  name: 'Practice 4',    type: 'practice',  topic: '', done: false },
    { id: 'ac_i1',  name: 'Find the Image', type: 'interpret', topic: '', done: false },
    { id: 'ac_i2',  name: 'Annotation 1',   type: 'interpret', topic: '', done: false },
    { id: 'ac_i3',  name: 'Annotation 2',   type: 'interpret', topic: '', done: false },
    { id: 'ac_i4',  name: 'Measurement',    type: 'interpret', topic: '', done: false },
    { id: 'ac_t1',  name: 'Test 1', type: 'test', topic: '', done: false },
    { id: 'ac_t2',  name: 'Test 2', type: 'test', topic: '', done: false },
  ],
  fl: [
    { id: 'fl_r1',  name: 'Femur',                                             type: 'resource',  topic: 'Fetal Femur',          done: false },
    { id: 'fl_r2',  name: 'Femur diaphysis',                                   type: 'resource',  topic: 'Fetal Femur',          done: false },
    { id: 'fl_r3',  name: 'Significance',                                      type: 'resource',  topic: 'Fetal Femur',          done: false },
    { id: 'fl_r4',  name: 'Anatomical landmarks of the femur diaphysis plane', type: 'resource',  topic: 'Anatomical landmarks', done: false },
    { id: 'fl_r5',  name: 'Geometric shapes of key landmarks',                 type: 'resource',  topic: 'Anatomical landmarks', done: false },
    { id: 'fl_r6',  name: 'Mind Sparks - Anatomical Landmarks',                type: 'resource',  topic: 'Anatomical landmarks', done: false },
    { id: 'fl_r7',  name: 'How to acquire the femur diaphysis plane',          type: 'resource',  topic: 'Imaging the plane',    done: false },
    { id: 'fl_r8',  name: 'Mind Sparks - Probe movements',                     type: 'resource',  topic: 'Imaging the plane',    done: false },
    { id: 'fl_r9',  name: 'Mind Sparks - Picture pick',                        type: 'resource',  topic: 'Imaging the plane',    done: false },
    { id: 'fl_r10', name: 'How to measure FL',                                 type: 'resource',  topic: 'Measurement',          done: false },
    { id: 'fl_r11', name: 'MindSparks - Picture Pick',                         type: 'resource',  topic: 'Measurement',          done: false },
    { id: 'fl_r12', name: 'Plane Acquisition Challenges',                      type: 'resource',  topic: 'Plane Acquisition',    done: false },
    { id: 'fl_r13', name: 'Common Measurement Errors',                         type: 'resource',  topic: 'Plane Acquisition',    done: false },
    { id: 'fl_r14', name: 'Image Diagnosis',                                   type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'fl_r15', name: 'Percentile Charts & Significance',                  type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'fl_r16', name: 'AC chart',                                          type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'fl_r17', name: 'Mind Sparks - Chart Interpretation',                type: 'resource',  topic: 'Image Diagnosis',      done: false },
    { id: 'fl_r18', name: 'Crossword puzzle', type: 'resource', topic: 'OB Boosters', done: false },
    { id: 'fl_r19', name: 'True/False',        type: 'resource', topic: 'OB Boosters', done: false },
    { id: 'fl_r20', name: 'Picture Pick',      type: 'resource', topic: 'OB Boosters', done: false },
    { id: 'fl_p1',  name: 'Practice 1',    type: 'practice',  topic: '', done: false },
    { id: 'fl_p2',  name: 'Practice 2',    type: 'practice',  topic: '', done: false },
    { id: 'fl_p3',  name: 'Practice 3',    type: 'practice',  topic: '', done: false },
    { id: 'fl_p4',  name: 'Practice 4',    type: 'practice',  topic: '', done: false },
    { id: 'fl_i1',  name: 'Find the Image', type: 'interpret', topic: '', done: false },
    { id: 'fl_i2',  name: 'Annotation 1',   type: 'interpret', topic: '', done: false },
    { id: 'fl_i3',  name: 'Annotation 2',   type: 'interpret', topic: '', done: false },
    { id: 'fl_i4',  name: 'Measurement',    type: 'interpret', topic: '', done: false },
    { id: 'fl_t1',  name: 'Test 1', type: 'test', topic: '', done: false },
    { id: 'fl_t2',  name: 'Test 2', type: 'test', topic: '', done: false },
  ],
  usp: [
    { id: 'usp_r1', name: 'Ultrasound Wave Physics', type: 'resource', topic: '', done: false },
    { id: 'usp_t1', name: 'Test 1',                  type: 'test',     topic: '', done: false },
  ],
};

// completed resource IDs + their dates
const COMPLETED_IDS   = new Set(['r5', 'r7']);
const COMPLETED_DATES = { r5: '2026-03-18', r7: '2026-03-18' };

// ─── META ─────────────────────────────────────────────────────────────────────

const TYPE_META = {
  resource:  { label: 'Learning Resource',    icon: BookOpen,       color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  practice:  { label: 'Practice',             icon: Dumbbell,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
  interpret: { label: 'Image Interpretation', icon: Eye,            color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  test:      { label: 'Test',                 icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function calcCertProgress(certId) {
  let total = 0, done = 0;
  (MODULES[certId] || []).forEach(m => {
    const res = RESOURCES[m.id] || [];
    total += res.length;
    done  += res.filter(r => COMPLETED_IDS.has(r.id)).length;
  });
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

// ─── SVG RING ─────────────────────────────────────────────────────────────────

function ProgressRing({ pct }) {
  const r = 44, circ = 2 * Math.PI * r;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100" className="flex-shrink-0">
      <circle cx={50} cy={50} r={r} fill="none" stroke="#e5e7eb" strokeWidth={8} />
      <circle
        cx={50} cy={50} r={r}
        fill="none"
        stroke="#8DC63F"
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={50} y={54} textAnchor="middle" fill="#1f2937" fontSize={16} fontWeight="700" fontFamily="inherit">
        {pct}%
      </text>
    </svg>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

function MyProgress() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const [activeCert, setActiveCert] = React.useState('btc');

  let token = localStorage.getItem("user_token");
  const decoded = jwtDecode(token);
  if (!decoded.role) return <Navigate to="/" replace />;

  const modules      = MODULES[activeCert] || [];
  const certProgress = calcCertProgress(activeCert);

  // all completed resources across the cert with their module label
  const completedList = modules.flatMap(m =>
    (RESOURCES[m.id] || [])
      .filter(r => COMPLETED_IDS.has(r.id))
      .map(r => ({ ...r, moduleLabel: m.label }))
  );

  const handleCertChange = (certId) => setActiveCert(certId);

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
            <span className="text-gray-700 font-medium">My Progress</span>
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

            {/* ── 1. Overall progress card ── */}
            <div className="bg-white border rounded-xl p-5 mb-5 flex items-center gap-8">
              <ProgressRing pct={certProgress.pct} />
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-800 mb-1">
                  {CERTS.find(c => c.id === activeCert)?.label} Certificate
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {certProgress.done} of {certProgress.total} resources completed
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#8DC63F] transition-all duration-700"
                    style={{ width: `${certProgress.pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── 2. Module cards (grid 2-col) ── */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {modules.map(mod => {
                const res      = RESOURCES[mod.id] || [];
                const done     = res.filter(r => COMPLETED_IDS.has(r.id)).length;
                const pct      = res.length ? Math.round((done / res.length) * 100) : 0;
                const empty    = res.length === 0;

                // type breakdown
                const byType     = res.reduce((a, r) => { a[r.type] = (a[r.type] || 0) + 1; return a; }, {});
                const doneByType = res.filter(r => COMPLETED_IDS.has(r.id))
                                      .reduce((a, r) => { a[r.type] = (a[r.type] || 0) + 1; return a; }, {});

                return (
                  <div
                    key={mod.id}
                    className={`bg-white rounded-xl border p-4 ${empty ? 'opacity-50' : ''}`}
                  >
                    {/* Module header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className={`text-sm font-semibold ${empty ? 'text-gray-400' : 'text-gray-700'}`}>
                          {mod.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{mod.course}</p>
                      </div>
                      {empty ? (
                        <div className="flex items-center gap-1">
                          <Lock size={12} className="text-gray-400" />
                          <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
                            Coming soon
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-[#8DC63F] bg-[#8DC63F]/10 border border-[#8DC63F]/20 rounded-full px-2 py-0.5">
                          {done}/{res.length}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {!empty && (
                      <>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                          <div
                            className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        {/* Type breakdown badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(byType).map(([typeKey, cnt]) => {
                            const meta     = TYPE_META[typeKey];
                            const typeDone = doneByType[typeKey] || 0;
                            const Icon     = meta.icon;
                            return (
                              <span
                                key={typeKey}
                                className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}
                              >
                                <Icon size={10} />
                                {typeDone}/{cnt} {meta.label}
                              </span>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── 3. Completed resources list ── */}
            {completedList.length > 0 && (
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-4">Completed Resources</p>
                <div className="flex flex-col">
                  {completedList.map((r, i) => {
                    const meta = TYPE_META[r.type];
                    const Icon = meta.icon;
                    return (
                      <div
                        key={r.id}
                        className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        {/* Done indicator */}
                        <div className="w-7 h-7 rounded-full bg-[#8DC63F]/10 border border-[#8DC63F]/25 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 size={14} className="text-[#8DC63F]" />
                        </div>

                        {/* Name + topic + module */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{r.name.trim()}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {r.topic ? `${r.topic} · ` : ''}{r.moduleLabel}
                          </p>
                        </div>

                        {/* Type badge */}
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${meta.bg} ${meta.color} ${meta.border}`}>
                          <Icon size={10} />
                          {meta.label}
                        </span>

                        {/* Date */}
                        <span className="text-[11px] text-[#8DC63F] font-medium flex-shrink-0">
                          {COMPLETED_DATES[r.id]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
          {/* end p-5 */}

        </div>
        {/* end main */}

      </div>
    </div>
  );
}

export default MyProgress;