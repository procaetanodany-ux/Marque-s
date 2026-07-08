import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Guide des tailles",
  description: "Guide des tailles SORI — coupe oversize, mesures en centimètres.",
};

/* Table indicative pour une coupe oversize streetwear (haut).
   Mesures à plat, en cm. Ajuste selon tes vraies pièces. */
const ROWS = [
  { size: "S", chest: "56", length: "70", shoulder: "56", sleeve: "22" },
  { size: "M", chest: "59", length: "72", shoulder: "59", sleeve: "23" },
  { size: "L", chest: "62", length: "74", shoulder: "62", sleeve: "24" },
  { size: "XL", chest: "65", length: "76", shoulder: "65", sleeve: "25" },
];

const COLS = [
  ["Poitrine (à plat)", "chest"],
  ["Longueur", "length"],
  ["Épaules", "shoulder"],
  ["Manche", "sleeve"],
] as const;

export default function GuideDesTaillesPage() {
  return (
    <main>
      <PageHeader title={<>Guide des<br />tailles</>} meta="Coupe oversize · mesures en cm" />

      <section className="mx-auto grid max-w-[760px] gap-6 px-4 pb-24 md:px-12">
        <p className="text-[15px] leading-relaxed text-dim">
          Nos pièces sont taillées <strong className="text-paper">oversize</strong>. Si tu hésites
          entre deux tailles ou préfères une coupe plus près du corps, prends la taille en dessous.
          Mesures indicatives, à plat, en centimètres.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-2 border-paper text-[14px]">
            <thead>
              <tr className="bg-acid text-ink">
                <th className="border-r-2 border-ink px-4 py-3 text-left font-bold uppercase tracking-[0.1em]">
                  Taille
                </th>
                {COLS.map(([label]) => (
                  <th
                    key={label}
                    className="border-r-2 border-ink px-4 py-3 text-left font-bold uppercase tracking-[0.08em] last:border-r-0"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.size} className="border-t border-inksoft">
                  <td className="border-r-2 border-inksoft px-4 py-3 font-display text-lg">
                    {r.size}
                  </td>
                  {COLS.map(([label, key]) => (
                    <td
                      key={label}
                      className="border-r border-inksoft px-4 py-3 tabular-nums text-dim last:border-r-0"
                    >
                      {r[key]} cm
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-dim">
          Un doute ? Écris-nous, on te conseille avec plaisir sur la coupe.
        </p>
      </section>
    </main>
  );
}
