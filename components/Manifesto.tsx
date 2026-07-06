"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const TEXT =
  "On ne suit pas les tendances, on les écrase. Chaque pièce est tirée une seule fois, numérotée, puis l'atelier passe à autre chose. Pas de soldes, pas de restock, pas de regrets.";

const STATS = [
  { value: "100%", label: "coton bio certifié" },
  { value: "0", label: "restock, jamais" },
  { value: "03", label: "drops par an" },
  { value: "675", label: "pièces numérotées" },
];

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

/* Le manifeste s'allume mot par mot au fil du scroll. */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = TEXT.split(" ");

  return (
    <section id="manifeste" className="border-y-2 border-ink bg-acid text-ink">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-12 md:py-32">
        <p className="mb-6 text-[13px] font-bold uppercase tracking-[0.3em]">Manifeste</p>
        <p
          ref={ref}
          className="max-w-[24ch] font-display text-[clamp(28px,4.6vw,60px)] uppercase leading-[1.12]"
        >
          {words.map((w, i) => (
            <Word
              key={i}
              word={w}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            />
          ))}
        </p>

        <ul className="mt-16 grid grid-cols-2 gap-6 border-t-2 border-ink pt-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <strong className="block font-display text-[clamp(36px,5vw,64px)] leading-none tabular-nums">
                {s.value}
              </strong>
              <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{s.label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
