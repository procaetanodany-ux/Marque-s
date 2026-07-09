"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";

const LETTERS = "SORI".split("");
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/* Page « Bientôt » — animation SORI + inscription pour être prévenu. */
export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "[SORI] Liste d'attente — lancement",
          _template: "table",
          _captcha: "false",
        }),
      });
    } catch {
      /* on confirme quand même */
    }
    setState("done");
  };

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-ink px-6 text-center">
      {/* halo acide */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 aspect-square w-[70vw] max-w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,240,0,0.15)_0%,transparent_68%)]"
      />

      <div className="w-full max-w-[560px]">
        <div className="flex justify-center overflow-hidden font-display text-[clamp(64px,16vw,180px)] leading-none">
          {LETTERS.map((l, i) => (
            <motion.span
              key={i}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {l}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-[13px] font-bold uppercase tracking-[0.3em] text-acid"
        >
          Bientôt
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mx-auto mt-4 max-w-[42ch] text-[16px] text-dim"
        >
          {site.tagline} Le premier drop arrive. Laisse ton e-mail pour être prévenu·e
          en avant-première — et rien d&apos;autre.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          {state === "done" ? (
            <p className="inline-flex items-center gap-2.5 bg-acid px-5 py-4 font-bold text-ink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                <path d="m4 13 5 5L20 7" />
              </svg>
              C&apos;est noté — on te préviens au lancement.
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="mx-auto flex max-w-[440px] flex-col gap-3 sm:flex-row">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="ton@email.com"
                aria-label="Ton e-mail"
                className={`min-h-[52px] flex-1 border-2 bg-ink px-4 py-3.5 text-paper placeholder:text-dim/60 focus:border-acid focus:outline-none ${
                  state === "error" ? "border-[#ff5a4e]" : "border-paper"
                }`}
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="min-h-[52px] border-2 border-acid bg-acid px-7 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper disabled:opacity-60"
              >
                {state === "loading" ? "…" : "Me prévenir"}
              </button>
            </form>
          )}
          {state === "error" && (
            <p role="alert" className="mt-2 text-[13px] font-semibold text-[#ff5a4e]">
              Entre une adresse e-mail valide.
            </p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-dim/70"
        >
          © 2026 SORI
        </motion.p>
      </div>
    </main>
  );
}
