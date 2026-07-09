"use client";

import { useEffect, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import ComingSoon from "./ComingSoon";

const STORAGE_KEY = "sori-access";

/* Porte « Bientôt » : masque le site tant que le visiteur n'a pas fourni
   ?access=<accessKey> (mémorisé ensuite). Désactivée quand
   site.comingSoon.enabled = false (jour du lancement). */
export default function ComingSoonGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"checking" | "locked" | "unlocked">(
    site.comingSoon.enabled ? "checking" : "unlocked",
  );

  useEffect(() => {
    if (!site.comingSoon.enabled) return;
    let unlocked = false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("access") === site.comingSoon.accessKey) {
        localStorage.setItem(STORAGE_KEY, site.comingSoon.accessKey);
        unlocked = true;
        /* on retire ?access de l'URL sans recharger */
        params.delete("access");
        const clean = window.location.pathname + (params.toString() ? `?${params}` : "") + window.location.hash;
        window.history.replaceState(null, "", clean);
      } else if (localStorage.getItem(STORAGE_KEY) === site.comingSoon.accessKey) {
        unlocked = true;
      }
    } catch {
      /* stockage indisponible : on reste verrouillé */
    }
    setState(unlocked ? "unlocked" : "locked");
  }, []);

  if (state === "unlocked") return <>{children}</>;
  if (state === "locked") return <ComingSoon />;
  /* "checking" : écran noir bref le temps de lire l'accès (évite le flash). */
  return <div className="min-h-dvh bg-ink" />;
}
