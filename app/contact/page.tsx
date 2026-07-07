import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte SORI — questions, commandes, presse, collaborations.",
};

const FAQ = [
  {
    q: "Quand a lieu le prochain drop ?",
    a: "Le Drop 003 sort le 12.07 à 10h00 (heure de Paris). Inscris-toi à la newsletter pour un accès anticipé de 24 h.",
  },
  {
    q: "Il y aura un restock ?",
    a: "Non, jamais. Chaque pièce est tirée une seule fois, numérotée. Quand c'est parti, c'est parti.",
  },
  {
    q: "Comment fonctionne la pré-commande ?",
    a: "Ajoute tes pièces au panier puis valide : ta demande nous arrive directement, on te confirme la disponibilité et le paiement sous 24 h.",
  },
  {
    q: "Vous livrez où ?",
    a: "Partout. Livraison suivie, mondiale. Les frais sont confirmés à la commande.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <PageHeader title="Contact" meta="On répond vite. Promis." />

      <section className="grid gap-12 px-4 pb-20 md:grid-cols-2 md:px-12">
        <div className="grid content-start gap-8">
          <div>
            <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.3em] text-dim">
              Écris-nous
            </h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.3em] text-dim">
              Ou par e-mail direct
            </h2>
            <a
              href={`mailto:${site.contactEmail}`}
              className="break-all font-display text-[clamp(18px,2.2vw,28px)] uppercase no-underline hover:text-acid"
            >
              {site.contactEmail}
            </a>
          </div>
          <div>
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.3em] text-dim">
              Réseaux
            </h2>
            <div className="flex gap-3">
              {[
                { label: "Instagram", href: site.socials.instagram },
                { label: "TikTok", href: site.socials.tiktok },
                { label: "X", href: site.socials.x },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="border-2 border-paper px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] no-underline transition-colors hover:border-acid hover:bg-acid hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.3em] text-dim">FAQ</h2>
          <div className="grid gap-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group border-2 border-paper open:border-acid"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-lg uppercase [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden className="text-acid transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-inksoft px-5 py-4 text-[15px] leading-relaxed text-dim">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
