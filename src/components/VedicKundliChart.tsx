import React from 'react';
import { HOUSES_DATA } from '../data/housesData';

interface VedicKundliChartProps {
  activeHouseId: number | null;
  onSelectHouse?: (houseId: number) => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  glowEffect?: boolean;
}

// Exact North Indian Kundli geometry (400 x 400 viewbox)
export const HOUSE_POLYGONS: Record<number, { points: string; center: [number, number]; labelPos: [number, number] }> = {
  1: {
    points: '200,0 300,100 200,200 100,100',
    center: [200, 100],
    labelPos: [200, 105],
  },
  2: {
    points: '0,0 200,0 100,100',
    center: [100, 35],
    labelPos: [100, 45],
  },
  3: {
    points: '0,0 100,100 0,200',
    center: [35, 100],
    labelPos: [35, 105],
  },
  4: {
    points: '0,200 100,100 200,200 100,300',
    center: [100, 200],
    labelPos: [100, 205],
  },
  5: {
    points: '0,200 100,300 0,400',
    center: [35, 300],
    labelPos: [35, 305],
  },
  6: {
    points: '0,400 100,300 200,400',
    center: [100, 365],
    labelPos: [100, 370],
  },
  7: {
    points: '200,200 300,300 200,400 100,300',
    center: [200, 300],
    labelPos: [200, 305],
  },
  8: {
    points: '200,400 300,300 400,400',
    center: [300, 365],
    labelPos: [300, 370],
  },
  9: {
    points: '400,200 300,300 400,400',
    center: [365, 300],
    labelPos: [365, 305],
  },
  10: {
    points: '200,200 300,100 400,200 300,300',
    center: [300, 200],
    labelPos: [300, 205],
  },
  11: {
    points: '400,0 300,100 400,200',
    center: [365, 100],
    labelPos: [365, 105],
  },
  12: {
    points: '200,0 400,0 300,100',
    center: [300, 35],
    labelPos: [300, 45],
  },
};

