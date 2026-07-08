/* Préfixe les assets de /public avec le basePath (GitHub Pages : /Marque-s). */
export const withBase = (path: string) =>
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;

/* Source d'image : URL distante (CDN Shopify) telle quelle,
   chemin local préfixé par le basePath. */
export const assetSrc = (path: string) =>
  path.startsWith("http") ? path : withBase(path);
