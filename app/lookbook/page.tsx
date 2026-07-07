import type { Metadata } from "next";
import Link from "next/link";
import { looks } from "@/lib/data";
import { withBase } from "@/lib/basePath";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Lookbook SORI — shooting béton, lumière dure. Drop 003.",
};

export default function LookbookPage() {
  return (
    <main>
      <PageHeader title="Lookbook" meta="Shooting béton, lumière dure — Drop 003" />
      <div className="grid gap-6 px-4 pb-24 sm:grid-cols-2 md:px-12 lg:grid-cols-3">
        {looks.map((look) => (
          <figure key={look.num}>
            <div
              className={`pattern-${look.pattern} relative grid aspect-[3/4] place-items-center overflow-hidden border-2 border-paper transition-colors duration-150 hover:border-acid`}
              data-hover
            >
              {look.image ? (
                <img
                  src={withBase(look.image)}
                  alt={look.imageAlt ?? look.caption}
                  width={1152}
                  height={922}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <span className="text-outline font-display text-[clamp(48px,6vw,88px)] opacity-80">
                  {look.num}
                </span>
              )}
              <span className="absolute bottom-4 left-4 bg-acid px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                Drop 003
              </span>
            </div>
            <figcaption className="mt-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-dim">
              {look.num} — {look.caption}
            </figcaption>
          </figure>
        ))}
        <Link
          href="/drop"
          className="grid aspect-[3/4] place-items-center border-2 border-acid bg-acid text-ink no-underline transition-colors duration-150 hover:bg-paper"
        >
          <span className="px-8 text-center font-display text-[clamp(28px,3vw,44px)] uppercase leading-tight">
            Shop
            <br />
            le drop →
          </span>
        </Link>
      </div>
    </main>
  );
}
