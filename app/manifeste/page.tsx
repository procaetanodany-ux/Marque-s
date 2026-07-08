import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Manifesto from "@/components/Manifesto";

export const metadata: Metadata = {
  title: "Manifeste",
  description:
    "Le manifeste SORI : éditions limitées, zéro restock, pièces numérotées. On ne suit pas les tendances, on les écrase.",
};

export default function ManifestePage() {
  return (
    <main>
      <PageHeader title="Manifeste" meta="Est. 2026 — Paris / Partout" />

      <section className="grid gap-10 px-4 pb-20 md:grid-cols-2 md:px-12">
        <div className="grid gap-6 text-[17px] leading-relaxed text-dim">
          <p>
            <strong className="text-paper">SORI est né dans la rue, pas dans un bureau.</strong>{" "}
            Chaque pièce part d&apos;un carnet, passe par l&apos;atelier, et sort en tirage
            unique : une seule production, numérotée, puis on passe à autre chose.
          </p>
          <p>
            Pas de soldes — un vêtement bien fait ne perd pas de valeur en janvier. Pas de
            restock — la rareté n&apos;est pas un argument marketing, c&apos;est notre façon de
            produire. Pas de sur-stock qui finit brûlé.
          </p>
          <p>
            La signature, notre pièce fondatrice, est passée à l&apos;aérographe une par une. Deux
            tees ne seront jamais identiques. C&apos;est le principe : tu ne portes pas un logo, tu
            portes une pièce.
          </p>
        </div>
        <div className="grid content-start gap-6">
          <blockquote className="border-l-4 border-acid pl-6 font-display text-[clamp(24px,3vw,40px)] uppercase leading-tight">
            « Quand c&apos;est parti, c&apos;est parti. »
          </blockquote>
          <Link
            href="/drop"
            className="w-fit border-2 border-acid bg-acid px-7 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
          >
            Voir le drop en cours
          </Link>
        </div>
      </section>

      <Manifesto />
    </main>
  );
}
