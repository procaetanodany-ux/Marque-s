"use client";

import Link from "next/link";
import { formatPrice, STATUS_LABEL, type Product } from "@/lib/commerce/types";
import { useLiveProduct } from "@/lib/commerce/live";
import ProductGallery from "./ProductGallery";
import AddToCart from "./AddToCart";
import ReassuranceBar from "./ReassuranceBar";

/* Détail produit — part des données du build puis se rafraîchit en direct
   depuis Shopify (tailles, description, prix, stock, photos). */
export default function ProductDetail({ slug, initial }: { slug: string; initial: Product }) {
  const product = useLiveProduct(slug, initial) ?? initial;

  return (
    <section className="grid gap-10 px-4 py-10 md:grid-cols-2 md:px-12 md:py-14 lg:gap-16">
      <ProductGallery key={product.images.join("|")} product={product} />

      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.2em] text-dim">
            N° {product.num}
            <span
              className={`px-2 py-0.5 tracking-[0.14em] ${
                product.status === "available"
                  ? "bg-acid text-ink"
                  : product.status === "soldout"
                    ? "border border-paper line-through"
                    : "border border-paper"
              }`}
            >
              {STATUS_LABEL[product.status]}
            </span>
          </p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] uppercase leading-[1.02]">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <span className="font-display text-3xl text-acid tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.edition && (
              <span className="border-[1.5px] border-paper px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                {product.edition}
              </span>
            )}
          </div>
        </div>

        {product.description && (
          <p className="max-w-[52ch] whitespace-pre-line text-[16px] leading-relaxed text-dim">
            {product.description}
          </p>
        )}

        <AddToCart key={product.variants.map((v) => v.size + v.available).join(",")} product={product} />

        <ul className="grid gap-0 border-2 border-paper text-[13px] font-semibold uppercase tracking-[0.1em]">
          {product.edition && (
            <li className="flex justify-between border-b border-inksoft px-4 py-3">
              <span className="text-dim">Édition</span>
              <span>Numérotée, {product.edition.replace("×", "")}</span>
            </li>
          )}
          <li className="flex justify-between border-b border-inksoft px-4 py-3">
            <span className="text-dim">Paiement</span>
            <span>CB, Apple Pay, Google Pay</span>
          </li>
          <li className="flex justify-between border-b border-inksoft px-4 py-3">
            <span className="text-dim">Livraison</span>
            <span>Mondiale, suivie</span>
          </li>
          <li className="flex justify-between px-4 py-3">
            <span className="text-dim">Restock</span>
            <span className="text-acid">Jamais</span>
          </li>
        </ul>

        <ReassuranceBar />

        <p className="text-xs text-dim">
          Besoin d&apos;aide sur la taille ?{" "}
          <Link href="/guide-des-tailles" className="text-acid underline-offset-2 hover:underline">
            Voir le guide des tailles
          </Link>
          {" · "}
          <Link href="/livraison-retours" className="text-acid underline-offset-2 hover:underline">
            Livraison &amp; retours
          </Link>
        </p>
      </div>
    </section>
  );
}