export const VedicKundliChart: React.FC<VedicKundliChartProps> = ({
  activeHouseId,
  onSelectHouse,
  showLabels = true,
  size = 'responsive',
  glowEffect = true,
}) => {
  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80',
    lg: 'w-96 h-96',
    responsive: 'w-full max-w-[420px] aspect-square',
  }[size];

  return (
    <div className={`relative ${sizeClasses} mx-auto select-none transition-all duration-500`}>
      {/* Outer Cosmic Aura if active */}
      {glowEffect && activeHouseId && (
        <div
          className="absolute -inset-2 rounded-2xl blur-xl opacity-60 transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${
              HOUSES_DATA.find((h) => h.id === activeHouseId)?.visualTheme.color || '#f59e0b'
            }44 0%, transparent 70%)`,
          }}
        />
      )}

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full filter drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Gold Gradient for outer border */}
          <linearGradient id="kundliBorderGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#b45309" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
          </linearGradient>

          {/* Active Highlight Glow Filter */}
          <filter id="celestialGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* House Active Radial Gradients */}
          {HOUSES_DATA.map((h) => (
            <radialGradient
              key={`grad-${h.id}`}
              id={`houseGrad-${h.id}`}
              cx="50%"
              cy="50%"
              r="60%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor={h.visualTheme.color} stopOpacity="0.48" />
              <stop offset="70%" stopColor={h.visualTheme.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0.95" />
            </radialGradient>
          ))}

          {/* Idle House Gradient */}
          <linearGradient id="idleHouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18181b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#09090b" stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {/* Outer Background Square */}
        <rect
          x="0"
          y="0"
          width="400"
          height="400"
          rx="12"
          fill="#0a0a0f"
          stroke="url(#kundliBorderGold)"
          strokeWidth="3.5"
          className="transition-all duration-300"
        />

        {/* Inner Subtle Sacred Watermark Lines */}
        <circle cx="200" cy="200" r="140" fill="none" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
        <circle cx="200" cy="200" r="195" fill="none" stroke="#3f3f46" strokeWidth="0.5" />

        {/* 12 House Polygons */}
        {Object.entries(HOUSE_POLYGONS).map(([hIdStr, poly]) => {
          const houseId = Number(hIdStr);
          const house = HOUSES_DATA.find((h) => h.id === houseId)!;
          const isActive = activeHouseId === houseId;

          return (
            <g
              key={`house-group-${houseId}`}
              className="cursor-pointer group transition-all duration-300"
              onClick={() => onSelectHouse?.(houseId)}
            >
              {/* House Polygon Fill */}
              <polygon
                points={poly.points}
                fill={isActive ? `url(#houseGrad-${houseId})` : 'url(#idleHouseGrad)'}
                stroke={isActive ? house.visualTheme.color : '#3f3f46'}
                strokeWidth={isActive ? '3' : '1.2'}
                filter={isActive ? 'url(#celestialGlow)' : undefined}
                className="transition-all duration-300 hover:fill-amber-500/15"
              />

              {/* Active Pulse Border Effect */}
              {isActive && (
                <polygon
                  points={poly.points}
                  fill="none"
                  stroke={house.visualTheme.color}
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              )}

              {/* House Number Badge */}
              <circle
                cx={poly.labelPos[0]}
                cy={poly.labelPos[1] - 8}
                r={isActive ? 13 : 11}
                fill={isActive ? house.visualTheme.color : '#18181b'}
                stroke={isActive ? '#ffffff' : '#52525b'}
                strokeWidth={isActive ? '1.8' : '1'}
                className="transition-all duration-300 drop-shadow-md"
              />

              <text
                x={poly.labelPos[0]}
                y={poly.labelPos[1] - 4}
                textAnchor="middle"
                fontSize={isActive ? '13' : '11'}
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                fill={isActive ? '#09090b' : '#f4f4f5'}
                className="pointer-events-none select-none"
              >
                {houseId}
              </text>

              {/* Text label / Keywords if enabled */}
              {showLabels && (
                <g className="pointer-events-none select-none">
                  {/* Primary 1-line tag */}
                  <text
                    x={poly.labelPos[0]}
                    y={poly.labelPos[1] + 12}
                    textAnchor="middle"
                    fontSize={isActive ? '9.5' : '8'}
                    fontWeight={isActive ? '700' : '500'}
                    fill={isActive ? '#fef08a' : '#a1a1aa'}
                    fontFamily="system-ui, sans-serif"
                    className="transition-colors duration-300"
                  >
                    {house.hindiOneLine.split(',')[0]}
                  </text>

                  {/* Sanskrit name / Karaka */}
                  <text
                    x={poly.labelPos[0]}
                    y={poly.labelPos[1] + 24}
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight="500"
                    fill={isActive ? '#ffffff' : '#71717a'}
                    fontFamily="system-ui, sans-serif"
                    className="opacity-90"
                  >
                    {house.karaka.split(' ')[0]}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Center Sacred Bindu & Om / Surya Symbol */}
        <circle cx="200" cy="200" r="14" fill="#18181b" stroke="url(#kundliBorderGold)" strokeWidth="1.8" />
        <circle cx="200" cy="200" r="4" fill="#fbbf24" className="animate-ping opacity-75" />
        <circle cx="200" cy="200" r="3.5" fill="#f59e0b" />

        {/* Vedic Directional Markers */}
        <text x="200" y="16" textAnchor="middle" fontSize="8" fill="#d97706" fontWeight="700">
          ईशान / EAST (Lagna)
        </text>
        <text x="200" y="394" textAnchor="middle" fontSize="8" fill="#71717a" fontWeight="600">
          WEST (7th)
        </text>
        <text x="14" y="203" textAnchor="start" fontSize="8" fill="#71717a" fontWeight="600">
          NORTH (4th)
        </text>
        <text x="386" y="203" textAnchor="end" fontSize="8" fill="#71717a" fontWeight="600">
          SOUTH (10th)
        </text>
      </svg>
    </div>
  );
};
