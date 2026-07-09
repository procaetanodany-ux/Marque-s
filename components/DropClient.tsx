"use client";

import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { useLiveCatalog } from "@/lib/commerce/live";
import { site } from "@/content/site";
import PageHeader from "./PageHeader";
import ProductGrid from "./ProductGrid";

/* Page drop — données du build puis rafraîchies en direct depuis Shopify. */
export default function DropClient({ initial }: { initial: Product[] }) {
  const products = useLiveCatalog(initial);

  return (
    <>
      <PageHeader
        title={
          <>
            Drop <span className="text-outline">{site.drop.number}</span>
          </>
        }
        meta={
          products.length > 0
            ? `${String(products.length).padStart(2, "0")} pièce${products.length > 1 ? "s" : ""} / tirage unique`
            : undefined
        }
      />
      {products.length > 0 ? (
        <div className="pb-24">
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="grid place-items-center px-4 pb-24 pt-8 text-center md:px-12">
          <div className="w-full max-w-[640px] border-2 border-paper p-10 md:p-16">
            <p className="font-display text-[clamp(28px,4vw,48px)] uppercase leading-tight">
              Le drop se prépare <span className="text-acid">à l&apos;atelier.</span>
            </p>
            <p className="mt-4 text-dim">
              Les pièces arrivent très bientôt. Inscris-toi pour être alerté avant tout le
              monde — accès anticipé 24 h.
            </p>
            <Link
              href="/#newsletter"
              className="mt-8 inline-block border-2 border-acid bg-acid px-7 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
            >
              Être alerté du drop
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
