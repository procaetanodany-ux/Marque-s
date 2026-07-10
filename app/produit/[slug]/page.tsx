import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog, getCatalogProduct } from "@/lib/commerce/catalog";
import ProductGrid from "@/components/ProductGrid";
import ProductDetail from "@/components/ProductDetail";
import { jsonLd, productLd } from "@/lib/jsonld";

export async function generateStaticParams() {
  const products = await getCatalog();
  /* L'export statique exige au moins un chemin : quand le catalogue
     Shopify est encore vide, on génère une page d'attente. */
  if (products.length === 0) return [{ slug: "a-venir" }];
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);

  if (!product) {
    return (
      <main className="grid min-h-[60dvh] place-items-center px-4 py-24 text-center">
        <div className="w-full max-w-[640px] border-2 border-paper p-10 md:p-16">
          <p className="font-display text-[clamp(28px,4vw,48px)] uppercase leading-tight">
            Cette pièce arrive <span className="text-acid">bientôt.</span>
          </p>
          <p className="mt-4 text-dim">
            Elle n&apos;est pas encore en ligne — inscris-toi pour être alerté dès sa sortie.
          </p>
          <Link
            href="/#newsletter"
            className="mt-8 inline-block border-2 border-acid bg-acid px-7 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
          >
            Être alerté
          </Link>
        </div>
      </main>
    );
  }

  const catalog = await getCatalog();
  const related = catalog.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main>
      {/* SEO : fiche produit lisible par Google (prix, stock, photo). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(productLd(product)) }}
      />
      <nav aria-label="Fil d'Ariane" className="px-4 pt-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-dim md:px-12">
        <Link href="/drop" className="no-underline hover:text-acid">
          ← Le Drop
        </Link>
      </nav>

      <ProductDetail slug={slug} initial={product} />

      {related.length > 0 && (
        <section className="border-t-2 border-paper pb-24 pt-14">
          <h2 className="mb-8 px-4 font-display text-[clamp(28px,4vw,52px)] uppercase md:px-12">
            Le reste du <span className="text-outline">drop</span>
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
