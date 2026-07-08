"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./cart/CartContext";
import { customerAccountUrl } from "@/lib/commerce/shopify";

const LINKS = [
  { href: "/drop", label: "Le Drop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/manifeste", label: "Manifeste" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { count, open: openCart } = useCart();
  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => pathname === href || pathname === `${href}/`;

  /* L'overlay est rendu dans <body> : le backdrop-filter du header
     créerait sinon un containing block qui casse position:fixed. */
  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-8 bg-ink/95 backdrop-blur-xl md:hidden"
          aria-label="Menu mobile"
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center border-2 border-paper"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
          </button>
          {LINKS.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`font-display text-4xl uppercase tracking-[0.06em] no-underline hover:text-acid ${
                  isActive(l.href) ? "text-acid" : ""
                }`}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-[100] flex items-center justify-between gap-6 border-b-2 border-paper bg-ink/90 px-4 py-3.5 backdrop-blur-md md:px-12"
    >
      <Link
        href="/"
        className="hover-glitch font-display text-[clamp(20px,2.4vw,26px)] uppercase tracking-[0.04em] no-underline"
        aria-label="SORI, retour à l'accueil"
      >
        SORI<sup className="text-[0.5em] text-acid">®</sup>
      </Link>

      <nav aria-label="Navigation principale" className="hidden gap-10 md:flex">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`group relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] no-underline transition-colors duration-150 hover:text-acid ${
              isActive(l.href) ? "text-acid" : ""
            }`}
          >
            {l.label}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-acid transition-all duration-200 group-hover:w-full ${
                isActive(l.href) ? "w-full" : "w-0"
              }`}
            />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {customerAccountUrl && (
          <a
            href={customerAccountUrl}
            aria-label="Mon compte — connexion et suivi de commandes"
            className="hidden h-11 w-11 place-items-center border-2 border-paper transition-colors duration-150 hover:border-acid hover:bg-acid hover:text-ink sm:grid"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
          </a>
        )}
        <button
          onClick={openCart}
          aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
          className="relative grid h-11 w-11 place-items-center border-2 border-paper transition-colors duration-150 hover:border-acid hover:bg-acid hover:text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 7h12l1.5 13h-15L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span
            aria-hidden
            className={`absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center text-[11px] font-bold ${
              count > 0 ? "bg-acid text-ink" : "bg-inksoft text-dim"
            }`}
          >
            {count}
          </span>
        </button>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="z-[102] flex h-11 w-11 flex-col items-center justify-center gap-[7px] border-2 border-paper md:hidden"
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 4.5 : 0 }} className="h-0.5 w-5 bg-paper" />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -4.5 : 0 }} className="h-0.5 w-5 bg-paper" />
        </button>
      </div>

      {mounted && createPortal(overlay, document.body)}
    </motion.header>
  );
}
