import { ImageResponse } from "next/og";

// Route segment config
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Generates the favicon at /icon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "#6366f1",
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginTop: "-4px",
          }}
        >
          H
        </div>
      </div>
    ),
    { ...size }
  );
}
