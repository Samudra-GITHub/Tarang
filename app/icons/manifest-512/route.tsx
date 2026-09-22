import { ImageResponse } from "next/og";
import { THEME_COLORS } from "@/lib/theme-colors";

export const dynamic = "force-static";

export function GET() {
  const s = 512;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: THEME_COLORS.background,
        }}
      >
        <div
          style={{
            width: s * 0.55,
            height: s * 0.55,
            borderRadius: "50%",
            border: `${Math.round(s * 0.1)}px solid ${THEME_COLORS.primary}`,
          }}
        />
      </div>
    ),
    { width: s, height: s },
  );
}
