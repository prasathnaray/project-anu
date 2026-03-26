// import { jwtDecode } from 'jwt-decode';
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import NavBar from '../components/navBar';
// import SideBar from '../components/sideBar';
// import {
//   LayoutDashboard,
//   Notebook,
//   BookOpen,
//   Dumbbell,
//   Eye,
//   ClipboardCheck,
//   CheckCircle2,
//   Lock,
//   ChevronRight,
//   ChevronDown,
//   Play,
//   FileText,
//   Brain,
//   Pencil,
//   Ruler,
//   Search,
// } from 'lucide-react';

// // ─── STATIC DATA ─────────────────────────────────────────────────────────────

// const CERTS = [
//   { id: 'btc', label: 'BTC' },
//   { id: 'ufc', label: 'UFC' },
// ];

// const MODULES = {
//   btc: [
//     { id: 'bpd_hc', label: 'BPD & HC',                         done: 2, total: 30 },
//     { id: 'ac',     label: 'AC',                                done: 0, total: 30 },
//     { id: 'fl',     label: 'FL',                                done: 0, total: 30 },
//     { id: 'step6',  label: 'Presentation, Fetus, Cardiac',      done: 0, total: 0,  locked: true },
//   ],
//   ufc: [
//     { id: 'usp',    label: 'Principles of Ultrasound',          done: 0, total: 2 },
//     { id: 'probe',  label: 'Probe Movements',                   done: 0, total: 0,  locked: true },
//   ],
// };

// const TYPE_FILTERS = [
//   { id: 'all',        label: 'All' },
//   { id: 'resource',   label: 'Learning Resource' },
//   { id: 'practice',   label: 'Practice' },
//   { id: 'interpret',  label: 'Image Interpretation' },
//   { id: 'test',       label: 'Test' },
// ];

// const RESOURCES = {
//   bpd_hc: [
//     // Learning Resources
//     { id: 'r1',  name: 'Transthalamic Plane',                    type: 'resource',  topic: 'Fetal Head',          done: false },
//     { id: 'r2',  name: 'Bi-Parietal Diameter',                   type: 'resource',  topic: 'Fetal Head',          done: false },
//     { id: 'r3',  name: 'Head Circumference',                     type: 'resource',  topic: 'Fetal Head',          done: false },
//     { id: 'r4',  name: 'Significance',                           type: 'resource',  topic: 'Fetal Head',          done: false },
//     { id: 'r5',  name: 'Anatomical Landmarks and Significance',  type: 'resource',  topic: 'Anatomical Landmarks',done: true  },
//     { id: 'r6',  name: 'Mind Sparks - Anatomical Landmarks',     type: 'resource',  topic: 'Anatomical Landmarks',done: false },
//     { id: 'r7',  name: 'How To Image The Plane',                 type: 'resource',  topic: 'Imaging the Plane',   done: true  },
//     { id: 'r8',  name: 'Mind Sparks - Probe Movements',          type: 'resource',  topic: 'Imaging the Plane',   done: false },
//     { id: 'r9',  name: 'How To Acquire The Transthalamic Plane', type: 'resource',  topic: 'Imaging the Plane',   done: false },
//     { id: 'r10', name: 'Mind Sparks - Picture Pick',             type: 'resource',  topic: 'Imaging the Plane',   done: false },
//     { id: 'r11', name: 'How To Measure BPD',                     type: 'resource',  topic: 'Measurements',        done: false },
//     { id: 'r12', name: 'How To Measure HC',                      type: 'resource',  topic: 'Measurements',        done: false },
//     { id: 'r13', name: 'Image Diagnosis',                        type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'r14', name: 'Percentile Chart & Significance',        type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'r15', name: 'BPD Chart',                              type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'r16', name: 'HC Chart',                               type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'r17', name: 'Mind Sparks - Chart Interpretation',     type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'r18', name: 'Picture Pick',                           type: 'resource',  topic: 'OB Boosters',         done: false },
//     { id: 'r19', name: 'True / False',                           type: 'resource',  topic: 'OB Boosters',         done: false },
//     { id: 'r20', name: 'Wordsearch',                             type: 'resource',  topic: 'OB Boosters',         done: false },
//     // Practice
//     { id: 'p1',  name: 'Practice 1',                             type: 'practice',  topic: '',                    done: false },
//     { id: 'p2',  name: 'Practice 2',                             type: 'practice',  topic: '',                    done: false },
//     { id: 'p3',  name: 'Practice 3',                             type: 'practice',  topic: '',                    done: false },
//     { id: 'p4',  name: 'Practice 4',                             type: 'practice',  topic: '',                    done: false },
//     // Image Interpretation
//     { id: 'i1',  name: 'Find the Image',                         type: 'interpret', topic: '',                    done: false },
//     { id: 'i2',  name: 'Annotation 1',                           type: 'interpret', topic: '',                    done: false },
//     { id: 'i3',  name: 'Annotation 2',                           type: 'interpret', topic: '',                    done: false },
//     { id: 'i4',  name: 'Measurement',                            type: 'interpret', topic: '',                    done: false },
//     // Test
//     { id: 't1',  name: 'Test 1',                                 type: 'test',      topic: '',                    done: false },
//     { id: 't2',  name: 'Test 2',                                 type: 'test',      topic: '',                    done: false },
//   ],
//   ac: [
//     { id: 'ac_r1',  name: 'Transabdominal plane',                              type: 'resource',  topic: 'Fetal abdomen',       done: false },
//     { id: 'ac_r2',  name: 'Abdominal circumference',                           type: 'resource',  topic: 'Fetal abdomen',       done: false },
//     { id: 'ac_r3',  name: 'Significance',                                      type: 'resource',  topic: 'Fetal abdomen',       done: false },
//     { id: 'ac_r4',  name: 'Anatomical landmarks of the transabdominal plane',  type: 'resource',  topic: 'Anatomical landmarks',done: false },
//     { id: 'ac_r5',  name: 'Geometric shapes of key landmarks',                 type: 'resource',  topic: 'Anatomical landmarks',done: false },
//     { id: 'ac_r6',  name: 'Mind Sparks - Anatomical Landmarks',                type: 'resource',  topic: 'Anatomical landmarks',done: false },
//     { id: 'ac_r7',  name: 'How to acquire the transabdominal plane',           type: 'resource',  topic: 'Imaging the plane',   done: false },
//     { id: 'ac_r8',  name: 'Mind Sparks - Probe movements',                     type: 'resource',  topic: 'Imaging the plane',   done: false },
//     { id: 'ac_r9',  name: 'Mind Sparks - Picture pick',                        type: 'resource',  topic: 'Imaging the plane',   done: false },
//     { id: 'ac_r10', name: 'How to measure AC',                                 type: 'resource',  topic: 'Measurement',         done: false },
//     { id: 'ac_r11', name: 'Mind Sparks - Picture Pick',                        type: 'resource',  topic: 'Measurement',         done: false },
//     { id: 'ac_r12', name: 'Image Diagnosis',                                   type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'ac_r13', name: 'Percentile Charts & Significance',                  type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'ac_r14', name: 'AC chart',                                          type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'ac_r15', name: 'Mind Sparks - Chart Interpretation',               type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'ac_r16', name: 'Crossword puzzle',                                  type: 'resource',  topic: 'OB Boosters',         done: false },
//     { id: 'ac_r17', name: 'True/False',                                        type: 'resource',  topic: 'OB Boosters',         done: false },
//     { id: 'ac_r18', name: 'Picture Pick',                                      type: 'resource',  topic: 'OB Boosters',         done: false },
//     { id: 'ac_r19', name: 'Plane Acquisition Challenges',                      type: 'resource',  topic: 'Plane Acquisition',   done: false },
//     { id: 'ac_r20', name: 'Common Measurement Errors',                         type: 'resource',  topic: 'Plane Acquisition',   done: false },
//     { id: 'ac_p1',  name: 'Practice 1',  type: 'practice',  topic: '', done: false },
//     { id: 'ac_p2',  name: 'Practice 2',  type: 'practice',  topic: '', done: false },
//     { id: 'ac_p3',  name: 'Practice 3',  type: 'practice',  topic: '', done: false },
//     { id: 'ac_p4',  name: 'Practice 4',  type: 'practice',  topic: '', done: false },
//     { id: 'ac_i1',  name: 'Find the Image',  type: 'interpret', topic: '', done: false },
//     { id: 'ac_i2',  name: 'Annotation 1',    type: 'interpret', topic: '', done: false },
//     { id: 'ac_i3',  name: 'Annotation 2',    type: 'interpret', topic: '', done: false },
//     { id: 'ac_i4',  name: 'Measurement',     type: 'interpret', topic: '', done: false },
//     { id: 'ac_t1',  name: 'Test 1', type: 'test', topic: '', done: false },
//     { id: 'ac_t2',  name: 'Test 2', type: 'test', topic: '', done: false },
//   ],
//   fl: [
//     { id: 'fl_r1',  name: 'Femur',                                               type: 'resource',  topic: 'Fetal Femur',         done: false },
//     { id: 'fl_r2',  name: 'Femur diaphysis',                                     type: 'resource',  topic: 'Fetal Femur',         done: false },
//     { id: 'fl_r3',  name: 'Significance',                                        type: 'resource',  topic: 'Fetal Femur',         done: false },
//     { id: 'fl_r4',  name: 'Anatomical landmarks of the femur diaphysis plane',   type: 'resource',  topic: 'Anatomical landmarks',done: false },
//     { id: 'fl_r5',  name: 'Geometric shapes of key landmarks',                   type: 'resource',  topic: 'Anatomical landmarks',done: false },
//     { id: 'fl_r6',  name: 'Mind Sparks - Anatomical Landmarks',                  type: 'resource',  topic: 'Anatomical landmarks',done: false },
//     { id: 'fl_r7',  name: 'How to acquire the femur diaphysis plane',            type: 'resource',  topic: 'Imaging the plane',   done: false },
//     { id: 'fl_r8',  name: 'Mind Sparks - Probe movements',                       type: 'resource',  topic: 'Imaging the plane',   done: false },
//     { id: 'fl_r9',  name: 'Mind Sparks - Picture pick',                          type: 'resource',  topic: 'Imaging the plane',   done: false },
//     { id: 'fl_r10', name: 'How to measure FL',                                   type: 'resource',  topic: 'Measurement',         done: false },
//     { id: 'fl_r11', name: 'MindSparks - Picture Pick',                           type: 'resource',  topic: 'Measurement',         done: false },
//     { id: 'fl_r12', name: 'Plane Acquisition Challenges',                        type: 'resource',  topic: 'Plane Acquisition',   done: false },
//     { id: 'fl_r13', name: 'Common Measurement Errors',                           type: 'resource',  topic: 'Plane Acquisition',   done: false },
//     { id: 'fl_r14', name: 'Image Diagnosis',                                     type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'fl_r15', name: 'Percentile Charts & Significance',                    type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'fl_r16', name: 'AC chart',                                            type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'fl_r17', name: 'Mind Sparks - Chart Interpretation',                 type: 'resource',  topic: 'Image Diagnosis',     done: false },
//     { id: 'fl_r18', name: 'Crossword puzzle', type: 'resource', topic: 'OB Boosters', done: false },
//     { id: 'fl_r19', name: 'True/False',        type: 'resource', topic: 'OB Boosters', done: false },
//     { id: 'fl_r20', name: 'Picture Pick',      type: 'resource', topic: 'OB Boosters', done: false },
//     { id: 'fl_p1',  name: 'Practice 1',  type: 'practice',  topic: '', done: false },
//     { id: 'fl_p2',  name: 'Practice 2',  type: 'practice',  topic: '', done: false },
//     { id: 'fl_p3',  name: 'Practice 3',  type: 'practice',  topic: '', done: false },
//     { id: 'fl_p4',  name: 'Practice 4',  type: 'practice',  topic: '', done: false },
//     { id: 'fl_i1',  name: 'Find the Image',  type: 'interpret', topic: '', done: false },
//     { id: 'fl_i2',  name: 'Annotation 1',    type: 'interpret', topic: '', done: false },
//     { id: 'fl_i3',  name: 'Annotation 2',    type: 'interpret', topic: '', done: false },
//     { id: 'fl_i4',  name: 'Measurement',     type: 'interpret', topic: '', done: false },
//     { id: 'fl_t1',  name: 'Test 1', type: 'test', topic: '', done: false },
//     { id: 'fl_t2',  name: 'Test 2', type: 'test', topic: '', done: false },
//   ],
//   usp: [
//     { id: 'usp_r1', name: 'Ultrasound Wave Physics', type: 'resource', topic: '', done: false },
//     { id: 'usp_t1', name: 'Test 1',                  type: 'test',     topic: '', done: false },
//   ],
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// const TYPE_META = {
//   resource:  { label: 'Learning Resource',     icon: BookOpen,       color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
//   practice:  { label: 'Practice',              icon: Dumbbell,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
//   interpret: { label: 'Image Interpretation',  icon: Eye,            color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
//   test:      { label: 'Test',                  icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
// };

