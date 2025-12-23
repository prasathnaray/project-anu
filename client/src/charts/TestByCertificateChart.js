import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';

export default function TestByCertificateChart({ testQuery = [] }){
    const colorPalette = [
    '#8DC63F', // Primary green
    '#6BA32E', // Darker green
    '#A8D96E', // Lighter green
    '#4A8B1F', // Deep green
    '#C5E89D', // Very light green
    '#2F6B0F', // Forest green
  ];
  const certificateCount = testQuery.reduce((acc, test) => {
    const certName = test.certificate_name || 'Unknown';
    acc[certName] = (acc[certName] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(certificateCount).map(([name, value], id) => ({
    id,
    value,
    label: name === 'BTC' ? 'BTC' : 
           name === 'UFC' ? 'UFC' : name
  }));

  return (
    <PieChart
      series={[{ data: chartData }]}
      colors={colorPalette}
      sx={{
        [`& .${pieArcClasses.faded}`]: {
          fill: 'gray',
        },
      }}
      height={300}
    />
  );
};
