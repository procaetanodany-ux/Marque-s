export type Product = {
  num: string;
  name: string;
  spec: string;
  price: string;
  edition: string;
  art: "peak" | "house" | "cross" | "flag" | "grid" | "star";
  featured?: boolean;
  image?: string;
  imageAlt?: string;
};

export const DROP_DATE = "2026-07-12T10:00:00+02:00";

export const products: Product[] = [
  { num: "01", name: "Hoodie « Béton »", spec: "Molleton 480 g/m² — coupe boxy", price: "89 €", edition: "×150 ex.", art: "peak" },
  { num: "02", name: "Veste « Chantier »", spec: "Canvas déperlant — poches utilitaires oversize", price: "159 €", edition: "×80 ex.", art: "house" },
  {
    num: "03",
    name: "Tee « Le Spray »",
    spec: "Oversize — épaules tombantes, col rond côtelé, spray artisanal dos",
    price: "45 €",
    edition: "×200 ex.",
    art: "cross",
    featured: true,
    image: "/products/le-spray-back.webp",
    imageAlt: "Tee Le Spray porté, vue de dos : tie-dye pastel rose et lavande avec grande signature SORI sprayée",
  },
  { num: "04", name: "Cargo « Périph »", spec: "Ripstop — jambe large, 8 poches", price: "119 €", edition: "×120 ex.", art: "flag" },
  { num: "05", name: "Bob « Bitume »", spec: "Nylon — logo brodé ton sur ton", price: "39 €", edition: "×100 ex.", art: "grid" },
  { num: "06", name: "Pack complet", spec: "Les 5 pièces + tote sérigraphié", price: "399 €", edition: "×25 ex.", art: "star" },
];

export type Look = {
  num: string;
  caption: string;
  pattern: number;
  image?: string;
  imageAlt?: string;
};

export const looks: Look[] = [
  {
    num: "001",
    caption: "Le Spray, skatepark — avant / dos",
    pattern: 1,
    image: "/products/le-spray-look.webp",
    imageAlt: "Deux vues du tee Le Spray porté au skatepark : logo SORI poitrine à l'avant, grande signature sprayée au dos",
  },
  { num: "002", caption: "Veste Chantier, dos", pattern: 2 },
  { num: "003", caption: "Hoodie Béton × Cargo Périph", pattern: 3 },
  { num: "004", caption: "Bob Bitume, détail", pattern: 4 },
  { num: "005", caption: "Full fit, drop 003", pattern: 5 },
];
