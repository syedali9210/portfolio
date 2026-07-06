import localFont from "next/font/local";

// "Geist Pixel" ships as distinct decorative variants (not weights) per Figma.
// "Line" is the default used across headings/body copy; "Square" and
// "Triangle" are used for a handful of specific accents (see design usage).
export const pixelLine = localFont({
  src: "./geist-pixel/GeistPixel-Line.otf",
  variable: "--font-pixel-line",
  display: "swap",
});

export const pixelSquare = localFont({
  src: "./geist-pixel/GeistPixel-Square.otf",
  variable: "--font-pixel-square",
  display: "swap",
});

export const pixelTriangle = localFont({
  src: "./geist-pixel/GeistPixel-Triangle.otf",
  variable: "--font-pixel-triangle",
  display: "swap",
});

export const sfPro = localFont({
  src: [
    { path: "./sf-pro/SF-Pro-Text-Light.otf", weight: "300", style: "normal" },
    { path: "./sf-pro/SF-Pro-Text-Regular.otf", weight: "400", style: "normal" },
    { path: "./sf-pro/SF-Pro-Text-Medium.otf", weight: "500", style: "normal" },
    { path: "./sf-pro/SF-Pro-Text-Semibold.otf", weight: "600", style: "normal" },
    { path: "./sf-pro/SF-Pro-Text-Bold.otf", weight: "700", style: "normal" },
    { path: "./sf-pro/SF-Pro-Text-Heavy.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});