// const TOPIC_ICONS = {
//   'Fetal Head':          Brain,
//   'Anatomical Landmarks': Search,
//   'Anatomical landmarks': Search,
//   'Imaging the Plane':   Eye,
//   'Imaging the plane':   Eye,
//   'Measurements':        Ruler,
//   'Measurement':         Ruler,
//   'Image Diagnosis':     FileText,
//   'OB Boosters':         Play,
//   'Fetal abdomen':       Brain,
//   'Plane Acquisition':   FileText,
//   'Fetal Femur':         Brain,
// };

// function ResourceIcon({ type }) {
//   const meta = TYPE_META[type];
//   const Icon = meta.icon;
//   return (
//     <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
//       <Icon size={16} className={meta.color} />
//     </div>
//   );
// }

// function ResourceTypeBadge({ type }) {
//   const meta = TYPE_META[type];
//   return (
//     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}>
//       {meta.label}
//     </span>
//   );
// }

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

// function ResourceRow({ r }) {
//   return (
//     <div
//       className={`flex items-center gap-3 p-3 rounded-xl border bg-white cursor-pointer
//         transition-all hover:shadow-sm group
//         ${r.done ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]' : 'border-gray-200 hover:border-[#8DC63F]/50'}`}
//     >
//       <ResourceIcon type={r.type} />

//       <div className="flex-1 min-w-0">
//         <p className={`text-sm font-medium truncate
//           ${r.done ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-[#8DC63F]'}`}>
//           {r.name}
//         </p>
//       </div>

//       <ResourceTypeBadge type={r.type} />

//       {r.done ? (
//         <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
//           <CheckCircle2 size={16} className="fill-[#8DC63F] text-white" />
//           <span className="text-[11px] font-semibold">Done</span>
//         </div>
//       ) : (
//         <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
//       )}
//     </div>
//   );
// }

// function MyLearning() {
//   const [buttonOpen, setButtonOpen] = React.useState(true);
//   const handleButtonOpen = () => setButtonOpen(!buttonOpen);

//   const [activeCert,   setActiveCert]   = React.useState('btc');
//   const [activeModule, setActiveModule] = React.useState('bpd_hc');
//   const [activeFilter, setActiveFilter] = React.useState('all');
//   const [search,       setSearch]       = React.useState('');
//   const [openTopics,   setOpenTopics]   = React.useState({});

//   const toggleTopic = (key) =>
//     setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

//   let token = localStorage.getItem("user_token");
//   const decoded = jwtDecode(token);
//   if (!decoded.role) return <Navigate to="/" replace />;

//   const modules   = MODULES[activeCert] || [];
//   const allRes    = RESOURCES[activeModule] || [];

//   const filtered = allRes.filter(r => {
//     const matchType   = activeFilter === 'all' || r.type === activeFilter;
//     const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
//     return matchType && matchSearch;
//   });

//   const activeModMeta = modules.find(m => m.id === activeModule);
//   const doneCount     = allRes.filter(r => r.done).length;
//   const totalCount    = allRes.length;
//   const pct           = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

//   // Group: LR items → keyed by topic; Practice/Interpret/Test → keyed by their type string
//   const grouped = filtered.reduce((acc, r) => {
//     const key = r.type === 'resource'
//       ? (r.topic || 'Learning Resource')   // LR always bucketed by topic
//       : r.type;                             // others bucketed by type
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(r);
//     return acc;
//   }, {});

//   const handleCertChange = (certId) => {
//     setActiveCert(certId);
//     const firstUnlocked = (MODULES[certId] || []).find(m => !m.locked);
//     setActiveModule(firstUnlocked?.id || MODULES[certId]?.[0]?.id || '');
//     setActiveFilter('all');
//     setSearch('');
//     setOpenTopics({});
//   };

//   const handleModuleChange = (mod) => {
//     if (mod.locked) return;
//     setActiveModule(mod.id);
//     setActiveFilter('all');
//     setSearch('');
//     setOpenTopics({});
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">

//       {/* ── Navbar ── */}
//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>

//       <div className="flex flex-grow pt-12">

//         {/* ── Sidebar ── */}
//         <div>
//           <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
//         </div>

//         {/* ── Main content ── */}
//         <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow`}>

//           {/* Breadcrumb */}
//           <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border-b text-sm">
//             <LayoutDashboard size={15} />
//             Dashboard /
//             <Notebook size={15} />
//             <span className="text-gray-500 font-medium">My Learning</span>
//           </div>

//           <div className="p-5">

//             {/* ── Cert tabs ── */}
//             <div className="flex items-center gap-3 mb-5">
//               {CERTS.map(cert => (
//                 <button
//                   key={cert.id}
//                   onClick={() => handleCertChange(cert.id)}
//                   className={`px-5 py-1.5 rounded-2xl border text-sm font-medium cursor-pointer transition-colors
//                     ${activeCert === cert.id
//                       ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
//                       : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
//                     }`}
//                 >
//                   {cert.label}
//                 </button>
//               ))}
//             </div>

//             {/* ── 3-col grid ── */}
//             <div className="grid grid-cols-3 gap-5">

//               {/* ── Col 1 · Module list ── */}
//               <div className="col-span-1 border rounded-xl bg-white p-4">
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

//                 <div className="flex flex-col gap-2">
//                   {modules.map(mod => {
//                     const isActive = activeModule === mod.id;
//                     const modPct   = mod.total ? Math.round((mod.done / mod.total) * 100) : 0;

//                     return (
//                       <button
//                         key={mod.id}
//                         onClick={() => handleModuleChange(mod)}
//                         disabled={mod.locked}
//                         className={`w-full text-left p-3 rounded-lg border transition-all
//                           ${mod.locked
//                             ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
//                             : isActive
//                               ? 'border-[#8DC63F] bg-[#8DC63F]/5 cursor-pointer'
//                               : 'border-gray-200 hover:border-[#8DC63F] hover:bg-[#8DC63F]/5 cursor-pointer'
//                           }`}
//                       >
//                         <div className="flex justify-between items-center mb-1.5">
//                           <span className={`text-sm font-medium ${isActive ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//                             {mod.label}
//                           </span>
//                           {mod.locked
//                             ? <Lock size={13} className="text-gray-400" />
//                             : <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
//                                 {mod.done}/{mod.total}
//                               </span>
//                           }
//                         </div>

//                         {/* Progress bar */}
//                         {!mod.locked && (
//                           <div className="w-full bg-gray-100 rounded-full h-1.5">
//                             <div
//                               className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//                               style={{ width: `${modPct}%` }}
//                             />
//                           </div>
//                         )}
//                         {mod.locked && (
//                           <p className="text-[10px] text-gray-400 mt-0.5">Coming soon</p>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* Module progress summary */}
//                 {activeModMeta && !activeModMeta.locked && (
//                   <div className="mt-4 pt-4 border-t">
//                     <div className="flex justify-between items-center mb-1.5">
//                       <span className="text-xs text-gray-500">{activeModMeta.label}</span>
//                       <span className="text-xs font-semibold text-[#8DC63F]">{pct}%</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-2">
//                       <div
//                         className="h-2 rounded-full bg-[#8DC63F] transition-all duration-500"
//                         style={{ width: `${pct}%` }}
//                       />
//                     </div>
//                     <p className="text-[11px] text-gray-400 mt-1.5">{doneCount} of {totalCount} resources completed</p>
//                   </div>
//                 )}
//               </div>

//               {/* ── Col 2-3 · Resource list ── */}
//               <div className="col-span-2">

//                 {/* Filter row + search */}
//                 <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     {TYPE_FILTERS.map(f => (
//                       <button
//                         key={f.id}
//                         onClick={() => setActiveFilter(f.id)}
//                         className={`px-3 py-1.5 rounded-2xl border text-xs font-medium cursor-pointer transition-colors
//                           ${activeFilter === f.id
//                             ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
//                             : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
//                           }`}
//                       >
//                         {f.label}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Search */}
//                   <div className="relative">
//                     <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search resources..."
//                       value={search}
//                       onChange={e => setSearch(e.target.value)}
//                       className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#8DC63F] w-48 transition-colors"
//                     />
//                   </div>
//                 </div>

//                 {/* Empty state */}
//                 {filtered.length === 0 && (
//                   <div className="flex flex-col items-center justify-center py-16 text-gray-400 border rounded-xl bg-white">
//                     <BookOpen size={36} className="mb-3 text-gray-300" />
//                     <p className="text-sm font-medium">No resources found</p>
//                     <p className="text-xs mt-1">Try adjusting your filter or search</p>
//                   </div>
//                 )}

//                 {/* ── Grouped resource cards (accordion for LR topics) ── */}
//                 {Object.entries(grouped).map(([topic, items]) => {

//                   // Practice / Image Interpretation / Test → render flat with a type header
//                   const isTypeBucket = items[0]?.type !== 'resource';
//                   if (isTypeBucket) {
//                     const meta = TYPE_META[items[0].type];
//                     const Icon = meta.icon;
//                     return (
//                       <div key={topic} className="mb-5">
//                         <div className="flex items-center gap-2 mb-2">
//                           <Icon size={13} className={meta.color} />
//                           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                             {meta.label}
//                           </span>
//                           <div className="flex-1 h-px bg-gray-100" />
//                           <span className="text-[10px] text-gray-400">{items.length}</span>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           {items.map(r => <ResourceRow key={r.id} r={r} />)}
//                         </div>
//                       </div>
//                     );
//                   }

//                   // Learning Resources with a topic → accordion
//                   const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
//                   const isOpen    = !!openTopics[topic];
//                   const topicDone = items.filter(r => r.done).length;

//                   return (
//                     <div key={topic} className="mb-3">
//                       {/* Accordion header */}
//                       <button
//                         onClick={() => toggleTopic(topic)}
//                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
//                           ${isOpen
//                             ? 'border-[#8DC63F] bg-[#8DC63F]/5'
//                             : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
//                           }`}
//                       >
//                         {/* Topic icon */}
//                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
//                           ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
//                           <TopicIcon size={15} />
//                         </div>

//                         {/* Label */}
//                         <div className="flex-1 text-left">
//                           <p className={`text-sm font-semibold transition-colors
//                             ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//                             {topic}
//                           </p>
//                           <p className="text-[11px] text-gray-400 mt-0.5">
//                             {topicDone}/{items.length} completed
//                           </p>
//                         </div>

//                         {/* Mini progress bar */}
//                         <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
//                           <div
//                             className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//                             style={{ width: `${items.length ? Math.round((topicDone / items.length) * 100) : 0}%` }}
//                           />
//                         </div>

//                         {/* Chevron */}
//                         {isOpen
//                           ? <ChevronDown size={16} className="text-[#8DC63F] flex-shrink-0 transition-transform" />
//                           : <ChevronRight size={16} className="text-gray-300 flex-shrink-0 transition-transform" />
//                         }
//                       </button>

//                       {/* Expanded resources */}
//                       {isOpen && (
//                         <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
//                           {items.map(r => <ResourceRow key={r.id} r={r} />)}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}

//               </div>
//               {/* end col 2-3 */}

//             </div>
//             {/* end grid */}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyLearning;


