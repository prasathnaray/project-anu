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

// const BASE_URL = 'http://localhost:4004' || '';

// const CERT_LABEL_MAP = {
//   '8264bc83-1d80-47ac-aa6b-ca021ffb4ace': 'BTC',
//   '24d9e2c4-42b0-4133-b801-d8cace4600f5': 'UFC',
// };

// // ─── RESOURCE ORDER ───────────────────────────────────────────────────────────

// const RESOURCE_ORDER = {
//   'BPD & HC::Transthalamic Plane': 1,
//   'BPD & HC::Bi-Parietal Diameter': 2,
//   'BPD & HC::Head Circumference': 3,
//   'BPD & HC::Significance': 4,
//   'BPD & HC::Anatomical Landmarks and Significance': 1,
//   'BPD & HC::Anatomical Landmarks of the Transthalamic Plane': 1,
//   'BPD & HC::Geometric shapes of key landmarks and their significance': 2,
//   'BPD & HC::Mind Sparks - Anatomical Landmarks': 3,
//   'BPD & HC:: How To Image The Plane': 1,
//   'BPD & HC::Mind Sparks - Probe Movements': 2,
//   'BPD & HC::How To Acquire The Transthalamic Plane': 3,
//   'BPD & HC::Mind Sparks - Picture Pick': 4,
//   'BPD & HC::Finding the fetal presentation': 1,
//   'BPD & HC::Mind Sparks - Probe movements': 2,
//   'BPD & HC::How to acquire the transthalamic plane': 3,
//   'BPD & HC::How To Measure BPD': 1,
//   'BPD & HC::How To Measure HC': 2,
//   'BPD & HC::How to measure BPD': 1,
//   'BPD & HC::How to measure HC': 2,
//   'BPD & HC::Image Diagnosis': 1,
//   'BPD & HC::Percentile Chart & Significance': 2,
//   'BPD & HC::Percentile Charts  & Significance': 2,
//   'BPD & HC::BPD Chart': 3,
//   'BPD & HC::HC Chart': 4,
//   'BPD & HC::Mind Sparks - Chart Interpretation': 5,
//   'BPD & HC::Picture Pick': 1,
//   'BPD & HC::True / False': 2,
//   'BPD & HC::True/False': 2,
//   'BPD & HC::Wordsearch': 3,
//   'BPD & HC::Word Search': 3,
//   'BPD & HC::Plane Acquisition Challenges': 1,
//   'BPD & HC::Common Measurement Errors': 2,
//   'AC::Transabdominal plane': 1,
//   'AC::Abdominal circumference': 2,
//   'AC::Significance': 3,
//   'AC::Anatomical landmarks of the transabdominal plane': 1,
//   'AC::Geometric shapes of key landmarks and their significance': 2,
//   'AC::Mind Sparks - Anatomical Landmarks': 3,
//   'AC::How to acquire the transabdominal plane': 1,
//   'AC::Mind Sparks - Probe movements': 2,
//   'AC::Mind Sparks - Picture pick': 3,
//   'AC::How to measure AC': 1,
//   'AC::Mind Sparks - Picture Pick': 2,
//   'AC::Image Diagnosis': 1,
//   'AC::Percentile Charts  & Significance': 2,
//   'AC::AC chart': 3,
//   'AC::Mind Sparks - Chart Interpretation': 4,
//   'AC::Crossword puzzle': 1,
//   'AC::True/False': 2,
//   'AC::Picture Pick': 3,
//   'AC::Plane Acquisition Challenges': 1,
//   'AC::Common Measurement Errors': 2,
//   'FL::Femur': 1,
//   'FL::Femur diaphysis': 2,
//   'FL::Significance': 3,
//   'FL::Anatomical landmarks of the femur diaphysis plane': 1,
//   'FL::Geometric shapes of key landmarks and their significance': 2,
//   'FL::Mind Sparks - Anatomical Landmarks': 3,
//   'FL::How to acquire the femur diaphysis plane': 1,
//   'FL::Mind Sparks - Probe movements': 2,
//   'FL::Mind Sparks - Picture pick': 3,
//   'FL::How to measure FL': 1,
//   'FL::MindSparks - Picture Pick': 2,
//   'FL::Image Diagnosis': 1,
//   'FL::Image diagnosis': 1,
//   'FL::Percentile Charts  & Significance': 2,
//   'FL::Percentile charts & significance': 2,
//   'FL::AC chart': 3,
//   'FL::FL chart': 3,
//   'FL::Mind Sparks - Chart Interpretation': 4,
//   'FL::Crossword puzzle': 1,
//   'FL::Picture Pick': 2,
//   'FL::True/False': 3,
//   'FL::Plane Acquisition Challenges': 1,
//   'FL::Common Measurement Errors': 2,
// };

// const TYPE_FILTERS = [
//   { id: 'all', label: 'All' },
//   { id: 'resource', label: 'Learning Resource' },
//   { id: 'practice', label: 'Practice' },
//   { id: 'interpret', label: 'Image Interpretation' },
//   { id: 'test', label: 'Test' },
// ];

// const RESOURCE_TYPE_MAP = {
//   'Learning Resource': 'resource',
//   'Practice': 'practice',
//   'Image Interpretation': 'interpret',
//   'Test': 'test',
// };

// const TYPE_META = {
//   resource: { label: 'Learning Resource', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
//   practice: { label: 'Practice', icon: Dumbbell, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
//   interpret: { label: 'Image Interpretation', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
//   test: { label: 'Test', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
// };

// // ─── TOPIC / MODULE ORDER ─────────────────────────────────────────────────────

// const TOPIC_ORDER = [
//   'Fetal Head',
//   'Fetal abdomen',
//   'Fetal Femur',
//   'Anatomical Landmarks',
//   'Anatomical landmarks',
//   'Imaging the Plane',
//   'Imaging the Transthalamic Plane',
//   'Imaging the transabdominal plane',
//   'Imaging the transfemoral plane',
//   'Measurement',
//   'Measurements',
//   'Plane Acquisition Challenges and Common Measurement Errors',
//   'Pitfalls in Plane Acquisition and Measurement',
//   'Image Diagnosis',
//   'Image diagnosis',
//   'OB Boosters',
// ];

// const MODULE_ORDER = ['BPD & HC', 'AC', 'FL'];

// const TOPIC_ICONS = {
//   'Fetal Head': Brain,
//   'Fetal abdomen': Brain,
//   'Fetal Femur': Brain,
//   'Anatomical Landmarks': Search,
//   'Anatomical landmarks': Search,
//   'Imaging the Plane': Eye,
//   'Imaging the plane': Eye,
//   'Imaging the Transthalamic Plane': Eye,
//   'Imaging the transabdominal plane': Eye,
//   'Imaging the transfemoral plane': Eye,
//   'Measurements': Ruler,
//   'Measurement': Ruler,
//   'Image Diagnosis': FileText,
//   'Image diagnosis': FileText,
//   'OB Boosters': Puzzle,
//   'Plane Acquisition': FileText,
//   'Plane Acquisition Challenges and Common Measurement Errors': FileText,
//   'Pitfalls in Plane Acquisition and Measurement': FileText,
// };

// // ─── HELPERS ──────────────────────────────────────────────────────────────────

// function isMindSpark(name = '') {
//   const lower = name.toLowerCase();
//   return lower.includes('mind spark') || lower.includes('mindspark');
// }

// function isOBBooster(topic = '') {
//   return topic === 'OB Boosters';
// }

// function deriveCompletionSource(name, topic) {
//   if (isMindSpark(name) || isOBBooster(topic)) return 'activity';
//   return 'progress';
// }

// function isResourceDone(r) {
//   if (r.completionSource === 'activity') return (r.activityData?.attempts ?? 0) > 0;
//   return r.done === true;
// }

// // ─── BUILD TOPIC GROUPS ───────────────────────────────────────────────────────
// // Returns { accordions, directRows }
// // - accordions: items WITH a topic  → rendered as collapsible accordions
// // - directRows: items with NO topic → rendered directly, no wrapper

// function buildTopicGroups(items) {
//   const topicMap = {};
//   const directRows = [];

//   items.forEach(r => {
//     if (!r.topic) {
//       directRows.push(r);
//     } else {
//       if (!topicMap[r.topic]) topicMap[r.topic] = [];
//       topicMap[r.topic].push(r);
//     }
//   });

//   const accordions = Object.entries(topicMap)
//     .map(([topic, topicItems]) => ({ topic, items: topicItems }))
//     .sort((a, b) => {
//       const ai = TOPIC_ORDER.indexOf(a.topic);
//       const bi = TOPIC_ORDER.indexOf(b.topic);
//       return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
//     });

//   return { accordions, directRows };
// }

// // ─── API DATA TRANSFORMER ─────────────────────────────────────────────────────

// function transformApiData(apiResponse) {
//   const { data = [] } = apiResponse;

//   const completionMap = {};
//   data.forEach(item => {
//     if (item.resource_id) {
//       completionMap[item.resource_id] = item.is_completed === true;
//     }
//   });

//   const certOrder = [];
//   const certSeen = new Set();
//   data.forEach(item => {
//     if (!certSeen.has(item.certificate_id)) {
//       certSeen.add(item.certificate_id);
//       certOrder.push({
//         id: item.certificate_id,
//         label: CERT_LABEL_MAP[item.certificate_id] || item.course_name || item.certificate_id,
//       });
//     }
//   });

//   const modulesByCert = {};
//   const resourcesByLMID = {};

//   data.forEach(item => {
//     const { certificate_id, learning_module_id, unit_name, course_name } = item;

//     if (!modulesByCert[certificate_id]) modulesByCert[certificate_id] = new Map();
//     const certModules = modulesByCert[certificate_id];

//     if (!certModules.has(learning_module_id)) {
//       certModules.set(learning_module_id, {
//         id: learning_module_id,
//         learning_module_id: learning_module_id,
//         label: unit_name || course_name || learning_module_id,
//         locked: false,
//         hasAnyResource: false,
//         done: 0,
//         total: 0,
//       });
//     }

//     if (item.resource_id) certModules.get(learning_module_id).hasAnyResource = true;
//     if (!item.resource_id) return;

//     if (!resourcesByLMID[learning_module_id]) resourcesByLMID[learning_module_id] = [];
//     if (resourcesByLMID[learning_module_id].some(r => r.id === item.resource_id)) return;

//     const typeKey = RESOURCE_TYPE_MAP[item.resource_type] || 'resource';
//     const completionSource = typeKey === 'resource'
//       ? deriveCompletionSource(item.resource_name, item.resource_topic)
//       : null;
//     const isDone = completionMap[item.resource_id] === true;

//     resourcesByLMID[learning_module_id].push({
//       id: item.resource_id,
//       name: (item.resource_name || '').trim(),
//       type: typeKey,
//       topic: item.resource_topic || '',
//       completionSource,
//       done: isDone,
//       activityData: completionSource === 'activity'
//         ? { attempts: isDone ? 1 : 0, correct: isDone ? 1 : 0, total: 1 }
//         : undefined,
//     });
//   });

//   const modulesByCertFinal = {};
//   certOrder.forEach(cert => {
//     const modMap = modulesByCert[cert.id];
//     if (!modMap) { modulesByCertFinal[cert.id] = []; return; }
//     modulesByCertFinal[cert.id] = Array.from(modMap.values())
//       .map(mod => ({ ...mod, locked: !mod.hasAnyResource }))
//       .sort((a, b) => {
//         const ai = MODULE_ORDER.indexOf(a.label);
//         const bi = MODULE_ORDER.indexOf(b.label);
//         return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
//       });
//   });

//   const sortedResources = {};
//   Object.entries(resourcesByLMID).forEach(([lmid, items]) => {
//     let unitName = '';
//     Object.values(modulesByCertFinal).forEach(mods => {
//       mods.forEach(m => { if (m.id === lmid) unitName = m.label; });
//     });
//     sortedResources[lmid] = [...items].sort((a, b) => {
//       const posA = RESOURCE_ORDER[`${unitName}::${a.name}`] ?? 999;
//       const posB = RESOURCE_ORDER[`${unitName}::${b.name}`] ?? 999;
//       return posA - posB;
//     });
//   });

//   Object.values(modulesByCertFinal).forEach(mods => {
//     mods.forEach(mod => {
//       const res = sortedResources[mod.id] || [];
//       mod.total = res.length;
//       mod.done = res.filter(isResourceDone).length;
//     });
//   });

//   return { certs: certOrder, modules: modulesByCertFinal, resources: sortedResources };
// }

// // ─── COMPLETION STATUS ────────────────────────────────────────────────────────

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
//     const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

//     if (attempts === 0) {
//       return (
//         <div className="flex items-center gap-1.5 flex-shrink-0">
//           {isMindSpark(r.name)
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

