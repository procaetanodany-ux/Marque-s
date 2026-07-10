"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { formatPrice, STATUS_LABEL } from "@/lib/commerce/types";
import { assetSrc } from "@/lib/basePath";
import { shopifyImg, shopifySrcSet } from "@/lib/img";
import ProductArt from "./ProductArt";

/* Stock total restant (si le stock réel Shopify est lisible), sinon null. */
function totalStock(p: Product): number | null {
  const known = p.variants.filter((v) => typeof v.maxQuantity === "number");
  if (!known.length) return null;
  return known.reduce((n, v) => n + (v.maxQuantity ?? 0), 0);
}

export default function ProductCard({ product: p, index = 0 }: { product: Product; index?: number }) {
  const stock = p.status === "available" ? totalStock(p) : null;
  const lowStock = stock !== null && stock > 0 && stock <= 5;
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      data-hover
      className={`group flex flex-col border-2 border-paper transition-colors duration-150 ${
        p.art === "star" ? "bg-acid text-ink hover:bg-paper" : "bg-ink hover:bg-acid hover:text-ink"
      } ${p.featured ? "lg:row-span-2" : ""}`}
    >
      <Link
        href={`/produit/${p.slug}`}
        className={`relative grid place-items-center overflow-hidden border-b-2 border-current no-underline ${
          p.featured ? "min-h-[320px] flex-1" : "aspect-[1/0.85]"
        }`}
        aria-label={`Voir ${p.name}`}
      >
        {p.images[0] ? (
          <img
            src={assetSrc(shopifyImg(p.images[0], 800))}
            srcSet={shopifySrcSet(p.images[0], [480, 800, 1200])}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={p.imageAlt ?? p.name}
            width={576}
            height={922}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <ProductArt
            art={p.art}
            className="w-[55%] opacity-90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-4deg] group-hover:scale-110"
          />
        )}
        <span
          className={`absolute left-4 top-3 font-display text-[28px] ${
            p.images[0] ? "bg-ink px-2 text-paper" : "opacity-35"
          }`}
        >
          {p.num}
        </span>
        <span
          className={`absolute bottom-3 right-4 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
            p.status === "available"
              ? "bg-acid text-ink"
              : p.status === "soldout"
                ? "bg-ink text-paper line-through"
                : "border border-current"
          }`}
        >
          {lowStock ? `Plus que ${stock}` : STATUS_LABEL[p.status]}
        </span>
      </Link>
      <div className="grid gap-1.5 p-6">
        <h3 className="font-display text-2xl uppercase tracking-[0.02em]">{p.name}</h3>
        {p.spec && <p className="text-sm opacity-70">{p.spec}</p>}
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-xl font-bold tabular-nums">{formatPrice(p.price)}</span>
          {p.edition && (
            <span className="border-[1.5px] border-current px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
              {p.edition}
            </span>
          )}
        </div>
      </div>
      <Link
        href={`/produit/${p.slug}`}
        className="flex min-h-[48px] items-center justify-between border-t-2 border-current px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] no-underline"
      >
        {p.status === "available" ? "Voir la pièce" : "Découvrir"}
        <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1.5">
          →
        </span>
      </Link>
    </motion.article>
  );
}