// import { jwtDecode } from 'jwt-decode';
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import NavBar from '../components/navBar';
// import SideBar from '../components/sideBar';
// import {
//   LayoutDashboard,
//   Notebook,
//   BookOpen,
//   Dumbbell,
//   Eye,
//   ClipboardCheck,
//   CheckCircle2,
//   Lock,
//   ChevronRight,
//   ChevronDown,
//   Play,
//   FileText,
//   Brain,
//   Ruler,
//   Search,
//   Zap,
//   Puzzle,
// } from 'lucide-react';
// const CERTS = [
//   { id: 'btc', label: 'BTC' },
//   { id: 'ufc', label: 'UFC' },
// ];
// const MODULES = {
//   btc: [
//     { id: 'bpd_hc', label: 'BPD & HC',                    done: 2, total: 30 },
//     { id: 'ac',     label: 'AC',                           done: 0, total: 30 },
//     { id: 'fl',     label: 'FL',                           done: 0, total: 30 },
//     { id: 'step6',  label: 'Presentation, Fetus, Cardiac', done: 0, total: 0, locked: true },
//   ],
//   ufc: [
//     { id: 'usp',   label: 'Principles of Ultrasound', done: 0, total: 2 },
//     { id: 'probe', label: 'Probe Movements',          done: 0, total: 0, locked: true },
//   ],
// };
// const TYPE_FILTERS = [
//   { id: 'all',        label: 'All' },
//   { id: 'resource',   label: 'Learning Resource' },
//   { id: 'practice',   label: 'Practice' },
//   { id: 'interpret',  label: 'Image Interpretation' },
//   { id: 'test',       label: 'Test' },
// ];
// const RESOURCES = {
//   bpd_hc: [
//     // ── Regular Learning Resources → progress_data ──
//     { id: 'r1',  name: 'Transthalamic Plane',                    type: 'resource', topic: 'Fetal Head',          completionSource: 'progress', done: false },
//     { id: 'r2',  name: 'Bi-Parietal Diameter',                   type: 'resource', topic: 'Fetal Head',          completionSource: 'progress', done: false },
//     { id: 'r3',  name: 'Head Circumference',                     type: 'resource', topic: 'Fetal Head',          completionSource: 'progress', done: false },
//     { id: 'r4',  name: 'Significance',                           type: 'resource', topic: 'Fetal Head',          completionSource: 'progress', done: false },
//     { id: 'r5',  name: 'Anatomical Landmarks and Significance',  type: 'resource', topic: 'Anatomical Landmarks', completionSource: 'progress', done: true  },
//     { id: 'r7',  name: 'How To Image The Plane',                 type: 'resource', topic: 'Imaging the Plane',   completionSource: 'progress', done: true  },
//     { id: 'r8',  name: 'Mind Sparks - Probe Movements',          type: 'resource', topic: 'Imaging the Plane',   completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'r9',  name: 'How To Acquire The Transthalamic Plane', type: 'resource', topic: 'Imaging the Plane',   completionSource: 'progress', done: false },
//     { id: 'r11', name: 'How To Measure BPD',                     type: 'resource', topic: 'Measurements',        completionSource: 'progress', done: false },
//     { id: 'r12', name: 'How To Measure HC',                      type: 'resource', topic: 'Measurements',        completionSource: 'progress', done: false },
//     { id: 'r13', name: 'Image Diagnosis',                        type: 'resource', topic: 'Image Diagnosis',     completionSource: 'progress', done: false },
//     { id: 'r14', name: 'Percentile Chart & Significance',        type: 'resource', topic: 'Image Diagnosis',     completionSource: 'progress', done: false },
//     { id: 'r15', name: 'BPD Chart',                              type: 'resource', topic: 'Image Diagnosis',     completionSource: 'progress', done: false },
//     { id: 'r16', name: 'HC Chart',                               type: 'resource', topic: 'Image Diagnosis',     completionSource: 'progress', done: false },
//     // ── Mind Sparks → activity_submissions ──
//     { id: 'r6',  name: 'Mind Sparks - Anatomical Landmarks',     type: 'resource', topic: 'Anatomical Landmarks', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'r10', name: 'Mind Sparks - Picture Pick',             type: 'resource', topic: 'Imaging the Plane',   completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'r17', name: 'Mind Sparks - Chart Interpretation',     type: 'resource', topic: 'Image Diagnosis',     completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     // ── OB Boosters → activity_submissions ──
//     { id: 'r18', name: 'Picture Pick',  type: 'resource', topic: 'OB Boosters', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 5 } },
//     { id: 'r19', name: 'True / False',  type: 'resource', topic: 'OB Boosters', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 5 } },
//     { id: 'r20', name: 'Wordsearch',    type: 'resource', topic: 'OB Boosters', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     // ── Practice ──
//     { id: 'p1', name: 'Practice 1', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'p2', name: 'Practice 2', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'p3', name: 'Practice 3', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'p4', name: 'Practice 4', type: 'practice',  topic: '', completionSource: null, done: false },
//     // ── Image Interpretation ──
//     { id: 'i1', name: 'Find the Image', type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'i2', name: 'Annotation 1',   type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'i3', name: 'Annotation 2',   type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'i4', name: 'Measurement',    type: 'interpret', topic: '', completionSource: null, done: false },
//     // ── Test ──
//     { id: 't1', name: 'Test 1', type: 'test', topic: '', completionSource: null, done: false },
//     { id: 't2', name: 'Test 2', type: 'test', topic: '', completionSource: null, done: false },
//   ],
//   ac: [
//     { id: 'ac_r1',  name: 'Transabdominal plane',                             type: 'resource', topic: 'Fetal abdomen',        completionSource: 'progress', done: false },
//     { id: 'ac_r2',  name: 'Abdominal circumference',                          type: 'resource', topic: 'Fetal abdomen',        completionSource: 'progress', done: false },
//     { id: 'ac_r3',  name: 'Significance',                                     type: 'resource', topic: 'Fetal abdomen',        completionSource: 'progress', done: false },
//     { id: 'ac_r4',  name: 'Anatomical landmarks of the transabdominal plane', type: 'resource', topic: 'Anatomical landmarks', completionSource: 'progress', done: false },
//     { id: 'ac_r5',  name: 'Geometric shapes of key landmarks',                type: 'resource', topic: 'Anatomical landmarks', completionSource: 'progress', done: false },
//     { id: 'ac_r7',  name: 'How to acquire the transabdominal plane',          type: 'resource', topic: 'Imaging the plane',    completionSource: 'progress', done: false },
//     { id: 'ac_r10', name: 'How to measure AC',                                type: 'resource', topic: 'Measurement',          completionSource: 'progress', done: false },
//     { id: 'ac_r12', name: 'Image Diagnosis',                                  type: 'resource', topic: 'Image Diagnosis',      completionSource: 'progress', done: false },
//     { id: 'ac_r13', name: 'Percentile Charts & Significance',                 type: 'resource', topic: 'Image Diagnosis',      completionSource: 'progress', done: false },
//     { id: 'ac_r14', name: 'AC chart',                                         type: 'resource', topic: 'Image Diagnosis',      completionSource: 'progress', done: false },
//     // Mind Sparks
//     { id: 'ac_r6',  name: 'Mind Sparks - Anatomical Landmarks',               type: 'resource', topic: 'Anatomical landmarks', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'ac_r8',  name: 'Mind Sparks - Probe movements',                    type: 'resource', topic: 'Imaging the plane',    completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'ac_r9',  name: 'Mind Sparks - Picture pick',                       type: 'resource', topic: 'Imaging the plane',    completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'ac_r11', name: 'Mind Sparks - Picture Pick',                       type: 'resource', topic: 'Measurement',          completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'ac_r15', name: 'Mind Sparks - Chart Interpretation',               type: 'resource', topic: 'Image Diagnosis',      completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     // OB Boosters
//     { id: 'ac_r16', name: 'Crossword puzzle',             type: 'resource', topic: 'OB Boosters',       completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'ac_r17', name: 'True/False',                   type: 'resource', topic: 'OB Boosters',       completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 5 } },
//     { id: 'ac_r18', name: 'Picture Pick',                 type: 'resource', topic: 'OB Boosters',       completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 5 } },
//     { id: 'ac_r19', name: 'Plane Acquisition Challenges', type: 'resource', topic: 'Plane Acquisition', completionSource: 'progress', done: false },
//     { id: 'ac_r20', name: 'Common Measurement Errors',    type: 'resource', topic: 'Plane Acquisition', completionSource: 'progress', done: false },
//     { id: 'ac_p1',  name: 'Practice 1', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'ac_p2',  name: 'Practice 2', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'ac_p3',  name: 'Practice 3', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'ac_p4',  name: 'Practice 4', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'ac_i1',  name: 'Find the Image', type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'ac_i2',  name: 'Annotation 1',   type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'ac_i3',  name: 'Annotation 2',   type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'ac_i4',  name: 'Measurement',    type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'ac_t1',  name: 'Test 1', type: 'test', topic: '', completionSource: null, done: false },
//     { id: 'ac_t2',  name: 'Test 2', type: 'test', topic: '', completionSource: null, done: false },
//   ],
//   fl: [
//     { id: 'fl_r1',  name: 'Femur',                                             type: 'resource', topic: 'Fetal Femur',          completionSource: 'progress', done: false },
//     { id: 'fl_r2',  name: 'Femur diaphysis',                                   type: 'resource', topic: 'Fetal Femur',          completionSource: 'progress', done: false },
//     { id: 'fl_r3',  name: 'Significance',                                      type: 'resource', topic: 'Fetal Femur',          completionSource: 'progress', done: false },
//     { id: 'fl_r4',  name: 'Anatomical landmarks of the femur diaphysis plane', type: 'resource', topic: 'Anatomical landmarks', completionSource: 'progress', done: false },
//     { id: 'fl_r5',  name: 'Geometric shapes of key landmarks',                 type: 'resource', topic: 'Anatomical landmarks', completionSource: 'progress', done: false },
//     { id: 'fl_r7',  name: 'How to acquire the femur diaphysis plane',          type: 'resource', topic: 'Imaging the plane',    completionSource: 'progress', done: false },
//     { id: 'fl_r10', name: 'How to measure FL',                                 type: 'resource', topic: 'Measurement',          completionSource: 'progress', done: false },
//     { id: 'fl_r12', name: 'Plane Acquisition Challenges',                      type: 'resource', topic: 'Plane Acquisition',    completionSource: 'progress', done: false },
//     { id: 'fl_r13', name: 'Common Measurement Errors',                         type: 'resource', topic: 'Plane Acquisition',    completionSource: 'progress', done: false },
//     { id: 'fl_r14', name: 'Image Diagnosis',                                   type: 'resource', topic: 'Image Diagnosis',      completionSource: 'progress', done: false },
//     { id: 'fl_r15', name: 'Percentile Charts & Significance',                  type: 'resource', topic: 'Image Diagnosis',      completionSource: 'progress', done: false },
//     { id: 'fl_r16', name: 'AC chart',                                          type: 'resource', topic: 'Image Diagnosis',      completionSource: 'progress', done: false },
//     // Mind Sparks
//     { id: 'fl_r6',  name: 'Mind Sparks - Anatomical Landmarks',  type: 'resource', topic: 'Anatomical landmarks', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'fl_r8',  name: 'Mind Sparks - Probe movements',       type: 'resource', topic: 'Imaging the plane',    completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'fl_r9',  name: 'Mind Sparks - Picture pick',          type: 'resource', topic: 'Imaging the plane',    completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'fl_r11', name: 'MindSparks - Picture Pick',           type: 'resource', topic: 'Measurement',          completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'fl_r17', name: 'Mind Sparks - Chart Interpretation',  type: 'resource', topic: 'Image Diagnosis',      completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     // OB Boosters
//     { id: 'fl_r18', name: 'Crossword puzzle', type: 'resource', topic: 'OB Boosters', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 1 } },
//     { id: 'fl_r19', name: 'True/False',        type: 'resource', topic: 'OB Boosters', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 5 } },
//     { id: 'fl_r20', name: 'Picture Pick',      type: 'resource', topic: 'OB Boosters', completionSource: 'activity', done: false, activityData: { attempts: 0, correct: 0, total: 5 } },
//     { id: 'fl_p1',  name: 'Practice 1', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'fl_p2',  name: 'Practice 2', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'fl_p3',  name: 'Practice 3', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'fl_p4',  name: 'Practice 4', type: 'practice',  topic: '', completionSource: null, done: false },
//     { id: 'fl_i1',  name: 'Find the Image', type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'fl_i2',  name: 'Annotation 1',   type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'fl_i3',  name: 'Annotation 2',   type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'fl_i4',  name: 'Measurement',    type: 'interpret', topic: '', completionSource: null, done: false },
//     { id: 'fl_t1',  name: 'Test 1', type: 'test', topic: '', completionSource: null, done: false },
//     { id: 'fl_t2',  name: 'Test 2', type: 'test', topic: '', completionSource: null, done: false },
//   ],
//   usp: [
//     { id: 'usp_r1', name: 'Ultrasound Wave Physics', type: 'resource', topic: '', completionSource: 'progress', done: false },
//     { id: 'usp_t1', name: 'Test 1',                  type: 'test',     topic: '', completionSource: null,       done: false },
//   ],
// };
// const TYPE_META = {
//   resource:  { label: 'Learning Resource',    icon: BookOpen,       color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
//   practice:  { label: 'Practice',             icon: Dumbbell,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
//   interpret: { label: 'Image Interpretation', icon: Eye,            color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
//   test:      { label: 'Test',                 icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
// };
// const TOPIC_ICONS = {
//   'Fetal Head':           Brain,
//   'Anatomical Landmarks': Search,
//   'Anatomical landmarks': Search,
//   'Imaging the Plane':    Eye,
//   'Imaging the plane':    Eye,
//   'Measurements':         Ruler,
//   'Measurement':          Ruler,
//   'Image Diagnosis':      FileText,
//   'OB Boosters':          Puzzle,
//   'Fetal abdomen':        Brain,
//   'Plane Acquisition':    FileText,
//   'Fetal Femur':          Brain,
// };
// function CompletionStatus({ r }) {
//   // ── progress_data source ──────────────────────────────────────────────────
//   if (r.completionSource === 'progress') {
//     return r.done ? (
//       <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
//         <CheckCircle2 size={15} className="fill-[#8DC63F] text-white" />
//         <span className="text-[11px] font-semibold">Completed</span>
//       </div>
//     ) : (
//       <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 flex-shrink-0">
//         Not started
//       </span>
//     );
//   }

