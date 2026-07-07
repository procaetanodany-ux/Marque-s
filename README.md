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
2. Shopify admin → Paramètres → **Apps et canaux de vente** → *Développer des apps* → crée une app, active l'**API Storefront** avec les scopes `unauthenticated_read_product_listings` et `unauthenticated_write_checkouts`, puis copie le **token d'accès public Storefront** (⚠️ pas la « clé secrète d'API » `shpss_…` : le token public est fait pour être exposé côté client, le secret non).
3. Dans GitHub : **Settings → Secrets and variables → Actions → onglet Variables** → ajoute :
   - `NEXT_PUBLIC_SHOPIFY_DOMAIN` = `ta-boutique.myshopify.com`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` = le token public
4. Relance le workflow (Actions → Deploy to GitHub Pages → *Run workflow*). Aucun changement de code : le panier bascule automatiquement sur le checkout Shopify hébergé. Connecteur : `lib/commerce/shopify.ts`.

### Formulaires (contact + newsletter) — déjà réels

Le formulaire de contact et la newsletter envoient via **FormSubmit** (gratuit, sans compte) vers `contactEmail`. ⚠️ **Activation unique** : à la toute première soumission, FormSubmit envoie un e-mail de confirmation à cette adresse — clique le lien une fois, et tout arrive ensuite en boîte. Pour passer la newsletter sur un vrai outil d'e-mailing (Brevo…), renseigne `newsletterEndpoint` dans `content/site.ts` ou la variable `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`.

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

- [ ] Activer FormSubmit (cliquer le lien du premier e-mail de confirmation)
- [ ] Compléter `app/mentions-legales/page.tsx` et `app/cgv/page.tsx` (raison sociale, SIRET)
- [ ] Remplacer les URLs des réseaux sociaux dans `content/site.ts`
- [ ] Brancher Shopify (voir plus haut) pour encaisser par CB
- [ ] Vérifier l'adresse e-mail de commande (`contactEmail`)
