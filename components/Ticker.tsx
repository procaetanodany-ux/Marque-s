import { site } from "@/content/site";
import BigMarquee from "./BigMarquee";

/* Bandeau d'annonce global — piloté par content/site.ts */
export default function Ticker() {
  if (!site.announcement.enabled) return null;
  const items = site.announcement.messages.flatMap((m) => [m, "★"]);
  return <BigMarquee variant="ticker" duration={18} items={items} />;
}