//   if (r.completionSource === 'activity') {
//     const { attempts, correct, total } = r.activityData || { attempts: 0, correct: 0, total: 1 };
//     const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
//     const isMindSpark = r.name.toLowerCase().includes('mind spark') || r.name.toLowerCase().includes('mindspark');

//     if (attempts === 0) {
//       return (
//         <div className="flex items-center gap-1.5 flex-shrink-0">
//           {isMindSpark
//             ? <Zap size={13} className="text-yellow-400" />
//             : <Puzzle size={13} className="text-pink-400" />
//           }
//           <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
//             Not attempted
//           </span>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center gap-2 flex-shrink-0">
//         {/* Score fraction */}
//         <div className="text-right">
//           <p className={`text-[11px] font-semibold leading-none ${pct === 100 ? 'text-[#8DC63F]' : 'text-yellow-500'}`}>
//             {correct}/{total}
//           </p>
//           <p className="text-[9px] text-gray-400 mt-0.5">{attempts} attempt{attempts !== 1 ? 's' : ''}</p>
//         </div>
//         {/* Mini bar */}
//         <div className="w-12 bg-gray-100 rounded-full h-1.5">
//           <div
//             className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-[#8DC63F]' : 'bg-yellow-400'}`}
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//         {pct === 100 && <CheckCircle2 size={14} className="fill-[#8DC63F] text-white flex-shrink-0" />}
//       </div>
//     );
//   }

//   // ── null source (Practice / Interpret / Test) ─────────────────────────────
//   return (
//     <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
//   );
// }

// // ─── RESOURCE ICON ────────────────────────────────────────────────────────────

// function ResourceIcon({ r }) {
//   const meta = TYPE_META[r.type];
//   const isMindSpark = r.name.toLowerCase().includes('mind spark') || r.name.toLowerCase().includes('mindspark');
//   const isOBBooster = r.topic === 'OB Boosters';

//   if (isMindSpark) {
//     return (
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-50 border border-yellow-200">
//         <Zap size={16} className="text-yellow-500" />
//       </div>
//     );
//   }
//   if (isOBBooster) {
//     return (
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-pink-50 border border-pink-200">
//         <Puzzle size={16} className="text-pink-500" />
//       </div>
//     );
//   }

//   const Icon = meta.icon;
//   return (
//     <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
//       <Icon size={16} className={meta.color} />
//     </div>
//   );
// }

// // ─── TYPE BADGE ───────────────────────────────────────────────────────────────

// function ResourceTypeBadge({ r }) {
//   const isMindSpark = r.name.toLowerCase().includes('mind spark') || r.name.toLowerCase().includes('mindspark');
//   const isOBBooster = r.topic === 'OB Boosters';

//   if (isMindSpark) {
//     return (
//       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200">
//         Mind Sparks
//       </span>
//     );
//   }
//   if (isOBBooster) {
//     return (
//       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-pink-50 text-pink-500 border border-pink-200">
//         OB Booster
//       </span>
//     );
//   }

//   const meta = TYPE_META[r.type];
//   return (
//     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}>
//       {meta.label}
//     </span>
//   );
// }

// // ─── RESOURCE ROW ─────────────────────────────────────────────────────────────

// function ResourceRow({ r }) {
//   const isActivityDone = r.completionSource === 'activity' && r.activityData?.attempts > 0;
//   const isProgressDone = r.completionSource === 'progress' && r.done;
//   const isDone = isActivityDone || isProgressDone;

//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-xl border bg-white cursor-pointer
//       transition-all hover:shadow-sm group
//       ${isDone ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]' : 'border-gray-200 hover:border-[#8DC63F]/50'}`}>

//       <ResourceIcon r={r} />

//       <div className="flex-1 min-w-0">
//         <p className={`text-sm font-medium truncate
//           ${isProgressDone ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-[#8DC63F]'}`}>
//           {r.name}
//         </p>
//       </div>

//       <ResourceTypeBadge r={r} />

//       <CompletionStatus r={r} />
//     </div>
//   );
// }

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

// function MyLearning() {
//   const [buttonOpen, setButtonOpen] = React.useState(true);
//   const handleButtonOpen = () => setButtonOpen(!buttonOpen);

//   const [activeCert,   setActiveCert]   = React.useState('btc');
//   const [activeModule, setActiveModule] = React.useState('bpd_hc');
//   const [activeFilter, setActiveFilter] = React.useState('all');
//   const [search,       setSearch]       = React.useState('');
//   const [openTopics,   setOpenTopics]   = React.useState({});

//   const toggleTopic = (key) =>
//     setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

//   let token = localStorage.getItem("user_token");
//   const decoded = jwtDecode(token);
//   if (!decoded.role) return <Navigate to="/" replace />;

//   const modules = MODULES[activeCert] || [];
//   const allRes  = RESOURCES[activeModule] || [];

//   const filtered = allRes.filter(r => {
//     const matchType   = activeFilter === 'all' || r.type === activeFilter;
//     const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
//     return matchType && matchSearch;
//   });

//   const activeModMeta = modules.find(m => m.id === activeModule);
//   const doneCount     = allRes.filter(r => r.done || (r.activityData?.attempts > 0)).length;
//   const totalCount    = allRes.length;
//   const pct           = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

//   // Group: LR by topic, others by type key
//   const grouped = filtered.reduce((acc, r) => {
//     const key = r.type === 'resource'
//       ? (r.topic || 'Learning Resource')
//       : r.type;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(r);
//     return acc;
//   }, {});

//   const handleCertChange = (certId) => {
//     setActiveCert(certId);
//     const firstUnlocked = (MODULES[certId] || []).find(m => !m.locked);
//     setActiveModule(firstUnlocked?.id || MODULES[certId]?.[0]?.id || '');
//     setActiveFilter('all');
//     setSearch('');
//     setOpenTopics({});
//   };

//   const handleModuleChange = (mod) => {
//     if (mod.locked) return;
//     setActiveModule(mod.id);
//     setActiveFilter('all');
//     setSearch('');
//     setOpenTopics({});
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">

//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>

//       <div className="flex flex-grow pt-12">
//         <div>
//           <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
//         </div>

//         <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow`}>

//           {/* Breadcrumb */}
//           <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border-b text-sm">
//             <LayoutDashboard size={15} />
//             Dashboard /
//             <Notebook size={15} />
//             <span className="text-gray-500 font-medium">My Learning</span>
//           </div>

//           <div className="p-5">

//             {/* Cert tabs */}
//             <div className="flex items-center gap-3 mb-5">
//               {CERTS.map(cert => (
//                 <button
//                   key={cert.id}
//                   onClick={() => handleCertChange(cert.id)}
//                   className={`px-5 py-1.5 rounded-2xl border text-sm font-medium cursor-pointer transition-colors
//                     ${activeCert === cert.id
//                       ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
//                       : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
//                     }`}
//                 >
//                   {cert.label}
//                 </button>
//               ))}
//             </div>

//             {/* Legend */}
//             <div className="flex items-center gap-4 mb-4 flex-wrap">
//               <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                 <BookOpen size={12} className="text-blue-500" />
//                 <span>Learning Resource — tracked via <span className="font-medium text-gray-600">progress_data</span></span>
//               </div>
//               <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                 <Zap size={12} className="text-yellow-500" />
//                 <span>Mind Sparks — tracked via <span className="font-medium text-gray-600">activity_submissions</span></span>
//               </div>
//               <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                 <Puzzle size={12} className="text-pink-500" />
//                 <span>OB Boosters — tracked via <span className="font-medium text-gray-600">activity_submissions</span></span>
//               </div>
//             </div>

//             {/* 3-col grid */}
//             <div className="grid grid-cols-3 gap-5">

//               {/* Col 1 · Module list */}
//               <div className="col-span-1 border rounded-xl bg-white p-4">
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

//                 <div className="flex flex-col gap-2">
//                   {modules.map(mod => {
//                     const isActive = activeModule === mod.id;
//                     const modPct   = mod.total ? Math.round((mod.done / mod.total) * 100) : 0;
//                     return (
//                       <button
//                         key={mod.id}
//                         onClick={() => handleModuleChange(mod)}
//                         disabled={mod.locked}
//                         className={`w-full text-left p-3 rounded-lg border transition-all
//                           ${mod.locked
//                             ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
//                             : isActive
//                               ? 'border-[#8DC63F] bg-[#8DC63F]/5 cursor-pointer'
//                               : 'border-gray-200 hover:border-[#8DC63F] hover:bg-[#8DC63F]/5 cursor-pointer'
//                           }`}
//                       >
//                         <div className="flex justify-between items-center mb-1.5">
//                           <span className={`text-sm font-medium ${isActive ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//                             {mod.label}
//                           </span>
//                           {mod.locked
//                             ? <Lock size={13} className="text-gray-400" />
//                             : <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
//                                 {mod.done}/{mod.total}
//                               </span>
//                           }
//                         </div>
//                         {!mod.locked && (
//                           <div className="w-full bg-gray-100 rounded-full h-1.5">
//                             <div
//                               className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//                               style={{ width: `${modPct}%` }}
//                             />
//                           </div>
//                         )}
//                         {mod.locked && (
//                           <p className="text-[10px] text-gray-400 mt-0.5">Coming soon</p>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* Module summary */}
//                 {activeModMeta && !activeModMeta.locked && (
//                   <div className="mt-4 pt-4 border-t">
//                     <div className="flex justify-between items-center mb-1.5">
//                       <span className="text-xs text-gray-500">{activeModMeta.label}</span>
//                       <span className="text-xs font-semibold text-[#8DC63F]">{pct}%</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-2">
//                       <div
//                         className="h-2 rounded-full bg-[#8DC63F] transition-all duration-500"
//                         style={{ width: `${pct}%` }}
//                       />
//                     </div>
//                     <p className="text-[11px] text-gray-400 mt-1.5">{doneCount} of {totalCount} resources completed</p>
//                   </div>
//                 )}
//               </div>

//               {/* Col 2-3 · Resource list */}
//               <div className="col-span-2">

