"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import type { UserError } from "@/lib/commerce/customer";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const inputCls =
  "min-h-[52px] w-full border-2 border-paper bg-ink px-4 py-3.5 text-paper placeholder:text-dim/60 focus:border-acid focus:outline-none";
const labelCls = "text-[13px] font-bold uppercase tracking-[0.14em]";
const btnCls =
  "w-full border-2 border-acid bg-acid px-6 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-paper hover:bg-paper disabled:opacity-60";

function ErrorList({ errors }: { errors: UserError[] }) {
  if (!errors.length) return null;
  return (
    <div role="alert" className="border-2 border-[#ff5a4e] px-4 py-3 text-[13px] font-semibold text-[#ff5a4e]">
      {errors.map((e, i) => (
        <p key={i}>{e.message}</p>
      ))}
    </div>
  );
}

type Tab = "login" | "register" | "recover";

export default function AuthForms() {
  const { login, register, recover, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [errors, setErrors] = useState<UserError[]>([]);
  const [recovered, setRecovered] = useState(false);

  // champs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [optin, setOptin] = useState(true);

  const switchTab = (t: Tab) => {
    setTab(t);
    setErrors([]);
    setRecovered(false);
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!isValidEmail(email) || !password) {
      setErrors([{ message: "E-mail ou mot de passe manquant." }]);
      return;
    }
    const res = await login(email, password);
    if (!res.ok) setErrors(res.errors ?? [{ message: "Connexion impossible." }]);
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!firstName.trim() || !isValidEmail(email) || password.length < 5) {
      setErrors([{ message: "Vérifie ton prénom, ton e-mail et un mot de passe d'au moins 5 caractères." }]);
      return;
    }
    const res = await register({ firstName, lastName, email, password, acceptsMarketing: optin });
    if (!res.ok) setErrors(res.errors ?? [{ message: "Création impossible." }]);
  };

  const onRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!isValidEmail(email)) {
      setErrors([{ message: "Entre une adresse e-mail valide." }]);
      return;
    }
    const res = await recover(email);
    if (res.ok) setRecovered(true);
    else setErrors(res.errors ?? [{ message: "Envoi impossible." }]);
  };

  return (
    <div className="mx-auto w-full max-w-[460px]">
      {tab !== "recover" && (
        <div className="mb-8 grid grid-cols-2 border-2 border-paper">
          <button
            onClick={() => switchTab("login")}
            className={`py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
              tab === "login" ? "bg-acid text-ink" : "hover:text-acid"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => switchTab("register")}
            className={`border-l-2 border-paper py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
              tab === "register" ? "bg-acid text-ink" : "hover:text-acid"
            }`}
          >
            Créer un compte
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "login" && (
            <form onSubmit={onLogin} noValidate className="grid gap-4">
              <ErrorList errors={errors} />
              <div className="grid gap-2">
                <label htmlFor="l-email" className={labelCls}>E-mail</label>
                <input id="l-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="prenom@exemple.com" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="l-pass" className={labelCls}>Mot de passe</label>
                <input id="l-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>
              <button type="button" onClick={() => switchTab("recover")} className="text-[13px] font-semibold uppercase tracking-[0.1em] text-dim hover:text-acid">
                Mot de passe oublié ?
              </button>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={onRegister} noValidate className="grid gap-4">
              <ErrorList errors={errors} />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="r-first" className={labelCls}>Prénom</label>
                  <input id="r-first" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} placeholder="Prénom" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="r-last" className={labelCls}>Nom</label>
                  <input id="r-last" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} placeholder="Nom" />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="r-email" className={labelCls}>E-mail</label>
                <input id="r-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="prenom@exemple.com" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="r-pass" className={labelCls}>Mot de passe</label>
                <input id="r-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Au moins 5 caractères" />
              </div>
              <label className="flex items-start gap-3 text-[13px] text-dim">
                <input type="checkbox" checked={optin} onChange={(e) => setOptin(e.target.checked)} className="mt-1 h-4 w-4 accent-[#d8f000]" />
                Je veux être prévenu des prochains drops en avant-première.
              </label>
              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Création…" : "Créer mon compte"}
              </button>
            </form>
          )}

          {tab === "recover" && (
            <form onSubmit={onRecover} noValidate className="grid gap-4">
              <button type="button" onClick={() => switchTab("login")} className="w-fit text-[13px] font-semibold uppercase tracking-[0.1em] text-dim hover:text-acid">
                ← Retour
              </button>
              <h2 className="font-display text-2xl uppercase">Mot de passe oublié</h2>
              {recovered ? (
                <p className="inline-flex items-center gap-2.5 bg-acid px-5 py-4 font-bold text-ink">
                  E-mail envoyé — regarde ta boîte pour réinitialiser.
                </p>
              ) : (
                <>
                  <ErrorList errors={errors} />
                  <p className="text-[14px] text-dim">On t&apos;envoie un lien de réinitialisation par e-mail.</p>
                  <div className="grid gap-2">
                    <label htmlFor="rec-email" className={labelCls}>E-mail</label>
                    <input id="rec-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="prenom@exemple.com" />
                  </div>
                  <button type="submit" disabled={loading} className={btnCls}>
                    {loading ? "Envoi…" : "Envoyer le lien"}
                  </button>
                </>
              )}
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