//   // practice / interpret / test — no completionSource
//   return r.done ? (
//     <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
//       <CheckCircle2 size={15} className="fill-[#8DC63F] text-white" />
//       <span className="text-[11px] font-semibold">Completed</span>
//     </div>
//   ) : (
//     <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
//   );
// }

// // ─── RESOURCE ICON ────────────────────────────────────────────────────────────

// function ResourceIcon({ r }) {
//   const meta = TYPE_META[r.type] || TYPE_META.resource;

//   if (isMindSpark(r.name)) {
//     return (
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-50 border border-yellow-200">
//         <Zap size={16} className="text-yellow-500" />
//       </div>
//     );
//   }
//   if (isOBBooster(r.topic)) {
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
//   if (isMindSpark(r.name)) {
//     return (
//       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200">
//         Mind Sparks
//       </span>
//     );
//   }
//   if (isOBBooster(r.topic)) {
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
//   const done = isResourceDone(r);
//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-xl border bg-white cursor-pointer
//       transition-all hover:shadow-sm group
//       ${done
//         ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]'
//         : 'border-gray-200 hover:border-[#8DC63F]/50'
//       }`}
//     >
//       <ResourceIcon r={r} />
//       <div className="flex-1 min-w-0">
//         <p className={`text-sm font-medium truncate
//           ${done && r.completionSource === 'progress'
//             ? 'text-gray-400'
//             : 'text-gray-700 group-hover:text-[#8DC63F]'
//           }`}
//         >
//           {r.name}
//         </p>
//       </div>
//       <ResourceTypeBadge r={r} />
//       <CompletionStatus r={r} />
//     </div>
//   );
// }

// // ─── TOPIC ACCORDION ─────────────────────────────────────────────────────────

// function TopicAccordion({ topic, items, isOpen, onToggle }) {
//   const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
//   const topicDone = items.filter(isResourceDone).length;
//   const pct = items.length ? Math.round((topicDone / items.length) * 100) : 0;

//   return (
//     <div className="mb-3">
//       <button
//         onClick={onToggle}
//         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
//           ${isOpen
//             ? 'border-[#8DC63F] bg-[#8DC63F]/5'
//             : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
//           }`}
//       >
//         <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
//           ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
//           <TopicIcon size={15} />
//         </div>
//         <div className="flex-1 text-left">
//           <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//             {topic}
//           </p>
//           <p className="text-[11px] text-gray-400 mt-0.5">{topicDone}/{items.length} completed</p>
//         </div>
//         <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
//           <div
//             className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//         {isOpen
//           ? <ChevronDown size={16} className="text-[#8DC63F] flex-shrink-0" />
//           : <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
//         }
//       </button>

//       {isOpen && (
//         <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
//           {items.map(r => <ResourceRow key={r.id} r={r} />)}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── TYPE SECTION ─────────────────────────────────────────────────────────────

// function TypeSection({ typeKey, accordions, directRows, flatList, openTopics, onToggleTopic }) {
//   const meta = TYPE_META[typeKey] || TYPE_META.resource;
//   const Icon = meta.icon;
//   const total = accordions.reduce((s, g) => s + g.items.length, 0) + directRows.length;

//   return (
//     <div className="mb-6">
//       {/* Section header */}
//       <div className="flex items-center gap-2 mb-3">
//         <Icon size={13} className={meta.color} />
//         <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           {meta.label}
//         </span>
//         <div className="flex-1 h-px bg-gray-100" />
//         <span className="text-[10px] text-gray-400">{total}</span>
//       </div>

//       {flatList ? (
//         // interpret + test → always flat, no accordions
//         <div className="flex flex-col gap-2">
//           {directRows.map(r => <ResourceRow key={r.id} r={r} />)}
//         </div>
//       ) : (
//         <>
//           {/* Topic accordions — items that have a topic */}
//           {accordions.map(({ topic, items }) => (
//             <TopicAccordion
//               key={topic}
//               topic={topic}
//               items={items}
//               isOpen={!!openTopics[`${typeKey}::${topic}`]}
//               onToggle={() => onToggleTopic(`${typeKey}::${topic}`)}
//             />
//           ))}

//           {/* Direct rows — items with NO topic, rendered straight, no wrapper */}
//           {directRows.length > 0 && (
//             <div className="flex flex-col gap-2 mt-1">
//               {directRows.map(r => <ResourceRow key={r.id} r={r} />)}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// function MyLearning() {
//   const [buttonOpen, setButtonOpen] = React.useState(true);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   const [certs, setCerts] = React.useState([]);
//   const [modules, setModules] = React.useState({});
//   const [resources, setResources] = React.useState({});

//   const [activeCert, setActiveCert] = React.useState('');
//   const [activeModule, setActiveModule] = React.useState('');
//   const [activeFilter, setActiveFilter] = React.useState('all');
//   const [search, setSearch] = React.useState('');
//   const [openTopics, setOpenTopics] = React.useState({});

//   // ── Auth ───────────────────────────────────────────────────────────────────
//   const token = localStorage.getItem('user_token');
//   let decoded = null;
//   try { decoded = token ? jwtDecode(token) : null; } catch (_) { }
//   const traineeId = decoded?.id || decoded?.sub || decoded?.userId || localStorage.getItem('people_id');

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

//         const firstCert = transformed.certs[0];
//         if (firstCert) {
//           setActiveCert(firstCert.id);
//           const firstMods = transformed.modules[firstCert.id] || [];
//           const firstUnlocked = firstMods.find(m => !m.locked);
//           setActiveModule(firstUnlocked?.id || firstMods[0]?.id || '');
//         }
//       })
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [traineeId, token]);

//   if (!decoded?.role) return <Navigate to="/" replace />;

//   // ── Handlers ───────────────────────────────────────────────────────────────
//   const toggleTopic = key =>
//     setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

//   const handleCertChange = certId => {
//     setActiveCert(certId);
//     const mods = modules[certId] || [];
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

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const currentModules = modules[activeCert] || [];
//   const allRes = resources[activeModule] || [];
//   const activeModMeta = currentModules.find(m => m.id === activeModule);

//   const doneCount = activeModMeta?.done ?? 0;
//   const totalCount = activeModMeta?.total ?? 0;
//   const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

//   // Filter + search
//   const filtered = allRes.filter(r => {
//     const matchType = activeFilter === 'all' || r.type === activeFilter;
//     const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
//     return matchType && matchSearch;
//   });

//   // ── Build sections ─────────────────────────────────────────────────────────
//   const SECTION_ORDER = ['resource', 'practice', 'interpret', 'test'];

//   const byType = filtered.reduce((acc, r) => {
//     if (!acc[r.type]) acc[r.type] = [];
//     acc[r.type].push(r);
//     return acc;
//   }, {});

//   const sections = SECTION_ORDER
//     .filter(typeKey => byType[typeKey]?.length > 0)
//     .map(typeKey => {
//       const isFlat = typeKey === 'interpret' || typeKey === 'test';
//       if (isFlat) {
//         return { typeKey, flatList: true, accordions: [], directRows: byType[typeKey] };
//       }
//       const { accordions, directRows } = buildTopicGroups(byType[typeKey]);
//       return { typeKey, flatList: false, accordions, directRows };
//     });

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

//             {loading && (
//               <div className="flex items-center justify-center py-24 text-gray-400">
//                 <Loader2 size={32} className="animate-spin mr-3" />
//                 <span className="text-sm">Loading your learning data…</span>
//               </div>
//             )}

//             {error && !loading && (
//               <div className="flex flex-col items-center justify-center py-24 text-red-400">
//                 <p className="text-sm font-medium">Failed to load data</p>
//                 <p className="text-xs mt-1 text-gray-400">{error}</p>
//               </div>
//             )}

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

//                 <div className="grid grid-cols-3 gap-5">

//                   {/* Col 1 — Module list */}
//                   <div className="col-span-1 border rounded-xl bg-white p-4">
//                     <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

//                     <div className="flex flex-col gap-2">
//                       {currentModules.map(mod => {
//                         const isActive = activeModule === mod.id;
//                         const modPct = mod.total ? Math.round((mod.done / mod.total) * 100) : 0;
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
//                                 : (
//                                   <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
//                                     {mod.done}/{mod.total}
//                                   </span>
//                                 )
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
//                         <p className="text-[11px] text-gray-400 mt-1.5">
//                           {doneCount} of {totalCount} resources completed
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Col 2-3 — Resource list */}
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

//                     {/* Sections */}
//                     {sections.map(({ typeKey, flatList, accordions, directRows }) => (
//                       <TypeSection
//                         key={typeKey}
//                         typeKey={typeKey}
//                         flatList={flatList}
//                         accordions={accordions}
//                         directRows={directRows}
//                         openTopics={openTopics}
//                         onToggleTopic={toggleTopic}
//                       />
//                     ))}

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

//export default MyLearning;

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
//   History,
//   MessageSquare,
//   TrendingUp,
//   Calendar,
//   Target,
//   AlertCircle,
//   CheckCheck,
//   X,
//   RotateCcw,
//   StickyNote,
// } from 'lucide-react';

// // ─── CONSTANTS ────────────────────────────────────────────────────────────────

// const BASE_URL = 'http://localhost:4004' || '';

// const CERT_LABEL_MAP = {
//   '8264bc83-1d80-47ac-aa6b-ca021ffb4ace': 'BTC',
//   '24d9e2c4-42b0-4133-b801-d8cace4600f5': 'UFC',
// };

// // ─── RESOURCE ORDER ───────────────────────────────────────────────────────────

// const RESOURCE_ORDER = {
//   'BPD & HC::Transthalamic Plane': 1,
//   'BPD & HC::Bi-Parietal Diameter': 2,
//   'BPD & HC::Head Circumference': 3,
//   'BPD & HC::Significance': 4,
//   'BPD & HC::Anatomical Landmarks and Significance': 1,
//   'BPD & HC::Anatomical Landmarks of the Transthalamic Plane': 1,
//   'BPD & HC::Geometric shapes of key landmarks and their significance': 2,
//   'BPD & HC::Mind Sparks - Anatomical Landmarks': 3,
//   'BPD & HC:: How To Image The Plane': 1,
//   'BPD & HC::Mind Sparks - Probe Movements': 2,
//   'BPD & HC::How To Acquire The Transthalamic Plane': 3,
//   'BPD & HC::Mind Sparks - Picture Pick': 4,
//   'BPD & HC::Finding the fetal presentation': 1,
//   'BPD & HC::Mind Sparks - Probe movements': 2,
//   'BPD & HC::How to acquire the transthalamic plane': 3,
//   'BPD & HC::How To Measure BPD': 1,
//   'BPD & HC::How To Measure HC': 2,
//   'BPD & HC::How to measure BPD': 1,
//   'BPD & HC::How to measure HC': 2,
//   'BPD & HC::Image Diagnosis': 1,
//   'BPD & HC::Percentile Chart & Significance': 2,
//   'BPD & HC::Percentile Charts  & Significance': 2,
//   'BPD & HC::BPD Chart': 3,
//   'BPD & HC::HC Chart': 4,
//   'BPD & HC::Mind Sparks - Chart Interpretation': 5,
//   'BPD & HC::Picture Pick': 1,
//   'BPD & HC::True / False': 2,
//   'BPD & HC::True/False': 2,
//   'BPD & HC::Wordsearch': 3,
//   'BPD & HC::Word Search': 3,
//   'BPD & HC::Plane Acquisition Challenges': 1,
//   'BPD & HC::Common Measurement Errors': 2,
//   'AC::Transabdominal plane': 1,
//   'AC::Abdominal circumference': 2,
//   'AC::Significance': 3,
//   'AC::Anatomical landmarks of the transabdominal plane': 1,
//   'AC::Geometric shapes of key landmarks and their significance': 2,
//   'AC::Mind Sparks - Anatomical Landmarks': 3,
//   'AC::How to acquire the transabdominal plane': 1,
//   'AC::Mind Sparks - Probe movements': 2,
//   'AC::Mind Sparks - Picture pick': 3,
//   'AC::How to measure AC': 1,
//   'AC::Mind Sparks - Picture Pick': 2,
//   'AC::Image Diagnosis': 1,
//   'AC::Percentile Charts  & Significance': 2,
//   'AC::AC chart': 3,
//   'AC::Mind Sparks - Chart Interpretation': 4,
//   'AC::Crossword puzzle': 1,
//   'AC::True/False': 2,
//   'AC::Picture Pick': 3,
//   'AC::Plane Acquisition Challenges': 1,
//   'AC::Common Measurement Errors': 2,
//   'FL::Femur': 1,
//   'FL::Femur diaphysis': 2,
//   'FL::Significance': 3,
//   'FL::Anatomical landmarks of the femur diaphysis plane': 1,
//   'FL::Geometric shapes of key landmarks and their significance': 2,
//   'FL::Mind Sparks - Anatomical Landmarks': 3,
//   'FL::How to acquire the femur diaphysis plane': 1,
//   'FL::Mind Sparks - Probe movements': 2,
//   'FL::Mind Sparks - Picture pick': 3,
//   'FL::How to measure FL': 1,
//   'FL::MindSparks - Picture Pick': 2,
//   'FL::Image Diagnosis': 1,
//   'FL::Image diagnosis': 1,
//   'FL::Percentile Charts  & Significance': 2,
//   'FL::Percentile charts & significance': 2,
//   'FL::AC chart': 3,
//   'FL::FL chart': 3,
//   'FL::Mind Sparks - Chart Interpretation': 4,
//   'FL::Crossword puzzle': 1,
//   'FL::Picture Pick': 2,
//   'FL::True/False': 3,
//   'FL::Plane Acquisition Challenges': 1,
//   'FL::Common Measurement Errors': 2,
// };

