/* ============================================================
   CONFIGURATION DU SITE — le fichier à éditer au quotidien.
   Annonce, drop, contacts : tout le site lit ces valeurs.
   ============================================================ */

export const site = {
  name: "SORI",
  tagline: "Porte la rue. Pas la mode.",
  description:
    "SORI. Streetwear brut, coupé pour la rue. Drops en édition limitée — quand c'est parti, c'est parti.",

  /* URL publique du site (SEO, sitemap, partages réseaux sociaux). */
  url: "https://procaetanodany-ux.github.io/Marque-s",

  /* E-mail de la marque : reçoit les commandes (mode pré-commande),
     les messages du formulaire de contact et les inscriptions
     newsletter. Affiché sur la page contact. */
  contactEmail: "pro.caetanodany@gmail.com",

  /* Formulaires (contact + newsletter) : envoyés via FormSubmit,
     un relais gratuit sans compte. IMPORTANT — à la première
     soumission, FormSubmit t'enverra UN e-mail de confirmation :
     clique le lien dedans une fois, et tous les formulaires du site
     arriveront ensuite directement dans ta boîte. */
  formEndpoint: "https://formsubmit.co/ajax/pro.caetanodany@gmail.com",

  /* ---- BANDEAU D'ANNONCE (ticker en haut de toutes les pages) ----
     Pour faire une annonce : passe enabled à true et édite messages.
     Chaque message est séparé par une étoile dans le bandeau. */
  announcement: {
    enabled: true,
    messages: [
      "DROP 001 — DISPONIBLE",
      "PIÈCES LIMITÉES",
      "LIVRAISON MONDIALE",
      "AUCUN RESTOCK",
    ],
  },

  /* ---- DROP EN COURS ---- */
  drop: {
    number: "001",
    label: "Drop 001",
    date: "2026-07-12T10:00:00+02:00", // compte à rebours (si countdown = true)
    countdown: false, // false = drop déjà en ligne, on masque le compte à rebours
    pieces: "Édition limitée / tirage unique",
  },

  /* ---- NEWSLETTER ----
     Laisse vide pour le mode démo. Pour brancher un vrai service
     (Formspree, Brevo…), mets l'URL du endpoint POST ici ou dans la
     variable d'env NEXT_PUBLIC_NEWSLETTER_ENDPOINT. */
  newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? "",

  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    x: "https://x.com/",
  },

  /* ---- IDENTITÉ LÉGALE (mentions légales + CGV) ----
     Vendeur particulier, Suisse. Complète les champs [à compléter]
     avant d'ouvrir largement les ventes. */
  legal: {
    seller: "[Prénom Nom]", // ton nom (vendeur particulier)
    locality: "[Localité, Canton]", // ex. "Lausanne, Vaud"
    country: "Suisse",
    // ide: "CHE-000.000.000", // si un jour tu t'enregistres
  },

  /* ---- LIVRAISON & RETOURS (page /livraison-retours + CGV) ----
     Défauts éditables — ajuste selon ta vraie offre. */
  shipping: {
    zones: "Suisse & International",
    delay: "3 à 7 jours ouvrés après expédition",
    freeFrom: 150, // livraison offerte dès ce montant (CHF), 0 = jamais
    flatRate: 6.9, // frais de livraison Suisse (CHF)
    returnDays: 14,
    returnCost: "à la charge du client", // ou "offert"
  },

  /* ---- OVERRIDE PHOTOS PRODUIT ----
     Pont temporaire : tant que la vraie photo n'est pas sur Shopify,
     on force les images locales pour ce handle. Vide-le une fois la
     bonne photo mise en ligne dans l'admin Shopify. */
  localImageOverrides: {
    "la-signature": ["/products/le-spray-back.webp", "/products/le-spray-look.webp"],
  } as Record<string, string[]>,
} as const;
