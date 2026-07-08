import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getCatalog } from "@/lib/commerce/catalog";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();
  const pages = [
    "",
    "/drop",
    "/lookbook",
    "/manifeste",
    "/livraison-retours",
    "/guide-des-tailles",
    "/contact",
    "/cgv",
    "/mentions-legales",
  ];
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}/`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/produit/${p.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
