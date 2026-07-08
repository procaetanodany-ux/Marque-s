"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { looks } from "@/lib/data";
import { assetSrc } from "@/lib/basePath";
import { site } from "@/content/site";

function LookCard({ look }: { look: (typeof looks)[number] }) {
  return (
    <figure className="w-[clamp(260px,36vw,440px)] flex-none" data-hover>
      <div className="relative grid aspect-[3/4] place-items-center overflow-hidden border-2 border-paper bg-inksoft/40 transition-colors duration-150 hover:border-acid">
        <img
          src={assetSrc(look.image)}
          alt={look.imageAlt ?? look.caption}
          width={1152}
          height={922}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute bottom-4 left-4 bg-acid px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
          {site.drop.label}
        </span>
      </div>
      <figcaption className="mt-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-dim">
        {look.num} — {look.caption}
      </figcaption>
    </figure>
  );
}

function CtaCard() {
  return (
    <Link
      href="/#newsletter"
      className="grid w-[clamp(260px,36vw,440px)] flex-none place-items-center border-2 border-acid bg-acid text-ink no-underline transition-colors duration-150 hover:bg-paper"
      style={{ aspectRatio: "3/4" }}
    >
      <span className="px-8 text-center font-display text-[clamp(28px,3vw,44px)] uppercase leading-tight">
        Rejoins
        <br />
        la liste →
      </span>
    </Link>
  );
}

/* Peu de photos : rangée statique. 3+ photos : le scroll vertical
   pilote un défilement horizontal (section sticky). */
export default function Lookbook() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);
  const scrollable = looks.length >= 3;

  const header = (
    <header className="flex flex-wrap items-baseline justify-between gap-4 px-4 pb-8 md:px-12">
      <h2 className="font-display text-[clamp(44px,8vw,110px)] uppercase leading-none">
        Lookbook
      </h2>
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-dim">
        Shooting béton, lumière dure
      </p>
    </header>
  );

  if (!scrollable) {
    return (
      <section id="lookbook" className="py-16 md:py-24">
        {header}
        <div className="flex flex-wrap gap-6 px-4 md:px-12">
          {looks.map((look) => (
            <LookCard key={look.num} look={look} />
          ))}
          <CtaCard />
        </div>
      </section>
    );
  }

  return (
    <section id="lookbook" ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {header}
        <motion.div style={{ x }} className="flex gap-6 pl-4 will-change-transform md:pl-12">
          {looks.map((look) => (
            <LookCard key={look.num} look={look} />
          ))}
          <CtaCard />
        </motion.div>
      </div>
    </section>
  );
}
