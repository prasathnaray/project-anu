import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function TargetedLearningChart({ targetedLearning }) {
  if (!targetedLearning) return null;

  // Extract data safely
  const targetedLearningCount = targetedLearning?.TLStats?.length || 0;
  const batchCount = Number(targetedLearning?.getBatchDas?.rows?.[0]?.count || 0);

  // Chart data
  const data = [
    { id: 0, value: targetedLearningCount, label: 'Targeted Learnings' },
    { id: 1, value: batchCount, label: 'Batches' },
  ];

  // Aesthetic color palette
  const colors = ['#8DC63F', '#36A2EB'];

  return (
    <div
      style={{
        width: '100%',
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <PieChart
        series={[
          {
            data,
            innerRadius: 70, // 👈 makes it a donut
            outerRadius: 120,
            paddingAngle: 3,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 270,
          },
        ]}
        colors={colors}
        width={300}
        height={300}
      />
    </div>
  );
}