//                 {/* Filter + search */}
//                 <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     {TYPE_FILTERS.map(f => (
//                       <button
//                         key={f.id}
//                         onClick={() => setActiveFilter(f.id)}
//                         className={`px-3 py-1.5 rounded-2xl border text-xs font-medium cursor-pointer transition-colors
//                           ${activeFilter === f.id
//                             ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
//                             : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
//                           }`}
//                       >
//                         {f.label}
//                       </button>
//                     ))}
//                   </div>
//                   <div className="relative">
//                     <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search resources..."
//                       value={search}
//                       onChange={e => setSearch(e.target.value)}
//                       className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#8DC63F] w-48 transition-colors"
//                     />
//                   </div>
//                 </div>

//                 {/* Empty state */}
//                 {filtered.length === 0 && (
//                   <div className="flex flex-col items-center justify-center py-16 text-gray-400 border rounded-xl bg-white">
//                     <BookOpen size={36} className="mb-3 text-gray-300" />
//                     <p className="text-sm font-medium">No resources found</p>
//                     <p className="text-xs mt-1">Try adjusting your filter or search</p>
//                   </div>
//                 )}

//                 {/* Grouped accordion */}
//                 {Object.entries(grouped).map(([topic, items]) => {

//                   // Practice / Interpret / Test → flat
//                   const isTypeBucket = items[0]?.type !== 'resource';
//                   if (isTypeBucket) {
//                     const meta = TYPE_META[items[0].type];
//                     const Icon = meta.icon;
//                     return (
//                       <div key={topic} className="mb-5">
//                         <div className="flex items-center gap-2 mb-2">
//                           <Icon size={13} className={meta.color} />
//                           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                             {meta.label}
//                           </span>
//                           <div className="flex-1 h-px bg-gray-100" />
//                           <span className="text-[10px] text-gray-400">{items.length}</span>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           {items.map(r => <ResourceRow key={r.id} r={r} />)}
//                         </div>
//                       </div>
//                     );
//                   }

//                   // Learning Resources → accordion by topic
//                   const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
//                   const isOpen    = !!openTopics[topic];
//                   const topicDone = items.filter(r =>
//                     (r.completionSource === 'progress' && r.done) ||
//                     (r.completionSource === 'activity' && r.activityData?.attempts > 0)
//                   ).length;

//                   return (
//                     <div key={topic} className="mb-3">
//                       <button
//                         onClick={() => toggleTopic(topic)}
//                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
//                           ${isOpen
//                             ? 'border-[#8DC63F] bg-[#8DC63F]/5'
//                             : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
//                           }`}
//                       >
//                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
//                           ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
//                           <TopicIcon size={15} />
//                         </div>

//                         <div className="flex-1 text-left">
//                           <p className={`text-sm font-semibold transition-colors
//                             ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//                             {topic}
//                           </p>
//                           <p className="text-[11px] text-gray-400 mt-0.5">
//                             {topicDone}/{items.length} completed
//                           </p>
//                         </div>

//                         <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
//                           <div
//                             className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//                             style={{ width: `${items.length ? Math.round((topicDone / items.length) * 100) : 0}%` }}
//                           />
//                         </div>

//                         {isOpen
//                           ? <ChevronDown  size={16} className="text-[#8DC63F] flex-shrink-0" />
//                           : <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
//                         }
//                       </button>

//                       {isOpen && (
//                         <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
//                           {items.map(r => <ResourceRow key={r.id} r={r} />)}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyLearning;

//above code is workng fine

// import { jwtDecode } from 'jwt-decode';
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import NavBar from '../components/navBar';
// import SideBar from '../components/sideBar';
// import {
//   LayoutDashboard,
//   Notebook,
//   BookOpen,
//   Dumbbell,
//   Eye,
//   ClipboardCheck,
//   CheckCircle2,
//   Lock,
//   ChevronRight,
//   ChevronDown,
//   FileText,
//   Brain,
//   Ruler,
//   Search,
//   Zap,
//   Puzzle,
//   Loader2,
// } from 'lucide-react';

// // ─── CONSTANTS ────────────────────────────────────────────────────────────────

// const BASE_URL = "http://localhost:4004" || '';

// // certificate_id → cert tab id
// // These are discovered dynamically from the API, but we keep a fallback label map
// const CERT_LABEL_MAP = {
//   '8264bc83-1d80-47ac-aa6b-ca021ffb4ace': 'BTC',
//   '24d9e2c4-42b0-4133-b801-d8cace4600f5': 'UFC',
// };

// const TYPE_FILTERS = [
//   { id: 'all',       label: 'All' },
//   { id: 'resource',  label: 'Learning Resource' },
//   { id: 'practice',  label: 'Practice' },
//   { id: 'interpret', label: 'Image Interpretation' },
//   { id: 'test',      label: 'Test' },
// ];

// // resource_type string from API → internal type key
// const RESOURCE_TYPE_MAP = {
//   'Learning Resource':    'resource',
//   'Practice':             'practice',
//   'Image Interpretation': 'interpret',
//   'Test':                 'test',
// };

// const TYPE_META = {
//   resource:  { label: 'Learning Resource',    icon: BookOpen,       color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
//   practice:  { label: 'Practice',             icon: Dumbbell,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
//   interpret: { label: 'Image Interpretation', icon: Eye,            color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
//   test:      { label: 'Test',                 icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
// };

// const TOPIC_ICONS = {
//   'Fetal Head':                                              Brain,
//   'Anatomical Landmarks':                                    Search,
//   'Anatomical landmarks':                                    Search,
//   'Imaging the Plane':                                       Eye,
//   'Imaging the plane':                                       Eye,
//   'Imaging the transabdominal plane':                        Eye,
//   'Imaging the transfemoral plane':                          Eye,
//   'Measurements':                                            Ruler,
//   'Measurement':                                             Ruler,
//   'Image Diagnosis':                                         FileText,
//   'OB Boosters':                                             Puzzle,
//   'Fetal abdomen':                                           Brain,
//   'Plane Acquisition':                                       FileText,
//   'Plane Acquisition Challenges and Common Measurement Errors': FileText,
//   'Fetal Femur':                                             Brain,
// };

// // ─── API DATA TRANSFORMER ─────────────────────────────────────────────────────
// //
// // Transforms raw API response into the shape the component needs:
// //   certs       → [{ id, label }]
// //   modules     → { certId: [{ id, label, done, total, locked, learning_module_id }] }
// //   resources   → { learning_module_id: [resource] }

// function isMindSpark(name = '') {
//   return name.toLowerCase().includes('mind spark') || name.toLowerCase().includes('mindspark');
// }

// function isOBBooster(topic = '') {
//   return topic === 'OB Boosters';
// }

// function deriveCompletionSource(name, topic) {
//   if (isMindSpark(name) || isOBBooster(topic)) return 'activity';
//   return 'progress';
// }

// function transformApiData(apiResponse) {
//   const { data = [], moduleCompletion = [] } = apiResponse;

//   // ── 1. Build a quick lookup: resource_id → is_completed ──────────────────
//   const completionMap = {};
//   data.forEach(item => {
//     if (item.resource_id) {
//       completionMap[item.resource_id] = item.is_completed === true;
//     }
//   });

//   // ── 2. Build moduleCompletion lookup: learning_module_id → { done, total } ─
//   const moduleCompletionMap = {};
//   moduleCompletion.forEach(mc => {
//     moduleCompletionMap[mc.learning_module_id] = {
//       done:  parseInt(mc.completed_learning_resources, 10) || 0,
//       total: parseInt(mc.total_learning_resources, 10)     || 0,
//     };
//   });

//   // ── 3. Collect unique certificates (preserve insertion order) ────────────
//   const certOrder  = [];
//   const certSeen   = new Set();
//   data.forEach(item => {
//     if (!certSeen.has(item.certificate_id)) {
//       certSeen.add(item.certificate_id);
//       certOrder.push({
//         id:    item.certificate_id,
//         label: CERT_LABEL_MAP[item.certificate_id] || item.course_name || item.certificate_id,
//       });
//     }
//   });

//   // ── 4. Collect unique learning modules per cert ──────────────────────────
//   //   A module is "locked" when all its data rows have resource_id = null
//   const modulesByCert  = {}; // certId → Map<learning_module_id, module meta>
//   const resourcesByLMID = {}; // learning_module_id → resource[]

//   data.forEach(item => {
//     const { certificate_id, learning_module_id, unit_name, course_name } = item;

//     if (!modulesByCert[certificate_id]) modulesByCert[certificate_id] = new Map();
//     const certModules = modulesByCert[certificate_id];

//     if (!certModules.has(learning_module_id)) {
//       const comp = moduleCompletionMap[learning_module_id] || { done: 0, total: 0 };
//       certModules.set(learning_module_id, {
//         id:                 learning_module_id,
//         learning_module_id: learning_module_id,
//         // label: prefer unit_name, fall back to course_name
//         label:   unit_name || course_name || learning_module_id,
//         done:    comp.done,
//         total:   comp.total,
//         locked:  false, // determined below
//         hasAnyResource: false,
//       });
//     }

//     // If this row has a real resource, the module is NOT locked
//     if (item.resource_id) {
//       certModules.get(learning_module_id).hasAnyResource = true;
//     }

//     // ── Build resource list per module ──────────────────────────────────────
//     if (!item.resource_id) return; // skip placeholder rows

//     if (!resourcesByLMID[learning_module_id]) resourcesByLMID[learning_module_id] = [];

//     // Avoid duplicates (API can return the same resource twice)
//     const alreadyAdded = resourcesByLMID[learning_module_id].some(r => r.id === item.resource_id);
//     if (alreadyAdded) return;

//     const typeKey          = RESOURCE_TYPE_MAP[item.resource_type] || 'resource';
//     const completionSource = typeKey === 'resource'
//       ? deriveCompletionSource(item.resource_name, item.resource_topic)
//       : null;

//     const isDone = completionMap[item.resource_id] === true;

//     resourcesByLMID[learning_module_id].push({
//       id:               item.resource_id,
//       name:             (item.resource_name || '').trim(),
//       type:             typeKey,
//       topic:            item.resource_topic || '',
//       completionSource: completionSource,
//       done:             isDone,
//       // activityData defaults (no real activity_submissions data in this endpoint)
//       activityData:     completionSource === 'activity'
//         ? { attempts: isDone ? 1 : 0, correct: isDone ? 1 : 0, total: 1 }
//         : undefined,
//     });
//   });

//   // ── 5. Finalise modules per cert (set locked flag, convert Map → array) ──
//   const modulesByCertFinal = {};
//   certOrder.forEach(cert => {
//     const modMap = modulesByCert[cert.id];
//     if (!modMap) {
//       modulesByCertFinal[cert.id] = [];
//       return;
//     }
//     modulesByCertFinal[cert.id] = Array.from(modMap.values()).map(mod => ({
//       ...mod,
//       locked: !mod.hasAnyResource,
//     }));
//   });

//   return { certs: certOrder, modules: modulesByCertFinal, resources: resourcesByLMID };
// }

// // ─── COMPLETION STATUS BADGE ──────────────────────────────────────────────────

// function CompletionStatus({ r }) {
//   if (r.completionSource === 'progress') {
//     return r.done ? (
//       <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
//         <CheckCircle2 size={15} className="fill-[#8DC63F] text-white" />
//         <span className="text-[11px] font-semibold">Completed</span>
//       </div>
//     ) : (
//       <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 flex-shrink-0">
//         Not started
//       </span>
//     );
//   }

//   if (r.completionSource === 'activity') {
//     const { attempts = 0, correct = 0, total = 1 } = r.activityData || {};
//     const pct         = total > 0 ? Math.round((correct / total) * 100) : 0;
//     const _isMindSpark = isMindSpark(r.name);

//     if (attempts === 0) {
//       return (
//         <div className="flex items-center gap-1.5 flex-shrink-0">
//           {_isMindSpark
//             ? <Zap    size={13} className="text-yellow-400" />
//             : <Puzzle size={13} className="text-pink-400"   />
//           }
//           <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
//             Not attempted
//           </span>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center gap-2 flex-shrink-0">
//         <div className="text-right">
//           <p className={`text-[11px] font-semibold leading-none ${pct === 100 ? 'text-[#8DC63F]' : 'text-yellow-500'}`}>
//             {correct}/{total}
//           </p>
//           <p className="text-[9px] text-gray-400 mt-0.5">{attempts} attempt{attempts !== 1 ? 's' : ''}</p>
//         </div>
//         <div className="w-12 bg-gray-100 rounded-full h-1.5">
//           <div
//             className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-[#8DC63F]' : 'bg-yellow-400'}`}
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//         {pct === 100 && <CheckCircle2 size={14} className="fill-[#8DC63F] text-white flex-shrink-0" />}
//       </div>
//     );
//   }

