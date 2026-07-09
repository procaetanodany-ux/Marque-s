"use client";

import { useEffect, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/components/account/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import AuthForms from "@/components/account/AuthForms";
import AccountDashboard from "@/components/account/AccountDashboard";
import { accountsEnabled } from "@/lib/commerce/customer";

export default function ComptePage() {
  const { ready, customer } = useAuth();
  const { open: openCart } = useCart();
  const handled = useRef(false);

  /* Venu du panier (« Se connecter pour commander ») : une fois connecté,
     on rouvre le panier pour finaliser. */
  useEffect(() => {
    if (handled.current || !customer) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect") === "cart") {
      handled.current = true;
      openCart();
    }
  }, [customer, openCart]);

  return (
    <main>
      <PageHeader
        title="Mon compte"
        meta={customer ? undefined : "Connexion & suivi de commandes"}
      />
      <section className="px-4 pb-24 md:px-12">
        {!accountsEnabled ? (
          <p className="mx-auto max-w-[460px] border-2 border-paper p-8 text-center text-dim">
            L&apos;espace compte sera disponible très bientôt.
          </p>
        ) : !ready ? (
          <div className="mx-auto max-w-[460px] animate-pulse border-2 border-inksoft p-8 text-center text-dim">
            Chargement…
          </div>
        ) : customer ? (
          <div className="mx-auto max-w-[860px]">
            <AccountDashboard />
          </div>
        ) : (
          <AuthForms />
        )}
      </section>
    </main>
  );
}
