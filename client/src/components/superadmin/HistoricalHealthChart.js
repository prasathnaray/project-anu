import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Wifi, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function HistoricalHealthChart({
  healthHistory,
  range = 'today',
  onRangeChange,
  onRefresh,
  loading = false
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const history = healthHistory?.history || [];
  const serviceInterruptions = healthHistory?.serviceInterruptions || [];
  const uptimePct = healthHistory?.serverUptimePercentage || 99.95;
  const currentApi = healthHistory?.currentApiLatency || 15;
  const currentDb = healthHistory?.currentDbLatency || 12;

  // Calculate averages
  const avgApi = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.apiLatency || 0), 0) / history.length) 
    : currentApi;
  const avgDb = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.dbLatency || 0), 0) / history.length) 
    : currentDb;

  // Check if any abnormal points exist
  const abnormalPoints = history.filter(h => h.abnormal || h.apiLatency > 100);

  // SVG Chart dimensions
  const width = 640;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const maxVal = Math.max(140, ...history.map(h => Math.max(h.apiLatency || 0, h.dbLatency || 0))) + 20;

  const getX = (index) => {
    if (history.length <= 1) return paddingX + chartW / 2;
    return paddingX + (index / (history.length - 1)) * chartW;
  };

  const getY = (val) => {
    const clamped = Math.max(0, Math.min(val, maxVal));
    return height - paddingY - (clamped / maxVal) * chartH;
  };

  // Generate SVG paths
  const apiPoints = history.map((h, i) => `${getX(i)},${getY(h.apiLatency || 0)}`).join(' ');
  const dbPoints = history.map((h, i) => `${getX(i)},${getY(h.dbLatency || 0)}`).join(' ');

  const apiArea = history.length > 1 
    ? `${getX(0)},${height - paddingY} ${apiPoints} ${getX(history.length - 1)},${height - paddingY}`
    : '';

  const thresholdY = getY(100); // 100ms SLA warning line

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      {/* Header bar: Tabs & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#8DC63F]" />
          <span className="text-xs font-bold text-slate-800">Historical Performance Trends</span>
          <span className="text-[11px] text-slate-400 font-mono">
            (Uptime SLA: <strong className="text-emerald-600 font-bold">{uptimePct}%</strong>)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] mr-2">
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8DC63F]" /> API Gateway
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> PostgreSQL DB
            </span>
          </div>

          {/* Range Pills: Today, 7 Days, 30 Days */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
            {['today', '7days', '30days'].map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  range === r ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7days' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              title="Refresh Performance Trends"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin text-[#8DC63F]' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Abnormal Warning Banner if High Latency Detected */}
      {abnormalPoints.length > 0 && (
        <div className="mb-3 px-3 py-2 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>
              <strong>Abnormal Latency Alert:</strong> {abnormalPoints.length} performance spike(s) exceeding 100ms threshold detected in this period.
            </span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
            Elevated
          </span>
        </div>
      )}

      {/* Interactive SVG Chart */}
      <div className="relative w-full bg-slate-50/60 rounded-xl border border-slate-100 p-2 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="apiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8DC63F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8DC63F" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="dbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 50, 100, maxVal].map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={val === 100 ? '#f43f5e' : '#e2e8f0'}
                  strokeDasharray={val === 100 ? '4 4' : 'none'}
                  strokeWidth={val === 100 ? 1.5 : 1}
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill={val === 100 ? '#f43f5e' : '#94a3b8'}
                  fontFamily="monospace"
                  fontWeight={val === 100 ? 'bold' : 'normal'}
                >
                  {Math.round(val)}ms
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          {apiArea && <polygon points={apiArea} fill="url(#apiGradient)" />}

          {/* Lines */}
          {apiPoints && (
            <polyline
              points={apiPoints}
              fill="none"
              stroke="#8DC63F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {dbPoints && (
            <polyline
              points={dbPoints}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeDasharray="2 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {history.map((h, i) => {
            const cx = getX(i);
            const cyApi = getY(h.apiLatency || 0);
            const isAbnormal = h.abnormal || h.apiLatency > 100;
            const isHovered = hoveredPoint?.index === i;

            return (
              <g key={i}>
                {/* X Axis Labels */}
                {(i === 0 || i === history.length - 1 || i % Math.ceil(history.length / 5) === 0) && (
                  <text
                    x={cx}
                    y={height - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748b"
                    fontFamily="monospace"
                  >
                    {h.label}
                  </text>
                )}

                {/* API Gateway Dot */}
                <circle
                  cx={cx}
                  cy={cyApi}
                  r={isHovered ? 5 : isAbnormal ? 4.5 : 3}
                  fill={isAbnormal ? '#ef4444' : '#8DC63F'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint({ ...h, index: i, cx, cy: cyApi })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/90 text-white p-2 rounded-lg text-[10px] shadow-lg backdrop-blur-xs transform -translate-x-1/2 -translate-y-full font-sans min-w-[130px]"
            style={{
              left: `${(hoveredPoint.cx / width) * 100}%`,
              top: `${(hoveredPoint.cy / height) * 100}%`,
              marginTop: '-8px'
            }}
          >
            <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-slate-300">
              {hoveredPoint.label}
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#8DC63F]">API Gateway:</span>
              <span className="font-mono font-bold">{hoveredPoint.apiLatency} ms</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-purple-400">PostgreSQL DB:</span>
              <span className="font-mono font-bold">{hoveredPoint.dbLatency} ms</span>
            </div>
            {hoveredPoint.abnormal && (
              <div className="mt-1 text-rose-300 font-semibold flex items-center gap-1 border-t border-slate-700/80 pt-1">
                <AlertTriangle size={10} /> Elevated Response Time
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-semibold">Avg API Response</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-0.5">{avgApi} ms</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-semibold">Avg DB Query Time</span>
          <span className="text-sm font-black text-slate-800 font-mono mt-0.5">{avgDb} ms</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-semibold">Uptime SLA Achieved</span>
          <span className="text-sm font-black text-emerald-600 font-mono mt-0.5">{uptimePct}%</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-semibold">Service Outages</span>
          <span className="text-sm font-black text-slate-700 font-mono mt-0.5">
            {serviceInterruptions.length === 0 ? '0 (Optimal)' : `${serviceInterruptions.length} incident(s)`}
          </span>
        </div>
      </div>
    </div>
  );
}
