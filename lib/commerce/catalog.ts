/* ============================================================
   CATALOGUE — source de vérité : TA BOUTIQUE SHOPIFY.

   Les produits affichés sur le site sont récupérés depuis l'API
   Storefront AU MOMENT DU BUILD. Tu gères tout depuis l'admin
   Shopify (créer, prix, tailles, photos, stock) ; le site se
   reconstruit automatiquement toutes les 6 h, ou immédiatement via
   GitHub → Actions → Deploy to GitHub Pages → Run workflow.

   Conventions côté Shopify :
   - variantes = option « Taille » (S, M, L, XL…)
   - publier chaque produit sur le canal HEADLESS
   - tag « soon » = affiché « Bientôt » (non achetable)
   - un tag comme « ×200 ex. » = badge édition limitée
   En dev sans boutique configurée, un catalogue d'exemple local
   est utilisé (content/products.ts).
   ============================================================ */

import type { Product, ProductStatus } from "./types";
import { shopifyConfigured, shopifyDemo, storefront } from "./shopify";
import { products as devFixtures } from "@/content/products";

const ARTS = ["cross", "peak", "house", "flag", "grid", "star"] as const;

type ShopifyProductNode = {
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: { nodes: { url: string; altText: string | null }[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

function mapProduct(node: ShopifyProductNode, index: number): Product {
  const soon = node.tags.some((t) => t.toLowerCase() === "soon");
  const status: ProductStatus = soon ? "soon" : node.availableForSale ? "available" : "soldout";
  const editionTag = node.tags.find((t) => /ex\.?$/i.test(t) || t.startsWith("×"));

  return {
    id: node.handle,
    slug: node.handle,
    num: String(index + 1).padStart(2, "0"),
    name: node.title,
    spec: node.description.split("\n")[0]?.slice(0, 90) ?? "",
    description: node.description,
    price: {
      amount: parseFloat(node.priceRange.minVariantPrice.amount),
      currencyCode: node.priceRange.minVariantPrice.currencyCode,
    },
    edition: editionTag,
    status,
    variants: node.variants.nodes.map((v) => ({
      id: v.id,
      shopifyVariantId: v.id,
      size:
        v.selectedOptions.find((o) => /taille|size/i.test(o.name))?.value ??
        (v.title === "Default Title" ? "TU" : v.title),
      available: v.availableForSale && !soon,
    })),
    images: node.images.nodes.map((i) => i.url),
    imageAlt: node.featuredImage?.altText ?? node.title,
    art: ARTS[index % ARTS.length],
    featured: index === 0,
  };
}

/* Récupéré une seule fois par build, partagé entre toutes les pages. */
let cache: Product[] | null = null;

export async function getCatalog(): Promise<Product[]> {
  if (cache) return cache;

  /* Dev local sans boutique : catalogue d'exemple. */
  if (!shopifyConfigured || shopifyDemo) {
    cache = devFixtures;
    return cache;
  }

  const query = `query {
    products(first: 50, sortKey: CREATED_AT, reverse: true) {
      nodes {
        handle title description availableForSale tags
        featuredImage { url altText }
        images(first: 8) { nodes { url altText } }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 20) {
          nodes { id title availableForSale selectedOptions { name value } }
        }
      }
    }
  }`;

  /* L'export statique rend chaque page dans un worker distinct : chacun
     interroge Shopify. Un échec réseau ponctuel ne doit pas faire tomber
     une page sur la vitrine alors que les autres ont les vrais produits
     — d'où les tentatives multiples avant tout repli. */
  try {
    let data: { products: { nodes: ShopifyProductNode[] } } | null = null;
    let lastErr: unknown;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        data = await storefront(query, {});
        break;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
    if (!data) throw lastErr;
    const fromShopify = data.products.nodes.map(mapProduct);

    /* Le site n'affiche QUE les vrais produits Shopify. Un seul drop
       pour l'instant : pas de pièces de remplissage. Si la boutique
       est vide, les pages montrent leur état d'attente soigné. */
    cache = fromShopify;
  } catch (e) {
    /* Shopify injoignable après plusieurs tentatives : on n'invente
       pas de faux produits, la page affiche son état d'attente. */
    console.warn("[catalog] Shopify indisponible au build :", e);
    cache = [];
  }
  return cache;
}

export async function getCatalogProduct(slug: string): Promise<Product | undefined> {
  return (await getCatalog()).find((p) => p.slug === slug);
}
