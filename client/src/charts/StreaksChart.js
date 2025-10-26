// import React, { useMemo } from 'react';
// import Chart from 'react-apexcharts';
// import { format } from 'date-fns';

// export default function StreakHeatmap({ data }) {

//   // Step 1: Extract valid completion dates
//   const completionDates = useMemo(() => {
//     return data
//       .filter(item => item.is_completed && item.updated_at)
//       .map(item => new Date(item.updated_at));
//   }, [data]);
//   const groupedData = useMemo(() => {
//     const monthsMap = {};
//     completionDates.forEach(date => {
//       const monthKey = format(date, 'MMM');
//       const dayKey = format(date, 'd');

//       if (!monthsMap[monthKey]) monthsMap[monthKey] = {};
//       monthsMap[monthKey][dayKey] = (monthsMap[monthKey][dayKey] || 0) + 1;
//     });
//     return Object.keys(monthsMap).map(month => {
//       const daysInMonth = 31; // optional: handle Feb separately if you want
//       const dataPoints = Array.from({ length: daysInMonth }, (_, i) => {
//         const day = (i + 1).toString();
//         return {
//           x: `${month} ${day}`,
//           y: monthsMap[month][day] || 0,
//         };
//       });
//       return { name: month, data: dataPoints };
//     });
//   }, [completionDates]);
//   const options = {
//     chart: {
//       type: "heatmap",
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       heatmap: {
//         shadeIntensity: 0.5,
//         radius: 2,
//         colorScale: {
//           ranges: [
//             { from: 0, to: 0, color: "#e0e0e0", name: "No Activity" },
//             { from: 1, to: 2, color: "#C8E6C9", name: "Low" },
//             { from: 3, to: 4, color: "#8DC63F", name: "Moderate" },
//             { from: 5, to: 10, color: "#388E3C", name: "High" },
//           ],
//         },
//       },
//     },
//     dataLabels: { enabled: false },
//     xaxis: {
//       labels: {
//         style: { fontSize: "8px" },
//         rotate: -45,
//       },
//       tickAmount: 10,
//     },
//     yaxis: {
//       labels: {
//         style: { fontSize: "10px", fontWeight: 600 },
//       },
//     },
//     legend: {
//       show: true,
//       position: "bottom",
//       fontSize: "10px",
//       markers: { width: 8, height: 8 },
//     },
//     tooltip: {
//       y: { formatter: (val) => `${val} completions` },
//     },
//   };
//   return (
//     <>
//       {groupedData.length > 0 ? (
//         <Chart options={options} series={groupedData} type="heatmap" height={300} />
//       ) : (
//         <div className="text-gray-400 text-center py-10">No completion streaks yet</div>
//       )}
//     </>
//   );
// }
// import React, { useMemo } from 'react';
// import { startOfYear, endOfYear, eachDayOfInterval, getDay, getWeek, format } from 'date-fns';

// const COLORS = ['#e0e0e0', '#C8E6C9', '#8DC63F', '#388E3C']; // No activity → high

// export default function GitHubStyleHeatmap({ data }) {
//   const dateCounts = useMemo(() => {
//     const map = {};
//     data.forEach(item => {
//       if (item.is_completed && item.updated_at) {
//         const dateStr = format(new Date(item.updated_at), 'yyyy-MM-dd');
//         map[dateStr] = (map[dateStr] || 0) + 1;
//       }
//     });
//     return map;
//   }, [data]);

//   const allDays = useMemo(() => {
//     const start = startOfYear(new Date());
//     const end = endOfYear(new Date());
//     return eachDayOfInterval({ start, end });
//   }, []);

//   // Group by weeks
//   const weeks = useMemo(() => {
//     const weekMap = {};
//     allDays.forEach(date => {
//       const week = getWeek(date, { weekStartsOn: 0 });
//       const day = getDay(date);
//       if (!weekMap[week]) weekMap[week] = Array(7).fill(0);
//       const dateStr = format(date, 'yyyy-MM-dd');
//       weekMap[week][day] = dateCounts[dateStr] || 0;
//     });
//     return Object.values(weekMap);
//   }, [allDays, dateCounts]);

//   const getColor = (count) => {
//     if (count === 0) return COLORS[0];
//     if (count <= 2) return COLORS[1];
//     if (count <= 4) return COLORS[2];
//     return COLORS[3];
//   };

//   return (
//     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2px', overflowX: 'auto', padding: '10px' }}>
//       {weeks.map((week, i) => (
//         <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
//           {week.map((count, j) => (
//             <div
//               key={j}
//               title={`Day: ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][j]}, Count: ${count}`}
//               style={{
//                 width: 12,
//                 height: 12,
//                 backgroundColor: getColor(count),
//                 borderRadius: 2,
//               }}
//             />
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// import React, { useMemo } from 'react';
// import { startOfYear, endOfYear, eachDayOfInterval, getDay, getWeek, format } from 'date-fns';

// const COLORS = ['#e0e0e0', '#C8E6C9', '#b4f559ff', '#388E3C']; // No activity → high

// export default function GitHubStyleHeatmap({ data }) {
//   const dateCounts = useMemo(() => {
//     const map = {};
//     data.forEach(item => {
//       if (item.is_completed && item.updated_at) {
//         const dateStr = format(new Date(item.updated_at), 'yyyy-MM-dd');
//         map[dateStr] = (map[dateStr] || 0) + 1;
//       }
//     });
//     return map;
//   }, [data]);

//   const allDays = useMemo(() => {
//     const start = startOfYear(new Date());
//     const end = endOfYear(new Date());
//     return eachDayOfInterval({ start, end });
//   }, []);

//   // Group by weeks
//   const weeks = useMemo(() => {
//     const weekMap = {};
//     allDays.forEach(date => {
//       const week = getWeek(date, { weekStartsOn: 0 });
//       const day = getDay(date);
//       if (!weekMap[week]) weekMap[week] = Array(7).fill(0);
//       const dateStr = format(date, 'yyyy-MM-dd');
//       weekMap[week][day] = dateCounts[dateStr] || 0;
//     });
//     return Object.values(weekMap);
//   }, [allDays, dateCounts]);

//   const monthLabels = useMemo(() => {
//     const labels = [];
//     let lastMonth = null;
//     let weekIndex = 0;
//     const weekIndexMap = {};
    
//     allDays.forEach(date => {
//       const week = getWeek(date, { weekStartsOn: 0 });
//       if (!weekIndexMap[week]) {
//         weekIndexMap[week] = weekIndex;
//         weekIndex++;
//       }
      
//       const month = format(date, 'MMM');
//       const day = getDay(date);
      
//       if (month !== lastMonth && day === 0) {
//         labels.push({ weekIndex: weekIndexMap[week], month });
//         lastMonth = month;
//       }
//     });
//     return labels;
//   }, [allDays]);

//   const getColor = (count) => {
//     if (count === 0) return COLORS[0];
//     if (count <= 2) return COLORS[1];
//     if (count <= 4) return COLORS[2];
//     return COLORS[3];
//   };

//   return (
//     <div style={{ padding: '10px', width: '100%', height: '100%' }}>
//       <div style={{ display: 'flex', gap: '2px', marginBottom: '4px', marginLeft: '20px' }}>
//         {weeks.map((_, i) => {
//           const label = monthLabels.find(l => l.weekIndex === i);
//           return (
//             <div key={i} style={{ width: 12, fontSize: '10px', color: '#666', fontWeight: '500' }}>
//               {label?.month}
//             </div>
//           );
//         })}
//       </div>
//       <div style={{ display: 'flex', alignItems: 'flex-start' }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px', fontSize: '9px', color: '#666' }}>
//           <div style={{ height: 12, lineHeight: '12px' }}>Sun</div>
//           <div style={{ height: 12, lineHeight: '12px' }}>Mon</div>
//           <div style={{ height: 12, lineHeight: '12px' }}>Tue</div>
//           <div style={{ height: 12, lineHeight: '12px' }}>Wed</div>
//           <div style={{ height: 12, lineHeight: '12px' }}>Thu</div>
//           <div style={{ height: 12, lineHeight: '12px' }}>Fri</div>
//           <div style={{ height: 12, lineHeight: '12px' }}>Sat</div>
//         </div>
//         <div style={{ display: 'flex', gap: '2px', overflowX: 'auto' }}>
//           {weeks.map((week, i) => (
//             <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
//               {week.map((count, j) => (
//                 <div
//                   key={j}
//                   title={`Day: ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][j]}, Count: ${count}`}
//                   style={{
//                     width: 12,
//                     height: 12,
//                     backgroundColor: getColor(count),
//                     borderRadius: 2,
//                   }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo } from 'react';
import { startOfYear, endOfYear, eachMonthOfInterval, eachDayOfInterval, startOfMonth, endOfMonth, format, getDay } from 'date-fns';

const COLORS = ['#e0e0e0', '#C8E6C9', '#8DC63F', '#388E3C']; // No activity → high

export default function GitHubStyleHeatmap({ data }) {
  const dateCounts = useMemo(() => {
    const map = {};
    data.forEach(item => {
      if (item.is_completed && item.updated_at) {
        const dateStr = format(new Date(item.updated_at), 'yyyy-MM-dd');
        map[dateStr] = (map[dateStr] || 0) + 1;
      }
    });
    return map;
  }, [data]);

  const monthsData = useMemo(() => {
    const start = startOfYear(new Date());
    const end = endOfYear(new Date());
    const months = eachMonthOfInterval({ start, end });
    
    return months.map(monthStart => {
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      const weeks = [];
      let currentWeek = [];
      
      days.forEach((date, idx) => {
        const dayOfWeek = getDay(date);
        
        // Start new week on Sunday (unless it's the first day and not Sunday)
        if (idx === 0 && dayOfWeek !== 0) {
          // Fill empty days at the start
          for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push(null);
          }
        }
        
        const dateStr = format(date, 'yyyy-MM-dd');
        currentWeek.push({
          date,
          count: dateCounts[dateStr] || 0
        });
        
        // Complete week on Saturday or last day
        if (dayOfWeek === 6 || idx === days.length - 1) {
          // Fill remaining days if it's the last day and not Saturday
          if (idx === days.length - 1 && dayOfWeek !== 6) {
            for (let i = dayOfWeek + 1; i <= 6; i++) {
              currentWeek.push(null);
            }
          }
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
      });
      
      return {
        month: format(monthStart, 'MMM'),
        weeks
      };
    });
  }, [dateCounts]);

  const getColor = (count) => {
    if (count === 0) return COLORS[0];
    if (count <= 2) return COLORS[1];
    if (count <= 4) return COLORS[2];
    return COLORS[3];
  };

  return (
    <div style={{ padding: '10px', width: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {monthsData.map((monthData, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '4px', textAlign: 'center' }}>
              {monthData.month}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {idx === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px', fontSize: '9px', color: '#666' }}>
                  <div style={{ height: 12, lineHeight: '12px' }}>S</div>
                  <div style={{ height: 12, lineHeight: '12px' }}>M</div>
                  <div style={{ height: 12, lineHeight: '12px' }}>T</div>
                  <div style={{ height: 12, lineHeight: '12px' }}>W</div>
                  <div style={{ height: 12, lineHeight: '12px' }}>T</div>
                  <div style={{ height: 12, lineHeight: '12px' }}>F</div>
                  <div style={{ height: 12, lineHeight: '12px' }}>S</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '2px' }}>
                {monthData.weeks.map((week, weekIdx) => (
                  <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {week.map((cell, dayIdx) => (
                      <div
                        key={dayIdx}
                        title={cell ? `${format(cell.date, 'MMM d, yyyy')} - ${cell.count} completion${cell.count !== 1 ? 's' : ''}` : ''}
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: cell ? getColor(cell.count) : 'transparent',
                          borderRadius: 2,
                          cursor: cell ? 'pointer' : 'default',
                          transition: 'transform 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (cell) e.currentTarget.style.transform = 'scale(1.3)';
                        }}
                        onMouseLeave={(e) => {
                          if (cell) e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
