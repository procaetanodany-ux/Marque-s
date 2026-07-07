/* ============================================================
   CATALOGUE — la source de vérité des produits.

   Pour sortir une pièce demain :
   1. passe son `status` à "available"
   2. ajuste les tailles disponibles (available: true/false)
   3. push → le site est à jour, panier + pré-commande actifs.

   Quand Shopify sera branché, ce catalogue sera remplacé par
   l'API Storefront (voir lib/commerce/shopify.ts) — les slugs
   deviennent les handles Shopify.
   ============================================================ */

import type { Product } from "@/lib/commerce/types";

const sizes = (slug: string, available: boolean, list = ["S", "M", "L", "XL"]) =>
  list.map((size) => ({
    id: `${slug}-${size.toLowerCase()}`,
    size,
    available,
  }));

export const products: Product[] = [
  {
    id: "tee-le-spray",
    slug: "tee-le-spray",
    num: "01",
    name: "Tee « Le Spray »",
    spec: "Oversize — épaules tombantes, col rond côtelé, spray artisanal dos",
    description:
      "La pièce signature de SORI. Un jersey lourd coupé oversize, épaules tombantes, col rond côtelé — puis passé à l'aérographe à l'atelier : nuages pastel rose, lavande et bleu ciel, signature sprayée à la main dans le dos. Chaque exemplaire est unique, numéroté, et ne sera jamais retiré.",
    price: { amount: 45, currencyCode: "EUR" },
    edition: "×200 ex.",
    status: "available",
    variants: sizes("tee-le-spray", true),
    images: ["/products/le-spray-back.webp", "/products/le-spray-look.webp"],
    imageAlt:
      "Tee Le Spray porté, vue de dos : tie-dye pastel rose et lavande avec grande signature SORI sprayée",
    art: "cross",
    featured: true,
  },
  {
    id: "hoodie-beton",
    slug: "hoodie-beton",
    num: "02",
    name: "Hoodie « Béton »",
    spec: "Molleton 480 g/m² — coupe boxy",
    description:
      "Un molleton 480 g/m² qui tient debout tout seul. Coupe boxy, capuche doublée, cordons épais. Teinté gris minéral, comme le parking où on l'a shooté.",
    price: { amount: 89, currencyCode: "EUR" },
    edition: "×150 ex.",
    status: "soon",
    variants: sizes("hoodie-beton", false),
    images: [],
    art: "peak",
  },
  {
    id: "veste-chantier",
    slug: "veste-chantier",
    num: "03",
    name: "Veste « Chantier »",
    spec: "Canvas déperlant — poches utilitaires oversize",
    description:
      "Canvas déperlant, poches utilitaires surdimensionnées, boutons pression métal brut. Faite pour durer plus longtemps que les tendances.",
    price: { amount: 159, currencyCode: "EUR" },
    edition: "×80 ex.",
    status: "soon",
    variants: sizes("veste-chantier", false),
    images: [],
    art: "house",
  },
  {
    id: "cargo-periph",
    slug: "cargo-periph",
    num: "04",
    name: "Cargo « Périph »",
    spec: "Ripstop — jambe large, 8 poches",
    description:
      "Ripstop indéchirable, jambe large, huit poches dont deux zippées. Taille élastiquée à cordon. Le pantalon qui suit, quoi qu'il arrive.",
    price: { amount: 119, currencyCode: "EUR" },
    edition: "×120 ex.",
    status: "soon",
    variants: sizes("cargo-periph", false),
    images: [],
    art: "flag",
  },
  {
    id: "bob-bitume",
    slug: "bob-bitume",
    num: "05",
    name: "Bob « Bitume »",
    spec: "Nylon — logo brodé ton sur ton",
    description:
      "Nylon technique, logo SORI brodé ton sur ton, cordon de serrage discret. Le détail qui finit un fit.",
    price: { amount: 39, currencyCode: "EUR" },
    edition: "×100 ex.",
    status: "soon",
    variants: sizes("bob-bitume", false, ["TU"]),
    images: [],
    art: "grid",
  },
  {
    id: "pack-complet",
    slug: "pack-complet",
    num: "06",
    name: "Pack complet",
    spec: "Les 5 pièces + tote sérigraphié",
    description:
      "Les cinq pièces du drop, ton set complet, plus un tote sérigraphié offert. Vingt-cinq packs, pas un de plus.",
    price: { amount: 399, currencyCode: "EUR" },
    edition: "×25 ex.",
    status: "soon",
    variants: sizes("pack-complet", false),
    images: [],
    art: "star",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featuredProducts = products.filter((p) => p.featured);
