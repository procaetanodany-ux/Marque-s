# SORI® — Site officiel

Site e-commerce de la marque streetwear SORI. Next.js 15 (export statique), Tailwind 4, Framer Motion. Déployé automatiquement sur GitHub Pages à chaque push.

**En ligne : https://procaetanodany-ux.github.io/Marque-s/**

## Piloter la boutique — tout se passe dans Shopify

**Les produits affichés sur le site viennent de ta boutique Shopify** (SoriWear, `0abmkz-mt.myshopify.com`). Crée, modifie, change les prix, gère le stock depuis l'admin Shopify : le site se reconstruit **automatiquement toutes les 6 h**. Pour une mise à jour immédiate : GitHub → **Actions → Deploy to GitHub Pages → Run workflow**.

### Créer un produit (dans l'admin Shopify)

1. Produits → Ajouter un produit : titre, description, prix (CHF), photos
2. Variantes : option **Taille** avec S, M, L, XL (ou Taille unique)
3. **Publication → cocher le canal « Headless »** (obligatoire, sinon invisible sur le site)
4. Astuces tags : ajoute le tag `soon` pour afficher « Bientôt » (non achetable) ; un tag comme `×200 ex.` s'affiche en badge édition limitée

Le premier produit de la liste (le plus récent) devient la pièce vedette (grande carte).

### Faire une annonce (bandeau en haut du site)

`content/site.ts` → bloc `announcement` — modifie, commit : en ligne 1 min après.

### Changer la date du drop (compte à rebours)

`content/site.ts` → `drop.date` (format ISO avec fuseau).

### Comptes clients

Création de compte, connexion et suivi de commandes sont **hébergés par Shopify** — accessibles via l'icône compte de la navbar et « Mon compte » dans le footer. Active « Comptes clients » dans Shopify (Paramètres → Comptes clients) selon ta préférence.

## Encaisser les commandes

### Aujourd'hui — pré-commande par e-mail (déjà actif)

Sans configuration, le bouton du panier génère un e-mail pré-rempli (récapitulatif + total) envoyé à l'adresse définie dans `content/site.ts` (`contactEmail`). Tu confirmes le paiement au client par retour (virement, PayPal, Lydia…).

### Mode actuel — checkout Shopify de démonstration

Le site est branché sur **mock.shop**, la boutique de démonstration publique de Shopify : le bouton du panier crée un vrai checkout Shopify hébergé (aucun débit possible). Cela prouve le connect de bout en bout en attendant la vraie boutique. Pour repasser en pré-commande e-mail : retire le fallback `|| 'mock.shop'` dans `.github/workflows/deploy.yml`.

### Brancher TA boutique Shopify (paiement CB, Apple Pay, stock)

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
