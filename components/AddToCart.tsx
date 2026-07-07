"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { useCart } from "./cart/CartContext";

export default function AddToCart({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [size, setSize] = useState<string | null>(
    product.variants.length === 1 ? product.variants[0].size : null,
  );
  const [warn, setWarn] = useState(false);

  if (product.status === "soon") {
    return (
      <div className="grid gap-3">
        <p className="border-2 border-paper px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.14em]">
          Drop le 12.07 — 10:00
        </p>
        <Link
          href="/#newsletter"
          className="border-2 border-acid bg-acid px-6 py-4 text-center text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper"
        >
          Être alerté du drop
        </Link>
      </div>
    );
  }

  if (product.status === "soldout") {
    return (
      <p className="border-2 border-paper px-6 py-4 text-center text-[15px] font-bold uppercase tracking-[0.1em] opacity-60">
        Épuisé — aucun restock
      </p>
    );
  }

  const add = () => {
    if (!size) {
      setWarn(true);
      return;
    }
    const variant = product.variants.find((v) => v.size === size)!;
    addLine({
      variantId: variant.shopifyVariantId ?? variant.id,
      slug: product.slug,
      name: product.name,
      size,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <div className="grid gap-4">
      <fieldset>
        <legend className="mb-2 text-[13px] font-bold uppercase tracking-[0.14em]">
          Taille {warn && !size && <span className="text-[#ff5a4e]">— choisis ta taille</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.available}
              aria-pressed={size === v.size}
              onClick={() => {
                setSize(v.size);
                setWarn(false);
              }}
              className={`min-h-[48px] min-w-[52px] border-2 px-3 text-[15px] font-bold uppercase transition-colors ${
                size === v.size
                  ? "border-acid bg-acid text-ink"
                  : "border-paper hover:border-acid"
              } disabled:cursor-not-allowed disabled:opacity-30`}
            >
              {v.size}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        onClick={add}
        className="border-2 border-acid bg-acid px-6 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper active:scale-[0.98]"
      >
        Ajouter au panier
      </button>
    </div>
  );
}
