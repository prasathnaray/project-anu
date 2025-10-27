import * as React from 'react';
import { PieChart, pieArcClasses, pieClasses } from '@mui/x-charts/PieChart';
import { useState } from 'react';
import GetgenderRatioAPI from '../API/GetgenderRatioAPI';

export default function CompletionStats() {
  const palette = ['#8DC63F', '#36A2EB', '#FFC107', '#FF5722'];
  const [genderAnalytics, setGenderAnalytics] = useState([]);

  const handleAnalytics = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const response = await GetgenderRatioAPI(token);
      const transformed = response.data.map((item, idx) => ({
        id: idx,
        value: Number(item.count),
        label: item.user_gender
      }));
      setGenderAnalytics(transformed);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    handleAnalytics();
  }, []);

  return (
    <PieChart
      series={[
        {
          data: genderAnalytics,
          innerRadius: 15,
          outerRadius: 25,
          cornerRadius: 3,
        },
      ]}
      colors={palette}
      width={70}
      height={70}
      sx={{
        [`.${pieClasses.series}[data-series="outer"] .${pieArcClasses.root}`]: {
          opacity: 0.8,
        },
      }}
    />
  );
}