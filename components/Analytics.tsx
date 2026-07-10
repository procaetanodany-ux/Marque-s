"use client";

import Script from "next/script";
import { site } from "@/content/site";

/* Statistiques de visite via GoatCounter — gratuit, open source et SANS
   cookie : conforme nLPD/RGPD sans bannière de consentement.
   Actif seulement si un code est renseigné dans site.analytics.goatcounter
   (dashboard : https://<code>.goatcounter.com). La page « Bientôt » est
   comptée aussi : utile pour mesurer le trafic avant le lancement. */
export default function Analytics() {
  const code = site.analytics.goatcounter;
  if (!code) return null;
  return (
    <Script
      data-goatcounter={`https://${code}.goatcounter.com/count`}
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}
