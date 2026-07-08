import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Livraison et politique de retours SORI — délais, frais, conditions.",
};

const shipping = site.shipping;

export default function LivraisonRetoursPage() {
  return (
    <main>
      <PageHeader title={<>Livraison<br />&amp; retours</>} meta="Tout ce qu'il faut savoir" />

      <section className="mx-auto grid max-w-[760px] gap-10 px-4 pb-24 md:px-12">
        <div>
          <h2 className="mb-4 font-display text-2xl uppercase text-paper">Livraison</h2>
          <ul className="grid gap-0 border-2 border-paper text-[14px] font-semibold uppercase tracking-[0.08em]">
            <li className="flex justify-between gap-4 border-b border-inksoft px-4 py-3">
              <span className="text-dim">Zones</span>
              <span className="text-right">{shipping.zones}</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-inksoft px-4 py-3">
              <span className="text-dim">Délai</span>
              <span className="text-right">{shipping.delay}</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-inksoft px-4 py-3">
              <span className="text-dim">Frais (Suisse)</span>
              <span className="text-right tabular-nums">
                {shipping.flatRate.toFixed(2)} CHF
              </span>
            </li>
            {shipping.freeFrom > 0 && (
              <li className="flex justify-between gap-4 px-4 py-3">
                <span className="text-dim">Offerte dès</span>
                <span className="text-right tabular-nums text-acid">
                  {shipping.freeFrom} CHF d&apos;achat
                </span>
              </li>
            )}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-dim">
            Chaque commande est expédiée avec suivi. Un e-mail de confirmation avec le numéro de
            suivi t&apos;est envoyé dès le départ du colis. Les frais exacts sont confirmés au
            paiement selon ta destination.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-display text-2xl uppercase text-paper">Retours</h2>
          <p className="text-[15px] leading-relaxed text-dim">
            Tu disposes de <strong className="text-paper">{shipping.returnDays} jours</strong> après
            réception pour nous retourner un article qui ne te convient pas. Il doit être{" "}
            <strong className="text-paper">neuf, non porté, non lavé</strong>, avec son étiquette et
            son emballage d&apos;origine. Les frais de retour sont {shipping.returnCost}.
          </p>
          <ol className="mt-4 grid gap-3 text-[15px] leading-relaxed text-dim">
            <li>
              <span className="mr-2 font-display text-acid">01</span> Écris-nous à{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-acid underline-offset-2 hover:underline">
                {site.contactEmail}
              </a>{" "}
              avec ton numéro de commande.
            </li>
            <li>
              <span className="mr-2 font-display text-acid">02</span> On te confirme l&apos;adresse
              de retour sous 24 h.
            </li>
            <li>
              <span className="mr-2 font-display text-acid">03</span> Dès réception et contrôle, tu
              es remboursé sous 14 jours sur ton moyen de paiement.
            </li>
          </ol>
          <p className="mt-4 text-sm text-dim">
            Les pièces personnalisées ne sont ni reprises ni échangées. Détails complets dans nos{" "}
            <Link href="/cgv" className="text-acid underline-offset-2 hover:underline">
              CGV
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