// const TYPE_FILTERS = [
//   { id: 'all', label: 'All' },
//   { id: 'resource', label: 'Learning Resource' },
//   { id: 'practice', label: 'Practice' },
//   { id: 'interpret', label: 'Image Interpretation' },
//   { id: 'test', label: 'Test' },
// ];

// const RESOURCE_TYPE_MAP = {
//   'Learning Resource': 'resource',
//   'Practice': 'practice',
//   'Image Interpretation': 'interpret',
//   'Test': 'test',
// };

// const TYPE_META = {
//   resource: { label: 'Learning Resource', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
//   practice: { label: 'Practice', icon: Dumbbell, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
//   interpret: { label: 'Image Interpretation', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
//   test: { label: 'Test', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
// };

// // ─── TOPIC / MODULE ORDER ─────────────────────────────────────────────────────

// const TOPIC_ORDER = [
//   'Fetal Head',
//   'Fetal abdomen',
//   'Fetal Femur',
//   'Anatomical Landmarks',
//   'Anatomical landmarks',
//   'Imaging the Plane',
//   'Imaging the Transthalamic Plane',
//   'Imaging the transabdominal plane',
//   'Imaging the transfemoral plane',
//   'Measurement',
//   'Measurements',
//   'Plane Acquisition Challenges and Common Measurement Errors',
//   'Pitfalls in Plane Acquisition and Measurement',
//   'Image Diagnosis',
//   'Image diagnosis',
//   'OB Boosters',
// ];

// const MODULE_ORDER = ['BPD & HC', 'AC', 'FL'];

// const TOPIC_ICONS = {
//   'Fetal Head': Brain,
//   'Fetal abdomen': Brain,
//   'Fetal Femur': Brain,
//   'Anatomical Landmarks': Search,
//   'Anatomical landmarks': Search,
//   'Imaging the Plane': Eye,
//   'Imaging the plane': Eye,
//   'Imaging the Transthalamic Plane': Eye,
//   'Imaging the transabdominal plane': Eye,
//   'Imaging the transfemoral plane': Eye,
//   'Measurements': Ruler,
//   'Measurement': Ruler,
//   'Image Diagnosis': FileText,
//   'Image diagnosis': FileText,
//   'OB Boosters': Puzzle,
//   'Plane Acquisition': FileText,
//   'Plane Acquisition Challenges and Common Measurement Errors': FileText,
//   'Pitfalls in Plane Acquisition and Measurement': FileText,
// };

// // ─── HELPERS ──────────────────────────────────────────────────────────────────

// function isMindSpark(name = '') {
//   const lower = name.toLowerCase();
//   return lower.includes('mind spark') || lower.includes('mindspark');
// }

// function isOBBooster(topic = '') {
//   return topic === 'OB Boosters';
// }

// function deriveCompletionSource(name, topic) {
//   if (isMindSpark(name) || isOBBooster(topic)) return 'activity';
//   return 'progress';
// }

// function isResourceDone(r) {
//   if (r.completionSource === 'activity') return (r.activityData?.attempts ?? 0) > 0;
//   return r.done === true;
// }

// // ─── STATIC IMAGE INTERPRETATION SCORES (replace with API data later) ────────

// const STATIC_INTERPRET_SCORES = {
//   'Find the Image': { score: 8, total: 10, results: [true, true, true, false, true, true, false, true, true, true] },
//   'Annotation 1': { score: 8, total: 10, results: [true, true, false, true, true, true, true, false, true, true] },
//   'Annotation 2': { score: 4, total: 10, results: [true, false, false, true, false, true, false, false, true, false] },
//   'Measurement': { score: 6, total: 10, results: [true, true, false, true, true, false, true, false, false, true] },
// };

// // ─── PRACTICE NUMBER HELPER ───────────────────────────────────────────────────
// // Returns 1-based practice number from name like "Practice 1", "Practice 2", etc.
// function getPracticeNumber(name = '') {
//   const match = name.match(/practice\s+(\d+)/i);
//   return match ? parseInt(match[1], 10) : null;
// }

// // P1 & P2 → show reattempt logs only
// // P3 & P4 → show reattempt logs + feedback
// function practiceShowsLog(name) {
//   const n = getPracticeNumber(name);
//   return n !== null && n >= 1 && n <= 4;
// }

// function practiceShowsFeedback(name) {
//   const n = getPracticeNumber(name);
//   return n !== null && n >= 3 && n <= 4;
// }

// // ─── BUILD TOPIC GROUPS ───────────────────────────────────────────────────────

// function buildTopicGroups(items) {
//   const topicMap = {};
//   const directRows = [];

//   items.forEach(r => {
//     if (!r.topic) {
//       directRows.push(r);
//     } else {
//       if (!topicMap[r.topic]) topicMap[r.topic] = [];
//       topicMap[r.topic].push(r);
//     }
//   });

//   const accordions = Object.entries(topicMap)
//     .map(([topic, topicItems]) => ({ topic, items: topicItems }))
//     .sort((a, b) => {
//       const ai = TOPIC_ORDER.indexOf(a.topic);
//       const bi = TOPIC_ORDER.indexOf(b.topic);
//       return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
//     });

//   return { accordions, directRows };
// }

// // ─── API DATA TRANSFORMER ─────────────────────────────────────────────────────

// function transformApiData(apiResponse) {
//   const { data = [], reAttempts = [] } = apiResponse;

//   // Build reattempt map keyed by resource_id
//   const reAttemptMap = {};
//   reAttempts.forEach(ra => {
//     if (!ra.resource_id) return;
//     if (!reAttemptMap[ra.resource_id]) reAttemptMap[ra.resource_id] = [];
//     reAttemptMap[ra.resource_id].push(ra);
//   });

//   const completionMap = {};
//   data.forEach(item => {
//     if (item.resource_id) {
//       completionMap[item.resource_id] = item.is_completed === true;
//     }
//   });

//   const certOrder = [];
//   const certSeen = new Set();
//   data.forEach(item => {
//     if (!certSeen.has(item.certificate_id)) {
//       certSeen.add(item.certificate_id);
//       certOrder.push({
//         id: item.certificate_id,
//         label: CERT_LABEL_MAP[item.certificate_id] || item.course_name || item.certificate_id,
//       });
//     }
//   });

//   const modulesByCert = {};
//   const resourcesByLMID = {};

//   data.forEach(item => {
//     const { certificate_id, learning_module_id, unit_name, course_name } = item;

//     if (!modulesByCert[certificate_id]) modulesByCert[certificate_id] = new Map();
//     const certModules = modulesByCert[certificate_id];

//     if (!certModules.has(learning_module_id)) {
//       certModules.set(learning_module_id, {
//         id: learning_module_id,
//         learning_module_id: learning_module_id,
//         label: unit_name || course_name || learning_module_id,
//         locked: false,
//         hasAnyResource: false,
//         done: 0,
//         total: 0,
//       });
//     }

//     if (item.resource_id) certModules.get(learning_module_id).hasAnyResource = true;
//     if (!item.resource_id) return;

//     if (!resourcesByLMID[learning_module_id]) resourcesByLMID[learning_module_id] = [];
//     if (resourcesByLMID[learning_module_id].some(r => r.id === item.resource_id)) return;

//     const typeKey = RESOURCE_TYPE_MAP[item.resource_type] || 'resource';
//     const completionSource = typeKey === 'resource'
//       ? deriveCompletionSource(item.resource_name, item.resource_topic)
//       : null;
//     const isDone = completionMap[item.resource_id] === true;

//     resourcesByLMID[learning_module_id].push({
//       id: item.resource_id,
//       name: (item.resource_name || '').trim(),
//       type: typeKey,
//       topic: item.resource_topic || '',
//       completionSource,
//       done: isDone,
//       updatedAt: item.updated_at || null,
//       reAttempts: reAttemptMap[item.resource_id] || [],
//       activityData: completionSource === 'activity'
//         ? { attempts: isDone ? 1 : 0, correct: isDone ? 1 : 0, total: 1 }
//         : undefined,
//     });
//   });

//   const modulesByCertFinal = {};
//   certOrder.forEach(cert => {
//     const modMap = modulesByCert[cert.id];
//     if (!modMap) { modulesByCertFinal[cert.id] = []; return; }
//     modulesByCertFinal[cert.id] = Array.from(modMap.values())
//       .map(mod => ({ ...mod, locked: !mod.hasAnyResource }))
//       .sort((a, b) => {
//         const ai = MODULE_ORDER.indexOf(a.label);
//         const bi = MODULE_ORDER.indexOf(b.label);
//         return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
//       });
//   });

//   const sortedResources = {};
//   Object.entries(resourcesByLMID).forEach(([lmid, items]) => {
//     let unitName = '';
//     Object.values(modulesByCertFinal).forEach(mods => {
//       mods.forEach(m => { if (m.id === lmid) unitName = m.label; });
//     });
//     sortedResources[lmid] = [...items].sort((a, b) => {
//       const posA = RESOURCE_ORDER[`${unitName}::${a.name}`] ?? 999;
//       const posB = RESOURCE_ORDER[`${unitName}::${b.name}`] ?? 999;
//       return posA - posB;
//     });
//   });

//   Object.values(modulesByCertFinal).forEach(mods => {
//     mods.forEach(mod => {
//       const res = sortedResources[mod.id] || [];
//       mod.total = res.length;
//       mod.done = res.filter(isResourceDone).length;
//     });
//   });

//   return { certs: certOrder, modules: modulesByCertFinal, resources: sortedResources };
// }

// // ─── FORMAT DATE ─────────────────────────────────────────────────────────────

// function formatDate(dateStr) {
//   if (!dateStr) return '—';
//   try {
//     const d = new Date(dateStr);
//     return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
//   } catch {
//     return dateStr;
//   }
// }

// function formatDateTime(dateStr) {
//   if (!dateStr) return '—';
//   try {
//     const d = new Date(dateStr);
//     return d.toLocaleString('en-IN', {
//       day: '2-digit', month: 'short', year: 'numeric',
//       hour: '2-digit', minute: '2-digit',
//     });
//   } catch {
//     return dateStr;
//   }
// }

// // ─── REATTEMPT LOG PANEL ──────────────────────────────────────────────────────

// function ReattemptLog({ reAttempts, updatedAt }) {
//   // Build attempt list: if reAttempts array is populated use it,
//   // otherwise synthesise a single entry from updatedAt
//   const attempts = reAttempts.length > 0
//     ? reAttempts
//     : (updatedAt ? [{ attempted_at: updatedAt, score: null, is_completed: true, attempt_number: 1 }] : []);

//   if (attempts.length === 0) {
//     return (
//       <div className="flex items-center gap-2 text-gray-400 py-2 px-3">
//         <History size={13} />
//         <span className="text-xs">No attempt history yet</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-1.5">
//       {attempts.map((attempt, idx) => {
//         const attemptNo = attempt.attempt_number ?? (attempts.length - idx);
//         const isReattempt = attemptNo > 1;
//         const score = attempt.score ?? attempt.percentage ?? null;
//         const passed = attempt.is_completed === true || attempt.passed === true;

//         return (
//           <div
//             key={idx}
//             className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs
//               ${isReattempt
//                 ? 'border-amber-200 bg-amber-50/60'
//                 : 'border-gray-100 bg-gray-50'
//               }`}
//           >
//             <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px]
//               ${passed ? 'bg-[#8DC63F] text-white' : 'bg-red-100 text-red-500'}`}>
//               {attemptNo}
//             </div>
//             <div className="flex-1 min-w-0">
//               <span className={`font-medium ${isReattempt ? 'text-amber-700' : 'text-gray-600'}`}>
//                 {isReattempt ? `Re-attempt ${attemptNo - 1}` : 'First attempt'}
//               </span>
//               {attempt.attempted_at && (
//                 <span className="ml-2 text-gray-400">{formatDateTime(attempt.attempted_at)}</span>
//               )}
//             </div>
//             {score !== null && (
//               <span className={`font-semibold flex-shrink-0
//                 ${score >= 80 ? 'text-[#8DC63F]' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
//                 {score}%
//               </span>
//             )}
//             <div className={`flex items-center gap-1 flex-shrink-0
//               ${passed ? 'text-[#8DC63F]' : 'text-red-400'}`}>
//               {passed
//                 ? <><CheckCheck size={12} /><span className="text-[10px] font-medium">Pass</span></>
//                 : <><X size={12} /><span className="text-[10px] font-medium">Fail</span></>
//               }
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── FEEDBACK PANEL ──────────────────────────────────────────────────────────