//   return (
//     <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
//   );
// }

// // ─── RESOURCE ICON ────────────────────────────────────────────────────────────

// function ResourceIcon({ r }) {
//   const meta         = TYPE_META[r.type] || TYPE_META.resource;
//   const _isMindSpark = isMindSpark(r.name);
//   const _isOBBooster = isOBBooster(r.topic);

//   if (_isMindSpark) {
//     return (
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-50 border border-yellow-200">
//         <Zap size={16} className="text-yellow-500" />
//       </div>
//     );
//   }
//   if (_isOBBooster) {
//     return (
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-pink-50 border border-pink-200">
//         <Puzzle size={16} className="text-pink-500" />
//       </div>
//     );
//   }

//   const Icon = meta.icon;
//   return (
//     <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
//       <Icon size={16} className={meta.color} />
//     </div>
//   );
// }

// // ─── TYPE BADGE ───────────────────────────────────────────────────────────────

// function ResourceTypeBadge({ r }) {
//   const _isMindSpark = isMindSpark(r.name);
//   const _isOBBooster = isOBBooster(r.topic);

//   if (_isMindSpark) {
//     return (
//       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200">
//         Mind Sparks
//       </span>
//     );
//   }
//   if (_isOBBooster) {
//     return (
//       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-pink-50 text-pink-500 border border-pink-200">
//         OB Booster
//       </span>
//     );
//   }

//   const meta = TYPE_META[r.type] || TYPE_META.resource;
//   return (
//     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}>
//       {meta.label}
//     </span>
//   );
// }

// // ─── RESOURCE ROW ─────────────────────────────────────────────────────────────

// function ResourceRow({ r }) {
//   const isActivityDone = r.completionSource === 'activity' && r.activityData?.attempts > 0;
//   const isProgressDone = r.completionSource === 'progress' && r.done;
//   const isDone         = isActivityDone || isProgressDone;

//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-xl border bg-white cursor-pointer
//       transition-all hover:shadow-sm group
//       ${isDone ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]' : 'border-gray-200 hover:border-[#8DC63F]/50'}`}>

//       <ResourceIcon r={r} />

//       <div className="flex-1 min-w-0">
//         <p className={`text-sm font-medium truncate
//           ${isProgressDone ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-[#8DC63F]'}`}>
//           {r.name}
//         </p>
//       </div>

//       <ResourceTypeBadge r={r} />
//       <CompletionStatus  r={r} />
//     </div>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// function MyLearning() {
//   // ── JWT / auth — must be derived BEFORE any hook calls ────────────────────
//   const token   = localStorage.getItem('user_token');
//   let   decoded = null;
//   try { decoded = token ? jwtDecode(token) : null; } catch (_) {}
//   const traineeId  = decoded?.id || decoded?.sub || decoded?.people_id || localStorage.getItem('people_id');
//   const hasRole    = Boolean(decoded?.role);

//   // ── All hooks unconditionally up front ────────────────────────────────────
//   const [buttonOpen,   setButtonOpen]   = React.useState(true);
//   const [loading,      setLoading]      = React.useState(true);
//   const [error,        setError]        = React.useState(null);

//   // Transformed data
//   const [certs,     setCerts]     = React.useState([]);
//   const [modules,   setModules]   = React.useState({});
//   const [resources, setResources] = React.useState({});

//   // UI state
//   const [activeCert,   setActiveCert]   = React.useState('');
//   const [activeModule, setActiveModule] = React.useState('');
//   const [activeFilter, setActiveFilter] = React.useState('all');
//   const [search,       setSearch]       = React.useState('');
//   const [openTopics,   setOpenTopics]   = React.useState({});

//   // ── Fetch ──────────────────────────────────────────────────────────────────
//   React.useEffect(() => {
//     if (!traineeId || !token) return;

//     setLoading(true);
//     setError(null);

//     fetch(`${BASE_URL}/api/v1/trainee/${traineeId}?isVr=false`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then(json => {
//         const transformed = transformApiData(json);
//         setCerts(transformed.certs);
//         setModules(transformed.modules);
//         setResources(transformed.resources);

//         // Default selections
//         const firstCert = transformed.certs[0];
//         if (firstCert) {
//           setActiveCert(firstCert.id);
//           const firstMods     = transformed.modules[firstCert.id] || [];
//           const firstUnlocked = firstMods.find(m => !m.locked);
//           setActiveModule(firstUnlocked?.id || firstMods[0]?.id || '');
//         }
//       })
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [traineeId, token]); // ← token added to satisfy exhaustive-deps

//   // ── Guard — after all hooks ────────────────────────────────────────────────
//   if (!hasRole) return <Navigate to="/" replace />;

//   // ── Helpers ────────────────────────────────────────────────────────────────
//   const toggleTopic = key =>
//     setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

//   const handleCertChange = certId => {
//     setActiveCert(certId);
//     const mods         = modules[certId] || [];
//     const firstUnlocked = mods.find(m => !m.locked);
//     setActiveModule(firstUnlocked?.id || mods[0]?.id || '');
//     setActiveFilter('all');
//     setSearch('');
//     setOpenTopics({});
//   };

//   const handleModuleChange = mod => {
//     if (mod.locked) return;
//     setActiveModule(mod.id);
//     setActiveFilter('all');
//     setSearch('');
//     setOpenTopics({});
//   };

//   // ── Derived data ───────────────────────────────────────────────────────────
//   const currentModules   = modules[activeCert]    || [];
//   const allRes           = resources[activeModule] || [];
//   const activeModMeta    = currentModules.find(m => m.id === activeModule);

//   const filtered = allRes.filter(r => {
//     const matchType   = activeFilter === 'all' || r.type === activeFilter;
//     const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
//     return matchType && matchSearch;
//   });

//   const doneCount  = allRes.filter(r =>
//     r.done || (r.activityData?.attempts > 0)
//   ).length;
//   const totalCount = allRes.length;
//   const pct        = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

//   // Group: LR by topic; others by type key
//   const grouped = filtered.reduce((acc, r) => {
//     const key = r.type === 'resource'
//       ? (r.topic || 'Learning Resource')
//       : r.type;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(r);
//     return acc;
//   }, {});

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">

//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>

//       <div className="flex flex-grow pt-12">
//         <div>
//           <SideBar handleButtonOpen={() => setButtonOpen(p => !p)} buttonOpen={buttonOpen} />
//         </div>

//         <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow`}>

//           {/* Breadcrumb */}
//           <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border-b text-sm">
//             <LayoutDashboard size={15} />
//             Dashboard /
//             <Notebook size={15} />
//             <span className="text-gray-500 font-medium">My Learning</span>
//           </div>

//           <div className="p-5">

//             {/* ── Loading ── */}
//             {loading && (
//               <div className="flex items-center justify-center py-24 text-gray-400">
//                 <Loader2 size={32} className="animate-spin mr-3" />
//                 <span className="text-sm">Loading your learning data…</span>
//               </div>
//             )}

//             {/* ── Error ── */}
//             {error && !loading && (
//               <div className="flex flex-col items-center justify-center py-24 text-red-400">
//                 <p className="text-sm font-medium">Failed to load data</p>
//                 <p className="text-xs mt-1 text-gray-400">{error}</p>
//               </div>
//             )}

//             {/* ── Content ── */}
//             {!loading && !error && (

//               <>
//                 {/* Cert tabs */}
//                 <div className="flex items-center gap-3 mb-5">
//                   {certs.map(cert => (
//                     <button
//                       key={cert.id}
//                       onClick={() => handleCertChange(cert.id)}
//                       className={`px-5 py-1.5 rounded-2xl border text-sm font-medium cursor-pointer transition-colors
//                         ${activeCert === cert.id
//                           ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
//                           : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
//                         }`}
//                     >
//                       {cert.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Legend */}
//                 <div className="flex items-center gap-4 mb-4 flex-wrap">
//                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                     <BookOpen size={12} className="text-blue-500" />
//                     <span>Learning Resource — tracked via <span className="font-medium text-gray-600">progress_data</span></span>
//                   </div>
//                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                     <Zap size={12} className="text-yellow-500" />
//                     <span>Mind Sparks — tracked via <span className="font-medium text-gray-600">activity_submissions</span></span>
//                   </div>
//                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                     <Puzzle size={12} className="text-pink-500" />
//                     <span>OB Boosters — tracked via <span className="font-medium text-gray-600">activity_submissions</span></span>
//                   </div>
//                 </div>

//                 {/* 3-col grid */}
//                 <div className="grid grid-cols-3 gap-5">

//                   {/* Col 1 · Module list */}
//                   <div className="col-span-1 border rounded-xl bg-white p-4">
//                     <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

//                     <div className="flex flex-col gap-2">
//                       {currentModules.map(mod => {
//                         const isActive = activeModule === mod.id;
//                         const modPct   = mod.total ? Math.round((mod.done / mod.total) * 100) : 0;
//                         return (
//                           <button
//                             key={mod.id}
//                             onClick={() => handleModuleChange(mod)}
//                             disabled={mod.locked}
//                             className={`w-full text-left p-3 rounded-lg border transition-all
//                               ${mod.locked
//                                 ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
//                                 : isActive
//                                   ? 'border-[#8DC63F] bg-[#8DC63F]/5 cursor-pointer'
//                                   : 'border-gray-200 hover:border-[#8DC63F] hover:bg-[#8DC63F]/5 cursor-pointer'
//                               }`}
//                           >
//                             <div className="flex justify-between items-center mb-1.5">
//                               <span className={`text-sm font-medium ${isActive ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//                                 {mod.label}
//                               </span>
//                               {mod.locked
//                                 ? <Lock size={13} className="text-gray-400" />
//                                 : <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
//                                     {mod.done}/{mod.total}
//                                   </span>
//                               }
//                             </div>
//                             {!mod.locked && (
//                               <div className="w-full bg-gray-100 rounded-full h-1.5">
//                                 <div
//                                   className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//                                   style={{ width: `${modPct}%` }}
//                                 />
//                               </div>
//                             )}
//                             {mod.locked && (
//                               <p className="text-[10px] text-gray-400 mt-0.5">Coming soon</p>
//                             )}
//                           </button>
//                         );
//                       })}
//                     </div>

//                     {/* Module summary */}
//                     {activeModMeta && !activeModMeta.locked && (
//                       <div className="mt-4 pt-4 border-t">
//                         <div className="flex justify-between items-center mb-1.5">
//                           <span className="text-xs text-gray-500">{activeModMeta.label}</span>
//                           <span className="text-xs font-semibold text-[#8DC63F]">{pct}%</span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-2">
//                           <div
//                             className="h-2 rounded-full bg-[#8DC63F] transition-all duration-500"
//                             style={{ width: `${pct}%` }}
//                           />
//                         </div>
//                         <p className="text-[11px] text-gray-400 mt-1.5">{doneCount} of {totalCount} resources completed</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Col 2-3 · Resource list */}
//                   <div className="col-span-2">

//                     {/* Filter + search */}
//                     <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         {TYPE_FILTERS.map(f => (
//                           <button
//                             key={f.id}
//                             onClick={() => setActiveFilter(f.id)}
//                             className={`px-3 py-1.5 rounded-2xl border text-xs font-medium cursor-pointer transition-colors
//                               ${activeFilter === f.id
//                                 ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
//                                 : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'
//                               }`}
//                           >
//                             {f.label}
//                           </button>
//                         ))}
//                       </div>
//                       <div className="relative">
//                         <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                           type="text"
//                           placeholder="Search resources…"
//                           value={search}
//                           onChange={e => setSearch(e.target.value)}
//                           className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#8DC63F] w-48 transition-colors"
//                         />
//                       </div>
//                     </div>

//                     {/* Empty state */}
//                     {filtered.length === 0 && (
//                       <div className="flex flex-col items-center justify-center py-16 text-gray-400 border rounded-xl bg-white">
//                         <BookOpen size={36} className="mb-3 text-gray-300" />
//                         <p className="text-sm font-medium">No resources found</p>
//                         <p className="text-xs mt-1">Try adjusting your filter or search</p>
//                       </div>
//                     )}

