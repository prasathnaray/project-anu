// src/charts/InteractionDonut.jsx

import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const MUI_COLORS = [
  '#3266ad', '#e24b4a', '#ef9f27', '#1d9e75',
  '#d4537e', '#7f77dd', '#63991a', '#d85a30',
  '#888780', '#185fa5'
];

// SVG center label — works in all MUI X versions
function CenterLabel({ value, label }) {
  return (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ pointerEvents: 'none' }}
    >
      <tspan
        x="50%"
        dy="-0.5em"
        style={{ fontSize: 22, fontWeight: 600, fill: '#374151' }}
      >
        {value}
      </tspan>
      <tspan
        x="50%"
        dy="1.4em"
        style={{ fontSize: 11, fill: '#9ca3af' }}
      >
        {label}
      </tspan>
    </text>
  );
}

function InteractionDonut({ data = [], loading = false, error = null }) {
  const [highlightedItem, setHighlightedItem] = useState(null);

  const totalAttempts = data.reduce((sum, r) => sum + Number(r.attempt_count), 0);
  const hoveredItem = highlightedItem !== null
    ? data[highlightedItem?.dataIndex]
    : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-6 h-6 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 p-3 bg-red-100 text-red-700 rounded text-sm">
        Error: {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="mt-3 text-gray-400 text-sm">
        No interaction data available.
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-4 flex-wrap">

      {/* Donut Chart */}
      <PieChart
        colors={MUI_COLORS}
        series={[{
          data: data.map((item, idx) => ({
            id: idx,
            value: Number(item.attempt_count),
            label: item.resource_name,
          })),
          innerRadius: 55,
          outerRadius: 90,
          paddingAngle: 2,
          cornerRadius: 4,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 55, additionalRadius: -5, color: '#d1d5db' },
          highlighted: { additionalRadius: 6 },
        }]}
        highlightedItem={highlightedItem}
        onHighlightChange={setHighlightedItem}
        width={220}
        height={200}
        slots={{ legend: () => null }}
        slotProps={{ legend: { hidden: true } }}
        tooltip={{ trigger: 'item' }}
      >
        {hoveredItem && (
            <CenterLabel
            value={`${hoveredItem.attempt_count}x`}
            label="attempts"
            />
        )}
      </PieChart>

      {/* Custom Legend — also controls highlight */}
      <div className="flex flex-col gap-2 text-sm flex-1 min-w-0">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 cursor-pointer transition-opacity duration-150"
            style={{
              opacity:
                highlightedItem === null || highlightedItem?.dataIndex === idx
                  ? 1
                  : 0.35,
            }}
            onMouseEnter={() => setHighlightedItem({ seriesIndex: 0, dataIndex: idx })}
            onMouseLeave={() => setHighlightedItem(null)}
          >
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: MUI_COLORS[idx % MUI_COLORS.length] }}
            />
            <span className="text-gray-600 truncate flex-1" title={item.resource_name}>
              {item.resource_name}
            </span>
            <span className="font-semibold text-gray-800 flex-shrink-0">
              {item.attempt_count}x
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default InteractionDonut;