// function FeedbackPanel({ reAttempts, resourceName }) {
//   // Collect all feedback entries from all attempts
//   const feedbackEntries = reAttempts.flatMap((ra, idx) => {
//     const feedbacks = [];

//     // instructor / expert feedback text
//     if (ra.feedback || ra.instructor_feedback || ra.expert_feedback) {
//       feedbacks.push({
//         attemptNo: ra.attempt_number ?? (idx + 1),
//         type: 'text',
//         text: ra.feedback || ra.instructor_feedback || ra.expert_feedback,
//         by: ra.feedback_by || ra.instructor_name || 'Instructor',
//         date: ra.feedback_at || ra.attempted_at,
//       });
//     }

//     // measurement comparison
//     if (ra.user_measurement !== undefined || ra.expert_measurement !== undefined) {
//       feedbacks.push({
//         attemptNo: ra.attempt_number ?? (idx + 1),
//         type: 'measurement',
//         userValue: ra.user_measurement,
//         expertValue: ra.expert_measurement,
//         offset: ra.offset,
//         unit: ra.unit || 'mm',
//         date: ra.attempted_at,
//       });
//     }

//     // structured guidance notes
//     if (ra.guidance_notes) {
//       feedbacks.push({
//         attemptNo: ra.attempt_number ?? (idx + 1),
//         type: 'guidance',
//         notes: Array.isArray(ra.guidance_notes) ? ra.guidance_notes : [ra.guidance_notes],
//         date: ra.feedback_at || ra.attempted_at,
//       });
//     }

//     return feedbacks;
//   });

//   if (feedbackEntries.length === 0) {
//     return (
//       <div className="flex items-center gap-2 text-gray-400 py-2 px-3">
//         <MessageSquare size={13} />
//         <span className="text-xs">No feedback available yet</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {feedbackEntries.map((entry, idx) => {
//         if (entry.type === 'measurement') {
//           const offsetNum = parseFloat(entry.offset);
//           const offsetOk = !isNaN(offsetNum) && Math.abs(offsetNum) <= 2;
//           return (
//             <div key={idx} className="border border-purple-100 bg-purple-50/40 rounded-lg p-3">
//               <div className="flex items-center gap-1.5 mb-2">
//                 <Ruler size={12} className="text-purple-500" />
//                 <span className="text-[11px] font-semibold text-purple-700">Measurement Comparison</span>
//                 <span className="ml-auto text-[10px] text-gray-400">{formatDate(entry.date)}</span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 text-center">
//                 <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-100">
//                   <p className="text-[9px] text-gray-400 mb-0.5">Your Measure</p>
//                   <p className="text-sm font-bold text-gray-700">
//                     {entry.userValue ?? '—'}<span className="text-[10px] font-normal text-gray-400 ml-0.5">{entry.unit}</span>
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-100">
//                   <p className="text-[9px] text-gray-400 mb-0.5">Expert Measure</p>
//                   <p className="text-sm font-bold text-[#8DC63F]">
//                     {entry.expertValue ?? '—'}<span className="text-[10px] font-normal text-gray-400 ml-0.5">{entry.unit}</span>
//                   </p>
//                 </div>
//                 <div className={`rounded-lg px-2 py-1.5 border
//                   ${offsetOk ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
//                   <p className="text-[9px] text-gray-400 mb-0.5">Offset</p>
//                   <p className={`text-sm font-bold ${offsetOk ? 'text-[#8DC63F]' : 'text-red-500'}`}>
//                     {entry.offset !== undefined ? `${entry.offset}${entry.unit}` : '—'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           );
//         }

//         if (entry.type === 'text') {
//           return (
//             <div key={idx} className="border border-blue-100 bg-blue-50/40 rounded-lg p-3">
//               <div className="flex items-center gap-1.5 mb-1.5">
//                 <MessageSquare size={12} className="text-blue-500" />
//                 <span className="text-[11px] font-semibold text-blue-700">{entry.by}</span>
//                 <span className="ml-auto text-[10px] text-gray-400">{formatDate(entry.date)}</span>
//               </div>
//               <p className="text-xs text-gray-600 leading-relaxed">{entry.text}</p>
//             </div>
//           );
//         }

//         if (entry.type === 'guidance') {
//           return (
//             <div key={idx} className="border border-amber-100 bg-amber-50/40 rounded-lg p-3">
//               <div className="flex items-center gap-1.5 mb-2">
//                 <StickyNote size={12} className="text-amber-500" />
//                 <span className="text-[11px] font-semibold text-amber-700">Guidance Notes</span>
//                 <span className="ml-auto text-[10px] text-gray-400">{formatDate(entry.date)}</span>
//               </div>
//               <ul className="space-y-1">
//                 {entry.notes.map((note, ni) => (
//                   <li key={ni} className="flex items-start gap-1.5 text-xs text-gray-600">
//                     <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
//                     {note}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         }

//         return null;
//       })}
//     </div>
//   );
// }

// // ─── PRACTICE EXPANDABLE PANEL ────────────────────────────────────────────────

// function PracticeExpandedPanel({ r, showFeedback }) {
//   const [activeTab, setActiveTab] = React.useState('log');
//   const tabs = [
//     { id: 'log', label: 'Attempt Log', icon: History },
//     ...(showFeedback ? [{ id: 'feedback', label: 'Feedback', icon: MessageSquare }] : []),
//   ];

//   const totalAttempts = r.reAttempts.length || (r.done ? 1 : 0);
//   const reattemptCount = Math.max(0, totalAttempts - 1);

//   return (
//     <div className="mt-2 border border-gray-100 rounded-xl bg-gray-50/60 overflow-hidden">
//       {/* Stats strip */}
//       <div className="flex items-center gap-4 px-4 py-2.5 bg-white border-b border-gray-100 text-xs text-gray-500">
//         <div className="flex items-center gap-1.5">
//           <Target size={12} className="text-[#8DC63F]" />
//           <span><span className="font-semibold text-gray-700">{totalAttempts}</span> total attempt{totalAttempts !== 1 ? 's' : ''}</span>
//         </div>
//         {reattemptCount > 0 && (
//           <div className="flex items-center gap-1.5">
//             <RotateCcw size={12} className="text-amber-500" />
//             <span><span className="font-semibold text-amber-600">{reattemptCount}</span> re-attempt{reattemptCount !== 1 ? 's' : ''}</span>
//           </div>
//         )}
//         {r.updatedAt && (
//           <div className="flex items-center gap-1.5 ml-auto">
//             <Calendar size={11} className="text-gray-400" />
//             <span>Last: {formatDate(r.updatedAt)}</span>
//           </div>
//         )}
//       </div>

//       {/* Tabs — only show tabs if feedback tab exists */}
//       {tabs.length > 1 && (
//         <div className="flex border-b border-gray-100 bg-white">
//           {tabs.map(tab => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2
//                   ${activeTab === tab.id
//                     ? 'border-[#8DC63F] text-[#8DC63F] bg-[#8DC63F]/5'
//                     : 'border-transparent text-gray-400 hover:text-gray-600'
//                   }`}
//               >
//                 <Icon size={12} />
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {/* Content */}
//       <div className="p-3">
//         {activeTab === 'log' && (
//           <ReattemptLog reAttempts={r.reAttempts} updatedAt={r.updatedAt} />
//         )}
//         {activeTab === 'feedback' && showFeedback && (
//           <FeedbackPanel reAttempts={r.reAttempts} resourceName={r.name} />
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── IMAGE INTERPRETATION EXPANDED PANEL ─────────────────────────────────────

// function ImageInterpretExpandedPanel({ r }) {
//   const scoreData = STATIC_INTERPRET_SCORES[r.name];

//   if (!scoreData) {
//     return (
//       <div className="flex items-center gap-2 text-gray-400 py-2 px-3">
//         <Eye size={13} />
//         <span className="text-xs">No score data available yet</span>
//       </div>
//     );
//   }

//   const { score, total, results } = scoreData;
//   const pct = Math.round((score / total) * 100);
//   const color = pct >= 80 ? '#8DC63F' : pct >= 50 ? '#F59E0B' : '#EF4444';
//   const colorClass = pct >= 80 ? 'text-[#8DC63F]' : pct >= 50 ? 'text-amber-500' : 'text-red-500';
//   const bgClass = pct >= 80 ? 'bg-[#8DC63F]/10 border-[#8DC63F]/30' : pct >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

//   return (
//     <div className="mt-2 border border-gray-100 rounded-xl bg-gray-50/60 overflow-hidden">
//       {/* Score summary strip */}
//       <div className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 ${bgClass} border`}>
//         {/* Big score */}
//         <div className="text-center">
//           <p className={`text-2xl font-bold leading-none ${colorClass}`}>{score}<span className="text-sm font-normal text-gray-400">/{total}</span></p>
//           <p className="text-[10px] text-gray-400 mt-0.5">Score</p>
//         </div>

//         {/* Progress bar */}
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-1">
//             <span className="text-[11px] text-gray-500 font-medium">Accuracy</span>
//             <span className={`text-[11px] font-bold ${colorClass}`}>{pct}%</span>
//           </div>
//           <div className="w-full bg-white rounded-full h-2 border border-gray-100">
//             <div
//               className="h-2 rounded-full transition-all duration-700"
//               style={{ width: `${pct}%`, backgroundColor: color }}
//             />
//           </div>
//         </div>

//         {/* Pass/fail pill */}
//         <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 text-xs font-semibold
//           ${pct >= 60 ? 'bg-[#8DC63F]/20 text-[#8DC63F]' : 'bg-red-100 text-red-500'}`}>
//           {pct >= 60
//             ? <><CheckCheck size={12} /> Pass</>
//             : <><X size={12} /> Needs Work</>
//           }
//         </div>
//       </div>

//       {/* Question grid */}
//       <div className="p-3">
//         <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Question Results</p>
//         <div className="grid grid-cols-5 gap-1.5">
//           {results.map((correct, idx) => (
//             <div
//               key={idx}
//               className={`flex flex-col items-center justify-center rounded-lg py-2 border text-xs font-semibold
//                 ${correct
//                   ? 'bg-[#8DC63F]/10 border-[#8DC63F]/30 text-[#8DC63F]'
//                   : 'bg-red-50 border-red-100 text-red-400'
//                 }`}
//             >
//               <span className="text-[10px] text-gray-400 font-normal mb-0.5">Q{idx + 1}</span>
//               {correct
//                 ? <CheckCheck size={13} className="text-[#8DC63F]" />
//                 : <X size={13} className="text-red-400" />
//               }
//             </div>
//           ))}
//         </div>

//         {/* Summary counts */}
//         <div className="flex items-center gap-3 mt-2.5">
//           <div className="flex items-center gap-1 text-[11px]">
//             <CheckCheck size={11} className="text-[#8DC63F]" />
//             <span className="text-gray-500"><span className="font-semibold text-[#8DC63F]">{results.filter(Boolean).length}</span> correct</span>
//           </div>
//           <div className="flex items-center gap-1 text-[11px]">
//             <X size={11} className="text-red-400" />
//             <span className="text-gray-500"><span className="font-semibold text-red-400">{results.filter(r => !r).length}</span> incorrect</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── COMPLETION STATUS ────────────────────────────────────────────────────────

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
//     const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

//     if (attempts === 0) {
//       return (
//         <div className="flex items-center gap-1.5 flex-shrink-0">
//           {isMindSpark(r.name)
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

//   // practice / interpret / test — no completionSource
//   return r.done ? (
//     <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
//       <CheckCircle2 size={15} className="fill-[#8DC63F] text-white" />
//       <span className="text-[11px] font-semibold">Completed</span>
//     </div>
//   ) : (
//     <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
//   );
// }

// // ─── RESOURCE ICON ────────────────────────────────────────────────────────────

// function ResourceIcon({ r }) {
//   const meta = TYPE_META[r.type] || TYPE_META.resource;

//   if (isMindSpark(r.name)) {
//     return (
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-50 border border-yellow-200">
//         <Zap size={16} className="text-yellow-500" />
//       </div>
//     );
//   }
//   if (isOBBooster(r.topic)) {
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
//   if (isMindSpark(r.name)) {
//     return (
//       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200">
//         Mind Sparks
//       </span>
//     );
//   }
//   if (isOBBooster(r.topic)) {
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
//   const done = isResourceDone(r);
//   const isPractice = r.type === 'practice';
//   const isInterpret = r.type === 'interpret';
//   const showLog = isPractice && practiceShowsLog(r.name);
//   const showFeedback = isPractice && practiceShowsFeedback(r.name);
//   const hasInterpretScore = isInterpret && !!STATIC_INTERPRET_SCORES[r.name];
//   const isExpandable = showLog || hasInterpretScore;

