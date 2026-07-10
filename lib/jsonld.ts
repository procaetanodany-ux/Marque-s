/* ============================================================
   DONNÉES STRUCTURÉES (JSON-LD) — SEO.
   Google lit ces blocs pour afficher prix, stock et photo du
   produit directement dans les résultats de recherche.
   ============================================================ */

import { site } from "@/content/site";
import type { Product } from "./commerce/types";

/* Sérialise pour un <script type="application/ld+json"> en échappant
   « < » (sécurité : empêche de fermer la balise script). */
export const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/og.jpg`,
  email: site.contactEmail,
  sameAs: Object.values(site.socials),
});

export const webSiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: `${site.url}/`,
  inLanguage: "fr",
});

export const productLd = (p: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  description: p.description,
  image: p.images.map((i) => (i.startsWith("http") ? i : `${site.url}${i}`)),
  brand: { "@type": "Brand", name: site.name },
  url: `${site.url}/produit/${p.slug}/`,
  offers: {
    "@type": "Offer",
    price: p.price.amount.toFixed(2),
    priceCurrency: p.price.currencyCode,
    availability:
      p.status === "available"
        ? "https://schema.org/InStock"
        : p.status === "soon"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/SoldOut",
    url: `${site.url}/produit/${p.slug}/`,
  },
});

export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
});
