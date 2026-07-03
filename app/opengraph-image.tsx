import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SkillSync - Prove Your Skills. Find Your Builders.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0A0C14",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#22D3EE",
            fontSize: 16,
            letterSpacing: "0.15em",
            marginBottom: 24,
          }}
        >
          SKILLSYNC
        </div>
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Prove Your Skills. Find Your Builders.
        </div>
        <div style={{ color: "#64748B", fontSize: 24, maxWidth: 600 }}>
          AI-generated challenges. Verified badges. Real co-builders.
        </div>
        <div
          style={{
            position: "absolute",
            right: 80,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#10131E",
            border: "1px solid rgba(34,211,238,0.3)",
            borderRadius: 12,
            padding: "32px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{ color: "#22D3EE", fontSize: 12, letterSpacing: "0.1em" }}
          >
            VERIFIED BADGE
          </div>
          <div style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
            React
          </div>
          <div style={{ color: "#94A3B8", fontSize: 14 }}>Intermediate</div>
          <div
            style={{
              color: "#4ADE80",
              fontSize: 36,
              fontWeight: 800,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            91
            <span style={{ fontSize: 18, color: "#64748B", marginLeft: 4 }}>
              /100
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
