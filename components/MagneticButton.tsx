"use client";

import { ReactNode, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* Bouton magnétique : attiré par le curseur, retour élastique. */
export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  type,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "submit" | "button";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.32);
    y.set((e.clientY - r.top - r.height / 2) * 0.32);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex min-h-[52px] items-center gap-2.5 border-2 border-acid bg-acid px-7 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors duration-150 hover:border-paper hover:bg-paper active:scale-95 no-underline";

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="inline-block">
      <motion.div style={{ x: sx, y: sy }}>
        {href ? (
          <Link href={href} className={`${base} ${className}`}>
            {children}
          </Link>
        ) : (
          <button type={type ?? "button"} onClick={onClick} className={`${base} ${className}`}>
            {children}
          </button>
        )}
      </motion.div>
    </div>
  );
}
