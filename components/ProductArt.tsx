export type Art = "peak" | "house" | "cross" | "flag" | "grid" | "star";

const paths: Record<Art, React.ReactNode> = {
  peak: (
    <>
      <rect x="20" y="20" width="160" height="160" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M60 140 100 60l40 80" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="118" r="10" fill="currentColor" />
    </>
  ),
  house: (
    <>
      <path d="M30 170V70l70-40 70 40v100" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M65 170v-60h70v60" fill="none" stroke="currentColor" strokeWidth="3" />
    </>
  ),
  cross: (
    <>
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M100 30v140M30 100h140" stroke="currentColor" strokeWidth="3" />
    </>
  ),
  flag: <path d="M50 30h100v140l-50-30-50 30V30Z" fill="none" stroke="currentColor" strokeWidth="3" />,
  grid: (
    <>
      <rect x="35" y="60" width="130" height="80" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M35 100h130M100 60v80" stroke="currentColor" strokeWidth="3" />
    </>
  ),
  star: (
    <path
      d="m100 25 20 45 50 5-37 33 11 49-44-26-44 26 11-49-37-33 50-5 20-45Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
  ),
};

export default function ProductArt({ art, className = "" }: { art: Art; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {paths[art]}
    </svg>
  );
}
