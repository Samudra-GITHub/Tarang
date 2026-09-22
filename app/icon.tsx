import { ImageResponse } from "next/og";
import { THEME_COLORS } from "@/lib/theme-colors";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `3.5px solid ${THEME_COLORS.primary}`,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
