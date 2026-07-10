"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { formatPrice, STATUS_LABEL } from "@/lib/commerce/types";
import { assetSrc } from "@/lib/basePath";
import { shopifyImg, shopifySrcSet } from "@/lib/img";
import ProductArt from "./ProductArt";

/* Présentation éditoriale d'une pièce unique — pour un drop à un seul
   article, plus fort qu'une carte isolée dans une grille. */
export default function ProductFeature({ product: p }: { product: Product }) {
  return (
    <div className="px-4 md:px-12">
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group mx-auto grid max-w-6xl overflow-hidden border-2 border-paper md:grid-cols-2"
      >
        <Link
          href={`/produit/${p.slug}`}
          aria-label={`Voir ${p.name}`}
          className="relative grid aspect-square place-items-center overflow-hidden border-b-2 border-paper no-underline md:aspect-auto md:min-h-[560px] md:border-b-0 md:border-r-2"
        >
          {p.images[0] ? (
            <img
              src={assetSrc(shopifyImg(p.images[0], 1152))}
              srcSet={shopifySrcSet(p.images[0], [640, 960, 1440])}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={p.imageAlt ?? p.name}
              width={1152}
              height={1152}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <ProductArt art={p.art} className="w-1/2 opacity-90" />
          )}
          <span
            className={`absolute bottom-4 left-4 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] ${
              p.status === "available"
                ? "bg-acid text-ink"
                : p.status === "soldout"
                  ? "bg-ink text-paper line-through"
                  : "border border-paper bg-ink"
            }`}
          >
            {STATUS_LABEL[p.status]}
          </span>
        </Link>

        <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
          <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.2em] text-dim">
            Pièce unique
            {p.edition && (
              <span className="border border-paper px-2 py-0.5 text-paper">{p.edition}</span>
            )}
          </p>
          <h3 className="font-display text-[clamp(34px,4.5vw,60px)] uppercase leading-[1.02]">
            {p.name}
          </h3>
          {p.spec && <p className="max-w-[42ch] text-[15px] leading-relaxed text-dim">{p.spec}</p>}
          <p className="font-display text-4xl text-acid tabular-nums">{formatPrice(p.price)}</p>
          <Link
            href={`/produit/${p.slug}`}
            className="mt-2 inline-flex w-fit items-center gap-2.5 border-2 border-acid bg-acid px-8 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
          >
            {p.status === "available" ? "Voir la pièce" : "Découvrir"}
            <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </motion.article>
    </div>
  );
}
