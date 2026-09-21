import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const bars = Array.from({ length: 24 }, (_, i) => 20 + ((i * 37) % 65));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "radial-gradient(circle at 50% 35%, #123430 0%, #090909 68%)",
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: "#f2f2f0",
            display: "flex",
          }}
        >
          TARA<span style={{ color: "#2dd4bf" }}>NG</span>
        </div>
        <div style={{ fontSize: 30, color: "#9a9a96", display: "flex" }}>{SITE_DESCRIPTION}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 48, marginTop: 12 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: `${h}%`,
                borderRadius: 3,
                background: "#2dd4bf",
                opacity: 0.55,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