//                     {/* Grouped accordion */}
//                     {Object.entries(grouped).map(([topic, items]) => {

//                       // Practice / Interpret / Test → flat list
//                       const isTypeBucket = items[0]?.type !== 'resource';
//                       if (isTypeBucket) {
//                         const meta = TYPE_META[items[0].type] || TYPE_META.resource;
//                         const Icon = meta.icon;
//                         return (
//                           <div key={topic} className="mb-5">
//                             <div className="flex items-center gap-2 mb-2">
//                               <Icon size={13} className={meta.color} />
//                               <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                                 {meta.label}
//                               </span>
//                               <div className="flex-1 h-px bg-gray-100" />
//                               <span className="text-[10px] text-gray-400">{items.length}</span>
//                             </div>
//                             <div className="flex flex-col gap-2">
//                               {items.map(r => <ResourceRow key={r.id} r={r} />)}
//                             </div>
//                           </div>
//                         );
//                       }

//                       // Learning Resources → accordion by topic
//                       const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
//                       const isOpen    = !!openTopics[topic];
//                       const topicDone = items.filter(r =>
//                         (r.completionSource === 'progress' && r.done) ||
//                         (r.completionSource === 'activity' && r.activityData?.attempts > 0)
//                       ).length;

//                       return (
//                         <div key={topic} className="mb-3">
//                           <button
//                             onClick={() => toggleTopic(topic)}
//                             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
//                               ${isOpen
//                                 ? 'border-[#8DC63F] bg-[#8DC63F]/5'
//                                 : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
//                               }`}
//                           >
//                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
//                               ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
//                               <TopicIcon size={15} />
//                             </div>

//                             <div className="flex-1 text-left">
//                               <p className={`text-sm font-semibold transition-colors
//                                 ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//                                 {topic}
//                               </p>
//                               <p className="text-[11px] text-gray-400 mt-0.5">
//                                 {topicDone}/{items.length} completed
//                               </p>
//                             </div>

//                             <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
//                               <div
//                                 className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//                                 style={{ width: `${items.length ? Math.round((topicDone / items.length) * 100) : 0}%` }}
//                               />
//                             </div>

//                             {isOpen
//                               ? <ChevronDown  size={16} className="text-[#8DC63F] flex-shrink-0" />
//                               : <ChevronRight size={16} className="text-gray-300 flex-shrink-0"  />
//                             }
//                           </button>

//                           {isOpen && (
//                             <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
//                               {items.map(r => <ResourceRow key={r.id} r={r} />)}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}

//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyLearning;

//above code is working
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
  FileText,
  Brain,
  Ruler,
  Search,
  Zap,
  Puzzle,
  Loader2,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:4004' || '';

const CERT_LABEL_MAP = {
  '8264bc83-1d80-47ac-aa6b-ca021ffb4ace': 'BTC',
  '24d9e2c4-42b0-4133-b801-d8cace4600f5': 'UFC',
};

// ─── RESOURCE ORDER ───────────────────────────────────────────────────────────

const RESOURCE_ORDER = {
  'BPD & HC::Transthalamic Plane': 1,
  'BPD & HC::Bi-Parietal Diameter': 2,
  'BPD & HC::Head Circumference': 3,
  'BPD & HC::Significance': 4,
  'BPD & HC::Anatomical Landmarks and Significance': 1,
  'BPD & HC::Anatomical Landmarks of the Transthalamic Plane': 1,
  'BPD & HC::Geometric shapes of key landmarks and their significance': 2,
  'BPD & HC::Mind Sparks - Anatomical Landmarks': 3,
  'BPD & HC:: How To Image The Plane': 1,
  'BPD & HC::Mind Sparks - Probe Movements': 2,
  'BPD & HC::How To Acquire The Transthalamic Plane': 3,
  'BPD & HC::Mind Sparks - Picture Pick': 4,
  'BPD & HC::Finding the fetal presentation': 1,
  'BPD & HC::Mind Sparks - Probe movements': 2,
  'BPD & HC::How to acquire the transthalamic plane': 3,
  'BPD & HC::How To Measure BPD': 1,
  'BPD & HC::How To Measure HC': 2,
  'BPD & HC::How to measure BPD': 1,
  'BPD & HC::How to measure HC': 2,
  'BPD & HC::Image Diagnosis': 1,
  'BPD & HC::Percentile Chart & Significance': 2,
  'BPD & HC::Percentile Charts  & Significance': 2,
  'BPD & HC::BPD Chart': 3,
  'BPD & HC::HC Chart': 4,
  'BPD & HC::Mind Sparks - Chart Interpretation': 5,
  'BPD & HC::Picture Pick': 1,
  'BPD & HC::True / False': 2,
  'BPD & HC::True/False': 2,
  'BPD & HC::Wordsearch': 3,
  'BPD & HC::Word Search': 3,
  'BPD & HC::Plane Acquisition Challenges': 1,
  'BPD & HC::Common Measurement Errors': 2,
  'AC::Transabdominal plane': 1,
  'AC::Abdominal circumference': 2,
  'AC::Significance': 3,
  'AC::Anatomical landmarks of the transabdominal plane': 1,
  'AC::Geometric shapes of key landmarks and their significance': 2,
  'AC::Mind Sparks - Anatomical Landmarks': 3,
  'AC::How to acquire the transabdominal plane': 1,
  'AC::Mind Sparks - Probe movements': 2,
  'AC::Mind Sparks - Picture pick': 3,
  'AC::How to measure AC': 1,
  'AC::Mind Sparks - Picture Pick': 2,
  'AC::Image Diagnosis': 1,
  'AC::Percentile Charts  & Significance': 2,
  'AC::AC chart': 3,
  'AC::Mind Sparks - Chart Interpretation': 4,
  'AC::Crossword puzzle': 1,
  'AC::True/False': 2,
  'AC::Picture Pick': 3,
  'AC::Plane Acquisition Challenges': 1,
  'AC::Common Measurement Errors': 2,
  'FL::Femur': 1,
  'FL::Femur diaphysis': 2,
  'FL::Significance': 3,
  'FL::Anatomical landmarks of the femur diaphysis plane': 1,
  'FL::Geometric shapes of key landmarks and their significance': 2,
  'FL::Mind Sparks - Anatomical Landmarks': 3,
  'FL::How to acquire the femur diaphysis plane': 1,
  'FL::Mind Sparks - Probe movements': 2,
  'FL::Mind Sparks - Picture pick': 3,
  'FL::How to measure FL': 1,
  'FL::MindSparks - Picture Pick': 2,
  'FL::Image Diagnosis': 1,
  'FL::Image diagnosis': 1,
  'FL::Percentile Charts  & Significance': 2,
  'FL::Percentile charts & significance': 2,
  'FL::AC chart': 3,
  'FL::FL chart': 3,
  'FL::Mind Sparks - Chart Interpretation': 4,
  'FL::Crossword puzzle': 1,
  'FL::Picture Pick': 2,
  'FL::True/False': 3,
  'FL::Plane Acquisition Challenges': 1,
  'FL::Common Measurement Errors': 2,
};

const TYPE_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'resource',  label: 'Learning Resource' },
  { id: 'practice',  label: 'Practice' },
  { id: 'interpret', label: 'Image Interpretation' },
  { id: 'test',      label: 'Test' },
];

const RESOURCE_TYPE_MAP = {
  'Learning Resource':    'resource',
  'Practice':             'practice',
  'Image Interpretation': 'interpret',
  'Test':                 'test',
};

