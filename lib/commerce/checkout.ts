/* Point d'entrée unique du checkout.
   - Shopify configuré → vrai checkout hébergé (CB, Apple Pay…).
   - Sinon → pré-commande par e-mail : un mailto pré-rempli avec le
     récapitulatif du panier part vers l'adresse de la marque.
     Fonctionnel dès aujourd'hui, zéro dépendance. */

import { site } from "@/content/site";
import { shopifyConfigured, shopifyDemo, createShopifyCheckout } from "./shopify";
import { cartTotal, formatPrice, type CartLine } from "./types";

export { shopifyConfigured, shopifyDemo };

export const checkoutModeLabel = shopifyDemo
  ? "Paiement sécurisé (démo)"
  : shopifyConfigured
    ? "Paiement sécurisé"
    : "Pré-commande par e-mail";

export async function checkout(lines: CartLine[]): Promise<{ url: string; external: boolean }> {
  if (shopifyConfigured) {
    return { url: await createShopifyCheckout(lines), external: true };
  }

  const body = [
    "Bonjour SORI,",
    "",
    "Je souhaite pré-commander :",
    ...lines.map(
      (l) => `- ${l.name} — taille ${l.size} × ${l.quantity} (${formatPrice(l.price)})`,
    ),
    "",
    `Total : ${formatPrice(cartTotal(lines))}`,
    "",
    "Adresse de livraison :",
    "",
  ].join("\n");

  const subject = `Pré-commande ${site.drop.label}`;
  return {
    url: `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    external: false,
  };
}
