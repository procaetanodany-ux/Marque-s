"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { assetSrc } from "@/lib/basePath";
import ProductArt from "./ProductArt";

export default function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);

  if (product.images.length === 0) {
    return (
      <div className="grid aspect-[4/5] place-items-center border-2 border-paper bg-inksoft/40">
        <ProductArt art={product.art} className="w-1/2 opacity-90" />
        <span className="absolute font-display text-[110px] opacity-10">{product.num}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/5] overflow-hidden border-2 border-paper">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={active}
            src={assetSrc(product.images[active])}
            alt={product.imageAlt ?? product.name}
            width={1152}
            height={1440}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      {product.images.length > 1 && (
        <div className="flex gap-3">
          {product.images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-pressed={active === i}
              className={`h-24 w-20 overflow-hidden border-2 transition-colors ${
                active === i ? "border-acid" : "border-paper opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={assetSrc(img)}
                alt=""
                width={160}
                height={192}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
