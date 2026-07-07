import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { products } from "@/content/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/drop", "/lookbook", "/manifeste", "/contact", "/cgv", "/mentions-legales"];
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
