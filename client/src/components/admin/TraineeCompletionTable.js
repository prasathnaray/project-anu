// import React, { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";

// function TraineeCompletionTable({ ApiData }) {
//   const [openModules, setOpenModules] = useState({});
//   if (!ApiData || !ApiData.data) return <p>No data available</p>;
//   const groupedData = ApiData.data.reduce((acc, item) => {
//     const { course_name, chapter_name, module_name } = item;

//     if (!acc[course_name]) acc[course_name] = {};
//     if (!acc[course_name][chapter_name]) acc[course_name][chapter_name] = {};
//     if (!acc[course_name][chapter_name][module_name])
//       acc[course_name][chapter_name][module_name] = [];

//     acc[course_name][chapter_name][module_name].push(item);
//     return acc;
//   }, {});
//   const toggleModule = (key) => {
//     setOpenModules((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };
//   return (
//     <div className="p-6 bg-white shadow mx-7 mt-4 rounded text-gray-700 transition-all duration-500">
//       <h2 className="text-xl font-semibold text-[#8DC63F] mb-4">
//         {ApiData.data[0]?.user_name}'s Learning Progress
//       </h2>
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100 border-b border-gray-300">
//             <th className="py-3 px-4 text-left text-[#8DC63F]">Course Name</th>
//             <th className="py-3 px-4 text-left text-[#8DC63F]">Module Name</th>
//             <th className="py-3 px-4 text-left text-[#8DC63F]">Total</th>
//             <th className="py-3 px-4 text-left text-[#8DC63F]">Completed</th>
//             <th className="py-3 px-4 text-left text-[#8DC63F]">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(groupedData).map(([courseName, chapters], courseIdx) =>
//             Object.entries(chapters).map(([chapterName, modules], chapterIdx) =>
//               Object.entries(modules).map(([moduleName, resources], moduleIdx) => {
//                 const completed = resources.filter((r) => r.is_completed).length;
//                 const total = resources.length;
//                 const key = `${courseIdx}-${chapterIdx}-${moduleIdx}`;
//                 const isOpen = openModules[key];
//                 return (
//                   <React.Fragment key={key}>
//                     <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                       <td className="py-3 px-4 font-medium">{courseName}</td>
//                       <td className="py-3 px-4">{moduleName}</td>
//                       <td className="py-3 px-4">{total}</td>
//                       <td className="py-3 px-4 text-green-600 font-semibold">{completed}</td>
//                       <td className="py-3 px-4">
//                         <button
//                           onClick={() => toggleModule(key)}
//                           className="flex items-center gap-1 text-sm text-[#8DC63F] hover:underline"
//                         >
//                           {isOpen ? (
//                             <>
//                               <ChevronDown size={16} /> Hide
//                             </>
//                           ) : (
//                             <>
//                               <ChevronRight size={16} /> Show
//                             </>
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                     {isOpen && (
//                       <tr>
//                         <td colSpan={6} className="px-4 py-2">
//                           <table className="w-[95%] mx-auto text-sm border border-gray-200 rounded transition-all">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="py-2 px-3 text-left text-gray-600">
//                                   Resource Name
//                                 </th>
//                                 <th className="py-2 px-3 text-left text-gray-600">Status</th>
//                                 <th className="py-2 px-3 text-left text-gray-600">
//                                   Last Updated
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {resources.map((r, idx) => (
//                                 <tr
//                                   key={idx}
//                                   className="border-t border-gray-100 hover:bg-gray-50"
//                                 >
//                                   <td className="py-2 px-3">{r.resource_name}</td>
//                                   <td
//                                     className={`py-2 px-3 font-medium ${
//                                       r.is_completed ? "text-green-600" : "text-gray-400"
//                                     }`}
//                                   >
//                                     {r.is_completed ? "Completed" : "Pending"}
//                                   </td>
//                                   <td className="py-2 px-3 text-gray-500">
//                                     {r.updated_at
//                                       ? new Date(r.updated_at).toLocaleString()
//                                       : "-"}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })
//             )
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// export default TraineeCompletionTable;


// below code is working good pl change it accordingly

// import React, { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";

// function TraineeCompletionTable({ ApiData }) {
//   const [openModules, setOpenModules] = useState({});

//   if (!ApiData || !ApiData.data) return <div>No data available</div>;

//   // Group by course -> module -> unit (keep all entries, even with empty module/unit)
//   const groupedData = ApiData.data.reduce((acc, item) => {
//     const { course_name, module_name, unit_name } = item;
    
//     // Use "No Module" and "No Unit" for empty values
//     const moduleKey = module_name || "No Module";
//     const unitKey = unit_name || "No Unit";
    
//     if (!acc[course_name]) acc[course_name] = {};
//     if (!acc[course_name][moduleKey]) acc[course_name][moduleKey] = {};
//     if (!acc[course_name][moduleKey][unitKey]) 
//       acc[course_name][moduleKey][unitKey] = [];
    
//     acc[course_name][moduleKey][unitKey].push(item);
//     return acc;
//   }, {});

//   const toggleModule = (key) => {
//     setOpenModules((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         {ApiData.data[0]?.user_name}'s Learning Progress
//       </h1>
//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="p-4 text-left text-sm font-semibold text-gray-700">Course Name</th>
//               {/* <th className="p-4 text-left text-sm font-semibold text-gray-700">Module Name</th> */}
//               <th className="p-4 text-left text-sm font-semibold text-gray-700">Unit Name</th>
//               <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
//               <th className="p-4 text-left text-sm font-semibold text-gray-700">Completed</th>
//               <th className="p-4 text-left text-sm font-semibold text-gray-700">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(groupedData).map(([courseName, modules], courseIdx) =>
//               Object.entries(modules).map(([moduleName, units], moduleIdx) =>
//                 Object.entries(units).map(([unitName, resources], unitIdx) => {
//                   // Filter out resources with null/N/A resource_name
//                   const validResources = resources.filter(r => r.resource_name && r.resource_name !== "N/A");
//                   const completed = validResources.filter((r) => r.is_completed).length;
//                   const total = validResources.length;
//                   const key = `${courseIdx}-${moduleIdx}-${unitIdx}`;
//                   const isOpen = openModules[key];

//                   return (
//                     <React.Fragment key={key}>
//                       <tr className="border-b hover:bg-gray-50">
//                         <td className="p-4 text-sm text-gray-800">{courseName}</td>
//                         {/* <td className="p-4 text-sm text-gray-800">{moduleName}</td> */}
//                         <td className="p-4 text-sm text-gray-800">{unitName}</td>
//                         <td className="p-4 text-sm text-gray-800">{total}</td>
//                         <td className="p-4 text-sm text-gray-800">{completed}</td>
//                         <td className="p-4">
//                           {total > 0 ? (
//                             <button
//                               onClick={() => toggleModule(key)}
//                               className="flex items-center gap-1 text-sm text-[#8DC63F] hover:underline focus:outline-none"
//                             >
//                               {isOpen ? (
//                                 <>
//                                   <ChevronDown size={16} />
//                                   Hide
//                                 </>
//                               ) : (
//                                 <>
//                                   <ChevronRight size={16} />
//                                   Show
//                                 </>
//                               )}
//                             </button>
//                           ) : (
//                             <span className="text-sm text-gray-400">No resources</span>
//                           )}
//                         </td>
//                       </tr>
//                       {isOpen && total > 0 && (
//                         <tr>
//                           <td colSpan="6" className="p-0">
//                             <div className="bg-gray-50 p-4">
//                               <table className="w-full">
//                                 <thead>
//                                   <tr className="bg-gray-200">
//                                     <th className="p-3 text-left text-sm font-semibold text-gray-700">
//                                       Resource Name
//                                     </th>
//                                     <th className="p-3 text-left text-sm font-semibold text-gray-700">
//                                       Status
//                                     </th>
//                                     <th className="p-3 text-left text-sm font-semibold text-gray-700">
//                                       Last Updated
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {validResources.map((r, idx) => (
//                                     <tr key={idx} className="border-b border-gray-300">
//                                       <td className="p-3 text-sm text-gray-800">
//                                         {r.resource_name || "N/A"}
//                                       </td>
//                                       <td className="p-3 text-sm">
//                                         <span
//                                           className={`px-2 py-1 rounded text-xs font-medium ${
//                                             r.is_completed
//                                               ? "bg-green-100 text-green-800"
//                                               : "bg-yellow-100 text-yellow-800"
//                                           }`}
//                                         >
//                                           {r.is_completed ? "Completed" : "Pending"}
//                                         </span>
//                                       </td>
//                                       <td className="p-3 text-sm text-gray-600">
//                                         {r.updated_at
//                                           ? new Date(r.updated_at).toLocaleString()
//                                           : "-"}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })
//               )
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
// export default TraineeCompletionTable;


//new code after changes
import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

// ── Build tree from LMS flat data ─────────────────────────────────────────────
// const buildTree = (rows) => {
//   const certMap = {};

//   for (const row of rows) {
//     const {
//       certificate_id, course_name, module_name, unit_name,
//       resource_id, resource_name, resource_type, resource_topic, is_completed,
//     } = row;

//     if (!resource_id) continue;

//     if (!certMap[certificate_id]) {
//       certMap[certificate_id] = { certificate_id, certificate_name: certificate_id, courses: {} };
//     }
//     const cert = certMap[certificate_id];
//     if (cert.certificate_name === certificate_id) cert.certificate_name = course_name || certificate_id;

//     const cKey = course_name || "General";
//     if (!cert.courses[cKey]) cert.courses[cKey] = { course_name: cKey, modules: {} };
//     const course = cert.courses[cKey];

//     const mKey = module_name || "General";
//     if (!course.modules[mKey]) course.modules[mKey] = { module_name: mKey, units: {} };
//     const mod = course.modules[mKey];

//     const uKey = unit_name || "General";
//     if (!mod.units[uKey]) {
//       mod.units[uKey] = {
//         unit_name: uKey,
//         learning_resources: { total: 0, completed: 0, items: {} },
//         image_interpretations: { total: 0, completed: 0, items: {} },
//         practices: [],
//         tests: [],
//       };
//     }
//     const unit = mod.units[uKey];
//     const leaf = { resource_id, resource_name, is_completed: is_completed ?? false };
//     const tKey = resource_topic || "General";

//     if (resource_type === "Learning Resource") {
//       unit.learning_resources.total += 1;
//       if (is_completed) unit.learning_resources.completed += 1;
//       if (!unit.learning_resources.items[tKey])
//         unit.learning_resources.items[tKey] = { resource_topic: tKey, resources: [] };
//       unit.learning_resources.items[tKey].resources.push(leaf);
//     } else if (resource_type === "Image Interpretation") {
//       unit.image_interpretations.total += 1;
//       if (is_completed) unit.image_interpretations.completed += 1;
//       if (!unit.image_interpretations.items[tKey])
//         unit.image_interpretations.items[tKey] = { resource_topic: tKey, resources: [] };
//       unit.image_interpretations.items[tKey].resources.push(leaf);
//     } else if (resource_type === "Practice") {
//       unit.practices.push(leaf);
//     } else if (resource_type === "Test") {
//       unit.tests.push(leaf);
//     }
//   }
  const buildTree = (rows) => {
  const certMap = {};

  for (const row of rows) {
    const {
      certificate_id, course_name, module_name, unit_name,
      resource_id, resource_name, resource_type, resource_topic, is_completed,
    } = row;

    // ❌ REMOVE this line from the top:
    // if (!resource_id) continue;

    if (!certMap[certificate_id]) {
      certMap[certificate_id] = { certificate_id, certificate_name: certificate_id, courses: {} };
    }
    const cert = certMap[certificate_id];
    if (cert.certificate_name === certificate_id) cert.certificate_name = course_name || certificate_id;

    const cKey = course_name || "General";
    if (!cert.courses[cKey]) cert.courses[cKey] = { course_name: cKey, modules: {} };
    const course = cert.courses[cKey];

    const mKey = module_name || "General";
    if (!course.modules[mKey]) course.modules[mKey] = { module_name: mKey, units: {} };
    const mod = course.modules[mKey];

    const uKey = unit_name || "General";
    if (!mod.units[uKey]) {
      mod.units[uKey] = {
        unit_name: uKey,
        learning_resources: { total: 0, completed: 0, items: {} },
        image_interpretations: { total: 0, completed: 0, items: {} },
        practices: [],
        tests: [],
      };
    }

    // ✅ Skip resource processing only — but unit is already registered above
    if (!resource_id) continue;

    const unit = mod.units[uKey];
    const leaf = { resource_id, resource_name, is_completed: is_completed ?? false };
    const tKey = resource_topic || "General";

    if (resource_type === "Learning Resource") {
      unit.learning_resources.total += 1;
      if (is_completed) unit.learning_resources.completed += 1;
      if (!unit.learning_resources.items[tKey])
        unit.learning_resources.items[tKey] = { resource_topic: tKey, resources: [] };
      unit.learning_resources.items[tKey].resources.push(leaf);
    } else if (resource_type === "Image Interpretation") {
      unit.image_interpretations.total += 1;
      if (is_completed) unit.image_interpretations.completed += 1;
      if (!unit.image_interpretations.items[tKey])
        unit.image_interpretations.items[tKey] = { resource_topic: tKey, resources: [] };
      unit.image_interpretations.items[tKey].resources.push(leaf);
    } else if (resource_type === "Practice") {
      unit.practices.push(leaf);
    } else if (resource_type === "Test") {
      unit.tests.push(leaf);
    }
  }
  return Object.values(certMap).map(cert => ({
    ...cert,
    courses: Object.values(cert.courses).map(course => ({
      ...course,
      modules: Object.values(course.modules).map(mod => ({
        ...mod,
        units: Object.values(mod.units).map(unit => ({
          ...unit,
          learning_resources: {
            ...unit.learning_resources,
            items: Object.values(unit.learning_resources.items),
          },
          image_interpretations: {
            ...unit.image_interpretations,
            items: Object.values(unit.image_interpretations.items),
          },
        })),
      })),
    })),
  }));
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ completed, total, color, onClick }) => {
  if (!total) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-col items-center px-3 py-1.5 rounded-lg border text-xs font-medium transition hover:shadow-md hover:scale-105 ${color}`}
    >
      <span className="text-base font-bold">{completed}/{total}</span>
      <span className="opacity-70">completed</span>
    </button>
  );
};

// ── Toggle row for modal ──────────────────────────────────────────────────────
const ToggleRow = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-gray-50 rounded transition text-sm font-medium text-gray-700"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {label}
      </button>
      {open && <div className="border-l-2 border-gray-200 ml-5 mb-1">{children}</div>}
    </div>
  );
};

const ResourceLeaf = ({ name, isCompleted }) => (
  <div className="flex items-center justify-between py-1.5 px-3 text-sm">
    <span className="text-gray-600">{name}</span>
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-50 text-yellow-600"
    }`}>
      {isCompleted ? "Completed" : "Pending"}
    </span>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, type, unit }) => {
  if (!open || !unit) return null;

  const renderContent = () => {
    if (type === "lr") {
      return unit.learning_resources.items.map(tg => (
        <ToggleRow key={tg.resource_topic} label={tg.resource_topic}>
          {tg.resources.map(r => (
            <ResourceLeaf key={r.resource_id} name={r.resource_name} isCompleted={r.is_completed} />
          ))}
        </ToggleRow>
      ));
    }
    if (type === "ii") {
      return unit.image_interpretations.items.map(tg => (
        <ToggleRow key={tg.resource_topic} label={tg.resource_topic}>
          {tg.resources.map(r => (
            <ResourceLeaf key={r.resource_id} name={r.resource_name} isCompleted={r.is_completed} />
          ))}
        </ToggleRow>
      ));
    }
    if (type === "practice") {
      return unit.practices.map(r => (
        <ResourceLeaf key={r.resource_id} name={r.resource_name} isCompleted={r.is_completed} />
      ));
    }
    if (type === "test") {
      return unit.tests.map(r => (
        <ResourceLeaf key={r.resource_id} name={r.resource_name} isCompleted={r.is_completed} />
      ));
    }
  };

  const typeLabel = {
    lr: "Learning Resources",
    ii: "Image Interpretation",
    practice: "Practice",
    test: "Test",
  }[type];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xs flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-md w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-[#8DC63F]">
              {typeLabel}
            </div>
            <div className="text-gray-800 font-semibold text-base">{title}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-red-100 transition">
            <X size={20} className="text-red-400" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3 flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// ── MUI Select helper ─────────────────────────────────────────────────────────
const MuiDropdown = ({ label, value, onChange, options, disabled }) => (
  <FormControl size="small" sx={{ minWidth: 180 }} disabled={disabled}>
    <InputLabel sx={{ fontSize: 13, "&.Mui-focused": { color: "#8DC63F" } }}>
      {label}
    </InputLabel>
    <Select
      value={value}
      label={label}
      onChange={e => onChange(e.target.value)}
      sx={{
        fontSize: 13,
        borderRadius: "8px",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8DC63F" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8DC63F" },
      }}
    >
      <MenuItem value=""><em>All</em></MenuItem>
      {options.map(o => (
        <MenuItem key={o} value={o} sx={{ fontSize: 13 }}>{o || "General"}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

// ── Main Component ────────────────────────────────────────────────────────────
function TraineeCompletionTable({ ApiData }) {
  const [modal, setModal] = useState({ open: false, type: null, unit: null, title: "" });
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const certificates = useMemo(() => {
    if (ApiData?.certificates?.length) return ApiData.certificates;
    if (ApiData?.data?.length) return buildTree(ApiData.data);
    return [];
  }, [ApiData]);

  // ── Dropdown options ──────────────────────────────────────────────────────
  const allCourses = useMemo(() => {
    const s = new Set();
    certificates.forEach(cert => cert.courses.forEach(c => s.add(c.course_name)));
    return [...s];
  }, [certificates]);

  const allModules = useMemo(() => {
    if (!selectedCourse) return [];
    const s = new Set();
    certificates.forEach(cert =>
      cert.courses
        .filter(c => c.course_name === selectedCourse)
        .forEach(c => c.modules.forEach(m => s.add(m.module_name)))
    );
    return [...s];
  }, [certificates, selectedCourse]);

  const allUnits = useMemo(() => {
    if (!selectedModule) return [];
    const s = new Set();
    certificates.forEach(cert =>
      cert.courses
        .filter(c => c.course_name === selectedCourse)
        .forEach(c =>
          c.modules
            .filter(m => m.module_name === selectedModule)
            .forEach(m => m.units.forEach(u => s.add(u.unit_name)))
        )
    );
    return [...s];
  }, [certificates, selectedCourse, selectedModule]);

  const handleCourseChange = (val) => { setSelectedCourse(val); setSelectedModule(""); setSelectedUnit(""); };
  const handleModuleChange = (val) => { setSelectedModule(val); setSelectedUnit(""); };

  // ── Filtered tree ─────────────────────────────────────────────────────────
  const filteredCertificates = useMemo(() => {
    return certificates
      .map(cert => ({
        ...cert,
        courses: cert.courses
          .filter(c => !selectedCourse || c.course_name === selectedCourse)
          .map(c => ({
            ...c,
            modules: c.modules
              .filter(m => !selectedModule || m.module_name === selectedModule)
              .map(m => ({
                ...m,
                units: m.units.filter(u => !selectedUnit || u.unit_name === selectedUnit),
              }))
              .filter(m => m.units.length > 0),
          }))
          .filter(c => c.modules.length > 0),
      }))
      .filter(cert => cert.courses.length > 0);
  }, [certificates, selectedCourse, selectedModule, selectedUnit]);

  const openModal = (type, unit, unitName) => setModal({ open: true, type, unit, title: unitName });
  const closeModal = () => setModal({ open: false, type: null, unit: null, title: "" });
  const userName = ApiData?.data?.[0]?.user_name || "";
  const hasFilters = selectedCourse || selectedModule || selectedUnit;

  if (!certificates.length) return <div className="p-6 text-gray-400 text-sm">No data available.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-lg mb-4 text-gray-800">
        {userName ? `${userName} - ` : ""}Learning Progress
      </h1>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 mb-6">
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <MuiDropdown
            label="Select Course"
            value={selectedCourse}
            onChange={handleCourseChange}
            options={allCourses}
            disabled={false}
          />
          <MuiDropdown
            label="Select Module"
            value={selectedModule}
            onChange={handleModuleChange}
            options={allModules}
            disabled={!selectedCourse}
          />
          <MuiDropdown
            label="Select Unit"
            value={selectedUnit}
            onChange={setSelectedUnit}
            options={allUnits}
            disabled={!selectedModule}
          />
          {hasFilters && (
            <Button
              size="small"
              onClick={() => { setSelectedCourse(""); setSelectedModule(""); setSelectedUnit(""); }}
              sx={{
                color: "#9ca3af",
                textTransform: "none",
                fontSize: 12,
                "&:hover": { color: "#ef4444", background: "transparent" },
              }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </div>

      {/* ── Certificate blocks ────────────────────────────────────────────── */}
      {filteredCertificates.map(cert => (
        <div key={cert.certificate_id} className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-[#8DC63F]">
            <span className="text-white font-bold text-sm tracking-wide">{cert.certificate_name}</span>
          </div>

          {cert.courses.map(course => (
            <div key={course.course_name}>
              {/* <div className="px-5 py-2 bg-gray-50 border-b text-gray-600 font-semibold text-sm">
                {course.course_name}
              </div> */}

              {course.modules.map(mod => (
                <div key={mod.module_name} className="px-4 py-3">
                  {mod.module_name && mod.module_name !== "General" && (
                    <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                      {mod.module_name}
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="text-left px-4 py-3 text-[#8DC63F] font-semibold w-1/5">Unit</th>
                          <th className="text-center px-4 py-3 text-[#8DC63F] font-semibold w-1/5">LR</th>
                          <th className="text-center px-4 py-3 text-[#8DC63F] font-semibold w-1/5">Image Interpretation</th>
                          <th className="text-center px-4 py-3 text-[#8DC63F] font-semibold w-1/5">Practice</th>
                          <th className="text-center px-4 py-3 text-[#8DC63F] font-semibold w-1/5">Test</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mod.units.map((unit, idx) => (
                          <tr key={unit.unit_name} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3 font-medium text-gray-800">{unit.unit_name}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                completed={unit.learning_resources.completed}
                                total={unit.learning_resources.total}
                                color="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => openModal("lr", unit, unit.unit_name)}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                completed={unit.image_interpretations.completed}
                                total={unit.image_interpretations.total}
                                color="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => openModal("ii", unit, unit.unit_name)}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                completed={unit.practices.filter(p => p.is_completed).length}
                                total={unit.practices.length}
                                color="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => openModal("practice", unit, unit.unit_name)}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                completed={unit.tests.filter(t => t.is_completed).length}
                                total={unit.tests.length}
                                color="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => openModal("test", unit, unit.unit_name)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <Modal open={modal.open} onClose={closeModal} title={modal.title} type={modal.type} unit={modal.unit} />
    </div>
  );
}

export default TraineeCompletionTable;