//   const [expanded, setExpanded] = React.useState(false);

//   const reattemptCount = r.reAttempts?.length > 1 ? r.reAttempts.length - 1 : 0;

//   // Inline score pill for interpret rows
//   const interpretScore = isInterpret ? STATIC_INTERPRET_SCORES[r.name] : null;

//   return (
//     <div className={`rounded-xl border bg-white transition-all
//       ${done
//         ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]'
//         : 'border-gray-200'
//       }
//       ${isExpandable ? 'hover:shadow-sm' : ''}
//     `}>
//       {/* Main row */}
//       <div
//         onClick={() => isExpandable && setExpanded(p => !p)}
//         className={`flex items-center gap-3 p-3 group
//           ${isExpandable ? 'cursor-pointer' : 'cursor-default'}
//         `}
//       >
//         <ResourceIcon r={r} />
//         <div className="flex-1 min-w-0">
//           <p className={`text-sm font-medium truncate
//             ${done && r.completionSource === 'progress'
//               ? 'text-gray-400'
//               : 'text-gray-700 group-hover:text-[#8DC63F]'
//             }`}
//           >
//             {r.name}
//           </p>
//           {/* Reattempt badge for P1–P4 */}
//           {showLog && reattemptCount > 0 && (
//             <div className="flex items-center gap-1 mt-0.5">
//               <RotateCcw size={10} className="text-amber-500" />
//               <span className="text-[10px] text-amber-600 font-medium">{reattemptCount} re-attempt{reattemptCount !== 1 ? 's' : ''}</span>
//             </div>
//           )}
//         </div>
//         <ResourceTypeBadge r={r} />

//         {/* Inline score pill for interpret rows */}
//         {interpretScore && (
//           <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border flex-shrink-0
//             ${interpretScore.score / interpretScore.total >= 0.8
//               ? 'bg-[#8DC63F]/10 border-[#8DC63F]/30'
//               : interpretScore.score / interpretScore.total >= 0.5
//                 ? 'bg-amber-50 border-amber-200'
//                 : 'bg-red-50 border-red-200'
//             }`}>
//             <span className={`text-xs font-bold
//               ${interpretScore.score / interpretScore.total >= 0.8
//                 ? 'text-[#8DC63F]'
//                 : interpretScore.score / interpretScore.total >= 0.5
//                   ? 'text-amber-500'
//                   : 'text-red-500'
//               }`}>
//               {interpretScore.score}/{interpretScore.total}
//             </span>
//           </div>
//         )}

//         {/* Feedback indicator badge for P3/P4 */}
//         {showFeedback && (
//           <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-200 flex-shrink-0">
//             <MessageSquare size={9} />
//             Feedback
//           </span>
//         )}

//         <CompletionStatus r={r} />

//         {/* Expand chevron */}
//         {isExpandable && (
//           <div className={`flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
//             <ChevronDown size={15} className={expanded ? 'text-[#8DC63F]' : 'text-gray-300'} />
//           </div>
//         )}
//       </div>

//       {/* Expanded panel */}
//       {isExpandable && expanded && (
//         <div className="px-3 pb-3">
//           {isInterpret
//             ? <ImageInterpretExpandedPanel r={r} />
//             : <PracticeExpandedPanel r={r} showFeedback={showFeedback} />
//           }
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── TOPIC ACCORDION ─────────────────────────────────────────────────────────

// function TopicAccordion({ topic, items, isOpen, onToggle }) {
//   const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
//   const topicDone = items.filter(isResourceDone).length;
//   const pct = items.length ? Math.round((topicDone / items.length) * 100) : 0;

//   return (
//     <div className="mb-3">
//       <button
//         onClick={onToggle}
//         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
//           ${isOpen
//             ? 'border-[#8DC63F] bg-[#8DC63F]/5'
//             : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'
//           }`}
//       >
//         <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
//           ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
//           <TopicIcon size={15} />
//         </div>
//         <div className="flex-1 text-left">
//           <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
//             {topic}
//           </p>
//           <p className="text-[11px] text-gray-400 mt-0.5">{topicDone}/{items.length} completed</p>
//         </div>
//         <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
//           <div
//             className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500"
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//         {isOpen
//           ? <ChevronDown size={16} className="text-[#8DC63F] flex-shrink-0" />
//           : <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
//         }
//       </button>

//       {isOpen && (
//         <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
//           {items.map(r => <ResourceRow key={r.id} r={r} />)}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── TYPE SECTION ─────────────────────────────────────────────────────────────

// function TypeSection({ typeKey, accordions, directRows, flatList, openTopics, onToggleTopic }) {
//   const meta = TYPE_META[typeKey] || TYPE_META.resource;
//   const Icon = meta.icon;
//   const total = accordions.reduce((s, g) => s + g.items.length, 0) + directRows.length;

//   return (
//     <div className="mb-6">
//       {/* Section header */}
//       <div className="flex items-center gap-2 mb-3">
//         <Icon size={13} className={meta.color} />
//         <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           {meta.label}
//         </span>
//         <div className="flex-1 h-px bg-gray-100" />
//         <span className="text-[10px] text-gray-400">{total}</span>
//       </div>

//       {flatList ? (
//         <div className="flex flex-col gap-2">
//           {directRows.map(r => <ResourceRow key={r.id} r={r} />)}
//         </div>
//       ) : (
//         <>
//           {accordions.map(({ topic, items }) => (
//             <TopicAccordion
//               key={topic}
//               topic={topic}
//               items={items}
//               isOpen={!!openTopics[`${typeKey}::${topic}`]}
//               onToggle={() => onToggleTopic(`${typeKey}::${topic}`)}
//             />
//           ))}
//           {directRows.length > 0 && (
//             <div className="flex flex-col gap-2 mt-1">
//               {directRows.map(r => <ResourceRow key={r.id} r={r} />)}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// function MyLearning() {
//   const [buttonOpen, setButtonOpen] = React.useState(true);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   const [certs, setCerts] = React.useState([]);
//   const [modules, setModules] = React.useState({});
//   const [resources, setResources] = React.useState({});

//   const [activeCert, setActiveCert] = React.useState('');
//   const [activeModule, setActiveModule] = React.useState('');
//   const [activeFilter, setActiveFilter] = React.useState('all');
//   const [search, setSearch] = React.useState('');
//   const [openTopics, setOpenTopics] = React.useState({});

//   // ── Auth ───────────────────────────────────────────────────────────────────
//   const token = localStorage.getItem('user_token');
//   let decoded = null;
//   try { decoded = token ? jwtDecode(token) : null; } catch (_) { }
//   const traineeId = decoded?.id || decoded?.sub || decoded?.userId || localStorage.getItem('people_id');

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

//         const firstCert = transformed.certs[0];
//         if (firstCert) {
//           setActiveCert(firstCert.id);
//           const firstMods = transformed.modules[firstCert.id] || [];
//           const firstUnlocked = firstMods.find(m => !m.locked);
//           setActiveModule(firstUnlocked?.id || firstMods[0]?.id || '');
//         }
//       })
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [traineeId, token]);

//   if (!decoded?.role) return <Navigate to="/" replace />;

//   // ── Handlers ───────────────────────────────────────────────────────────────
//   const toggleTopic = key =>
//     setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

//   const handleCertChange = certId => {
//     setActiveCert(certId);
//     const mods = modules[certId] || [];
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

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const currentModules = modules[activeCert] || [];
//   const allRes = resources[activeModule] || [];
//   const activeModMeta = currentModules.find(m => m.id === activeModule);

//   const doneCount = activeModMeta?.done ?? 0;
//   const totalCount = activeModMeta?.total ?? 0;
//   const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

//   const filtered = allRes.filter(r => {
//     const matchType = activeFilter === 'all' || r.type === activeFilter;
//     const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
//     return matchType && matchSearch;
//   });

//   // ── Build sections ─────────────────────────────────────────────────────────
//   const SECTION_ORDER = ['resource', 'practice', 'interpret', 'test'];

//   const byType = filtered.reduce((acc, r) => {
//     if (!acc[r.type]) acc[r.type] = [];
//     acc[r.type].push(r);
//     return acc;
//   }, {});

//   const sections = SECTION_ORDER
//     .filter(typeKey => byType[typeKey]?.length > 0)
//     .map(typeKey => {
//       const isFlat = typeKey === 'interpret' || typeKey === 'test';
//       if (isFlat) {
//         return { typeKey, flatList: true, accordions: [], directRows: byType[typeKey] };
//       }
//       const { accordions, directRows } = buildTopicGroups(byType[typeKey]);
//       return { typeKey, flatList: false, accordions, directRows };
//     });

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

//             {loading && (
//               <div className="flex items-center justify-center py-24 text-gray-400">
//                 <Loader2 size={32} className="animate-spin mr-3" />
//                 <span className="text-sm">Loading your learning data…</span>
//               </div>
//             )}

//             {error && !loading && (
//               <div className="flex flex-col items-center justify-center py-24 text-red-400">
//                 <p className="text-sm font-medium">Failed to load data</p>
//                 <p className="text-xs mt-1 text-gray-400">{error}</p>
//               </div>
//             )}

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

//                 <div className="grid grid-cols-3 gap-5">

//                   {/* Col 1 — Module list */}
//                   <div className="col-span-1 border rounded-xl bg-white p-4">
//                     <p className="text-sm font-semibold text-gray-700 mb-3">Modules</p>

//                     <div className="flex flex-col gap-2">
//                       {currentModules.map(mod => {
//                         const isActive = activeModule === mod.id;
//                         const modPct = mod.total ? Math.round((mod.done / mod.total) * 100) : 0;
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
//                                 : (
//                                   <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>
//                                     {mod.done}/{mod.total}
//                                   </span>
//                                 )
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
//                         <p className="text-[11px] text-gray-400 mt-1.5">
//                           {doneCount} of {totalCount} resources completed
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Col 2-3 — Resource list */}
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

//                     {/* Sections */}
//                     {sections.map(({ typeKey, flatList, accordions, directRows }) => (
//                       <TypeSection
//                         key={typeKey}
//                         typeKey={typeKey}
//                         flatList={flatList}
//                         accordions={accordions}
//                         directRows={directRows}
//                         openTopics={openTopics}
//                         onToggleTopic={toggleTopic}
//                       />
//                     ))}

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


//the above code is working good

import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import {
  LayoutDashboard, Notebook, BookOpen, Dumbbell, Eye, ClipboardCheck,
  CheckCircle2, Lock, ChevronRight, ChevronDown, FileText, Brain,
  Ruler, Search, Zap, Puzzle, Loader2, History, MessageSquare,
  Calendar, Target, CheckCheck, X, RotateCcw, StickyNote,
} from 'lucide-react';
import APP_URL from '../API/config';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const BASE_URL = APP_URL || '';
const BATCH_API_BASE = 'https://api.hticlab.org/api/v1/batch-individual';

