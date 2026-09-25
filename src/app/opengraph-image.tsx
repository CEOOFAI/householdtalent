import { ImageResponse } from "next/og";

export const alt = "HouseHoldTalent — Exceptional Staff. Exemplary Homes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Uses the built-in fallback font (no remote font fetch at build/runtime).
const SERIF = 'Georgia, "Times New Roman", serif';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          backgroundImage:
            "radial-gradient(ellipse at 50% 40%, rgba(155,123,60,0.16) 0%, rgba(10,10,10,0) 60%)",
          padding: 36,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(155,123,60,0.55)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
              border: "1px solid rgba(155,123,60,0.18)",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontFamily: SERIF, fontSize: 96, fontWeight: 700, letterSpacing: -1 }}>
            <span style={{ color: "#FFFFFF" }}>HouseHold</span>
            <span style={{ color: "#9B7B3C", marginLeft: -6 }}>Talent</span>
          </div>
          <div style={{ display: "flex", width: 120, height: 1, background: "#9B7B3C", marginTop: 28, marginBottom: 28 }} />
          <div style={{ display: "flex", fontFamily: SERIF, fontSize: 40, fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>
            Exceptional Staff. Exemplary Homes.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#9B7B3C",
            }}
          >
            Gibraltar · Costa del Sol · International
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
