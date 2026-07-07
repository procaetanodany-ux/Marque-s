import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

/* CGV — squelette conforme e-commerce FR à compléter avec les
   informations légales réelles avant l'ouverture des ventes CB. */

const ARTICLES: { title: string; body: string }[] = [
  {
    title: "Article 1 — Objet",
    body: `Les présentes conditions générales de vente régissent les ventes de vêtements et accessoires de la marque ${site.name} réalisées via le site ${site.url} (ci-après « le Site »). Toute commande implique l'acceptation sans réserve des présentes CGV.`,
  },
  {
    title: "Article 2 — Prix",
    body: "Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. SORI se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés au tarif en vigueur au moment de la commande. Conformément à notre manifeste, aucune remise ni solde n'est pratiquée.",
  },
  {
    title: "Article 3 — Commande et pré-commande",
    body: "Les pièces sont produites en édition limitée numérotée, sans restock. En période de pré-commande, la commande est confirmée après validation du paiement par retour d'e-mail sous 24 h. En vente directe, la commande est confirmée au paiement via notre prestataire (Shopify Payments).",
  },
  {
    title: "Article 4 — Paiement",
    body: "Le paiement s'effectue par carte bancaire, Apple Pay ou Google Pay via un checkout sécurisé, ou selon les modalités convenues par e-mail en période de pré-commande (virement). Les données bancaires ne transitent jamais par le Site.",
  },
  {
    title: "Article 5 — Livraison",
    body: "Livraison mondiale, suivie. Les délais indicatifs sont de 5 à 10 jours ouvrés pour la France métropolitaine après expédition. Les frais de livraison sont précisés avant la validation de la commande. [Transporteurs et grille tarifaire à compléter.]",
  },
  {
    title: "Article 6 — Droit de rétractation",
    body: "Conformément à l'article L.221-18 du Code de la consommation, tu disposes de 14 jours à compter de la réception pour exercer ton droit de rétractation, sans avoir à motiver ta décision. Le produit doit être retourné neuf, non porté, dans son emballage d'origine. Les frais de retour restent à ta charge. Remboursement sous 14 jours après réception du retour.",
  },
  {
    title: "Article 7 — Garanties",
    body: "Tous nos produits bénéficient de la garantie légale de conformité (art. L.217-3 et s. du Code de la consommation) et de la garantie contre les vices cachés (art. 1641 et s. du Code civil). En cas de défaut, contacte-nous : réparation, remplacement (dans la limite du tirage) ou remboursement.",
  },
  {
    title: "Article 8 — Données personnelles",
    body: "Les données collectées (commande, newsletter, contact) servent uniquement au traitement des commandes et à l'information sur les drops. Elles ne sont jamais revendues. Droits d'accès, de rectification et de suppression : écris-nous à l'adresse de contact.",
  },
  {
    title: "Article 9 — Droit applicable",
    body: "Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. Plateforme européenne de règlement des litiges : ec.europa.eu/consumers/odr. [Tribunal compétent et médiateur de la consommation à compléter.]",
  },
];

export default function CgvPage() {
  return (
    <main>
      <PageHeader title={<>CGV</>} meta="Conditions générales de vente" />
      <section className="mx-auto grid max-w-[760px] gap-8 px-4 pb-24 text-[15px] leading-relaxed text-dim md:px-12">
        <p className="border-l-4 border-acid pl-4 text-paper">
          Version en vigueur — à compléter avec la raison sociale et le SIRET avant
          l&apos;ouverture des ventes par carte bancaire. Contact : {site.contactEmail}
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
