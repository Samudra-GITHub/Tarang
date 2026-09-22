import { ImageResponse } from "next/og";
import { THEME_COLORS } from "@/lib/theme-colors";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: `18px solid ${THEME_COLORS.primary}`,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
