import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function BatchProgressBarChart({ batchData }) {
  if (!batchData || batchData.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center p-10">
        No batch progress data available
      </div>
    );
  }

  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: batchData.map((b) => b.batch_name),
          label: "Batches",
        },
      ]}
      series={[
        {
          data: batchData.map((b) => Number(b.progress_percentage)),
          label: "Completion %",
          color: "#8DC63F",
        },
      ]}
      height={300}
      margin={{ top: 20, bottom: 50, left: 40, right: 10 }}
    />
  );
}
