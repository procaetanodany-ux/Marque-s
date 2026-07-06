import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

const anton = localFont({
  src: "./fonts/anton-latin.woff2",
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const epilogue = localFont({
  src: "./fonts/epilogue-var-latin.woff2",
  weight: "100 900",
  variable: "--font-epilogue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SORI® — Streetwear brut. Éditions limitées.",
  description:
    "SORI. Streetwear brut, coupé pour la rue. Drops en édition limitée — quand c'est parti, c'est parti.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${anton.variable} ${epilogue.variable}`}>
      <body>
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
