import type { Metadata } from "next";
import { getCatalog } from "@/lib/commerce/catalog";
import { site } from "@/content/site";
import DropClient from "@/components/DropClient";
import Countdown from "@/components/Countdown";

export const metadata: Metadata = {
  title: "Le Drop",
  description: `${site.drop.label} — éditions limitées, aucun restock.`,
};

export default async function DropPage() {
  const products = await getCatalog();

  return (
    <main>
      <DropClient initial={products} />
      <Countdown />
    </main>
  );
}
