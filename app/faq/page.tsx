import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import { jsonLd, faqLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes — paiement, tailles, livraison, retours, drops SORI.",
};

const s = site.shipping;

/* Questions/réponses en texte brut : servent au JSON-LD (Google) ET à
   l'affichage. Les liens sont ajoutés à l'affichage seulement. */
const FAQ: { q: string; a: string; links?: { href: string; label: string }[] }[] = [
  {
    q: "Comment fonctionnent les drops ?",
    a: `Chaque pièce SORI sort en édition limitée, en quantité fixée d'avance. Quand une taille est épuisée, elle ne revient pas : aucun restock, jamais. Le drop suivant apporte de nouvelles pièces.`,
    links: [{ href: "/drop", label: "Voir le drop en cours" }],
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Carte bancaire (Visa, Mastercard, American Express), Apple Pay et Google Pay. Le paiement est traité par Shopify, l'une des plateformes e-commerce les plus sécurisées au monde — tes données bancaires ne passent jamais par nos serveurs.",
  },
  {
    q: "Faut-il un compte pour commander ?",
    a: "Oui — la création prend une minute et te permet de suivre tes commandes, retrouver tes adresses et être livré plus vite au prochain drop.",
    links: [{ href: "/compte", label: "Créer mon compte" }],
  },
  {
    q: "Quels sont les délais et frais de livraison ?",
    a: `Expédition avec suivi (${s.zones}). Délai : ${s.delay}. Frais : ${s.flatRate.toFixed(2)} CHF pour la Suisse${s.freeFrom > 0 ? `, offerts dès ${s.freeFrom} CHF d'achat` : ""}. Les frais exacts sont confirmés au moment du paiement selon ta destination.`,
    links: [{ href: "/livraison-retours", label: "Détails livraison" }],
  },
  {
    q: "Comment choisir ma taille ?",
    a: "Les coupes SORI sont oversize : si tu hésites entre deux tailles, prends la plus petite pour un rendu ajusté, la plus grande pour un rendu ample. Toutes les mesures (poitrine, longueur, épaules, manches) sont dans le guide des tailles.",
    links: [{ href: "/guide-des-tailles", label: "Guide des tailles" }],
  },
  {
    q: "Puis-je retourner un article ?",
    a: `Oui : tu as ${s.returnDays} jours après réception pour retourner un article neuf, non porté, non lavé, avec son étiquette et son emballage d'origine. Les frais de retour sont ${s.returnCost}. Remboursement sous 14 jours après réception et contrôle.`,
    links: [{ href: "/livraison-retours", label: "Procédure de retour" }],
  },
  {
    q: "Ma taille est épuisée, que faire ?",
    a: "Aucun restock — c'est la règle des éditions limitées. Sur la fiche produit, laisse ton e-mail via « Préviens-moi du prochain drop » : tu seras averti·e en avant-première de la prochaine sortie.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Dès l'expédition, tu reçois un e-mail avec le numéro de suivi. Tu retrouves aussi toutes tes commandes et leur statut dans ton espace compte.",
    links: [{ href: "/compte", label: "Mon compte" }],
  },
  {
    q: "Comment vous contacter ?",
    a: `Par e-mail à ${site.contactEmail} ou via le formulaire de contact — réponse sous 24 h ouvrées.`,
    links: [{ href: "/contact", label: "Formulaire de contact" }],
  },
];

export default function FaqPage() {
  return (
    <main>
      {/* SEO : bloc FAQ lisible par Google (rich results). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(FAQ)) }}
      />
      <PageHeader title="FAQ" meta="Les réponses, direct" />

      <section className="mx-auto max-w-[760px] px-4 pb-24 md:px-12">
        <div className="border-2 border-paper">
          {FAQ.map((item, i) => (
            <details key={item.q} className="group border-inksoft [&:not(:last-child)]:border-b">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-bold uppercase tracking-[0.06em] transition-colors hover:text-acid [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="mr-3 font-display text-acid">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="grid h-8 w-8 flex-none place-items-center border-2 border-current text-lg transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1">
                <p className="max-w-[62ch] text-[15px] leading-relaxed text-dim">{item.a}</p>
                {item.links && (
                  <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    {item.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="text-[13px] font-bold uppercase tracking-[0.1em] text-acid underline-offset-2 hover:underline"
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-8 text-sm text-dim">
          Pas trouvé ta réponse ?{" "}
          <Link href="/contact" className="text-acid underline-offset-2 hover:underline">
            Écris-nous
          </Link>{" "}
          — on répond sous 24 h.
        </p>
      </section>
    </main>
  );
}
