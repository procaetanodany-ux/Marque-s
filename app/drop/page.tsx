import type { Metadata } from "next";
import { products } from "@/content/products";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import ProductGrid from "@/components/ProductGrid";
import Countdown from "@/components/Countdown";

export const metadata: Metadata = {
  title: "Le Drop",
  description: `${site.drop.label} — ${site.drop.pieces}. Éditions limitées, aucun restock.`,
};

export default function DropPage() {
  return (
    <main>
      <PageHeader
        title={
          <>
            Drop <span className="text-outline">{site.drop.number}</span>
          </>
        }
        meta={site.drop.pieces}
      />
      <div className="pb-24">
        <ProductGrid products={products} />
      </div>
      <Countdown />
    </main>
  );
}
