/* ============================================================
   COMPTES CLIENTS — API Storefront (comptes classiques).

   Tout se passe côté navigateur avec le token Storefront public :
   connexion, inscription, mot de passe oublié, profil et historique
   de commandes. Le jeton client (customerAccessToken) est stocké en
   localStorage et n'a accès qu'aux données du client connecté.
   Le backend (comptes, commandes, sécurité) reste géré par Shopify.
   ============================================================ */

import { storefront, shopifyConfigured } from "./shopify";

export { shopifyConfigured as accountsEnabled };

export type UserError = { field?: string[] | null; message: string; code?: string | null };

export type CustomerToken = { accessToken: string; expiresAt: string };

export type OrderLine = {
  title: string;
  quantity: number;
  image?: string;
};

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  total: { amount: number; currencyCode: string };
  statusUrl: string;
  lines: OrderLine[];
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  email: string | null;
  phone: string | null;
  numberOfOrders: string;
  orders: CustomerOrder[];
};

/* ---------- Connexion ---------- */
export async function login(
  email: string,
  password: string,
): Promise<{ token?: CustomerToken; errors: UserError[] }> {
  type Resp = {
    customerAccessTokenCreate: {
      customerAccessToken: CustomerToken | null;
      customerUserErrors: UserError[];
    };
  };
  const data = await storefront<Resp>(
    `mutation ($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message code }
      }
    }`,
    { input: { email, password } },
  );
  const r = data.customerAccessTokenCreate;
  return { token: r.customerAccessToken ?? undefined, errors: r.customerUserErrors };
}

/* ---------- Inscription (puis connexion auto) ---------- */
export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptsMarketing?: boolean;
}): Promise<{ token?: CustomerToken; errors: UserError[] }> {
  type Resp = {
    customerCreate: { customer: { id: string } | null; customerUserErrors: UserError[] };
  };
  const data = await storefront<Resp>(
    `mutation ($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { field message code }
      }
    }`,
    { input },
  );
  if (data.customerCreate.customerUserErrors.length) {
    return { errors: data.customerCreate.customerUserErrors };
  }
  /* Compte créé → on connecte directement. */
  return login(input.email, input.password);
}

/* ---------- Mot de passe oublié ---------- */
export async function recover(email: string): Promise<{ errors: UserError[] }> {
  type Resp = { customerRecover: { customerUserErrors: UserError[] } };
  const data = await storefront<Resp>(
    `mutation ($email: String!) {
      customerRecover(email: $email) { customerUserErrors { field message code } }
    }`,
    { email },
  );
  return { errors: data.customerRecover.customerUserErrors };
}

/* ---------- Déconnexion ---------- */
export async function logout(accessToken: string): Promise<void> {
  try {
    await storefront(
      `mutation ($t: String!) {
        customerAccessTokenDelete(customerAccessToken: $t) { deletedAccessToken userErrors { message } }
      }`,
      { t: accessToken },
    );
  } catch {
    /* le token est de toute façon effacé côté client */
  }
}

/* ---------- Profil + commandes ---------- */
export async function getCustomer(accessToken: string): Promise<Customer | null> {
  type Resp = {
    customer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      displayName: string;
      email: string | null;
      phone: string | null;
      numberOfOrders: string;
      orders: {
        nodes: {
          id: string;
          name: string;
          processedAt: string;
          financialStatus: string | null;
          fulfillmentStatus: string;
          statusUrl: string;
          totalPrice: { amount: string; currencyCode: string };
          lineItems: {
            nodes: {
              title: string;
              quantity: number;
              variant: { image: { url: string } | null } | null;
            }[];
          };
        }[];
      };
    } | null;
  };
  const data = await storefront<Resp>(
    `query ($t: String!) {
      customer(customerAccessToken: $t) {
        id firstName lastName displayName email phone numberOfOrders
        orders(first: 25, reverse: true) {
          nodes {
            id name processedAt financialStatus fulfillmentStatus statusUrl
            totalPrice { amount currencyCode }
            lineItems(first: 8) {
              nodes { title quantity variant { image { url } } }
            }
          }
        }
      }
    }`,
    { t: accessToken },
  );
  const c = data.customer;
  if (!c) return null;
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    displayName: c.displayName,
    email: c.email,
    phone: c.phone,
    numberOfOrders: c.numberOfOrders,
    orders: c.orders.nodes.map((o) => ({
      id: o.id,
      name: o.name,
      processedAt: o.processedAt,
      financialStatus: o.financialStatus,
      fulfillmentStatus: o.fulfillmentStatus,
      statusUrl: o.statusUrl,
      total: { amount: parseFloat(o.totalPrice.amount), currencyCode: o.totalPrice.currencyCode },
      lines: o.lineItems.nodes.map((l) => ({
        title: l.title,
        quantity: l.quantity,
        image: l.variant?.image?.url,
      })),
    })),
  };
}
