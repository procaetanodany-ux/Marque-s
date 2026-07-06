/* Marquee double piste — adapté du composant 21st.dev « Marquee » (samke),
   restylé SORI : Anton, bordures 2px, variantes acide/contour. */
export default function BigMarquee({
  items,
  variant = "acid",
  reverse = false,
  duration = 24,
  className = "",
}: {
  items: string[];
  variant?: "acid" | "outline" | "ticker";
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  const styles = {
    acid:
      "border-y-2 border-ink bg-acid text-ink font-display uppercase text-[clamp(28px,5vw,64px)] py-2",
    outline:
      "text-outline-soft font-display uppercase text-[clamp(64px,14vw,200px)] py-4",
    ticker:
      "border-b-2 border-ink bg-acid text-ink font-bold uppercase text-[13px] tracking-[0.12em] py-2",
  }[variant];

  /* Contenu répété pour que chaque piste dépasse toujours la largeur d'écran */
  const repeated = Array(4).fill(items).flat();

  const track = (cls: string) => (
    <div
      className={`${cls} whitespace-nowrap will-change-transform`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {repeated.map((item, i) => (
        <span key={i} className="mx-4 inline-block">
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative flex w-full overflow-x-hidden ${styles} ${reverse ? "marquee-reverse" : ""} ${className}`}
      aria-hidden
    >
      {track("animate-marquee")}
      <div className="absolute top-0 flex h-full items-center">
        {track("animate-marquee2")}
      </div>
    </div>
  );
}
