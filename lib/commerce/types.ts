/* Types commerce — alignés sur les objets Shopify Storefront pour que la
   bascule locale → Shopify soit un simple changement de source. */

export type Money = { amount: number; currencyCode: string };

export type ProductStatus = "soon" | "available" | "soldout";

export type Variant = {
  id: string; // local : "tee-le-spray-m" — sera remplacé par le GID Shopify
  size: string;
  available: boolean;
  /* Stock réel Shopify (quantityAvailable). Défini seulement si le droit
     unauthenticated_read_product_inventory est activé sur le jeton. */
  maxQuantity?: number;
  /* À remplir lors du branchement Shopify (gid://shopify/ProductVariant/…) */
  shopifyVariantId?: string;
};

export type Product = {
  id: string;
  slug: string; // = handle Shopify
  num: string;
  name: string;
  spec: string;
  description: string;
  price: Money;
  edition?: string;
  status: ProductStatus;
  variants: Variant[];
  images: string[]; // chemins /public ou URLs CDN Shopify
  imageAlt?: string;
  art: "peak" | "house" | "cross" | "flag" | "grid" | "star";
  featured?: boolean;
};

export type CartLine = {
  variantId: string;
  slug: string;
  name: string;
  size: string;
  price: Money;
  quantity: number;
  /* Plafond de stock Shopify pour cette variante (si connu). */
  maxQuantity?: number;
  image?: string;
};

export const formatPrice = (m: Money) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: m.currencyCode,
    minimumFractionDigits: 0,
  }).format(m.amount);

export const cartTotal = (lines: CartLine[]): Money => ({
  amount: lines.reduce((sum, l) => sum + l.price.amount * l.quantity, 0),
  currencyCode: lines[0]?.price.currencyCode ?? "CHF",
});

export const STATUS_LABEL: Record<ProductStatus, string> = {
  soon: "Bientôt",
  available: "Disponible",
  soldout: "Épuisé",
};
