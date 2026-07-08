import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

/* Vendeur particulier, Suisse. Les champs entre [ ] sont à compléter
   dans content/site.ts › legal avant d'ouvrir largement les ventes. */
export default function MentionsLegalesPage() {
  return (
    <main>
      <PageHeader title="Mentions légales" />
      <section className="mx-auto grid max-w-[760px] gap-8 px-4 pb-24 text-[15px] leading-relaxed text-dim md:px-12">
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Éditeur du site</h2>
          <p>
            {site.name} — vêtements en édition limitée.
            <br />
            Responsable : {site.legal.seller}
            <br />
            {site.legal.locality} — {site.legal.country}
            <br />
            Contact : {site.contactEmail}
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Statut</h2>
          <p>
            {site.name} est exploité par un vendeur particulier. En cas d&apos;évolution vers une
            entreprise enregistrée (raison individuelle ou société), les présentes mentions seront
            mises à jour avec le numéro IDE/CHE correspondant.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Hébergement</h2>
          <p>
            Site hébergé par GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San
            Francisco, CA 94107, États-Unis. Paiements et commandes traités par Shopify
            International Ltd.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Données personnelles</h2>
          <p>
            Les données collectées (commande, formulaire de contact, newsletter) servent uniquement
            au traitement des commandes et à l&apos;information sur les sorties {site.name}. Elles ne
            sont jamais revendues. Conformément à la loi fédérale sur la protection des données
            (LPD), tu peux demander l&apos;accès, la rectification ou la suppression de tes données
            en écrivant à {site.contactEmail}. Désinscription de la newsletter possible à tout
            moment.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des visuels, logos, créations graphiques et textes de ce site sont la
            propriété exclusive de {site.name}. Toute reproduction, même partielle, est interdite
            sans autorisation écrite.
          </p>
        </div>
      </section>
    </main>
  );
}
