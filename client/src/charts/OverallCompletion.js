import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TOTAL = 300;
const RADIUS = 72;
const C = 2 * Math.PI * RADIUS;

const segments = [
  { key: 'easy',   solved: 12, label: 'Easy',   color: '#8DC63F' },
//   { key: 'medium', solved: 250, label: 'Medium', color: '#f59e0b' },
//   { key: 'hard',   solved: 8,  label: 'Hard',   color: '#f43f5e' },
];

const totalSolved = segments.reduce((s, x) => s + x.solved, 0);
const totalPct = ((totalSolved / TOTAL) * 100).toFixed(1);

// Pre-compute each arc
let off = 0;
const arcs = segments.map(seg => {
  const dash = (seg.solved / TOTAL) * C;
  const arc = { ...seg, dash, offset: -off };
  off += dash;
  return arc;
});

export default function OverallCompletion() {
  const [hovered, setHovered] = useState(null);
  const active = arcs.find(a => a.key === hovered);

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: 200, p: 3, borderRadius: 3,
      //border: '1px solid', borderColor: 'divider',
      bgcolor: 'background.paper',
    }}>
      <Box sx={{ position: 'relative', width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180"
          style={{ position: 'absolute', top: 0, left: 0 }}>

          {/* Track */}
          <circle cx="90" cy="90" r={RADIUS} fill="none"
            stroke="#e5e7eb" strokeWidth="12"
            strokeDasharray={C} strokeLinecap="round" />

          {/* Colored arcs */}
          {arcs.map(arc => (
            <circle key={arc.key}
              cx="90" cy="90" r={RADIUS} fill="none"
              stroke={arc.color} strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${arc.dash} ${C}`}
              strokeDashoffset={arc.offset}
              transform="rotate(-90 90 90)"
              style={{
                cursor: 'pointer',
                opacity: hovered && hovered !== arc.key ? 0.2 : 1,
                transition: 'opacity 0.18s',
              }}
              onMouseEnter={() => setHovered(arc.key)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <Typography variant="h5" fontWeight={500}
            color={active ? active.color : 'text.primary'}
            sx={{ transition: 'color 0.18s' }}>
            {active
              ? `${((active.solved / TOTAL) * 100).toFixed(1)}%`
              : `${totalPct}%`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {active
              ? `${active.label} · ${active.solved}`
              : `${totalSolved} / ${TOTAL}`}
          </Typography>
        </Box>
      </Box>

      {/* <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
        ✓ Solved
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#5DCAA5' }} />
        <Typography variant="caption" color="text.secondary">3 Attempting</Typography>
      </Box> */}
    </Box>
  );
}