import * as React from 'react';
import { PieChart, pieArcClasses, pieClasses } from '@mui/x-charts/PieChart';

export default function BasicPie() {
  const palette = ['#8DC63F', '#36A2EB', '#FFC107', '#FF5722']; // pink, blue, yellow

  return (
    <PieChart
      colors={palette}
      sx={{
        [`.${pieClasses.series}[data-series="outer"] .${pieArcClasses.root}`]: {
          opacity: 0.6,
        },
      }}
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'Trainees' },
            { id: 1, value: 15, label: 'Intructors' },
          ],
        },
      ]}
      width={300}
      height={300}
    />
  );
}