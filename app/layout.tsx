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
import { AuthProvider } from "@/components/account/AuthContext";
import ComingSoonGate from "@/components/ComingSoonGate";
import Analytics from "@/components/Analytics";
import { jsonLd, organizationLd, webSiteLd } from "@/lib/jsonld";

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
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}® — Streetwear brut. Éditions limitées.`,
    template: `%s — ${site.name}®`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name}® — Streetwear brut. Éditions limitées.`,
    description: site.description,
    url: `${site.url}/`,
    images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}® — Streetwear brut. Éditions limitées.`,
    description: site.description,
    images: [`${site.url}/og.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${anton.variable} ${epilogue.variable}`}>
      <body>
        {/* SEO : identité de la marque pour Google (données structurées). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(webSiteLd()) }}
        />
        <Analytics />
        <ComingSoonGate>
          <AuthProvider>
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
          </AuthProvider>
        </ComingSoonGate>
      </body>
    </html>
  );
}
