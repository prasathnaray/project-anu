import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default function StatsPieChart({ completed, total }) {
  if (!total || total === 0) {
    return (
      <Typography variant="body2" color="textSecondary" fontSize={10}>
        No data
      </Typography>
    );
  }

  const completedValue = completed;
  const remainingValue = total - completed;

  const data = [
    { id: 0, value: completedValue, label: "Completed Resources" },
    { id: 1, value: remainingValue, label: "Total Resources" },
  ];

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <PieChart
        series={[
          {
            data,
            // 👇 remove innerRadius for pie
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