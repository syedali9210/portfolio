import type { Metadata } from "next";
import { pixelLine, pixelSquare, pixelTriangle, sfPro } from "@/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syed Ali — Portfolio",
  description:
    "Product designer and design engineer bringing ideas to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sfPro.variable} ${pixelLine.variable} ${pixelSquare.variable} ${pixelTriangle.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black font-body text-white">
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
