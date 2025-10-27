import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default function HalfDonut({ dataa }) {
  // ✅ Ensure dataa is always an array
  const safeData = Array.isArray(dataa) ? dataa : [];

  const total = safeData.length;
  const completed = safeData.filter((item) => item?.is_completed === true).length;

  if (total === 0) {
    return (
      <Typography variant="body2" color="textSecondary" fontSize={10}>
        No data available
      </Typography>
    );
  }

  const remaining = total - completed;

  const chartData = [
    { id: 0, value: completed, label: "Completed" },
    { id: 1, value: remaining, label: "Remaining" },
  ];

  const percentage = ((completed / total) * 100).toFixed(0);

  return (
    <Box
      sx={{
        width: 280,
        height: 180,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 65,
            outerRadius: 105,
            cornerRadius: 3,
          },
        ]}
        colors={["#8DC63F", "#e0e0e0"]}
        width={280}
        height={240}
      />

      {/* Center Label */}
      <Box
        sx={{
          position: "absolute",
          top: "47%",
          left: "35%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#8DC63F">
          {percentage}%
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Completed
        </Typography>
      </Box>
    </Box>
  );
}