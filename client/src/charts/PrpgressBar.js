import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default function StatsDonutChart({ completed, total }) {
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
    { id: 0, value: completedValue, label: "Completed" },
    { id: 1, value: remainingValue, label: "Not completed" },
  ];

  const percentage = total > 0 ? ((completed / total) * 100).toFixed(0) : 0;

  return (
    <Box
      position="relative"
      display="inline-flex"
      width={50}
      height={50}
      justifyContent="center"
      alignItems="center"
    >
      <PieChart
        series={[
          {
            data,
            innerRadius: 20,
            outerRadius: 30,
            paddingAngle: 1,
          },
        ]}
        colors={["#8DC63F", "#e0e0e0"]}
        width={60}
        height={60}
      />
      <Box
        position="absolute"
        display="flex"
        justifyContent="center"
        alignItems="center"
        top={0}
        left={-60}
        width="100%"
        height="100%"
      >
        <Typography variant="caption" fontWeight="bold">
          {completedValue}
        </Typography>
      </Box>
    </Box>
  );
}