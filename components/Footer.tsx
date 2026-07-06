import BigMarquee from "./BigMarquee";

const SOCIALS = [
  {
    label: "Instagram",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 6.5c1 1.8 2.6 3 4.8 3.2" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="m4 4 16 16M20 4 4 20" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-paper">
      <BigMarquee
        items={Array(6).fill("MARQUE-S® —")}
        variant="outline"
        duration={36}
      />
      <div className="grid gap-10 border-t-2 border-inksoft px-4 py-10 md:grid-cols-[2fr_1fr_1fr] md:px-12">
        <div>
          <p className="font-display text-[28px] uppercase">
            MARQUE-S<sup className="text-[0.5em] text-acid">®</sup>
          </p>
          <p className="mt-1.5 text-sm text-dim">Porte la rue. Pas la mode.</p>
        </div>
        <nav aria-label="Liens de pied de page" className="grid content-start gap-2.5">
          {["Le Drop", "Manifeste", "Lookbook", "Newsletter"].map((label) => (
            <a
              key={label}
              href={`#${label === "Le Drop" ? "drop" : label.toLowerCase()}`}
              className="w-fit py-1 text-sm font-semibold uppercase tracking-[0.1em] no-underline transition-colors duration-150 hover:text-acid"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-start gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href="#top"
              aria-label={s.label}
              className="grid h-11 w-11 place-items-center border-2 border-paper transition-colors duration-150 hover:border-acid hover:bg-acid hover:text-ink"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <p className="border-t border-inksoft px-4 py-5 text-[13px] text-dim md:px-12">
        © 2026 MARQUE-S. Tous droits réservés. Fabriqué dur, porté fort.
      </p>
    </footer>
  );
}
