import Link from "next/link";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import BigMarquee from "@/components/BigMarquee";
import ProductGrid from "@/components/ProductGrid";
import Manifesto from "@/components/Manifesto";
import Lookbook from "@/components/Lookbook";
import Countdown from "@/components/Countdown";
import Newsletter from "@/components/Newsletter";
import { products } from "@/content/products";
import { site } from "@/content/site";

export default function Home() {
  const preview = products.slice(0, 3);

  return (
    <div id="top">
      <Preloader />
      <main>
        <Hero />
        <BigMarquee
          items={["HOODIES — TEES — CARGOS — VESTES — ACCESSOIRES —"]}
          duration={22}
        />

        <section id="drop" className="pb-16 pt-4">
          <header className="flex flex-wrap items-baseline justify-between gap-4 px-4 py-14 md:px-12 md:py-20">
            <h2 className="font-display text-[clamp(44px,8vw,110px)] uppercase leading-none">
              Drop <span className="text-outline">{site.drop.number}</span>
            </h2>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-dim">
              {site.drop.pieces}
            </p>
          </header>
          <ProductGrid products={preview} />
          <div className="px-4 pt-10 text-center md:px-12">
            <Link
              href="/drop"
              className="inline-block border-2 border-paper px-8 py-4 text-[15px] font-bold uppercase tracking-[0.1em] no-underline transition-colors hover:border-acid hover:bg-acid hover:text-ink"
            >
              Voir tout le drop →
            </Link>
          </div>
        </section>

        <Manifesto />
        <Lookbook />
        <Countdown />
        <Newsletter />
      </main>
    </div>
  );
}
