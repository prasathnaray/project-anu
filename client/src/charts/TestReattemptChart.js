// import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';

// export default function TestReattemptChart({ reAttempts = [] }) {
//   const colorPalette = [
//     '#D5EDB3', // Light
//     '#B4DD8E', // Medium Light
//     '#8DC63F', // Base (your original)
//     '#5F8829', // Medium Dark
//     '#3D571A', // Dark
//   ];

//   const chartData = reAttempts.map((item, id) => ({
//     id,
//     value: Number(item.attempt_count),
//     label: item.resource_name,
//   }));

//   if (!chartData.length) {
//     return <div className="text-sm text-gray-400">No multiple attempts found</div>;
//   }

//   return (
//     <PieChart
//       series={[{ data: chartData }]}
//       colors={colorPalette}
//       sx={{
//         [`& .${pieArcClasses.faded}`]: {
//           fill: 'gray',
//         },
//       }}
//       height={300}
//     />
//   );
// }
import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';

export default function TestReattemptChart({
  reAttempts = [],
  testQuery = [],
}) {
  const colorPalette = [
    '#C6D43F', // Yellow-Green
    '#AAD03F', // Lime
    '#8DC63F', // Base (your original)
    '#3FC664', // Green
    '#3FC693', // Teal-Green
  ];

  // 🔁 Build lookup map from testQuery
  const testMetaMap = new Map(
    testQuery.map(test => [test.resource_id, test])
  );
  const enrichedData = reAttempts.map((item) => {
    const meta = testMetaMap.get(item.resource_id) || {};
    return {
      ...item,
      resource_name: meta.resource_name || 'Unknown Test',
      module_name: meta.module_name || 'Unknown Module',
      course_name: meta.course_name || 'Unknown Course',
    };
  });
  const chartData = enrichedData.map((item, id) => ({
    id,
    value: Number(item.attempt_count),
    label: `${item.resource_name} (${item.module_name})`,
  }));

  if (!chartData.length) {
    return (
      <div className="text-sm text-gray-400 text-center py-6">
        No tests with multiple attempts
      </div>
    );
  }
  return (
    <PieChart
      series={[
        {
          data: chartData,
          highlightScope: { faded: 'global', highlighted: 'item' },
        },
      ]}
      colors={colorPalette}
      sx={{
        [`& .${pieArcClasses.faded}`]: {
          fill: '#E5E7EB',
        },
      }}
      height={300}
    />
  );
}
