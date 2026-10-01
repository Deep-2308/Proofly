"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface BadgeCardProps {
  skillName: string;
  domain: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  score: number;
  badgeSummary: string;
  issuedAt: Date | string;
  size?: "sm" | "md" | "lg";
}

const difficultyStyles = {
  beginner: {
    gradient: "from-[rgba(148,163,184,0.4)] to-[rgba(148,163,184,0.1)]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(148,163,184,0.2)]",
    pillBg: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  },
  intermediate: {
    gradient: "from-[rgba(34,211,238,0.6)] to-[rgba(34,211,238,0.2)]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    pillBg: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  },
  advanced: {
    gradient: "from-[rgba(245,158,11,0.7)] to-[rgba(245,158,11,0.3)]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    pillBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
};

const getScoreColor = (score: number) => {
  if (score >= 85) return "#4ADE80";
  if (score >= 70) return "#22D3EE";
  return "#F59E0B";
};

export function BadgeCard({
  skillName,
  domain,
  difficulty,
  score,
  badgeSummary,
  issuedAt,
  size = "md",
}: BadgeCardProps) {
  const [mounted, setMounted] = useState(false);
  const date = typeof issuedAt === "string" ? new Date(issuedAt) : issuedAt;

  useEffect(() => {
    // Small delay to trigger the CSS transition for the SVG ring
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const styles = difficultyStyles[difficulty] || difficultyStyles.beginner;
  const scoreColor = getScoreColor(score);
  
  // SVG Ring Calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius; // ~175.92
  const offset = mounted ? circumference - (score / 100) * circumference : circumference;

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-[1px] bg-gradient-to-br transition-all duration-300 hover:-translate-y-1",
        styles.gradient,
        styles.hoverGlow
      )}
    >
      <div className="flex h-full w-full flex-col justify-between rounded-[calc(1rem-1px)] bg-[#10131E] p-5">
        
        {/* TOP SECTION */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", styles.pillBg)}>
            {difficulty}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-success">
              Verified
            </span>
          </div>
        </div>

        {/* MIDDLE & SCORE SECTION */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-heading text-[20px] font-bold leading-tight tracking-tight text-white">
              {skillName}
            </h3>
            <p className="mt-1 text-xs text-text-muted">{domain}</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-baseline gap-0.5">
              <span className="font-heading text-[32px] font-bold leading-none" style={{ color: scoreColor }}>
                {score}
              </span>
              <span className="text-xs font-medium text-text-muted">/100</span>
            </div>
            
            {/* SVG Ring */}
            <div className="relative flex size-[64px] items-center justify-center">
              <svg className="-rotate-90 transform" width="64" height="64">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="transparent"
                  stroke="#1E2533"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="transparent"
                  stroke={scoreColor}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* BADGE SUMMARY */}
        <p className="mb-4 line-clamp-3 text-[13px] italic leading-relaxed text-text-muted">
          "{badgeSummary}"
        </p>

        {/* BOTTOM */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-text-muted/60">
            Issued {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date)}
          </p>
        </div>
      </div>
    </div>
  );
}
