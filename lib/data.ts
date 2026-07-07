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
    imageAlt:
      "Deux vues du tee Le Spray porté au skatepark : logo SORI poitrine à l'avant, grande signature sprayée au dos",
  },
  { num: "002", caption: "Veste Chantier, dos", pattern: 2 },
  { num: "003", caption: "Hoodie Béton × Cargo Périph", pattern: 3 },
  { num: "004", caption: "Bob Bitume, détail", pattern: 4 },
  { num: "005", caption: "Full fit, drop 003", pattern: 5 },
];
