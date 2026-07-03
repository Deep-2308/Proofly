"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface ScoreRadarChartProps {
  scoreBreakdown: {
    completeness: number;
    quality: number;
    accuracy: number;
    depth: number;
  };
}

export function ScoreRadarChart({ scoreBreakdown }: ScoreRadarChartProps) {
  const data = [
    {
      subject: "Completeness",
      score: scoreBreakdown.completeness,
      max: 25,
      pct: Math.round((scoreBreakdown.completeness / 25) * 100),
    },
    {
      subject: "Quality",
      score: scoreBreakdown.quality,
      max: 30,
      pct: Math.round((scoreBreakdown.quality / 30) * 100),
    },
    {
      subject: "Accuracy",
      score: scoreBreakdown.accuracy,
      max: 25,
      pct: Math.round((scoreBreakdown.accuracy / 25) * 100),
    },
    {
      subject: "Depth",
      score: scoreBreakdown.depth,
      max: 20,
      pct: Math.round((scoreBreakdown.depth / 20) * 100),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={80} data={data}>
            <PolarGrid stroke="#1E2533" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#64748B"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-surface p-2 shadow-xl">
                      <p className="text-xs font-semibold text-text">
                        {data.subject}: <span className="text-primary">{data.score}/{data.max}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Score"
              dataKey="pct"
              fill="#22D3EE"
              fillOpacity={0.2}
              stroke="#22D3EE"
              strokeWidth={2}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.subject} className="rounded-lg bg-surface-2 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {item.subject}
            </p>
            <p className="mt-1 font-heading text-lg font-bold text-text">
              {item.score}
              <span className="text-sm font-medium text-text-muted">/{item.max}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
