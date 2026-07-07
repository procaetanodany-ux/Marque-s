import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

/* Squelette à compléter avec les informations légales réelles
   (raison sociale, SIRET, hébergeur…) avant l'ouverture des ventes. */
export default function MentionsLegalesPage() {
  return (
    <main>
      <PageHeader title="Mentions légales" />
      <section className="mx-auto grid max-w-[760px] gap-8 px-4 pb-24 text-[15px] leading-relaxed text-dim md:px-12">
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Éditeur du site</h2>
          <p>
            {site.name} — marque de vêtements.
            <br />
            Contact : {site.contactEmail}
            <br />
            <em>[Raison sociale, forme juridique, SIRET et adresse à compléter avant l&apos;ouverture des ventes.]</em>
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Hébergement</h2>
          <p>
            GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107,
            États-Unis.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Données personnelles</h2>
          <p>
            L&apos;adresse e-mail collectée via la newsletter sert uniquement à annoncer les drops
            {" "}{site.name}. Aucune donnée n&apos;est revendue. Désinscription possible à tout
            moment en répondant à un e-mail.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl uppercase text-paper">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des visuels, logos et textes de ce site sont la propriété exclusive de
            {" "}{site.name}. Toute reproduction est interdite sans autorisation écrite.
          </p>
        </div>
      </section>
    </main>
  );
}
