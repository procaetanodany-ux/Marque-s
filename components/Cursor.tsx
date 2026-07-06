"use client";

import { useEffect, useRef } from "react";

/* Curseur custom : point acide + anneau traînant.
   Grossit sur les éléments interactifs. Désactivé au toucher / reduced motion. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("has-cursor");
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let x = -100, y = -100, rx = -100, ry = -100;
    let hovering = false;
    let rafId: number;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      hovering = !!t.closest("a, button, input, [data-hover]");
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      const s = hovering ? 2.2 : 1;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(${s})`;
      ring.style.borderColor = hovering ? "var(--color-acid)" : "var(--color-paper)";
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[999] hidden md:block">
      <div ref={dotRef} className="absolute h-2 w-2 bg-acid" />
      <div
        ref={ringRef}
        className="absolute h-10 w-10 rounded-full border-2 border-paper transition-[border-color] duration-150"
      />
    </div>
  );
}
