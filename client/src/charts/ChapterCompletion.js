import React from "react";
import { Box, Paper } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function ChapterCompletion({ data = [] }) {
  const isModuleData = data.some(
    (item) => "module_init" in item || "module_id" in item
  );

  const chartData = data.map((item) => ({
    name: item.chapter_name || item.module_name,
    completed: Number(item.users_completed_all) || Number(item.users_completed_all),
    total: Number(item.total_users) || Number(item.total_users),
  }));

  return (
    <Box sx={{ pt: 2, width: "100%"}}>
      <Paper elevation={0} sx={{ p: 0, boxShadow: "none" }}>
        <BarChart
          dataset={chartData}
          xAxis={[{ scaleType: "linear", dataKey: "completed", label: "Users Completed" }]} // numeric values
          yAxis={[{ scaleType: "band", dataKey: "name", label: isModuleData ? "Modules" : "Chapters" }]} // categories
          series={[
            { dataKey: "completed", label: "Trainees Completed", color: "#8DC63F", borderWith: 2, borderColor: "#558B2F" },
            { dataKey: "total", label: "Total trainees", color: "#C8E6C9", borderWith: 2, borderColor: "#81C784" },
          ]}
          layout="horizontal"
          height={400}
          margin={{ top: 20, right: 30, bottom: 40, left: 0 }}
        />
      </Paper>
    </Box>
  );
}