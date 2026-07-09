"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import AddressFields, { toInput, isAddressComplete } from "./AddressForm";
import { formatPrice } from "@/lib/commerce/types";
import type { Address, AddressInput, CustomerOrder } from "@/lib/commerce/customer";

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

const sectionTitle = "font-display text-2xl uppercase";
const smallBtn =
  "border-2 border-paper px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-acid hover:text-acid";
const acidBtn =
  "border-2 border-acid bg-acid px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-paper hover:bg-paper disabled:opacity-60";
const inputCls =
  "min-h-[48px] w-full border-2 border-paper bg-ink px-4 py-3 text-paper focus:border-acid focus:outline-none";
const labelCls = "text-[12px] font-bold uppercase tracking-[0.14em]";

/* ---------------- Profil ---------------- */
function ProfileSection() {
  const { customer, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(customer?.firstName ?? "");
  const [lastName, setLastName] = useState(customer?.lastName ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [error, setError] = useState("");

  if (!customer) return null;

  const save = async () => {
    setError("");
    const res = await updateProfile({ firstName, lastName, phone: phone || undefined });
    if (res.ok) setEditing(false);
    else setError(res.errors?.[0]?.message ?? "Modification impossible.");
  };

  return (
    <section className="border-2 border-paper">
      <header className="flex items-center justify-between border-b-2 border-inksoft px-5 py-4">
        <h3 className={sectionTitle}>Mes infos</h3>
        {!editing && <button onClick={() => setEditing(true)} className={smallBtn}>Modifier</button>}
      </header>
      <div className="px-5 py-4">
        {!editing ? (
          <dl className="grid gap-2 text-[15px]">
            <div className="flex justify-between gap-4"><dt className="text-dim">Nom</dt><dd>{customer.displayName}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-dim">E-mail</dt><dd className="break-all">{customer.email}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-dim">Téléphone</dt><dd>{customer.phone || "—"}</dd></div>
          </dl>
        ) : (
          <div className="grid gap-4">
            {error && <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><label className={labelCls}>Prénom</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} /></div>
              <div className="grid gap-2"><label className={labelCls}>Nom</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} /></div>
            </div>
            <div className="grid gap-2"><label className={labelCls}>Téléphone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+41 79 000 00 00" /></div>
            <div className="flex gap-3">
              <button onClick={save} disabled={loading} className={acidBtn}>{loading ? "…" : "Enregistrer"}</button>
              <button onClick={() => setEditing(false)} className={smallBtn}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Adresses ---------------- */
function AddressSection() {
  const { customer, createAddress, updateAddress, deleteAddress, setDefaultAddress, loading } = useAuth();
  const [form, setForm] = useState<AddressInput | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!customer) return null;

  const openAdd = () => { setEditId(null); setForm(toInput({})); setError(""); };
  const openEdit = (a: Address) => { setEditId(a.id); setForm(toInput(a)); setError(""); };

  const save = async () => {
    if (!form) return;
    setError("");
    if (!isAddressComplete(form)) { setError("Complète la rue, le code postal, la ville et le pays."); return; }
    const res = editId ? await updateAddress(editId, form) : await createAddress(form, customer.addresses.length === 0);
    if (res.ok) { setForm(null); setEditId(null); }
    else setError(res.errors?.[0]?.message ?? "Enregistrement impossible.");
  };

  return (
    <section className="border-2 border-paper">
      <header className="flex items-center justify-between border-b-2 border-inksoft px-5 py-4">
        <h3 className={sectionTitle}>Mes adresses</h3>
        {!form && <button onClick={openAdd} className={smallBtn}>+ Ajouter</button>}
      </header>
      <div className="grid gap-4 px-5 py-4">
        {form ? (
          <div className="grid gap-4">
            {error && <p role="alert" className="text-[13px] font-semibold text-[#ff5a4e]">{error}</p>}
            <AddressFields value={form} onChange={setForm} />
            <div className="flex gap-3">
              <button onClick={save} disabled={loading} className={acidBtn}>{loading ? "…" : "Enregistrer"}</button>
              <button onClick={() => { setForm(null); setEditId(null); }} className={smallBtn}>Annuler</button>
            </div>
          </div>
        ) : customer.addresses.length === 0 ? (
          <p className="text-[15px] text-dim">Aucune adresse enregistrée.</p>
        ) : (
          customer.addresses.map((a) => (
            <div key={a.id} className="flex flex-wrap items-start justify-between gap-4 border border-inksoft p-4">
              <div className="text-[14px] leading-relaxed">
                {a.id === customer.defaultAddressId && (
                  <span className="mb-1 inline-block bg-acid px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink">Par défaut</span>
                )}
                <p className="whitespace-pre-line">{(a.formatted ?? []).join("\n")}</p>
                {a.phone && <p className="text-dim">{a.phone}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {a.id !== customer.defaultAddressId && (
                  <button onClick={() => setDefaultAddress(a.id)} className={smallBtn}>Par défaut</button>
                )}
                <button onClick={() => openEdit(a)} className={smallBtn}>Modifier</button>
                <button onClick={() => deleteAddress(a.id)} className={`${smallBtn} hover:!border-[#ff5a4e] hover:!text-[#ff5a4e]`}>Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ---------------- Commandes ---------------- */
function OrderCard({ order }: { order: CustomerOrder }) {
  const date = new Date(order.processedAt).toLocaleDateString("fr-CH", { day: "2-digit", month: "long", year: "numeric" });
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
        <a href={order.statusUrl} target="_blank" rel="noreferrer" className={smallBtn}>Suivre →</a>
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
        </div>
        <button onClick={logout} className="border-2 border-paper px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-acid hover:text-acid">
          Se déconnecter
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProfileSection />
        <AddressSection />
      </div>

      <section>
        <h3 className="mb-4 font-display text-2xl uppercase">
          Mes commandes {customer.orders.length > 0 && <span className="text-acid">({customer.orders.length})</span>}
        </h3>
        {customer.orders.length === 0 ? (
          <div className="border-2 border-paper p-8 text-center">
            <p className="font-display text-xl uppercase">Aucune commande pour l&apos;instant.</p>
            <p className="mt-2 text-sm text-dim">Ta première pièce t&apos;attend.</p>
            <a href="drop/" className="mt-6 inline-block border-2 border-acid bg-acid px-6 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink no-underline transition-colors hover:border-paper hover:bg-paper">
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
