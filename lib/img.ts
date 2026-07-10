/* ============================================================
   IMAGES OPTIMISÉES — CDN Shopify.
   L'export statique désactive l'optimiseur d'images Next, mais le
   CDN Shopify sait redimensionner à la volée via `?width=N`.
   On demande donc des tailles adaptées à l'écran (srcset) au lieu
   de servir l'original en pleine résolution partout.
   Les images locales (/products/*.webp) sont renvoyées telles quelles.
   ============================================================ */

const isShopifyCdn = (url: string) => url.includes("cdn.shopify.com");

/* URL redimensionnée par le CDN Shopify (sans effet hors CDN). */
export const shopifyImg = (url: string, width: number) =>
  isShopifyCdn(url) ? `${url}${url.includes("?") ? "&" : "?"}width=${width}` : url;

/* srcset multi-largeurs pour les images CDN Shopify ; undefined sinon
   (le navigateur retombe alors sur src). */
export const shopifySrcSet = (url: string, widths: number[]) =>
  isShopifyCdn(url)
    ? widths.map((w) => `${shopifyImg(url, w)} ${w}w`).join(", ")
    : undefined;
