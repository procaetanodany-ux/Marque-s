/* ============================================================
   CONNECTEUR SHOPIFY STOREFRONT — le site est la vitrine,
   Shopify gère le backend (paiement, stock, commandes).

   MODE DÉMO (actif par défaut) : tant que la vraie boutique n'est
   pas renseignée, le connect pointe sur mock.shop — la boutique de
   démonstration publique de Shopify. Le checkout est un vrai
   checkout Shopify hébergé, sans aucun débit possible.

   PASSER EN PRODUCTION (aucun changement de code) :
   1. Boutique Shopify : produits avec les mêmes handles que les
      slugs du catalogue (tee-le-spray, hoodie-beton, …) et des
      variantes nommées comme les tailles (S, M, L, XL).
   2. Admin → Apps → Développer des apps → active l'API Storefront
      (scopes unauthenticated_read_product_listings +
      unauthenticated_write_checkouts) → copie le TOKEN PUBLIC
      Storefront (⚠️ pas la clé secrète shpss_…, qui ne doit
      jamais être exposée côté client).
   3. GitHub → Settings → Secrets and variables → Actions →
      Variables :
        NEXT_PUBLIC_SHOPIFY_DOMAIN=ta-boutique.myshopify.com
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<token public>
   4. Relance le workflow : le checkout bascule sur ta boutique.
   ============================================================ */

import type { CartLine } from "./types";

/* Identifiants Shopify Storefront. Valeurs par défaut = boutique SoriWear,
   pour que le site fonctionne sur N'IMPORTE quel hébergement (Vercel,
   GitHub Pages, local) sans configuration. Le token Storefront est PUBLIC
   par conception (lecture catalogue + panier + comptes clients uniquement) —
   il est déjà exposé dans le bundle du site en ligne. Une variable d'env
   la remplace si besoin (ex. autre boutique). */
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "0abmkz-mt.myshopify.com";
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "b4672a202a2bfaef31d4ea0efdd1932e";
const API_VERSION = "2025-01";

/* mock.shop : API Storefront de démo Shopify, sans token. */
export const shopifyDemo = DOMAIN === "mock.shop";
export const shopifyConfigured = shopifyDemo || Boolean(DOMAIN && TOKEN);

/* Compte client hébergé par Shopify (création de compte, connexion,
   suivi des commandes) — rien à gérer côté site. */
export const customerAccountUrl =
  shopifyConfigured && !shopifyDemo ? `https://${DOMAIN}/account` : null;

const ENDPOINT = shopifyDemo
  ? "https://mock.shop/api"
  : `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!shopifyDemo) headers["X-Shopify-Storefront-Access-Token"] = TOKEN;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

/* Tailles courtes du catalogue → noms de variantes longs (démo). */
const SIZE_NAMES: Record<string, string> = {
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "X-Large",
  TU: "Small",
};

type VariantNodes = { nodes: { id: string; title: string; availableForSale: boolean }[] };

function matchVariant(variants: VariantNodes, size: string): string | null {
  const candidates = [size, `${size} /`, SIZE_NAMES[size] ?? "", `${SIZE_NAMES[size] ?? ""} /`]
    .filter(Boolean)
    .map((s) => s.toLowerCase());
  const found = variants.nodes.find((v) => {
    const t = v.title.toLowerCase();
    return candidates.some((c) => t === c || t.startsWith(c));
  });
  return found?.id ?? variants.nodes[0]?.id ?? null;
}

/* Résout l'ID de variante Shopify pour un handle + une taille.
   En démo, si le handle n'existe pas sur mock.shop, on retombe sur
   un produit de démonstration pour prouver le flux de bout en bout. */
async function resolveVariantId(handle: string, size: string): Promise<string | null> {
  type Resp = { product: { variants: VariantNodes } | null };
  const query = `query ($handle: String!) {
    product(handle: $handle) {
      variants(first: 20) { nodes { id title availableForSale } }
    }
  }`;

  const data = await storefront<Resp>(query, { handle });
  if (data.product) return matchVariant(data.product.variants, size);

  if (shopifyDemo) {
    const fallback = await storefront<Resp>(query, { handle: "men-t-shirt" });
    if (fallback.product) return matchVariant(fallback.product.variants, size);
  }
  return null;
}

/* Crée un panier Shopify et renvoie l'URL du checkout hébergé. */
export async function createShopifyCheckout(lines: CartLine[]): Promise<string> {
  const resolved = await Promise.all(
    lines.map(async (l) => ({
      merchandiseId: l.variantId.startsWith("gid://")
        ? l.variantId
        : await resolveVariantId(l.slug, l.size),
      quantity: l.quantity,
    })),
  );
  const valid = resolved.filter((l): l is { merchandiseId: string; quantity: number } =>
    Boolean(l.merchandiseId),
  );
  if (!valid.length) throw new Error("Aucune variante Shopify trouvée pour ce panier.");

  /* Client connecté : on rattache le panier à son compte pour que la
     commande apparaisse dans « Mes commandes » et que le checkout soit
     pré-rempli. Token lu depuis le localStorage du compte. */
  let buyerIdentity: { customerAccessToken: string } | undefined;
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("sori-customer-v1") : null;
    if (raw) {
      const t = JSON.parse(raw) as { accessToken?: string; expiresAt?: string };
      if (t.accessToken && (!t.expiresAt || new Date(t.expiresAt).getTime() > Date.now())) {
        buyerIdentity = { customerAccessToken: t.accessToken };
      }
    }
  } catch {
    /* pas connecté / stockage indisponible : checkout invité */
  }

  type Resp = {
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  };
  const data = await storefront<Resp>(
    `mutation ($lines: [CartLineInput!]!, $buyer: CartBuyerIdentityInput) {
      cartCreate(input: { lines: $lines, buyerIdentity: $buyer }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines: valid, buyer: buyerIdentity ?? null },
  );
  if (!data.cartCreate.cart) {
    throw new Error(data.cartCreate.userErrors[0]?.message ?? "Création du panier impossible.");
  }
  return data.cartCreate.cart.checkoutUrl;
}