const TYPE_META = {
  resource:  { label: 'Learning Resource',    icon: BookOpen,       color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  practice:  { label: 'Practice',             icon: Dumbbell,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
  interpret: { label: 'Image Interpretation', icon: Eye,            color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  test:      { label: 'Test',                 icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
};

// ─── TOPIC / MODULE ORDER ─────────────────────────────────────────────────────

const TOPIC_ORDER = [
  'Fetal Head',
  'Fetal abdomen',
  'Fetal Femur',
  'Anatomical Landmarks',
  'Anatomical landmarks',
  'Imaging the Plane',
  'Imaging the Transthalamic Plane',
  'Imaging the transabdominal plane',
  'Imaging the transfemoral plane',
  'Measurement',
  'Measurements',
  'Plane Acquisition Challenges and Common Measurement Errors',
  'Pitfalls in Plane Acquisition and Measurement',
  'Image Diagnosis',
  'Image diagnosis',
  'OB Boosters',
];

const MODULE_ORDER = ['BPD & HC', 'AC', 'FL'];

const TOPIC_ICONS = {
  'Fetal Head':                                                           Brain,
  'Fetal abdomen':                                                        Brain,
  'Fetal Femur':                                                          Brain,
  'Anatomical Landmarks':                                                  Search,
  'Anatomical landmarks':                                                  Search,
  'Imaging the Plane':                                                     Eye,
  'Imaging the plane':                                                     Eye,
  'Imaging the Transthalamic Plane':                                       Eye,
  'Imaging the transabdominal plane':                                      Eye,
  'Imaging the transfemoral plane':                                        Eye,
  'Measurements':                                                          Ruler,
  'Measurement':                                                           Ruler,
  'Image Diagnosis':                                                       FileText,
  'Image diagnosis':                                                       FileText,
  'OB Boosters':                                                           Puzzle,
  'Plane Acquisition':                                                     FileText,
  'Plane Acquisition Challenges and Common Measurement Errors':            FileText,
  'Pitfalls in Plane Acquisition and Measurement':                         FileText,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function isMindSpark(name = '') {
  const lower = name.toLowerCase();
  return lower.includes('mind spark') || lower.includes('mindspark');
}

function isOBBooster(topic = '') {
  return topic === 'OB Boosters';
}

function deriveCompletionSource(name, topic) {
  if (isMindSpark(name) || isOBBooster(topic)) return 'activity';
  return 'progress';
}

// ─── isResourceDone ── single source of truth for "done" check ───────────────

function isResourceDone(r) {
  if (r.completionSource === 'activity') return (r.activityData?.attempts ?? 0) > 0;
  return r.done === true;
}

// ─── API DATA TRANSFORMER ─────────────────────────────────────────────────────
//
// KEY FIX: Module done/total are recalculated from ALL resource types
// (not just Learning Resources as the API's moduleCompletion only counts those).

function transformApiData(apiResponse) {
  const { data = [] } = apiResponse;

  // ── 1. Build completion lookup: resource_id → is_completed ───────────────
  const completionMap = {};
  data.forEach(item => {
    if (item.resource_id) {
      completionMap[item.resource_id] = item.is_completed === true;
    }
  });

  // ── 2. Collect unique certificates ───────────────────────────────────────
  const certOrder = [];
  const certSeen  = new Set();
  data.forEach(item => {
    if (!certSeen.has(item.certificate_id)) {
      certSeen.add(item.certificate_id);
      certOrder.push({
        id:    item.certificate_id,
        label: CERT_LABEL_MAP[item.certificate_id] || item.course_name || item.certificate_id,
      });
    }
  });

  // ── 3. Collect modules per cert + resources per module ───────────────────
  const modulesByCert   = {};   // certId → Map<lmid, module meta>
  const resourcesByLMID = {};   // lmid   → resource[]

  data.forEach(item => {
    const { certificate_id, learning_module_id, unit_name, course_name } = item;

    if (!modulesByCert[certificate_id]) modulesByCert[certificate_id] = new Map();
    const certModules = modulesByCert[certificate_id];

    if (!certModules.has(learning_module_id)) {
      certModules.set(learning_module_id, {
        id:                 learning_module_id,
        learning_module_id: learning_module_id,
        label:              unit_name || course_name || learning_module_id,
        locked:             false,
        hasAnyResource:     false,
        // done/total will be recalculated after resources are built
        done:  0,
        total: 0,
      });
    }

    if (item.resource_id) {
      certModules.get(learning_module_id).hasAnyResource = true;
    }

    // ── Build resource list ─────────────────────────────────────────────────
    if (!item.resource_id) return;

    if (!resourcesByLMID[learning_module_id]) resourcesByLMID[learning_module_id] = [];

    // Deduplicate
    if (resourcesByLMID[learning_module_id].some(r => r.id === item.resource_id)) return;

    const typeKey          = RESOURCE_TYPE_MAP[item.resource_type] || 'resource';
    const completionSource = typeKey === 'resource'
      ? deriveCompletionSource(item.resource_name, item.resource_topic)
      : null;

    const isDone = completionMap[item.resource_id] === true;

    resourcesByLMID[learning_module_id].push({
      id:               item.resource_id,
      name:             (item.resource_name || '').trim(),
      type:             typeKey,
      topic:            item.resource_topic || '',
      completionSource: completionSource,
      done:             isDone,
      activityData:     completionSource === 'activity'
        ? { attempts: isDone ? 1 : 0, correct: isDone ? 1 : 0, total: 1 }
        : undefined,
    });
  });

  // ── 4. Finalise modules: set locked flag + sort ───────────────────────────
  const modulesByCertFinal = {};
  certOrder.forEach(cert => {
    const modMap = modulesByCert[cert.id];
    if (!modMap) {
      modulesByCertFinal[cert.id] = [];
      return;
    }
    modulesByCertFinal[cert.id] = Array.from(modMap.values())
      .map(mod => ({ ...mod, locked: !mod.hasAnyResource }))
      .sort((a, b) => {
        const ai = MODULE_ORDER.indexOf(a.label);
        const bi = MODULE_ORDER.indexOf(b.label);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
  });

  // ── 5. Sort resources within each module ─────────────────────────────────
  const sortedResources = {};
  Object.entries(resourcesByLMID).forEach(([lmid, items]) => {
    let unitName = '';
    Object.values(modulesByCertFinal).forEach(mods => {
      mods.forEach(m => { if (m.id === lmid) unitName = m.label; });
    });
    sortedResources[lmid] = [...items].sort((a, b) => {
      const posA = RESOURCE_ORDER[`${unitName}::${a.name}`] ?? 999;
      const posB = RESOURCE_ORDER[`${unitName}::${b.name}`] ?? 999;
      return posA - posB;
    });
  });

  // ── 6. KEY FIX: Recalculate done/total from ALL resource types ────────────
  //    The API's moduleCompletion only counts Learning Resources, so we ignore
  //    it and derive the counts ourselves from the full resource list.
  Object.values(modulesByCertFinal).forEach(mods => {
    mods.forEach(mod => {
      const res    = sortedResources[mod.id] || [];
      mod.total    = res.length;
      mod.done     = res.filter(isResourceDone).length;
    });
  });

  return { certs: certOrder, modules: modulesByCertFinal, resources: sortedResources };
}

// ─── COMPLETION STATUS BADGE ──────────────────────────────────────────────────

function CompletionStatus({ r }) {
  if (r.completionSource === 'progress') {
    return r.done ? (
      <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
        <CheckCircle2 size={15} className="fill-[#8DC63F] text-white" />
        <span className="text-[11px] font-semibold">Completed</span>
      </div>
    ) : (
      <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 flex-shrink-0">
        Not started
      </span>
    );
  }

  if (r.completionSource === 'activity') {
    const { attempts = 0, correct = 0, total = 1 } = r.activityData || {};
    const pct          = total > 0 ? Math.round((correct / total) * 100) : 0;
    const _isMindSpark = isMindSpark(r.name);

    if (attempts === 0) {
      return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {_isMindSpark
            ? <Zap    size={13} className="text-yellow-400" />
            : <Puzzle size={13} className="text-pink-400"   />
          }
          <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
            Not attempted
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <p className={`text-[11px] font-semibold leading-none ${pct === 100 ? 'text-[#8DC63F]' : 'text-yellow-500'}`}>
            {correct}/{total}
          </p>
          <p className="text-[9px] text-gray-400 mt-0.5">{attempts} attempt{attempts !== 1 ? 's' : ''}</p>
        </div>
        <div className="w-12 bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-[#8DC63F]' : 'bg-yellow-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && <CheckCircle2 size={14} className="fill-[#8DC63F] text-white flex-shrink-0" />}
      </div>
    );
  }

  // Non-LR types (practice / interpret / test) — no completionSource
  return (
    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
  );
}

// ─── RESOURCE ICON ────────────────────────────────────────────────────────────

function ResourceIcon({ r }) {
  const meta         = TYPE_META[r.type] || TYPE_META.resource;
  const _isMindSpark = isMindSpark(r.name);
  const _isOBBooster = isOBBooster(r.topic);

  if (_isMindSpark) {
    return (
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-50 border border-yellow-200">
        <Zap size={16} className="text-yellow-500" />
      </div>
    );
  }
  if (_isOBBooster) {
    return (
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-pink-50 border border-pink-200">
        <Puzzle size={16} className="text-pink-500" />
      </div>
    );
  }

  const Icon = meta.icon;
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
      <Icon size={16} className={meta.color} />
    </div>
  );
}

// ─── TYPE BADGE ───────────────────────────────────────────────────────────────

function ResourceTypeBadge({ r }) {
  const _isMindSpark = isMindSpark(r.name);
  const _isOBBooster = isOBBooster(r.topic);

  if (_isMindSpark) {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200">
        Mind Sparks
      </span>
    );
  }
  if (_isOBBooster) {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-pink-50 text-pink-500 border border-pink-200">
        OB Booster
      </span>
    );
  }

  const meta = TYPE_META[r.type] || TYPE_META.resource;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}>
      {meta.label}
    </span>
  );
}

// ─── RESOURCE ROW ─────────────────────────────────────────────────────────────

function ResourceRow({ r }) {
  const done = isResourceDone(r);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border bg-white cursor-pointer
      transition-all hover:shadow-sm group
      ${done
        ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]'
        : 'border-gray-200 hover:border-[#8DC63F]/50'
      }`}
    >
      <ResourceIcon r={r} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate
          ${done && r.completionSource === 'progress'
            ? 'text-gray-400'
            : 'text-gray-700 group-hover:text-[#8DC63F]'
          }`}
        >
          {r.name}
        </p>
      </div>

      <ResourceTypeBadge r={r} />
      <CompletionStatus  r={r} />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function MyLearning() {
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [loading,    setLoading]    = React.useState(true);
  const [error,      setError]      = React.useState(null);

  // Transformed data
  const [certs,     setCerts]     = React.useState([]);
  const [modules,   setModules]   = React.useState({});
  const [resources, setResources] = React.useState({});

  // UI state
  const [activeCert,   setActiveCert]   = React.useState('');
  const [activeModule, setActiveModule] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [search,       setSearch]       = React.useState('');
  const [openTopics,   setOpenTopics]   = React.useState({});

  // ── JWT / auth ─────────────────────────────────────────────────────────────
  const token   = localStorage.getItem('user_token');
  let   decoded = null;
  try { decoded = token ? jwtDecode(token) : null; } catch (_) {}
  const traineeId = decoded?.id || decoded?.sub || decoded?.userId || localStorage.getItem('people_id');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!traineeId || !token) return;

    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/api/v1/trainee/${traineeId}?isVr=false`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        const transformed = transformApiData(json);
        setCerts(transformed.certs);
        setModules(transformed.modules);
        setResources(transformed.resources);

        const firstCert = transformed.certs[0];
        if (firstCert) {
          setActiveCert(firstCert.id);
          const firstMods     = transformed.modules[firstCert.id] || [];
          const firstUnlocked = firstMods.find(m => !m.locked);
          setActiveModule(firstUnlocked?.id || firstMods[0]?.id || '');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [traineeId, token]);

  // ── Guard ──────────────────────────────────────────────────────────────────
  if (!decoded?.role) return <Navigate to="/" replace />;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleTopic = key =>
    setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCertChange = certId => {
    setActiveCert(certId);
    const mods          = modules[certId] || [];
    const firstUnlocked = mods.find(m => !m.locked);
    setActiveModule(firstUnlocked?.id || mods[0]?.id || '');
    setActiveFilter('all');
    setSearch('');
    setOpenTopics({});
  };

  const handleModuleChange = mod => {
    if (mod.locked) return;
    setActiveModule(mod.id);
    setActiveFilter('all');
    setSearch('');
    setOpenTopics({});
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const currentModules = modules[activeCert]    || [];
  const allRes         = resources[activeModule] || [];
  const activeModMeta  = currentModules.find(m => m.id === activeModule);

  // Module-level progress (already counts all types thanks to the fix)
  const doneCount  = activeModMeta?.done  ?? 0;
  const totalCount = activeModMeta?.total ?? 0;
  const pct        = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  // Filter + search
  const filtered = allRes.filter(r => {
    const matchType   = activeFilter === 'all' || r.type === activeFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Group: LR by topic, others by type key
  const grouped = filtered.reduce((acc, r) => {
    const key = r.type === 'resource' ? (r.topic || 'Learning Resource') : r.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const TYPE_BUCKET_ORDER = ['practice', 'interpret', 'test'];
  const sortedGroupKeys   = Object.keys(grouped).sort((a, b) => {
    const aIsType = TYPE_BUCKET_ORDER.includes(a);
    const bIsType = TYPE_BUCKET_ORDER.includes(b);
    if (!aIsType && !bIsType) {
      const ai = TOPIC_ORDER.indexOf(a);
      const bi = TOPIC_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    }
    if (aIsType && bIsType) return TYPE_BUCKET_ORDER.indexOf(a) - TYPE_BUCKET_ORDER.indexOf(b);
    return aIsType ? 1 : -1;
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        <div>
          <SideBar handleButtonOpen={() => setButtonOpen(p => !p)} buttonOpen={buttonOpen} />
        </div>

        <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow`}>

          {/* Breadcrumb */}
          <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border-b text-sm">
            <LayoutDashboard size={15} />
            Dashboard /
            <Notebook size={15} />
            <span className="text-gray-500 font-medium">My Learning</span>
          </div>

          <div className="p-5">

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader2 size={32} className="animate-spin mr-3" />
                <span className="text-sm">Loading your learning data…</span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-red-400">
                <p className="text-sm font-medium">Failed to load data</p>
                <p className="text-xs mt-1 text-gray-400">{error}</p>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Cert tabs */}
                <div className="flex items-center gap-3 mb-5">
                  {certs.map(cert => (
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

                {/* 3-col grid */}
                <div className="grid grid-cols-3 gap-5">

                  {/* Col 1 · Module list */}
                  <div className="col-span-1 border rounded-xl bg-white p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

                    <div className="flex flex-col gap-2">
                      {currentModules.map(mod => {
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
                                : (
                                  <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
                                    {mod.done}/{mod.total}
                                  </span>
                                )
                              }
                            </div>
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

                    {/* Module summary */}
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
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          {doneCount} of {totalCount} resources completed
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Col 2-3 · Resource list */}
                  <div className="col-span-2">

                    {/* Filter + search */}
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
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search resources…"
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

                    {/* Grouped accordion */}
                    {sortedGroupKeys.map(topic => {
                      const items = grouped[topic];

                      // Practice / Interpret / Test → flat list with header
                      const isTypeBucket = items[0]?.type !== 'resource';
                      if (isTypeBucket) {
                        const meta = TYPE_META[items[0].type] || TYPE_META.resource;
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

                      // Learning Resources → accordion by topic
                      const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
                      const isOpen    = !!openTopics[topic];
                      const topicDone = items.filter(isResourceDone).length;

                      return (
                        <div key={topic} className="mb-3">
                          <button
                            onClick={() => toggleTopic(topic)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
                              ${isOpen
                                ? 'border-[#8DC63F] bg-[#8DC63F]/5'
                                : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                              ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <TopicIcon size={15} />
                            </div>

                            <div className="flex-1 text-left">
                              <p className={`text-sm font-semibold transition-colors
                                ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
                                {topic}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {topicDone}/{items.length} completed
                              </p>
                            </div>

                            <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
                              <div
                                className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
                                style={{ width: `${items.length ? Math.round((topicDone / items.length) * 100) : 0}%` }}
                              />
                            </div>

                            {isOpen
                              ? <ChevronDown  size={16} className="text-[#8DC63F] flex-shrink-0" />
                              : <ChevronRight size={16} className="text-gray-300 flex-shrink-0"  />
                            }
                          </button>

                          {isOpen && (
                            <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
                              {items.map(r => <ResourceRow key={r.id} r={r} />)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLearning;