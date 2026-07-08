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

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "";
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "";
const API_VERSION = "2025-01";

/* mock.shop : API Storefront de démo Shopify, sans token. */
export const shopifyDemo = DOMAIN === "mock.shop";
export const shopifyConfigured = shopifyDemo || Boolean(DOMAIN && TOKEN);

const ENDPOINT = shopifyDemo
  ? "https://mock.shop/api"
  : `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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

  type Resp = {
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  };
  const data = await storefront<Resp>(
    `mutation ($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines: valid },
  );
  if (!data.cartCreate.cart) {
    throw new Error(data.cartCreate.userErrors[0]?.message ?? "Création du panier impossible.");
  }
  return data.cartCreate.cart.checkoutUrl;
}
