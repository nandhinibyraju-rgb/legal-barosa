import React from 'react';

export default function Gauge({
  value = 0,
  color = '#168CFF',
  showLabels = false,
  min = '0',
  max = '100',
}) {
  const TOTAL_TICKS = 40;
  const activeCount = Math.round((Math.min(Math.max(value, 0), 100) / 100) * TOTAL_TICKS);

  const ticks = Array.from({ length: TOTAL_TICKS }, (_, i) => {
    // 180° arc: starts at angle π (180°), sweeps to 2π (360°)
    const angle = Math.PI + (i / (TOTAL_TICKS - 1)) * Math.PI;
    const rInner = 70;
    const rOuter = 80;

    const x1 = 100 + rInner * Math.cos(angle);
    const y1 = 100 + rInner * Math.sin(angle);
    const x2 = 100 + rOuter * Math.cos(angle);
    const y2 = 100 + rOuter * Math.sin(angle);

    const isActive = i < activeCount;

    return {
      id: i,
      x1,
      y1,
      x2,
      y2,
      stroke: isActive ? color : '#d4d4d8',
    };
  });

  return (
    <div className="flex flex-col items-center w-full max-w-[260px] mx-auto select-none">
      <svg
        viewBox="0 0 200 120"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        {ticks.map((tick) => (
          <line
            key={tick.id}
            x1={tick.x1.toFixed(2)}
            y1={tick.y1.toFixed(2)}
            x2={tick.x2.toFixed(2)}
            y2={tick.y2.toFixed(2)}
            stroke={tick.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        <text
          x="100"
          y="105"
          textAnchor="middle"
          className="fill-neutral-900 font-semibold"
          style={{ fontSize: '22px', fontWeight: 600 }}
        >
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className="flex justify-between text-[11px] text-neutral-500 w-full px-2 mt-1 font-inter">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
// Final submission update
