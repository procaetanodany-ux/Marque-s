/* ============================================================
   CONNECTEUR SHOPIFY STOREFRONT — prêt à activer.

   Pour brancher Shopify :
   1. Crée la boutique + les produits (mêmes handles que les slugs
      du catalogue : tee-le-spray, hoodie-beton, …).
   2. Dans Shopify admin : Apps → Develop apps → crée une app avec
      le scope Storefront API `unauthenticated_read_product_listings`
      + `unauthenticated_write_checkouts`.
   3. Renseigne les variables d'env (dans le workflow de déploiement
      ou .env.local) :
        NEXT_PUBLIC_SHOPIFY_DOMAIN=ta-boutique.myshopify.com
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxx
   4. C'est tout : le panier crée alors un vrai checkout Shopify
      (paiement CB, Apple Pay, suivi de stock).

   Le token Storefront est PUBLIC par conception (lecture catalogue +
   création de panier uniquement) — il peut vivre côté client.
   ============================================================ */

import type { CartLine } from "./types";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "";
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "";
const API_VERSION = "2025-01";

export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

/* Récupère l'ID de variante Shopify pour un handle + une taille.
   Utilisé au checkout pour mapper le catalogue local → Shopify. */
async function resolveVariantId(handle: string, size: string): Promise<string | null> {
  type Resp = {
    product: {
      variants: { nodes: { id: string; title: string; availableForSale: boolean }[] };
    } | null;
  };
  const data = await storefront<Resp>(
    `query ($handle: String!) {
      product(handle: $handle) {
        variants(first: 20) { nodes { id title availableForSale } }
      }
    }`,
    { handle },
  );
  const variant = data.product?.variants.nodes.find(
    (v) => v.title.toLowerCase() === size.toLowerCase(),
  );
  return variant?.id ?? null;
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

  type Resp = { cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } };
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
