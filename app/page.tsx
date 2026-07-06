import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BigMarquee from "@/components/BigMarquee";
import DropGrid from "@/components/DropGrid";
import Manifesto from "@/components/Manifesto";
import Lookbook from "@/components/Lookbook";
import Countdown from "@/components/Countdown";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Preloader />
      <BigMarquee
        variant="ticker"
        duration={18}
        items={[
          "DROP 003 — 12.07 — PIÈCES LIMITÉES", "★",
          "LIVRAISON MONDIALE", "★",
          "AUCUN RESTOCK", "★",
        ]}
      />
      <Navbar />
      <main>
        <Hero />
        <BigMarquee
          items={["HOODIES — TEES — CARGOS — VESTES — ACCESSOIRES —"]}
          duration={22}
        />
        <DropGrid />
        <Manifesto />
        <Lookbook />
        <Countdown />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
