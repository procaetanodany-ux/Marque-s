import { site } from "@/content/site";

const ITEMS = [
  {
    label: "Paiement sécurisé",
    sub: "CB · Apple Pay · Google Pay",
    icon: (
      <path d="M3 8h18M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2m-18 0v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M7 15h4" />
    ),
  },
  {
    label: `Livraison ${site.shipping.zones.toLowerCase()}`,
    sub: site.shipping.delay,
    icon: <path d="M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5ZM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
  },
  {
    label: `Retours ${site.shipping.returnDays} jours`,
    sub: "Article non porté",
    icon: <path d="M3 7v6h6M3 13a9 9 0 1 0 2.5-6.3L3 9" />,
  },
  {
    label: "Édition numérotée",
    sub: "Aucun restock, jamais",
    icon: <path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3Z" />,
  },
];

export default function ReassuranceBar() {
  return (
    <ul className="grid grid-cols-2 gap-px border-2 border-paper bg-paper lg:grid-cols-4">
      {ITEMS.map((it) => (
        <li key={it.label} className="flex items-start gap-3 bg-ink p-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 flex-none text-acid"
            aria-hidden
          >
            {it.icon}
          </svg>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em]">{it.label}</p>
            <p className="text-xs text-dim">{it.sub}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
