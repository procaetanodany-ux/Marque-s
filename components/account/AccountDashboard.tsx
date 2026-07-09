"use client";

import { useAuth } from "./AuthContext";
import { formatPrice } from "@/lib/commerce/types";
import type { CustomerOrder } from "@/lib/commerce/customer";

const FULFILLMENT_LABEL: Record<string, string> = {
  FULFILLED: "Expédiée",
  UNFULFILLED: "En préparation",
  PARTIALLY_FULFILLED: "Partiellement expédiée",
  RESTOCKED: "Remboursée",
  IN_PROGRESS: "En cours",
  ON_HOLD: "En attente",
  SCHEDULED: "Programmée",
};

const FINANCIAL_LABEL: Record<string, string> = {
  PAID: "Payée",
  PENDING: "Paiement en attente",
  REFUNDED: "Remboursée",
  PARTIALLY_REFUNDED: "Partiellement remboursée",
  VOIDED: "Annulée",
  AUTHORIZED: "Autorisée",
};

function OrderCard({ order }: { order: CustomerOrder }) {
  const date = new Date(order.processedAt).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <article className="border-2 border-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-inksoft px-5 py-4">
        <div>
          <p className="font-display text-xl uppercase">Commande {order.name}</p>
          <p className="text-[13px] text-dim">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.financialStatus && (
            <span className="border border-paper px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
              {FINANCIAL_LABEL[order.financialStatus] ?? order.financialStatus}
            </span>
          )}
          <span className="bg-acid px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
            {FULFILLMENT_LABEL[order.fulfillmentStatus] ?? order.fulfillmentStatus}
          </span>
        </div>
      </header>
      <ul className="grid gap-3 px-5 py-4">
        {order.lines.map((l, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="h-12 w-10 flex-none overflow-hidden border border-inksoft bg-inksoft">
              {l.image && <img src={l.image} alt="" width={80} height={96} className="h-full w-full object-cover" />}
            </div>
            <span className="flex-1 text-[14px]">{l.title}</span>
            <span className="text-[13px] text-dim tabular-nums">×{l.quantity}</span>
          </li>
        ))}
      </ul>
      <footer className="flex items-center justify-between border-t-2 border-inksoft px-5 py-4">
        <span className="font-bold tabular-nums">{formatPrice(order.total)}</span>
        <a
          href={order.statusUrl}
          target="_blank"
          rel="noreferrer"
          className="border-2 border-paper px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-acid hover:bg-acid hover:text-ink"
        >
          Suivre →
        </a>
      </footer>
    </article>
  );
}

export default function AccountDashboard() {
  const { customer, logout } = useAuth();
  if (!customer) return null;

  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-dim">Ton compte</p>
          <h2 className="font-display text-[clamp(28px,4vw,48px)] uppercase leading-none">
            {customer.firstName ? `Salut, ${customer.firstName}` : customer.displayName}
          </h2>
          {customer.email && <p className="mt-1 text-sm text-dim">{customer.email}</p>}
        </div>
        <button
          onClick={logout}
          className="border-2 border-paper px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-acid hover:text-acid"
        >
          Se déconnecter
        </button>
      </div>

      <section>
        <h3 className="mb-4 font-display text-2xl uppercase">
          Mes commandes {customer.orders.length > 0 && <span className="text-acid">({customer.orders.length})</span>}
        </h3>
        {customer.orders.length === 0 ? (
          <div className="border-2 border-paper p-8 text-center">
            <p className="font-display text-xl uppercase">Aucune commande pour l&apos;instant.</p>
            <p className="mt-2 text-sm text-dim">Ta première pièce t&apos;attend.</p>
            <a
              href="drop/"
              className="mt-6 inline-block border-2 border-acid bg-acid px-6 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper"
            >
              Voir le drop
            </a>
          </div>
        ) : (
          <div className="grid gap-5">
            {customer.orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
