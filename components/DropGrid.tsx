"use client";

import { motion } from "framer-motion";
import { products } from "@/lib/data";
import ProductArt from "./ProductArt";

export default function DropGrid() {
  return (
    <section id="drop" className="px-4 pb-24 md:px-12">
      <header className="flex flex-wrap items-baseline justify-between gap-4 py-20 md:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(44px,8vw,110px)] uppercase leading-none"
        >
          Drop <span className="text-outline">003</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[13px] font-semibold uppercase tracking-[0.2em] text-dim"
        >
          06 pièces / tirage unique / 12.07.2026
        </motion.p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <motion.article
            key={p.num}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 3) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            data-hover
            className={`group flex flex-col border-2 border-paper transition-colors duration-150 ${
              p.art === "star"
                ? "bg-acid text-ink hover:bg-paper"
                : "bg-ink hover:bg-acid hover:text-ink"
            } ${p.featured ? "lg:row-span-2" : ""}`}
          >
            <div
              className={`relative grid place-items-center overflow-hidden border-b-2 border-current ${
                p.featured ? "min-h-[320px] flex-1" : "aspect-[1/0.85]"
              }`}
            >
              <ProductArt
                art={p.art}
                className="w-[55%] opacity-90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-4deg] group-hover:scale-110"
              />
              <span className="absolute left-4 top-3 font-display text-[28px] opacity-35">{p.num}</span>
              <span className="absolute bottom-3 right-4 translate-y-8 text-[11px] font-bold uppercase tracking-[0.14em] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Drop 12.07 — 10:00
              </span>
            </div>
            <div className="grid gap-1.5 p-6">
              <h3 className="font-display text-2xl uppercase tracking-[0.02em]">{p.name}</h3>
              <p className="text-sm opacity-70">{p.spec}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xl font-bold tabular-nums">{p.price}</span>
                <span className="border-[1.5px] border-current px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                  {p.edition}
                </span>
              </div>
            </div>
            <a
              href="#newsletter"
              className="flex min-h-[48px] items-center justify-between border-t-2 border-current px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] no-underline"
            >
              Être alerté
              <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
