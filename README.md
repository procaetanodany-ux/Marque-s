# SORI® — Site officiel

Site e-commerce de la marque streetwear SORI. Next.js 15 (export statique), Tailwind 4, Framer Motion. Déployé automatiquement sur GitHub Pages à chaque push.

**En ligne : https://procaetanodany-ux.github.io/Marque-s/**

## Piloter le site au quotidien

Tout se passe dans deux fichiers — modifie, commit, push : le site est à jour ~1 min après.

### Faire une annonce (bandeau en haut du site)

`content/site.ts` → bloc `announcement` :

```ts
announcement: {
  enabled: true,
  messages: ["NOUVEAU DROP CE VENDREDI", "10H00 PILE", "SOYEZ LÀ"],
},
```

### Sortir un vêtement / ouvrir la vente

`content/products.ts` → passe le produit en `status: "available"` et rends les tailles disponibles :

```ts
status: "available",
variants: sizes("hoodie-beton", true),   // true = toutes les tailles dispo
```

Statuts possibles : `"soon"` (bientôt, bouton « Être alerté »), `"available"` (panier actif), `"soldout"` (épuisé).

### Changer la date du drop (compte à rebours)

`content/site.ts` → `drop.date` (format ISO avec fuseau) :

```ts
date: "2026-07-12T10:00:00+02:00",
```

### Ajouter un produit

Ajoute une entrée dans `content/products.ts` (copie une existante). Mets les photos dans `public/products/` (WebP conseillé, ~1600 px de large max) et référence-les dans `images: []`. La page produit est générée automatiquement à l'adresse `/produit/<slug>/`.

## Encaisser les commandes

### Aujourd'hui — pré-commande par e-mail (déjà actif)

Sans configuration, le bouton du panier génère un e-mail pré-rempli (récapitulatif + total) envoyé à l'adresse définie dans `content/site.ts` (`contactEmail`). Tu confirmes le paiement au client par retour (virement, PayPal, Lydia…).

### Demain — Shopify (paiement CB, Apple Pay, stock)

1. Crée ta boutique Shopify et tes produits avec **les mêmes handles que les slugs** du catalogue (`tee-le-spray`, `hoodie-beton`, …) et des variantes nommées comme les tailles (`S`, `M`, `L`, `XL`).
2. Shopify admin → Apps → *Develop apps* → crée une app privée avec les scopes Storefront `unauthenticated_read_product_listings` et `unauthenticated_write_checkouts`. Récupère le **Storefront access token** (public par conception).
3. Renseigne les deux variables dans `.github/workflows/deploy.yml` (bloc `env` de l'étape build) :

```yaml
NEXT_PUBLIC_SHOPIFY_DOMAIN: ta-boutique.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: xxxx
```

4. Push. Le panier crée désormais un vrai checkout Shopify hébergé. Le code du connecteur est dans `lib/commerce/shopify.ts`.

### Newsletter

Mode démo par défaut. Pour collecter réellement les e-mails, crée un formulaire sur Formspree ou Brevo et mets l'URL du endpoint dans `content/site.ts` (`newsletterEndpoint`) ou via `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`.

## Développement

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export statique dans out/
```

## Structure

```
content/           ← LES FICHIERS À ÉDITER (config site + catalogue)
app/               pages (accueil, drop, produit/[slug], lookbook, manifeste, contact)
components/        UI (hero, marquees, panier, cartes produit…)
lib/commerce/      types, checkout, connecteur Shopify
public/products/   photos produit
.github/workflows/ déploiement GitHub Pages automatique
```

## Avant d'ouvrir les ventes — checklist

- [ ] Compléter `app/mentions-legales/page.tsx` (raison sociale, SIRET)
- [ ] Ajouter des CGV
- [ ] Remplacer les URLs des réseaux sociaux dans `content/site.ts`
- [ ] Brancher la newsletter sur un vrai service
- [ ] Vérifier l'adresse e-mail de commande (`contactEmail`)
