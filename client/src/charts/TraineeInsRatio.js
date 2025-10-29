import React from 'react'
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";
function TraineeInsRatio({ trainee, instructor }) {
  const data = [
    { id: 0, value: trainee, label: "Trainees" },
    { id: 1, value: instructor, label: "Instructors" },
  ];

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <PieChart
        series={[
          {
            data,
            outerRadius: 100,
            paddingAngle: 2,
          },
        ]}
        colors={["#8DC63F", "#e0e0e0"]}
        width={300}
        height={300}
      />
    </Box>
  );
}

export default TraineeInsRatio