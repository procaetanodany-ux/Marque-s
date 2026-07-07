"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";

/* Hero kinetic — structure inspirée du composant 21st.dev « Hero — Bold Urban »
   (clip-path diagonal, barre d'accent, stat en callout), restylé SORI. */

function KineticLine({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span className="flex flex-wrap">
        {text.split("").map((c, i) => (
          <motion.span
            key={i}
            initial={{ y: "115%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ delay: delay + i * 0.03, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yBlob = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[94dvh] flex-col justify-center overflow-hidden px-4 pb-24 pt-20 md:px-12"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 96%, 0 100%)" }}
    >
      {/* Barre d'accent (pattern Hero Bold Urban) */}
      <div className="absolute left-0 top-0 h-1 w-1/3 bg-acid" />

      {/* Fond : grille + halo parallaxe */}
      <div className="hero-grid-bg absolute inset-0 -z-10" aria-hidden />
      <motion.div
        aria-hidden
        style={{ y: yBlob }}
        className="absolute -right-[10%] top-[10%] -z-10 aspect-square w-[46vw] max-w-[640px] rounded-full bg-[radial-gradient(circle,rgba(216,240,0,0.22)_0%,transparent_68%)]"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="mb-6 text-[13px] font-semibold uppercase tracking-[0.3em] text-dim"
      >
        Est. 2026 — Paris / Partout
      </motion.p>

      <motion.h1
        style={{ y: yTitle, opacity }}
        className="font-display text-[clamp(52px,12vw,170px)] uppercase leading-[0.92] tracking-[0.01em]"
      >
        <KineticLine text="Porte" delay={2.0} />
        <KineticLine text="la rue." delay={2.15} className="text-outline ml-[clamp(24px,8vw,140px)]" />
        <KineticLine text="Pas la mode." delay={2.3} className="ml-[clamp(8px,3vw,56px)] text-acid" />
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 flex flex-wrap items-end gap-10"
      >
        <p className="max-w-[46ch] text-[17px] text-dim">
          Streetwear brut, coupé lourd, tiré en série limitée.
          <br />
          Quand c&apos;est parti, c&apos;est parti. Aucun restock, jamais.
        </p>
        <MagneticButton href="/drop">
          Voir le drop 003
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </MagneticButton>
        {/* Stat callout (pattern Hero Bold Urban) */}
        <div className="ml-auto hidden text-right lg:block">
          <p className="font-display text-6xl text-acid">675</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-dim">
            pièces numérotées, pas une de plus
          </p>
        </div>
      </motion.div>

      {/* Badge rotatif */}
      <motion.div
        aria-hidden
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 3.1, type: "spring", stiffness: 160, damping: 14 }}
        className="absolute right-[clamp(16px,6vw,90px)] top-[18%] hidden aspect-square w-[clamp(96px,12vw,150px)] place-items-center md:grid"
      >
        <svg viewBox="0 0 120 120" className="animate-spin-slow absolute inset-0">
          <defs>
            <path id="circlePath" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text className="fill-paper text-[10.5px] font-bold tracking-[0.22em]">
            <textPath href="#circlePath">ÉDITION LIMITÉE ★ SORI ★ DROP 003</textPath>
          </text>
        </svg>
        <span className="font-display text-[clamp(30px,4vw,48px)] text-acid">S</span>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-10 w-6 border-2 border-dim"
        >
          <div className="mx-auto mt-1.5 h-2 w-0.5 bg-acid" />
        </motion.div>
      </motion.div>
    </section>
  );
}
