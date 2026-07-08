/* ============================================================
   LOOKBOOK — les photos de shooting de la marque.
   Ajoute une entrée par photo : mets le fichier dans
   public/products/ (ou /public/lookbook/) et référence-le ici.
   La mise en page s'adapte automatiquement au nombre de photos.
   ============================================================ */

export type Look = {
  num: string;
  caption: string;
  image: string;
  imageAlt?: string;
};

export const looks: Look[] = [
  {
    num: "001",
    caption: "Le Spray, skatepark — avant / dos",
    image: "/products/le-spray-look.webp",
    imageAlt:
      "Deux vues du tee Le Spray porté au skatepark : logo SORI poitrine à l'avant, grande signature sprayée au dos",
  },
];
