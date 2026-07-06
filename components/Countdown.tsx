"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DROP_DATE } from "@/lib/data";

type Parts = { d: string; h: string; m: string; s: string };

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

function compute(): Parts | null {
  const diff = new Date(DROP_DATE).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: pad(Math.floor(diff / 864e5)),
    h: pad(Math.floor(diff / 36e5) % 24),
    m: pad(Math.floor(diff / 6e4) % 60),
    s: pad(Math.floor(diff / 1e3) % 60),
  };
}

function Digit({ value }: { value: string }) {
  return (
    <span className="relative block h-[1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Countdown() {
  const [parts, setParts] = useState<Parts | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const tick = () => {
      const p = compute();
      if (!p) setLive(true);
      setParts(p);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cells: { key: keyof Parts; label: string }[] = [
    { key: "d", label: "jours" },
    { key: "h", label: "heures" },
    { key: "m", label: "min" },
    { key: "s", label: "sec" },
  ];

  return (
    <section
      className="border-t-2 border-paper px-4 py-24 text-center md:px-12 md:py-32"
      aria-label="Compte à rebours avant le prochain drop"
    >
      <p className="mb-8 text-sm font-bold uppercase tracking-[0.3em] text-dim">
        {live ? "Le drop est LIVE." : "Drop 003 dans"}
      </p>
      <div className="flex flex-wrap justify-center gap-3 md:gap-10" role="timer">
        {cells.map(({ key, label }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-[clamp(80px,12vw,140px)] border-2 border-paper px-4 py-4 md:px-8"
          >
            <span className="block font-display text-[clamp(40px,7vw,88px)] leading-none text-acid tabular-nums">
              <Digit value={parts ? parts[key] : "00"} />
            </span>
            <small className="text-xs font-bold uppercase tracking-[0.2em]">{label}</small>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
