import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog, getCatalogProduct } from "@/lib/commerce/catalog";
import { formatPrice, STATUS_LABEL } from "@/lib/commerce/types";
import ProductGallery from "@/components/ProductGallery";
import ProductGrid from "@/components/ProductGrid";
import AddToCart from "@/components/AddToCart";
import ReassuranceBar from "@/components/ReassuranceBar";

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
      <nav aria-label="Fil d'Ariane" className="px-4 pt-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-dim md:px-12">
        <Link href="/drop" className="no-underline hover:text-acid">
          ← Le Drop
        </Link>
      </nav>

      <section className="grid gap-10 px-4 py-10 md:grid-cols-2 md:px-12 md:py-14 lg:gap-16">
        <ProductGallery product={product} />

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

          <p className="max-w-[52ch] text-[16px] leading-relaxed text-dim">{product.description}</p>

          <AddToCart product={product} />

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