const RESOURCE_ORDER = {
  'BPD & HC::Transthalamic Plane': 1, 'BPD & HC::Bi-Parietal Diameter': 2,
  'BPD & HC::Head Circumference': 3, 'BPD & HC::Significance': 4,
  'BPD & HC::Anatomical Landmarks and Significance': 1,
  'BPD & HC::Anatomical Landmarks of the Transthalamic Plane': 1,
  'BPD & HC::Geometric shapes of key landmarks and their significance': 2,
  'BPD & HC::Mind Sparks - Anatomical Landmarks': 3,
  'BPD & HC:: How To Image The Plane': 1, 'BPD & HC::Mind Sparks - Probe Movements': 2,
  'BPD & HC::How To Acquire The Transthalamic Plane': 3, 'BPD & HC::Mind Sparks - Picture Pick': 4,
  'BPD & HC::Finding the fetal presentation': 1, 'BPD & HC::Mind Sparks - Probe movements': 2,
  'BPD & HC::How to acquire the transthalamic plane': 3,
  'BPD & HC::How To Measure BPD': 1, 'BPD & HC::How To Measure HC': 2,
  'BPD & HC::How to measure BPD': 1, 'BPD & HC::How to measure HC': 2,
  'BPD & HC::Image Diagnosis': 1, 'BPD & HC::Percentile Chart & Significance': 2,
  'BPD & HC::Percentile Charts  & Significance': 2, 'BPD & HC::BPD Chart': 3,
  'BPD & HC::HC Chart': 4, 'BPD & HC::Mind Sparks - Chart Interpretation': 5,
  'BPD & HC::Picture Pick': 1, 'BPD & HC::True / False': 2, 'BPD & HC::True/False': 2,
  'BPD & HC::Wordsearch': 3, 'BPD & HC::Word Search': 3,
  'BPD & HC::Plane Acquisition Challenges': 1, 'BPD & HC::Common Measurement Errors': 2,
  'AC::Transabdominal plane': 1, 'AC::Abdominal circumference': 2, 'AC::Significance': 3,
  'AC::Anatomical landmarks of the transabdominal plane': 1,
  'AC::Geometric shapes of key landmarks and their significance': 2,
  'AC::Mind Sparks - Anatomical Landmarks': 3, 'AC::How to acquire the transabdominal plane': 1,
  'AC::Mind Sparks - Probe movements': 2, 'AC::Mind Sparks - Picture pick': 3,
  'AC::How to measure AC': 1, 'AC::Mind Sparks - Picture Pick': 2,
  'AC::Image Diagnosis': 1, 'AC::Percentile Charts  & Significance': 2,
  'AC::AC chart': 3, 'AC::Mind Sparks - Chart Interpretation': 4,
  'AC::Crossword puzzle': 1, 'AC::True/False': 2, 'AC::Picture Pick': 3,
  'AC::Plane Acquisition Challenges': 1, 'AC::Common Measurement Errors': 2,
  'FL::Femur': 1, 'FL::Femur diaphysis': 2, 'FL::Significance': 3,
  'FL::Anatomical landmarks of the femur diaphysis plane': 1,
  'FL::Geometric shapes of key landmarks and their significance': 2,
  'FL::Mind Sparks - Anatomical Landmarks': 3, 'FL::How to acquire the femur diaphysis plane': 1,
  'FL::Mind Sparks - Probe movements': 2, 'FL::Mind Sparks - Picture pick': 3,
  'FL::How to measure FL': 1, 'FL::MindSparks - Picture Pick': 2,
  'FL::Image Diagnosis': 1, 'FL::Image diagnosis': 1,
  'FL::Percentile Charts  & Significance': 2, 'FL::Percentile charts & significance': 2,
  'FL::AC chart': 3, 'FL::FL chart': 3, 'FL::Mind Sparks - Chart Interpretation': 4,
  'FL::Crossword puzzle': 1, 'FL::Picture Pick': 2, 'FL::True/False': 3,
  'FL::Plane Acquisition Challenges': 1, 'FL::Common Measurement Errors': 2,
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

const TOPIC_ORDER = [
  'Fetal Head', 'Fetal abdomen', 'Fetal Femur',
  'Anatomical Landmarks', 'Anatomical landmarks',
  'Imaging the Plane', 'Imaging the Transthalamic Plane',
  'Imaging the transabdominal plane', 'Imaging the transfemoral plane',
  'Measurement', 'Measurements',
  'Plane Acquisition Challenges and Common Measurement Errors',
  'Pitfalls in Plane Acquisition and Measurement',
  'Image Diagnosis', 'Image diagnosis', 'OB Boosters',
];

const MODULE_ORDER = ['BPD & HC', 'AC', 'FL'];

const TOPIC_ICONS = {
  'Fetal Head': Brain, 'Fetal abdomen': Brain, 'Fetal Femur': Brain,
  'Anatomical Landmarks': Search, 'Anatomical landmarks': Search,
  'Imaging the Plane': Eye, 'Imaging the plane': Eye,
  'Imaging the Transthalamic Plane': Eye,
  'Imaging the transabdominal plane': Eye, 'Imaging the transfemoral plane': Eye,
  'Measurements': Ruler, 'Measurement': Ruler,
  'Image Diagnosis': FileText, 'Image diagnosis': FileText, 'OB Boosters': Puzzle,
  'Plane Acquisition Challenges and Common Measurement Errors': FileText,
  'Pitfalls in Plane Acquisition and Measurement': FileText,
};

const QUESTION_TYPE_META = {
  type1:       { label: 'Find the Image',          color: 'bg-blue-50 text-blue-600 border-blue-200'       },
  type2:       { label: 'Find the Image (Upload)', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  annotation1: { label: 'Annotation 1',            color: 'bg-purple-50 text-purple-600 border-purple-200' },
  annotation2: { label: 'Annotation 2',            color: 'bg-pink-50 text-pink-600 border-pink-200'       },
  measurement: { label: 'Measurement',             color: 'bg-amber-50 text-amber-600 border-amber-200'    },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function isMindSpark(name = '') {
  const l = name.toLowerCase();
  return l.includes('mind spark') || l.includes('mindspark');
}
function isOBBooster(topic = '') { return topic === 'OB Boosters'; }
function deriveCompletionSource(name, topic) {
  return (isMindSpark(name) || isOBBooster(topic)) ? 'activity' : 'progress';
}
function isResourceDone(r) {
  if (r.completionSource === 'activity') return (r.activityData?.attempts ?? 0) > 0;
  return r.done === true;
}
function getPracticeNumber(name = '') {
  const m = name.match(/practice\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}
function practiceShowsLog(name) {
  const n = getPracticeNumber(name);
  return n !== null && n >= 1 && n <= 4;
}
function practiceShowsFeedback(name) {
  const n = getPracticeNumber(name);
  return n !== null && n >= 3 && n <= 4;
}
function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}
function formatDateTime(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return d; }
}
function scoreMeta(pct) {
  if (pct >= 80) return { hex: '#8DC63F', cls: 'text-[#8DC63F]' };
  if (pct >= 50) return { hex: '#F59E0B', cls: 'text-amber-500'  };
  return           { hex: '#EF4444', cls: 'text-red-500'    };
}

// ─── BATCH API ────────────────────────────────────────────────────────────────

async function fetchBatchCertLabel(batchId, token) {
  const res = await fetch(`${BATCH_API_BASE}/${batchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  // Returns: { batchInfo: { certificate: { certificate_id, certificate_name } } }
  const cert = json?.batchInfo?.certificate;
  if (cert?.certificate_id && cert?.certificate_name) {
    return { [cert.certificate_id]: cert.certificate_name };
  }
  return {};
}

// ─── SUBMISSION API ───────────────────────────────────────────────────────────

async function fetchSubmissions(resourceId, token) {
  const res = await fetch(`${BASE_URL}/api/v1/get-submissions?resource_id=${resourceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

function groupBySession(submissions) {
  const map = {};
  submissions.forEach(s => {
    const sid = s.session_id || 'unknown';
    if (!map[sid]) map[sid] = { session_id: sid, created_at: s.created_at, byType: {} };
    const sess = map[sid];
    if (s.created_at < sess.created_at) sess.created_at = s.created_at;
    if (!sess.byType[s.question_type]) sess.byType[s.question_type] = [];
    sess.byType[s.question_type].push(s);
  });
  return Object.values(map).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

function sessionSummary(session) {
  const all = Object.values(session.byType).flat();
  const total = all.length;
  const correct = all.filter(q => q.is_correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { total, correct, pct };
}

// ─── API DATA TRANSFORMER ─────────────────────────────────────────────────────

function transformApiData(apiResponse, certLabelMap = {}) {
  const { data = [], reAttempts = [] } = apiResponse;

  const reAttemptMap = {};
  reAttempts.forEach(ra => {
    if (!ra.resource_id) return;
    if (!reAttemptMap[ra.resource_id]) reAttemptMap[ra.resource_id] = [];
    reAttemptMap[ra.resource_id].push(ra);
  });

  const completionMap = {};
  data.forEach(item => {
    if (item.resource_id) completionMap[item.resource_id] = item.is_completed === true;
  });

  const certOrder = [];
  const certSeen = new Set();
  data.forEach(item => {
    if (!certSeen.has(item.certificate_id)) {
      certSeen.add(item.certificate_id);
      certOrder.push({
        id: item.certificate_id,
        // Use dynamic label from batch API, fallback to course_name, then ID
        label: certLabelMap[item.certificate_id] || item.course_name || item.certificate_id,
      });
    }
  });

  const modulesByCert = {};
  const resourcesByLMID = {};

  data.forEach(item => {
    const { certificate_id, learning_module_id, unit_name, course_name } = item;
    if (!modulesByCert[certificate_id]) modulesByCert[certificate_id] = new Map();
    const certModules = modulesByCert[certificate_id];
    if (!certModules.has(learning_module_id)) {
      certModules.set(learning_module_id, {
        id: learning_module_id,
        label: unit_name || course_name || learning_module_id,
        locked: false, hasAnyResource: false, done: 0, total: 0,
      });
    }
    if (item.resource_id) certModules.get(learning_module_id).hasAnyResource = true;
    if (!item.resource_id) return;

    if (!resourcesByLMID[learning_module_id]) resourcesByLMID[learning_module_id] = [];
    if (resourcesByLMID[learning_module_id].some(r => r.id === item.resource_id)) return;

    const typeKey = RESOURCE_TYPE_MAP[item.resource_type] || 'resource';
    const completionSource = typeKey === 'resource'
      ? deriveCompletionSource(item.resource_name, item.resource_topic)
      : null;
    const isDone = completionMap[item.resource_id] === true;

    resourcesByLMID[learning_module_id].push({
      id: item.resource_id,
      name: (item.resource_name || '').trim(),
      type: typeKey,
      topic: item.resource_topic || '',
      completionSource,
      done: isDone,
      updatedAt: item.updated_at || null,
      reAttempts: reAttemptMap[item.resource_id] || [],
      activityData: completionSource === 'activity'
        ? { attempts: isDone ? 1 : 0, correct: isDone ? 1 : 0, total: 1 }
        : undefined,
    });
  });

  const modulesByCertFinal = {};
  certOrder.forEach(cert => {
    const modMap = modulesByCert[cert.id];
    if (!modMap) { modulesByCertFinal[cert.id] = []; return; }
    modulesByCertFinal[cert.id] = Array.from(modMap.values())
      .map(mod => ({ ...mod, locked: !mod.hasAnyResource }))
      .sort((a, b) => {
        const ai = MODULE_ORDER.indexOf(a.label), bi = MODULE_ORDER.indexOf(b.label);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
  });

  const sortedResources = {};
  Object.entries(resourcesByLMID).forEach(([lmid, items]) => {
    let unitName = '';
    Object.values(modulesByCertFinal).forEach(mods =>
      mods.forEach(m => { if (m.id === lmid) unitName = m.label; })
    );
    sortedResources[lmid] = [...items].sort((a, b) => {
      const pa = RESOURCE_ORDER[`${unitName}::${a.name}`] ?? 999;
      const pb = RESOURCE_ORDER[`${unitName}::${b.name}`] ?? 999;
      return pa - pb;
    });
  });

  Object.values(modulesByCertFinal).forEach(mods => {
    mods.forEach(mod => {
      const res = sortedResources[mod.id] || [];
      mod.total = res.length;
      mod.done  = res.filter(isResourceDone).length;
    });
  });

  return { certs: certOrder, modules: modulesByCertFinal, resources: sortedResources };
}

function buildTopicGroups(items) {
  const topicMap = {};
  const directRows = [];
  items.forEach(r => {
    if (!r.topic) { directRows.push(r); return; }
    if (!topicMap[r.topic]) topicMap[r.topic] = [];
    topicMap[r.topic].push(r);
  });
  const accordions = Object.entries(topicMap)
    .map(([topic, topicItems]) => ({ topic, items: topicItems }))
    .sort((a, b) => {
      const ai = TOPIC_ORDER.indexOf(a.topic), bi = TOPIC_ORDER.indexOf(b.topic);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  return { accordions, directRows };
}

// ─── IMAGE INTERPRETATION MODAL ───────────────────────────────────────────────

function QuestionRow({ q }) {
  const isAnnotation  = q.question_type === 'annotation1' || q.question_type === 'annotation2';
  const isMeasurement = q.question_type === 'measurement';

  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border text-xs
      ${q.is_correct ? 'bg-[#8DC63F]/5 border-[#8DC63F]/25' : 'bg-red-50/60 border-red-100'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5
        ${q.is_correct ? 'bg-[#8DC63F] text-white' : 'bg-red-100 text-red-500'}`}>
        {q.question_no}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        {q.option_chosen != null && (
          <p className="text-gray-500">Option chosen: <span className="font-semibold text-gray-700">{q.option_chosen}</span></p>
        )}
        {isAnnotation && (
          <div className="flex items-center gap-3">
            <span className="text-[#8DC63F] font-medium">✓ {q.correct_label_count ?? 0} correct</span>
            <span className="text-red-500 font-medium">✗ {q.wrong_label_count ?? 0} wrong</span>
            <span className="text-gray-400">{q.unused_label_count ?? 0} unused</span>
          </div>
        )}
        {isMeasurement && (
          <div className="flex flex-wrap items-center gap-3">
            {q.value != null && (
              <span className="text-gray-600">Value: <span className="font-semibold">{q.value}</span></span>
            )}
            {q.interpretation && (
              <span className={`capitalize font-medium ${q.interpretation === 'good' ? 'text-[#8DC63F]' : 'text-red-500'}`}>
                Interpretation: {q.interpretation}
              </span>
            )}
            {q.caliper_placement_interpretation && (
              <span className={`capitalize font-medium ${q.caliper_placement_interpretation === 'good' ? 'text-[#8DC63F]' : 'text-amber-500'}`}>
                Caliper: {q.caliper_placement_interpretation}
              </span>
            )}
          </div>
        )}
        {q.public_url && (
          <a href={q.public_url} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:underline">
            <Eye size={10} /> View submitted image
          </a>
        )}
      </div>
      <div className="flex-shrink-0 mt-0.5">
        {q.is_correct
          ? <CheckCheck size={14} className="text-[#8DC63F]" />
          : <X size={14} className="text-red-400" />
        }
      </div>
    </div>
  );
}

function SessionCard({ session, attemptNo, isLatest }) {
  const { total, correct, pct } = sessionSummary(session);
  const sm   = scoreMeta(pct);
  const [open, setOpen] = React.useState(isLatest);
  const types = Object.keys(session.byType);

  return (
    <div className={`border rounded-xl overflow-hidden ${isLatest ? 'border-[#8DC63F]/40' : 'border-gray-200'}`}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
          ${open ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
          ${isLatest ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-500'}`}>
          {attemptNo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {attemptNo === 1 ? 'First Attempt' : `Re-attempt ${attemptNo - 1}`}
            </span>
            {isLatest && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8DC63F]/15 text-[#8DC63F]">Latest</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {formatDateTime(session.created_at)} · {types.length} question type{types.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right flex-shrink-0 mr-2">
          <p className={`text-lg font-bold leading-none ${sm.cls}`}>
            {correct}<span className="text-sm font-normal text-gray-400">/{total}</span>
          </p>
          <p className={`text-[11px] font-semibold ${sm.cls}`}>{pct}%</p>
        </div>
        <div className="w-16 flex-shrink-0">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: sm.hex }} />
          </div>
        </div>
        <ChevronDown size={15} className={`flex-shrink-0 transition-transform ${open ? 'rotate-180 text-[#8DC63F]' : 'text-gray-300'}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 space-y-4 bg-white border-t border-gray-100">
          {types.map(type => {
            const qs = session.byType[type].slice().sort((a, b) => a.question_no - b.question_no);
            const typeCorrect = qs.filter(q => q.is_correct).length;
            const tm = QUESTION_TYPE_META[type] || { label: type, color: 'bg-gray-100 text-gray-600 border-gray-200' };
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tm.color}`}>{tm.label}</span>
                  <span className="text-[11px] text-gray-400">{typeCorrect}/{qs.length} correct</span>
                </div>
                <div className="space-y-1.5">
                  {qs.map(q => <QuestionRow key={q.id} q={q} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImageInterpretModal({ r, token, onClose }) {
  const [loading, setLoading]   = React.useState(true);
  const [error, setError]       = React.useState(null);
  const [sessions, setSessions] = React.useState([]);

  React.useEffect(() => {
    setLoading(true); setError(null);
    fetchSubmissions(r.id, token)
      .then(data => setSessions(groupBySession(data)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [r.id, token]);

  const latest    = sessions[sessions.length - 1];
  const latestSum = latest ? sessionSummary(latest) : null;
  const latestSm  = latestSum ? scoreMeta(latestSum.pct) : null;
  const totalSubs = sessions.reduce((s, sess) => s + Object.values(sess.byType).flat().length, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
            <Eye size={16} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-800 truncate">{r.name}</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Image Interpretation · {sessions.length} attempt{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          {latestSum && latestSm && (
            <div className="text-center mr-2 flex-shrink-0">
              <p className={`text-xl font-bold leading-none ${latestSm.cls}`}>
                {latestSum.correct}<span className="text-sm font-normal text-gray-400">/{latestSum.total}</span>
              </p>
              <p className={`text-[10px] font-semibold ${latestSm.cls}`}>Latest</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading submissions…</span>
            </div>
          )}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-red-400">
              <p className="text-sm font-medium">Failed to load submissions</p>
              <p className="text-xs mt-1 text-gray-400">{error}</p>
            </div>
          )}
          {!loading && !error && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Eye size={32} className="mb-3 text-gray-300" />
              <p className="text-sm font-medium">No submissions yet</p>
              <p className="text-xs mt-1">This resource hasn't been attempted</p>
            </div>
          )}
          {!loading && !error && sessions.map((session, idx) => (
            <SessionCard
              key={session.session_id}
              session={session}
              attemptNo={idx + 1}
              isLatest={idx === sessions.length - 1}
            />
          ))}
        </div>

        {!loading && sessions.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <span className="text-xs text-gray-400">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} · {totalSubs} total submissions
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-gray-200 hover:border-[#8DC63F] hover:text-[#8DC63F] transition-colors text-xs font-medium text-gray-500"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRACTICE EXPANDED PANEL ──────────────────────────────────────────────────

function ReattemptLog({ reAttempts, updatedAt }) {
  const attempts = reAttempts.length > 0
    ? reAttempts
    : (updatedAt ? [{ attempted_at: updatedAt, score: null, is_completed: true, attempt_number: 1 }] : []);

  if (attempts.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-2 px-3">
        <History size={13} /><span className="text-xs">No attempt history yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {attempts.map((attempt, idx) => {
        const attemptNo   = attempt.attempt_number ?? (attempts.length - idx);
        const isReattempt = attemptNo > 1;
        const score       = attempt.score ?? attempt.percentage ?? null;
        const passed      = attempt.is_completed === true || attempt.passed === true;
        return (
          <div key={idx} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs
            ${isReattempt ? 'border-amber-200 bg-amber-50/60' : 'border-gray-100 bg-gray-50'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[10px]
              ${passed ? 'bg-[#8DC63F] text-white' : 'bg-red-100 text-red-500'}`}>
              {attemptNo}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`font-medium ${isReattempt ? 'text-amber-700' : 'text-gray-600'}`}>
                {isReattempt ? `Re-attempt ${attemptNo - 1}` : 'First attempt'}
              </span>
              {attempt.attempted_at && (
                <span className="ml-2 text-gray-400">{formatDateTime(attempt.attempted_at)}</span>
              )}
            </div>
            {score !== null && (
              <span className={`font-semibold flex-shrink-0
                ${score >= 80 ? 'text-[#8DC63F]' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {score}%
              </span>
            )}
            <div className={`flex items-center gap-1 flex-shrink-0 ${passed ? 'text-[#8DC63F]' : 'text-red-400'}`}>
              {passed
                ? <><CheckCheck size={12} /><span className="text-[10px] font-medium">Pass</span></>
                : <><X size={12} /><span className="text-[10px] font-medium">Fail</span></>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeedbackPanel({ reAttempts }) {
  const entries = reAttempts.flatMap((ra) => {
    const list = [];
    if (ra.feedback || ra.instructor_feedback || ra.expert_feedback) {
      list.push({
        type: 'text',
        text: ra.feedback || ra.instructor_feedback || ra.expert_feedback,
        by: ra.feedback_by || ra.instructor_name || 'Instructor',
        date: ra.feedback_at || ra.attempted_at,
      });
    }
    if (ra.user_measurement !== undefined || ra.expert_measurement !== undefined) {
      list.push({
        type: 'measurement',
        userValue: ra.user_measurement, expertValue: ra.expert_measurement,
        offset: ra.offset, unit: ra.unit || 'mm', date: ra.attempted_at,
      });
    }
    if (ra.guidance_notes) {
      list.push({
        type: 'guidance',
        notes: Array.isArray(ra.guidance_notes) ? ra.guidance_notes : [ra.guidance_notes],
        date: ra.feedback_at || ra.attempted_at,
      });
    }
    return list;
  });

  if (entries.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-2 px-3">
        <MessageSquare size={13} /><span className="text-xs">No feedback available yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => {
        if (entry.type === 'measurement') {
          const off = parseFloat(entry.offset);
          const ok  = !isNaN(off) && Math.abs(off) <= 2;
          return (
            <div key={idx} className="border border-purple-100 bg-purple-50/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Ruler size={12} className="text-purple-500" />
                <span className="text-[11px] font-semibold text-purple-700">Measurement Comparison</span>
                <span className="ml-auto text-[10px] text-gray-400">{formatDate(entry.date)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-100">
                  <p className="text-[9px] text-gray-400 mb-0.5">Your Measure</p>
                  <p className="text-sm font-bold text-gray-700">{entry.userValue ?? '—'}<span className="text-[10px] font-normal text-gray-400 ml-0.5">{entry.unit}</span></p>
                </div>
                <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-100">
                  <p className="text-[9px] text-gray-400 mb-0.5">Expert Measure</p>
                  <p className="text-sm font-bold text-[#8DC63F]">{entry.expertValue ?? '—'}<span className="text-[10px] font-normal text-gray-400 ml-0.5">{entry.unit}</span></p>
                </div>
                <div className={`rounded-lg px-2 py-1.5 border ${ok ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <p className="text-[9px] text-gray-400 mb-0.5">Offset</p>
                  <p className={`text-sm font-bold ${ok ? 'text-[#8DC63F]' : 'text-red-500'}`}>{entry.offset !== undefined ? `${entry.offset}${entry.unit}` : '—'}</p>
                </div>
              </div>
            </div>
          );
        }
        if (entry.type === 'text') {
          return (
            <div key={idx} className="border border-blue-100 bg-blue-50/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageSquare size={12} className="text-blue-500" />
                <span className="text-[11px] font-semibold text-blue-700">{entry.by}</span>
                <span className="ml-auto text-[10px] text-gray-400">{formatDate(entry.date)}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{entry.text}</p>
            </div>
          );
        }
        if (entry.type === 'guidance') {
          return (
            <div key={idx} className="border border-amber-100 bg-amber-50/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <StickyNote size={12} className="text-amber-500" />
                <span className="text-[11px] font-semibold text-amber-700">Guidance Notes</span>
                <span className="ml-auto text-[10px] text-gray-400">{formatDate(entry.date)}</span>
              </div>
              <ul className="space-y-1">
                {entry.notes.map((note, ni) => (
                  <li key={ni} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />{note}
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function PracticeExpandedPanel({ r, showFeedback }) {
  const [activeTab, setActiveTab] = React.useState('log');
  const tabs = [
    { id: 'log', label: 'Attempt Log', icon: History },
    ...(showFeedback ? [{ id: 'feedback', label: 'Feedback', icon: MessageSquare }] : []),
  ];
  const totalAttempts  = r.reAttempts.length || (r.done ? 1 : 0);
  const reattemptCount = Math.max(0, totalAttempts - 1);

  return (
    <div className="mt-2 border border-gray-100 rounded-xl bg-gray-50/60 overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-2.5 bg-white border-b border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Target size={12} className="text-[#8DC63F]" />
          <span><span className="font-semibold text-gray-700">{totalAttempts}</span> total attempt{totalAttempts !== 1 ? 's' : ''}</span>
        </div>
        {reattemptCount > 0 && (
          <div className="flex items-center gap-1.5">
            <RotateCcw size={12} className="text-amber-500" />
            <span><span className="font-semibold text-amber-600">{reattemptCount}</span> re-attempt{reattemptCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {r.updatedAt && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Calendar size={11} className="text-gray-400" />
            <span>Last: {formatDate(r.updatedAt)}</span>
          </div>
        )}
      </div>

      {tabs.length > 1 && (
        <div className="flex border-b border-gray-100 bg-white">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2
                  ${activeTab === tab.id
                    ? 'border-[#8DC63F] text-[#8DC63F] bg-[#8DC63F]/5'
                    : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <Icon size={12} />{tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="p-3">
        {activeTab === 'log'      && <ReattemptLog reAttempts={r.reAttempts} updatedAt={r.updatedAt} />}
        {activeTab === 'feedback' && <FeedbackPanel reAttempts={r.reAttempts} />}
      </div>
    </div>
  );
}

// ─── COMPLETION STATUS ────────────────────────────────────────────────────────

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
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    if (attempts === 0) {
      return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isMindSpark(r.name) ? <Zap size={13} className="text-yellow-400" /> : <Puzzle size={13} className="text-pink-400" />}
          <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">Not attempted</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <p className={`text-[11px] font-semibold leading-none ${pct === 100 ? 'text-[#8DC63F]' : 'text-yellow-500'}`}>{correct}/{total}</p>
          <p className="text-[9px] text-gray-400 mt-0.5">{attempts} attempt{attempts !== 1 ? 's' : ''}</p>
        </div>
        <div className="w-12 bg-gray-100 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-[#8DC63F]' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && <CheckCircle2 size={14} className="fill-[#8DC63F] text-white flex-shrink-0" />}
      </div>
    );
  }

  return r.done ? (
    <div className="flex items-center gap-1 text-[#8DC63F] flex-shrink-0">
      <CheckCircle2 size={15} className="fill-[#8DC63F] text-white" />
      <span className="text-[11px] font-semibold">Completed</span>
    </div>
  ) : (
    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8DC63F] transition-colors flex-shrink-0" />
  );
}

// ─── RESOURCE ICON & TYPE BADGE ───────────────────────────────────────────────

function ResourceIcon({ r }) {
  if (isMindSpark(r.name)) return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-50 border border-yellow-200">
      <Zap size={16} className="text-yellow-500" />
    </div>
  );
  if (isOBBooster(r.topic)) return (
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-pink-50 border border-pink-200">
      <Puzzle size={16} className="text-pink-500" />
    </div>
  );
  const meta = TYPE_META[r.type] || TYPE_META.resource;
  const Icon = meta.icon;
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
      <Icon size={16} className={meta.color} />
    </div>
  );
}

function ResourceTypeBadge({ r }) {
  if (isMindSpark(r.name)) return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200">Mind Sparks</span>
  );
  if (isOBBooster(r.topic)) return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-pink-50 text-pink-500 border border-pink-200">OB Booster</span>
  );
  const meta = TYPE_META[r.type] || TYPE_META.resource;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}>
      {meta.label}
    </span>
  );
}

// ─── RESOURCE ROW ─────────────────────────────────────────────────────────────

function ResourceRow({ r, token, onOpenInterpretModal }) {
  const done         = isResourceDone(r);
  const isPractice   = r.type === 'practice';
  const isInterpret  = r.type === 'interpret';
  const showLog      = isPractice && practiceShowsLog(r.name);
  const showFeedback = isPractice && practiceShowsFeedback(r.name);
  const isClickable  = isInterpret || showLog;
  const reattemptCount = r.reAttempts?.length > 1 ? r.reAttempts.length - 1 : 0;

  const [expanded, setExpanded] = React.useState(false);

  const handleClick = () => {
    if (isInterpret) onOpenInterpretModal(r);
    else if (showLog) setExpanded(p => !p);
  };

  return (
    <div className={`rounded-xl border bg-white transition-all
      ${done ? 'border-[#8DC63F]/40 bg-[#8DC63F]/[0.02]' : 'border-gray-200'}
      ${isClickable ? 'hover:shadow-sm' : ''}`}
    >
      <div
        onClick={handleClick}
        className={`flex items-center gap-3 p-3 group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <ResourceIcon r={r} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate
            ${done && r.completionSource === 'progress' ? 'text-gray-400' : 'text-gray-700 group-hover:text-[#8DC63F]'}`}>
            {r.name}
          </p>
          {showLog && reattemptCount > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <RotateCcw size={10} className="text-amber-500" />
              <span className="text-[10px] text-amber-600 font-medium">
                {reattemptCount} re-attempt{reattemptCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <ResourceTypeBadge r={r} />
        {isInterpret && (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 border border-purple-200 flex-shrink-0">
            <Eye size={9} /> View Scores
          </span>
        )}
        {showFeedback && (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-200 flex-shrink-0">
            <MessageSquare size={9} /> Feedback
          </span>
        )}
        <CompletionStatus r={r} />
        {isInterpret && (
          <ChevronRight size={15} className="text-purple-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
        )}
        {showLog && (
          <div className={`flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={15} className={expanded ? 'text-[#8DC63F]' : 'text-gray-300'} />
          </div>
        )}
      </div>
      {showLog && expanded && (
        <div className="px-3 pb-3">
          <PracticeExpandedPanel r={r} showFeedback={showFeedback} />
        </div>
      )}
    </div>
  );
}

// ─── TOPIC ACCORDION ─────────────────────────────────────────────────────────

function TopicAccordion({ topic, items, isOpen, onToggle, token, onOpenInterpretModal }) {
  const TopicIcon = TOPIC_ICONS[topic] || BookOpen;
  const topicDone = items.filter(isResourceDone).length;
  const pct       = items.length ? Math.round((topicDone / items.length) * 100) : 0;

  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
          ${isOpen ? 'border-[#8DC63F] bg-[#8DC63F]/5' : 'border-gray-200 bg-white hover:border-[#8DC63F]/50 hover:bg-[#8DC63F]/[0.02]'}`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
          ${isOpen ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-400'}`}>
          <TopicIcon size={15} />
        </div>
        <div className="flex-1 text-left">
          <p className={`text-sm font-semibold transition-colors ${isOpen ? 'text-[#8DC63F]' : 'text-gray-700'}`}>{topic}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{topicDone}/{items.length} completed</p>
        </div>
        <div className="w-20 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
          <div className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {isOpen
          ? <ChevronDown size={16} className="text-[#8DC63F] flex-shrink-0" />
          : <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
        }
      </button>
      {isOpen && (
        <div className="mt-2 flex flex-col gap-2 pl-4 border-l-2 border-[#8DC63F]/20 ml-4">
          {items.map(r => (
            <ResourceRow key={r.id} r={r} token={token} onOpenInterpretModal={onOpenInterpretModal} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TYPE SECTION ─────────────────────────────────────────────────────────────

function TypeSection({ typeKey, accordions, directRows, flatList, openTopics, onToggleTopic, token, onOpenInterpretModal }) {
  const meta  = TYPE_META[typeKey] || TYPE_META.resource;
  const Icon  = meta.icon;
  const total = accordions.reduce((s, g) => s + g.items.length, 0) + directRows.length;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className={meta.color} />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{meta.label}</span>
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[10px] text-gray-400">{total}</span>
      </div>
      {flatList ? (
        <div className="flex flex-col gap-2">
          {directRows.map(r => (
            <ResourceRow key={r.id} r={r} token={token} onOpenInterpretModal={onOpenInterpretModal} />
          ))}
        </div>
      ) : (
        <>
          {accordions.map(({ topic, items }) => (
            <TopicAccordion
              key={topic}
              topic={topic}
              items={items}
              isOpen={!!openTopics[`${typeKey}::${topic}`]}
              onToggle={() => onToggleTopic(`${typeKey}::${topic}`)}
              token={token}
              onOpenInterpretModal={onOpenInterpretModal}
            />
          ))}
          {directRows.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {directRows.map(r => (
                <ResourceRow key={r.id} r={r} token={token} onOpenInterpretModal={onOpenInterpretModal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function MyLearning() {
  const [buttonOpen, setButtonOpen]         = React.useState(true);
  const [loading, setLoading]               = React.useState(true);
  const [error, setError]                   = React.useState(null);
  const [certs, setCerts]                   = React.useState([]);
  const [modules, setModules]               = React.useState({});
  const [resources, setResources]           = React.useState({});
  const [activeCert, setActiveCert]         = React.useState('');
  const [activeModule, setActiveModule]     = React.useState('');
  const [activeFilter, setActiveFilter]     = React.useState('all');
  const [search, setSearch]                 = React.useState('');
  const [openTopics, setOpenTopics]         = React.useState({});
  const [interpretModal, setInterpretModal] = React.useState(null);
  const [certLabelMap, setCertLabelMap]     = React.useState({});

  // ── Auth ──────────────────────────────────────────────────────────────────
  const token = localStorage.getItem('user_token');
  let decoded = null;
  try { decoded = token ? jwtDecode(token) : null; } catch (_) {}
  const traineeId = decoded?.id || decoded?.sub || decoded?.userId || localStorage.getItem('people_id');

  // ── Step 1: Fetch cert label from batch API ───────────────────────────────
  React.useEffect(() => {
    const batchId = localStorage.getItem('batch_id');
    if (!batchId || !token) return;

    fetchBatchCertLabel(batchId, token)
      .then(map => setCertLabelMap(map))
      .catch(err => console.error('Failed to fetch batch cert label:', err));
  }, [token]);

  // ── Step 2: Fetch trainee data, re-transform when certLabelMap is ready ───
  React.useEffect(() => {
    if (!traineeId || !token) return;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/api/v1/trainee/${traineeId}?isVr=false`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(json => {
        const t = transformApiData(json, certLabelMap);
        setCerts(t.certs);
        setModules(t.modules);
        setResources(t.resources);
        const first = t.certs[0];
        if (first) {
          setActiveCert(first.id);
          const mods    = t.modules[first.id] || [];
          const unlocked = mods.find(m => !m.locked);
          setActiveModule(unlocked?.id || mods[0]?.id || '');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [traineeId, token, certLabelMap]);

  if (!decoded?.role) return <Navigate to="/" replace />;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleTopic = key => setOpenTopics(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCertChange = certId => {
    setActiveCert(certId);
    const mods     = modules[certId] || [];
    const unlocked = mods.find(m => !m.locked);
    setActiveModule(unlocked?.id || mods[0]?.id || '');
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentModules = modules[activeCert] || [];
  const allRes         = resources[activeModule] || [];
  const activeModMeta  = currentModules.find(m => m.id === activeModule);
  const doneCount      = activeModMeta?.done ?? 0;
  const totalCount     = activeModMeta?.total ?? 0;
  const pct            = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const filtered = allRes.filter(r => {
    const matchType   = activeFilter === 'all' || r.type === activeFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const SECTION_ORDER = ['resource', 'practice', 'interpret', 'test'];
  const byType = filtered.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const sections = SECTION_ORDER
    .filter(k => byType[k]?.length > 0)
    .map(typeKey => {
      const isFlat = typeKey === 'interpret' || typeKey === 'test';
      if (isFlat) return { typeKey, flatList: true, accordions: [], directRows: byType[typeKey] };
      const { accordions, directRows } = buildTopicGroups(byType[typeKey]);
      return { typeKey, flatList: false, accordions, directRows };
    });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {interpretModal && (
        <ImageInterpretModal
          r={interpretModal}
          token={token}
          onClose={() => setInterpretModal(null)}
        />
      )}

      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={() => setButtonOpen(p => !p)} buttonOpen={buttonOpen} />

        <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow`}>

          {/* Breadcrumb */}
          <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border-b text-sm">
            <LayoutDashboard size={15} /> Dashboard /
            <Notebook size={15} />
            <span className="text-gray-500 font-medium">My Learning</span>
          </div>

          <div className="p-5">

            {loading && (
              <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader2 size={32} className="animate-spin mr-3" />
                <span className="text-sm">Loading your learning data…</span>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-red-400">
                <p className="text-sm font-medium">Failed to load data</p>
                <p className="text-xs mt-1 text-gray-400">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Cert tabs — labels now come from batch API */}
                <div className="flex items-center gap-3 mb-5">
                  {certs.map(cert => (
                    <button
                      key={cert.id}
                      onClick={() => handleCertChange(cert.id)}
                      className={`px-5 py-1.5 rounded-2xl border text-sm font-medium cursor-pointer transition-colors
                        ${activeCert === cert.id
                          ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
                          : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'}`}
                    >
                      {cert.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-5">

                  {/* Module list */}
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
                                  : 'border-gray-200 hover:border-[#8DC63F] hover:bg-[#8DC63F]/5 cursor-pointer'}`}
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className={`text-sm font-medium ${isActive ? 'text-[#8DC63F]' : 'text-gray-700'}`}>
                                {mod.label}
                              </span>
                              {mod.locked
                                ? <Lock size={13} className="text-gray-400" />
                                : <span className={`text-xs ${isActive ? 'text-[#8DC63F] font-semibold' : 'text-gray-400'}`}>{mod.done}/{mod.total}</span>
                              }
                            </div>
                            {!mod.locked && (
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-[#8DC63F] transition-all duration-500" style={{ width: `${modPct}%` }} />
                              </div>
                            )}
                            {mod.locked && <p className="text-[10px] text-gray-400 mt-0.5">Coming soon</p>}
                          </button>
                        );
                      })}
                    </div>

                    {activeModMeta && !activeModMeta.locked && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-500">{activeModMeta.label}</span>
                          <span className="text-xs font-semibold text-[#8DC63F]">{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full bg-[#8DC63F] transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">{doneCount} of {totalCount} resources completed</p>
                      </div>
                    )}
                  </div>

                  {/* Resource list */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {TYPE_FILTERS.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-3 py-1.5 rounded-2xl border text-xs font-medium cursor-pointer transition-colors
                              ${activeFilter === f.id
                                ? 'bg-[#8DC63F] text-white border-[#8DC63F]'
                                : 'border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white'}`}
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

                    {filtered.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400 border rounded-xl bg-white">
                        <BookOpen size={36} className="mb-3 text-gray-300" />
                        <p className="text-sm font-medium">No resources found</p>
                        <p className="text-xs mt-1">Try adjusting your filter or search</p>
                      </div>
                    )}

                    {sections.map(({ typeKey, flatList, accordions, directRows }) => (
                      <TypeSection
                        key={typeKey}
                        typeKey={typeKey}
                        flatList={flatList}
                        accordions={accordions}
                        directRows={directRows}
                        openTopics={openTopics}
                        onToggleTopic={toggleTopic}
                        token={token}
                        onOpenInterpretModal={setInterpretModal}
                      />
                    ))}
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