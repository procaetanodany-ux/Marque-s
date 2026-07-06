/* Préfixe les assets de /public avec le basePath (GitHub Pages : /Marque-s). */
export const withBase = (path: string) =>
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;
