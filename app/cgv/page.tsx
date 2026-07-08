import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

/* CGV — droit suisse, ventes en CHF, vendeur particulier.
   Politique retour commerciale : 14 jours. */

const ARTICLES: { title: string; body: string }[] = [
  {
    title: "Article 1 — Champ d'application",
    body: `Les présentes conditions générales de vente (CGV) régissent les ventes de vêtements et accessoires de la marque ${site.name}, réalisées via le site ${site.url}. Toute commande implique l'acceptation sans réserve des présentes CGV. Les ventes sont soumises au droit suisse.`,
  },
  {
    title: "Article 2 — Prix",
    body: "Les prix sont indiqués en francs suisses (CHF), taxes comprises le cas échéant, hors frais de livraison. Les prix en vigueur sont ceux affichés au moment de la commande. Conformément à notre approche, aucune remise ni solde n'est pratiquée.",
  },
  {
    title: "Article 3 — Commande",
    body: "Les pièces sont produites en édition limitée numérotée, sans réassort. La commande est confirmée après validation du paiement. La confirmation de commande est envoyée par e-mail. Nous nous réservons le droit de refuser ou d'annuler toute commande en cas d'indisponibilité ou d'erreur manifeste de prix.",
  },
  {
    title: "Article 4 — Paiement",
    body: "Le paiement s'effectue en ligne, de manière sécurisée, via notre prestataire Shopify (carte bancaire, Apple Pay, Google Pay selon disponibilité). Les données de paiement ne transitent jamais par le site et ne sont pas conservées par le vendeur.",
  },
  {
    title: "Article 5 — Livraison",
    body: `Zones desservies : ${site.shipping.zones}. Délai indicatif : ${site.shipping.delay}. Les frais de livraison sont indiqués avant la validation de la commande. Les risques de perte ou de dommage sont transférés au client à la remise du colis au transporteur, sous réserve des dispositions légales impératives.`,
  },
  {
    title: "Article 6 — Retours et remboursement",
    body: `Bien que le droit suisse n'impose pas de droit de rétractation pour les achats en ligne, ${site.name} accepte les retours sous ${site.shipping.returnDays} jours à compter de la réception. L'article doit être retourné neuf, non porté, non lavé, avec son étiquette et son emballage d'origine. Les frais de retour sont ${site.shipping.returnCost}. Après réception et contrôle, le remboursement est effectué sous 14 jours sur le moyen de paiement d'origine. Les pièces personnalisées ne sont ni reprises ni échangées.`,
  },
  {
    title: "Article 7 — Garantie légale",
    body: "Les produits bénéficient de la garantie légale des défauts de la chose vendue prévue par le Code des obligations suisse (art. 197 et suivants CO). En cas de défaut avéré, contacte-nous : selon le cas, réparation, remplacement (dans la limite du tirage disponible) ou remboursement.",
  },
  {
    title: "Article 8 — Protection des données",
    body: `Les données personnelles sont traitées conformément à la loi fédérale sur la protection des données (LPD) et à notre politique décrite dans les mentions légales. Elles ne sont jamais revendues. Contact : ${site.contactEmail}.`,
  },
  {
    title: "Article 9 — Droit applicable et for",
    body: `Les présentes CGV sont soumises au droit suisse. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le for judiciaire est celui du domicile du vendeur, sous réserve d'un for impératif prévu par la loi en faveur du consommateur.`,
  },
];

export default function CgvPage() {
  return (
    <main>
      <PageHeader title={<>CGV</>} meta="Conditions générales de vente" />
      <section className="mx-auto grid max-w-[760px] gap-8 px-4 pb-24 text-[15px] leading-relaxed text-dim md:px-12">
        <p className="border-l-4 border-acid pl-4 text-paper">
          Ventes soumises au droit suisse, prix en CHF. Vendeur : {site.legal.seller},{" "}
          {site.legal.locality}. Contact : {site.contactEmail}.
        </p>
        {ARTICLES.map((a) => (
          <div key={a.title}>
            <h2 className="mb-2 font-display text-xl uppercase text-paper">{a.title}</h2>
            <p>{a.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
