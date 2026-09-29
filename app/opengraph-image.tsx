import { ImageResponse } from "next/og";

export const alt = "A2Z Academy — Empowering Institutes with Tech-Based Training";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded social share card, generated at request time so it stays in sync with
 * the brand palette. Mirrors the reference site's custom social preview images.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #ffffff 0%, #f7f7f7 55%, #eaf6e1 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#71bf43",
              color: "#1a1a1a",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            A2Z
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1a335a" }}>A2Z Academy</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 68,
              fontWeight: 800,
              color: "#1a335a",
              lineHeight: 1.1,
            }}
          >
            <div style={{ display: "flex" }}>Tech-Based</div>
            <div style={{ display: "flex", color: "#71bf43" }}>Hackathon</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#666", maxWidth: 900 }}>
            Empowering institutes with tech-based training — build real solutions and get certified.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["Cyber Security", "Cloud Security", "IoT Security", "Full Stack"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                color: "#1a335a",
                background: "#ffffff",
                border: "1px solid rgba(26,51,90,0.12)",
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
