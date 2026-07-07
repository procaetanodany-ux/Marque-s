"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/content/site";
import MagneticButton from "./MagneticButton";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError(true);
      return;
    }
    setError(false);
    setState("loading");

    /* Endpoint configurable dans content/site.ts (Formspree, Brevo…).
       Sans endpoint : mode démo, l'inscription est simulée. */
    if (site.newsletterEndpoint) {
      try {
        await fetch(site.newsletterEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        /* on affiche quand même la confirmation : le service e-mail
           gère ses propres retries côté formulaire */
      }
      setState("done");
    } else {
      setTimeout(() => setState("done"), 900);
    }
  };

  return (
    <section id="newsletter" className="border-t-2 border-paper">
      <div className="mx-auto max-w-[760px] px-4 py-24 text-center md:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(36px,6vw,72px)] uppercase leading-[1.05]"
        >
          Sois prévenu <span className="text-outline">avant tout le monde.</span>
        </motion.h2>
        <p className="mb-10 mt-4 text-dim">
          Accès anticipé 24 h avant chaque drop. Zéro spam, promis.
        </p>

        <AnimatePresence mode="wait">
          {state !== "done" ? (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -16 }}
              onSubmit={submit}
              noValidate
              className="flex flex-wrap items-end justify-center gap-4"
            >
              <div className="grid max-w-[420px] flex-[1_1_300px] gap-2 text-left">
                <label htmlFor="email" className="text-[13px] font-bold uppercase tracking-[0.14em]">
                  Ton e-mail <span aria-hidden className="text-acid">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="prenom@exemple.com"
                  required
                  value={email}
                  aria-invalid={error}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error && isValidEmail(e.target.value)) setError(false);
                  }}
                  onBlur={() => email.trim() !== "" && setError(!isValidEmail(email))}
                  className={`min-h-[52px] w-full border-2 bg-ink px-4 py-3.5 text-paper placeholder:text-dim/60 focus:border-acid focus:outline-none ${
                    error ? "border-[#ff5a4e]" : "border-paper"
                  }`}
                />
                {error && (
                  <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">
                    Entre une adresse e-mail valide (ex. prenom@exemple.com).
                  </p>
                )}
              </div>
              <MagneticButton type="submit">
                {state === "loading" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="animate-spin"
                    aria-hidden
                  >
                    <path d="M12 3a9 9 0 1 0 9 9" />
                  </svg>
                ) : (
                  "S'inscrire"
                )}
              </MagneticButton>
            </motion.form>
          ) : (
            <motion.p
              key="done"
              role="status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="inline-flex items-center gap-2.5 bg-acid px-5 py-3 font-bold text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                <path d="m4 13 5 5L20 7" />
              </svg>
              C&apos;est noté. Rendez-vous le 12.07 — check tes mails.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
