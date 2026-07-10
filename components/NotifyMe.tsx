"use client";

import { useState } from "react";
import { site } from "@/content/site";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/* Alerte e-mail — la marque n'a « aucun restock », donc la promesse est
   d'être prévenu·e du PROCHAIN DROP (pas d'un retour en stock).
   Envoi via FormSubmit (même relais que newsletter/contact) : l'e-mail
   arrive chez SORI avec le produit + la taille demandée. */
export default function NotifyMe({
  productName,
  sizes,
}: {
  productName: string;
  /* Tailles épuisées proposées dans le select ; vide = produit entier. */
  sizes?: string[];
}) {
  const [email, setEmail] = useState("");
  const [size, setSize] = useState(sizes?.[0] ?? "");
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
          piece: productName,
          taille: size || "toutes",
          _subject: `[SORI] Alerte drop — ${productName}${size ? ` taille ${size}` : ""}`,
          _template: "table",
          _captcha: "false",
        }),
      });
    } catch {
      /* on confirme quand même : FormSubmit répond parfois hors CORS */
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <p className="inline-flex items-center gap-2.5 bg-acid px-4 py-3 text-[14px] font-bold text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
          <path d="m4 13 5 5L20 7" />
        </svg>
        C&apos;est noté — tu seras prévenu·e en premier.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-2.5">
      {sizes && sizes.length > 1 && (
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          aria-label="Taille souhaitée"
          className="min-h-[48px] border-2 border-paper bg-ink px-3 text-[14px] font-bold uppercase text-paper focus:border-acid focus:outline-none"
        >
          {sizes.map((s) => (
            <option key={s} value={s}>
              Taille {s}
            </option>
          ))}
        </select>
      )}
      <div className="flex flex-col gap-2.5 sm:flex-row">
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
          className={`min-h-[48px] flex-1 border-2 bg-ink px-3.5 text-[14px] text-paper placeholder:text-dim/60 focus:border-acid focus:outline-none ${
            state === "error" ? "border-[#ff5a4e]" : "border-paper"
          }`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="min-h-[48px] border-2 border-acid bg-acid px-5 text-[13px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper disabled:opacity-60"
        >
          {state === "loading" ? "…" : "Me prévenir"}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">
          Entre une adresse e-mail valide.
        </p>
      )}
    </form>
  );
}
