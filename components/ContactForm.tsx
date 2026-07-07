"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/content/site";

const SUBJECTS = ["Commande", "Presse", "Collaboration", "SAV", "Autre"];

type FieldErrors = { name?: string; email?: string; message?: string };
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((err) => ({ ...err, [k]: undefined }));
  };

  const validate = (): boolean => {
    const err: FieldErrors = {};
    if (values.name.trim().length < 2) err.name = "Dis-nous ton nom.";
    if (!isValidEmail(values.email)) err.email = "Entre une adresse e-mail valide.";
    if (values.message.trim().length < 10) err.message = "Ton message est un peu court (10 caractères min).";
    setErrors(err);
    const first = Object.keys(err)[0];
    if (first) document.getElementById(`cf-${first}`)?.focus();
    return !first;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("loading");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          _subject: `[SORI Contact] ${values.subject} — ${values.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <motion.p
        role="status"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2.5 bg-acid px-5 py-4 font-bold text-ink"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
          <path d="m4 13 5 5L20 7" />
        </svg>
        Message envoyé. On te répond sous 24 h.
      </motion.p>
    );
  }

  const inputCls = (invalid?: string) =>
    `min-h-[52px] w-full border-2 bg-ink px-4 py-3.5 text-paper placeholder:text-dim/60 focus:border-acid focus:outline-none ${
      invalid ? "border-[#ff5a4e]" : "border-paper"
    }`;

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="cf-name" className="text-[13px] font-bold uppercase tracking-[0.14em]">
            Nom <span aria-hidden className="text-acid">*</span>
          </label>
          <input
            id="cf-name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            className={inputCls(errors.name)}
            placeholder="Ton nom"
          />
          {errors.name && (
            <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">{errors.name}</p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="cf-email" className="text-[13px] font-bold uppercase tracking-[0.14em]">
            E-mail <span aria-hidden className="text-acid">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            className={inputCls(errors.email)}
            placeholder="prenom@exemple.com"
          />
          {errors.email && (
            <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="cf-subject" className="text-[13px] font-bold uppercase tracking-[0.14em]">
          Sujet
        </label>
        <select id="cf-subject" value={values.subject} onChange={set("subject")} className={inputCls()}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s} className="bg-ink">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="cf-message" className="text-[13px] font-bold uppercase tracking-[0.14em]">
          Message <span aria-hidden className="text-acid">*</span>
        </label>
        <textarea
          id="cf-message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          className={`${inputCls(errors.message)} resize-y`}
          placeholder="Dis-nous tout."
        />
        {errors.message && (
          <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">{errors.message}</p>
        )}
      </div>

      {state === "error" && (
        <p role="alert" className="border-2 border-[#ff5a4e] px-4 py-3 text-[13px] font-semibold text-[#ff5a4e]">
          L&apos;envoi a échoué. Réessaie, ou écris-nous directement : {site.contactEmail}
        </p>
      )}

      <AnimatePresence>
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-fit border-2 border-acid bg-acid px-8 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper active:scale-[0.98] disabled:opacity-60"
        >
          {state === "loading" ? "Envoi…" : "Envoyer"}
        </button>
      </AnimatePresence>
    </form>
  );
}
