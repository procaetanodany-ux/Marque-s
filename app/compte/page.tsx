"use client";

import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/components/account/AuthContext";
import AuthForms from "@/components/account/AuthForms";
import AccountDashboard from "@/components/account/AccountDashboard";
import { accountsEnabled } from "@/lib/commerce/customer";

export default function ComptePage() {
  const { ready, customer } = useAuth();

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
          <div className="mx-auto max-w-[720px]">
            <AccountDashboard />
          </div>
        ) : (
          <AuthForms />
        )}
      </section>
    </main>
  );
}
