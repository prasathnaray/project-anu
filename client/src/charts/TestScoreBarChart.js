import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function TestScoreBarChart({ testData }) {
  if (!testData) {
    return (
      <div className="text-gray-400 text-sm text-center p-10">
        Please select a test to view scores
      </div>
    );
  }

  const scores = [
    {
      label: "Plane Identification",
      value: Number(testData.plane_identification || 0),
    },
    {
      label: "Image Optimization",
      value: Number(testData.image_optimization || 0),
    },
    {
      label: "Measurement",
      value: Number(testData.measurement || 0),
    },
    {
      label: "Diagnostic Interpretation",
      value: Number(testData.diagnostic_interpretation || 0),
    },
  ];

  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: scores.map((s) => s.label),
        },
      ]}
      series={[
        {
          data: scores.map((s) => s.value),
          label: testData.resource_name,
          color: "#8DC63F",
        },
      ]}
      height={320}
      width={650}
    />
  );
}