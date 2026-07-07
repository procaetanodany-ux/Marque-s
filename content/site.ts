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
      "DROP 003 — 12.07 — PIÈCES LIMITÉES",
      "LE SPRAY DISPONIBLE EN PRÉ-COMMANDE",
      "AUCUN RESTOCK",
    ],
  },

  /* ---- DROP EN COURS ---- */
  drop: {
    number: "003",
    label: "Drop 003",
    date: "2026-07-12T10:00:00+02:00", // compte à rebours
    pieces: "06 pièces / tirage unique / 12.07.2026",
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
} as const;
