"use client";

import { useState } from "react";
import type { Address, AddressInput } from "@/lib/commerce/customer";

/* Pays proposés (label FR → valeur acceptée par Shopify en anglais). */
export const COUNTRIES: { label: string; value: string }[] = [
  { label: "Suisse", value: "Switzerland" },
  { label: "France", value: "France" },
  { label: "Allemagne", value: "Germany" },
  { label: "Italie", value: "Italy" },
  { label: "Autriche", value: "Austria" },
  { label: "Belgique", value: "Belgium" },
  { label: "Luxembourg", value: "Luxembourg" },
];

const inputCls =
  "min-h-[48px] w-full border-2 border-paper bg-ink px-4 py-3 text-paper placeholder:text-dim/60 focus:border-acid focus:outline-none";
const labelCls = "text-[12px] font-bold uppercase tracking-[0.14em]";

export function toInput(a: Partial<Address>): AddressInput {
  return {
    firstName: a.firstName ?? "",
    lastName: a.lastName ?? "",
    address1: a.address1 ?? "",
    address2: a.address2 ?? "",
    city: a.city ?? "",
    province: a.province ?? "",
    zip: a.zip ?? "",
    country: a.country ?? "Switzerland",
    phone: a.phone ?? "",
  };
}

export function isAddressComplete(a: AddressInput): boolean {
  return Boolean(a.address1.trim() && a.zip.trim() && a.city.trim() && a.country.trim());
}

/* Champs d'adresse contrôlés — réutilisés à l'inscription et dans le compte. */
export default function AddressFields({
  value,
  onChange,
  requireName = true,
}: {
  value: AddressInput;
  onChange: (a: AddressInput) => void;
  requireName?: boolean;
}) {
  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...value, [k]: e.target.value });

  return (
    <div className="grid gap-4">
      {requireName && (
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className={labelCls}>Prénom</label>
            <input autoComplete="given-name" value={value.firstName ?? ""} onChange={set("firstName")} className={inputCls} placeholder="Prénom" />
          </div>
          <div className="grid gap-2">
            <label className={labelCls}>Nom</label>
            <input autoComplete="family-name" value={value.lastName ?? ""} onChange={set("lastName")} className={inputCls} placeholder="Nom" />
          </div>
        </div>
      )}
      <div className="grid gap-2">
        <label className={labelCls}>Adresse <span className="text-acid">*</span></label>
        <input autoComplete="address-line1" value={value.address1} onChange={set("address1")} className={inputCls} placeholder="Rue et numéro" />
      </div>
      <div className="grid gap-2">
        <label className={labelCls}>Complément</label>
        <input autoComplete="address-line2" value={value.address2 ?? ""} onChange={set("address2")} className={inputCls} placeholder="Appartement, étage… (optionnel)" />
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <div className="grid gap-2">
          <label className={labelCls}>Code postal <span className="text-acid">*</span></label>
          <input autoComplete="postal-code" inputMode="numeric" value={value.zip} onChange={set("zip")} className={inputCls} placeholder="1000" />
        </div>
        <div className="grid gap-2">
          <label className={labelCls}>Ville <span className="text-acid">*</span></label>
          <input autoComplete="address-level2" value={value.city} onChange={set("city")} className={inputCls} placeholder="Ville" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className={labelCls}>Canton / région</label>
          <input autoComplete="address-level1" value={value.province ?? ""} onChange={set("province")} className={inputCls} placeholder="Vaud, Genève…" />
        </div>
        <div className="grid gap-2">
          <label className={labelCls}>Pays <span className="text-acid">*</span></label>
          <select value={value.country} onChange={set("country")} className={inputCls}>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-ink">{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-2">
        <label className={labelCls}>Téléphone</label>
        <input type="tel" autoComplete="tel" value={value.phone ?? ""} onChange={set("phone")} className={inputCls} placeholder="+41 79 000 00 00" />
      </div>
    </div>
  );
}
