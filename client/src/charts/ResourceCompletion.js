import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default function HalfDonut({ dataa }) {
  // ✅ Calculate completion from your API data
  const total = dataa.length;
  const completed = dataa.filter((item) => item.is_completed === true).length;

  if (total === 0) {
    return (
      <Typography variant="body2" color="textSecondary" fontSize={10}>
        No data available
      </Typography>
    );
  }

  const remaining = total - completed;

  const data = [
    { id: 0, value: completed, label: "Completed" },
    { id: 1, value: remaining, label: "Remaining" },
  ];

  const percentage = ((completed / total) * 100).toFixed(0);

  return (
    <Box
      sx={{
        width: 220,
        height: 140,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PieChart
        series={[
          {
            data,
            innerRadius: 50,
            outerRadius: 80,
            cornerRadius: 2,
          },
        ]}
        colors={["#8DC63F", "#e0e0e0"]}
        width={220}
        height={190}
      />

      {/* Center Label */}
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "15%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#8DC63F">
          {percentage}%
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Completed
        </Typography>
      </Box>
    </Box>
  );
}