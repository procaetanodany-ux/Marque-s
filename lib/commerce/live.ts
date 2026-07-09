/* ============================================================
   CATALOGUE EN DIRECT (côté navigateur).

   Le site est un export statique : les pages sont rendues avec les
   données Shopify au moment du build. Pour que tes modifications dans
   l'admin Shopify (tailles, description, prix, stock, photos)
   apparaissent IMMÉDIATEMENT sans redéployer, on rafraîchit le
   catalogue directement dans le navigateur au chargement de la page.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { storefront, shopifyConfigured, shopifyDemo } from "./shopify";
import { PRODUCTS_QUERY, mapProduct, type ShopifyProductNode } from "./catalog";
import type { Product } from "./types";

const live = shopifyConfigured && !shopifyDemo;

async function fetchLiveCatalog(): Promise<Product[]> {
  const data = await storefront<{ products: { nodes: ShopifyProductNode[] } }>(PRODUCTS_QUERY, {});
  return data.products.nodes.map(mapProduct);
}

/* Rafraîchit tout le catalogue. Part des données du build (affichage
   instantané), puis remplace par la version live dès qu'elle arrive. */
export function useLiveCatalog(initial: Product[]): Product[] {
  const [products, setProducts] = useState(initial);
  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    fetchLiveCatalog()
      .then((fresh) => {
        if (!cancelled && fresh.length) setProducts(fresh);
      })
      .catch(() => {
        /* on garde les données du build en cas d'échec réseau */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return products;
}

/* Rafraîchit une seule pièce (par slug/handle). */
export function useLiveProduct(slug: string, initial: Product | undefined): Product | undefined {
  const [product, setProduct] = useState(initial);
  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    fetchLiveCatalog()
      .then((fresh) => {
        const found = fresh.find((p) => p.slug === slug);
        if (!cancelled && found) setProduct(found);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return product;
}
