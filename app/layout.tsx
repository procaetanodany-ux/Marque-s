import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Ticker from "@/components/Ticker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

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
  title: {
    default: `${site.name}® — Streetwear brut. Éditions limitées.`,
    template: `%s — ${site.name}®`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${anton.variable} ${epilogue.variable}`}>
      <body>
        <CartProvider>
          <SmoothScroll>
            <Cursor />
            <Ticker />
            <Navbar />
            {children}
            <Footer />
            <CartDrawer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
