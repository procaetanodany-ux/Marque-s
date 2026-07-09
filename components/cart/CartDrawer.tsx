"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { useAuth } from "../account/AuthContext";
import { formatPrice } from "@/lib/commerce/types";
import { checkout, checkoutModeLabel, shopifyConfigured, shopifyDemo } from "@/lib/commerce/checkout";
import { accountsEnabled } from "@/lib/commerce/customer";
import { assetSrc } from "@/lib/basePath";

export default function CartDrawer() {
  const { lines, total, isOpen, close, setQuantity, removeLine } = useCart();
  const { customer, ready } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /* Compte obligatoire avant de commander (quand les comptes sont actifs). */
  const mustLogin = accountsEnabled && !shopifyDemo && ready && !customer;

  const onCheckout = async () => {
    setBusy(true);
    setError("");
    try {
      const { url, external } = await checkout(lines);
      if (external) {
        window.location.href = url;
      } else {
        window.location.href = url; // mailto
        setBusy(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue. Réessaie.");
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Fermer le panier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[110] bg-ink/60 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-label="Panier"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[111] flex h-dvh w-full max-w-[440px] flex-col border-l-2 border-paper bg-ink"
          >
            <header className="flex items-center justify-between border-b-2 border-paper px-6 py-4">
              <h2 className="font-display text-2xl uppercase">
                Panier <span className="text-acid">({lines.reduce((n, l) => n + l.quantity, 0)})</span>
              </h2>
              <button
                onClick={close}
                aria-label="Fermer le panier"
                className="grid h-11 w-11 place-items-center border-2 border-paper transition-colors hover:border-acid hover:bg-acid hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="m5 5 14 14M19 5 5 19" />
                </svg>
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="grid flex-1 place-items-center px-6 text-center">
                <div>
                  <p className="font-display text-3xl uppercase">Panier vide.</p>
                  <p className="mt-2 text-sm text-dim">La rue n&apos;attend pas.</p>
                  <Link
                    href="/drop"
                    onClick={close}
                    className="mt-6 inline-block border-2 border-acid bg-acid px-6 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink no-underline transition-colors hover:bg-paper hover:border-paper"
                  >
                    Voir le drop
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4">
                  {lines.map((l) => (
                    <li key={l.variantId} className="flex gap-4 border-b border-inksoft py-4">
                      <div className="h-20 w-16 flex-none overflow-hidden border-2 border-paper bg-inksoft">
                        {l.image && (
                          <img
                            src={assetSrc(l.image)}
                            alt=""
                            width={128}
                            height={160}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="font-display text-base uppercase leading-tight">{l.name}</p>
                        <p className="text-xs text-dim">Taille {l.size}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border-2 border-paper">
                            <button
                              onClick={() => setQuantity(l.variantId, l.quantity - 1)}
                              aria-label={`Réduire la quantité de ${l.name}`}
                              className="grid h-8 w-8 place-items-center hover:bg-acid hover:text-ink"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums">{l.quantity}</span>
                            <button
                              onClick={() => setQuantity(l.variantId, l.quantity + 1)}
                              aria-label={`Augmenter la quantité de ${l.name}`}
                              className="grid h-8 w-8 place-items-center hover:bg-acid hover:text-ink"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold tabular-nums">
                            {formatPrice({ amount: l.price.amount * l.quantity, currencyCode: l.price.currencyCode })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLine(l.variantId)}
                        aria-label={`Retirer ${l.name} du panier`}
                        className="self-start text-dim hover:text-acid"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>

                <footer className="border-t-2 border-paper px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.14em]">Total</span>
                    <span className="font-display text-3xl text-acid tabular-nums">{formatPrice(total)}</span>
                  </div>
                  {error && (
                    <p role="alert" className="mb-3 text-[13px] font-semibold text-[#ff5a4e]">
                      {error}
                    </p>
                  )}
                  {mustLogin ? (
                    <>
                      <Link
                        href="/compte?redirect=cart"
                        onClick={close}
                        className="block w-full border-2 border-acid bg-acid px-6 py-4 text-center text-[15px] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
                      >
                        Se connecter pour commander
                      </Link>
                      <p className="mt-3 text-center text-xs text-dim">
                        Un compte est requis pour finaliser ta commande — création en 1 minute.
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={onCheckout}
                        disabled={busy}
                        className="w-full border-2 border-acid bg-acid px-6 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper disabled:opacity-60"
                      >
                        {busy ? "Un instant…" : checkoutModeLabel}
                      </button>
                      <p className="mt-3 text-center text-xs text-dim">
                        {shopifyDemo
                          ? "Mode test : checkout sur la boutique de démonstration Shopify — aucun débit possible."
                          : shopifyConfigured
                            ? "Paiement CB, Apple Pay & Google Pay via Shopify."
                            : "La vente en ligne arrive — en attendant, ta pré-commande part par e-mail et on te répond sous 24 h."}
                      </p>
                    </>
                  )}
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
