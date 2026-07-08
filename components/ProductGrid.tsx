import type { Product } from "@/lib/commerce/types";
import ProductCard from "./ProductCard";
import ProductFeature from "./ProductFeature";

export default function ProductGrid({ products }: { products: Product[] }) {
  /* Une seule pièce : présentation éditoriale plein format. */
  if (products.length === 1) {
    return <ProductFeature product={products[0]} />;
  }

  /* Deux pièces : deux colonnes centrées, pas de troisième vide. */
  const cols = products.length === 2 ? "sm:grid-cols-2 mx-auto max-w-5xl" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-6 px-4 md:px-12 ${cols}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
