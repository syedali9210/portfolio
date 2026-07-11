import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Syed Ali — Design Engineer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const svg = readFileSync(join(process.cwd(), "public/images/dynamic-info-mark-simple.svg"), "utf8");
  const markDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

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
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(140,50,0,0.55) 0%, rgba(60,20,0,0.25) 40%, #030303 75%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 160,
            height: 160,
            borderRadius: 32,
            background: "#050505",
            border: "1px solid rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri} width={90} height={55} alt="" />
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 600, color: "#ffffff", letterSpacing: -1 }}>
          Syed Ali
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
          Design Engineer — Portfolio
        </div>
      </div>
    ),
    { ...size }
  );
}
