import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farhan — Full-Stack Developer & 3D Engineer",
  description:
    "Portfolio of Farhan, a full-stack developer building fast, animated web experiences, WebGL interfaces and AI products. Creator of FarhanGPT — farhangpt.bond",
  keywords: [
    "Farhan",
    "developer",
    "full-stack",
    "three.js",
    "webgl",
    "next.js",
    "farhangpt",
  ],
  openGraph: {
    title: "Farhan — Full-Stack Developer & 3D Engineer",
    description:
      "Fast, animated, WebGL-powered web experiences and AI products. Creator of FarhanGPT.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
};

const themeInit = `(function(){try{var t=localStorage.getItem("farhan-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="grain min-h-screen antialiased">{children}</body>
    </html>
  );
}
