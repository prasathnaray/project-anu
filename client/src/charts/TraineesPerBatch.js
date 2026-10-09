import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default function TraineesPerBatch({ PropsTraineesPerBatch }) {
  // Handle empty or undefined data
  if (!PropsTraineesPerBatch || PropsTraineesPerBatch.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" fontSize={12}>
        No data available
      </Typography>
    );
  }

  const data = PropsTraineesPerBatch.map((batch, index) => {
    const count = Number(batch.total_users) || 0;
    const name = batch.batch_name || `Batch ${index + 1}`;
    return {
      id: index,
      value: count,
      label: `${name}: ${count}`,
    };
  });

  const totalUsers = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box
      position="relative"
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      width={300}
      height={300}
    >
      <PieChart
        series={[
          {
            data,
            innerRadius: 80,
            outerRadius: 120,
            paddingAngle: 2,
            valueFormatter: (item) =>
              `${item?.value ?? 0} ${Number(item?.value) === 1 ? "trainee" : "trainees"}`,
          },
        ]}
        width={400}
        height={400}
      />

      {/* Center text inside donut */}
      <Box
        position="absolute"
        top={0}
        left={-80}
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography variant="h6" fontWeight="bold">
          {totalUsers}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Total Trainees
        </Typography>
      </Box>
    </Box>
  );
}
