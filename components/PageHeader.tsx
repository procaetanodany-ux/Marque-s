"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageHeader({
  title,
  meta,
}: {
  title: ReactNode;
  meta?: string;
}) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-4 px-4 pb-10 pt-16 md:px-12 md:pb-14 md:pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[clamp(44px,8vw,110px)] uppercase leading-none"
      >
        {title}
      </motion.h1>
      {meta && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[13px] font-semibold uppercase tracking-[0.2em] text-dim"
        >
          {meta}
        </motion.p>
      )}
    </header>
  );
}
