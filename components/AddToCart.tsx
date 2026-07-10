"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { useCart } from "./cart/CartContext";
import NotifyMe from "./NotifyMe";

/* Seuil sous lequel on affiche l'urgence stock (« Plus que N »). */
const LOW_STOCK = 5;

export default function AddToCart({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [size, setSize] = useState<string | null>(
    product.variants.length === 1 ? product.variants[0].size : null,
  );
  const [warn, setWarn] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const soldOutSizes = product.variants.filter((v) => !v.available).map((v) => v.size);

  if (product.status === "soon") {
    return (
      <div className="grid gap-3">
        <p className="border-2 border-paper px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.14em]">
          Bientôt disponible
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
      <div className="grid gap-4">
        <p className="border-2 border-paper px-6 py-4 text-center text-[15px] font-bold uppercase tracking-[0.1em] opacity-60">
          Épuisé — aucun restock
        </p>
        <div className="border-2 border-inksoft p-4">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em]">
            Sois prévenu·e du <span className="text-acid">prochain drop</span>
          </p>
          <NotifyMe productName={product.name} />
        </div>
      </div>
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
      maxQuantity: variant.maxQuantity,
      image: product.images[0],
    });
  };

  return (
    <div className="grid gap-4">
      <fieldset>
        <div className="mb-2 flex items-center justify-between">
          <legend className="text-[13px] font-bold uppercase tracking-[0.14em]">
            Taille {warn && !size && <span className="text-[#ff5a4e]">— choisis ta taille</span>}
          </legend>
          {product.variants.length > 1 && (
            <Link
              href="/guide-des-tailles"
              className="text-[12px] font-semibold uppercase tracking-[0.1em] text-dim underline-offset-2 hover:text-acid hover:underline"
            >
              Guide des tailles
            </Link>
          )}
        </div>
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
        {/* Urgence stock : visible seulement quand le stock réel est lisible
            (scope inventaire Shopify activé) et bas. */}
        {(() => {
          const sel = size ? product.variants.find((v) => v.size === size) : undefined;
          const q = sel?.maxQuantity;
          if (sel?.available && typeof q === "number" && q > 0 && q <= LOW_STOCK) {
            return (
              <p className="mt-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-acid">
                <span aria-hidden className="inline-block h-2 w-2 animate-pulse bg-acid" />
                Plus que {q} en stock — taille {sel.size}
              </p>
            );
          }
          return null;
        })()}
      </fieldset>
      <button
        onClick={add}
        className="border-2 border-acid bg-acid px-6 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper active:scale-[0.98]"
      >
        Ajouter au panier
      </button>

      {/* Taille épuisée : capture d'e-mail pour le prochain drop. */}
      {soldOutSizes.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setNotifyOpen((o) => !o)}
            aria-expanded={notifyOpen}
            className="text-left text-[13px] font-semibold uppercase tracking-[0.1em] text-dim underline-offset-2 hover:text-acid hover:underline"
          >
            Ta taille est épuisée ? Préviens-moi du prochain drop {notifyOpen ? "−" : "+"}
          </button>
          {notifyOpen && (
            <div className="mt-3 border-2 border-inksoft p-4">
              <NotifyMe productName={product.name} sizes={soldOutSizes} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
