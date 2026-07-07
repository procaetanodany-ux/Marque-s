import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70dvh] place-items-center px-4 py-24 text-center">
      <div>
        <p className="font-display text-[clamp(100px,20vw,240px)] leading-none text-acid">404</p>
        <h1 className="mt-4 font-display text-[clamp(24px,4vw,44px)] uppercase">
          Cette page a été <span className="text-outline">écrasée.</span>
        </h1>
        <p className="mt-3 text-dim">Comme les tendances. Retourne voir ce qui existe vraiment.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="border-2 border-acid bg-acid px-7 py-4 text-[15px] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
          >
            Accueil
          </Link>
          <Link
            href="/drop"
            className="border-2 border-paper px-7 py-4 text-[15px] font-bold uppercase tracking-[0.1em] no-underline transition-colors hover:border-acid hover:text-acid"
          >
            Voir le drop
          </Link>
        </div>
      </div>
    </main>
  );
}
