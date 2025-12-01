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

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function TraineeCompletionTable({ ApiData }) {
  const [openModules, setOpenModules] = useState({});

  if (!ApiData || !ApiData.data) return <div>No data available</div>;

  // Group by course -> module -> unit (keep all entries, even with empty module/unit)
  const groupedData = ApiData.data.reduce((acc, item) => {
    const { course_name, module_name, unit_name } = item;
    
    // Use "No Module" and "No Unit" for empty values
    const moduleKey = module_name || "No Module";
    const unitKey = unit_name || "No Unit";
    
    if (!acc[course_name]) acc[course_name] = {};
    if (!acc[course_name][moduleKey]) acc[course_name][moduleKey] = {};
    if (!acc[course_name][moduleKey][unitKey]) 
      acc[course_name][moduleKey][unitKey] = [];
    
    acc[course_name][moduleKey][unitKey].push(item);
    return acc;
  }, {});

  const toggleModule = (key) => {
    setOpenModules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {ApiData.data[0]?.user_name}'s Learning Progress
      </h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Course Name</th>
              {/* <th className="p-4 text-left text-sm font-semibold text-gray-700">Module Name</th> */}
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Unit Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Completed</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([courseName, modules], courseIdx) =>
              Object.entries(modules).map(([moduleName, units], moduleIdx) =>
                Object.entries(units).map(([unitName, resources], unitIdx) => {
                  // Filter out resources with null/N/A resource_name
                  const validResources = resources.filter(r => r.resource_name && r.resource_name !== "N/A");
                  const completed = validResources.filter((r) => r.is_completed).length;
                  const total = validResources.length;
                  const key = `${courseIdx}-${moduleIdx}-${unitIdx}`;
                  const isOpen = openModules[key];

                  return (
                    <React.Fragment key={key}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-800">{courseName}</td>
                        {/* <td className="p-4 text-sm text-gray-800">{moduleName}</td> */}
                        <td className="p-4 text-sm text-gray-800">{unitName}</td>
                        <td className="p-4 text-sm text-gray-800">{total}</td>
                        <td className="p-4 text-sm text-gray-800">{completed}</td>
                        <td className="p-4">
                          {total > 0 ? (
                            <button
                              onClick={() => toggleModule(key)}
                              className="flex items-center gap-1 text-sm text-[#8DC63F] hover:underline focus:outline-none"
                            >
                              {isOpen ? (
                                <>
                                  <ChevronDown size={16} />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <ChevronRight size={16} />
                                  Show
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">No resources</span>
                          )}
                        </td>
                      </tr>
                      {isOpen && total > 0 && (
                        <tr>
                          <td colSpan="6" className="p-0">
                            <div className="bg-gray-50 p-4">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                                      Resource Name
                                    </th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                                      Status
                                    </th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                                      Last Updated
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {validResources.map((r, idx) => (
                                    <tr key={idx} className="border-b border-gray-300">
                                      <td className="p-3 text-sm text-gray-800">
                                        {r.resource_name || "N/A"}
                                      </td>
                                      <td className="p-3 text-sm">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            r.is_completed
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {r.is_completed ? "Completed" : "Pending"}
                                        </span>
                                      </td>
                                      <td className="p-3 text-sm text-gray-600">
                                        {r.updated_at
                                          ? new Date(r.updated_at).toLocaleString()
                                          : "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default TraineeCompletionTable;