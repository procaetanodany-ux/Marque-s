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

export type Address = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
  formatted: string[];
};

export type AddressInput = {
  firstName?: string;
  lastName?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  email: string | null;
  phone: string | null;
  numberOfOrders: string;
  defaultAddressId: string | null;
  addresses: Address[];
  orders: CustomerOrder[];
};

const ADDRESS_FIELDS = `id firstName lastName address1 address2 city province zip country phone formatted(withName: true)`;

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

/* ---------- Inscription (puis connexion auto + adresse) ---------- */
export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  acceptsMarketing?: boolean;
  address?: AddressInput; // adresse par défaut créée après connexion
}): Promise<{ token?: CustomerToken; errors: UserError[] }> {
  const { address, ...customer } = input;
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
    { input: customer },
  );
  if (data.customerCreate.customerUserErrors.length) {
    return { errors: data.customerCreate.customerUserErrors };
  }
  /* Compte créé → connexion directe. */
  const session = await login(input.email, input.password);
  /* Adresse fournie → on la crée et on la définit par défaut. */
  if (session.token && address) {
    try {
      const created = await createAddress(session.token.accessToken, address);
      if (created.id) await setDefaultAddress(session.token.accessToken, created.id);
    } catch {
      /* l'adresse pourra être ajoutée depuis l'espace compte */
    }
  }
  return session;
}

/* ---------- Modifier le profil (nom, téléphone, e-mail) ---------- */
export async function updateProfile(
  accessToken: string,
  input: { firstName?: string; lastName?: string; phone?: string; email?: string },
): Promise<{ errors: UserError[] }> {
  type Resp = { customerUpdate: { customerUserErrors: UserError[] } };
  const data = await storefront<Resp>(
    `mutation ($t: String!, $c: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $t, customer: $c) {
        customerUserErrors { field message code }
      }
    }`,
    { t: accessToken, c: input },
  );
  return { errors: data.customerUpdate.customerUserErrors };
}

/* ---------- Adresses ---------- */
export async function createAddress(
  accessToken: string,
  address: AddressInput,
): Promise<{ id?: string; errors: UserError[] }> {
  type Resp = {
    customerAddressCreate: { customerAddress: { id: string } | null; customerUserErrors: UserError[] };
  };
  const data = await storefront<Resp>(
    `mutation ($t: String!, $a: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $t, address: $a) {
        customerAddress { id }
        customerUserErrors { field message code }
      }
    }`,
    { t: accessToken, a: address },
  );
  const r = data.customerAddressCreate;
  return { id: r.customerAddress?.id, errors: r.customerUserErrors };
}

export async function updateAddress(
  accessToken: string,
  id: string,
  address: AddressInput,
): Promise<{ errors: UserError[] }> {
  type Resp = { customerAddressUpdate: { customerUserErrors: UserError[] } };
  const data = await storefront<Resp>(
    `mutation ($t: String!, $id: ID!, $a: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $t, id: $id, address: $a) {
        customerUserErrors { field message code }
      }
    }`,
    { t: accessToken, id, a: address },
  );
  return { errors: data.customerAddressUpdate.customerUserErrors };
}

export async function deleteAddress(
  accessToken: string,
  id: string,
): Promise<{ errors: UserError[] }> {
  type Resp = { customerAddressDelete: { customerUserErrors: UserError[] } };
  const data = await storefront<Resp>(
    `mutation ($t: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $t, id: $id) {
        deletedCustomerAddressId
        customerUserErrors { field message code }
      }
    }`,
    { t: accessToken, id },
  );
  return { errors: data.customerAddressDelete.customerUserErrors };
}

export async function setDefaultAddress(
  accessToken: string,
  addressId: string,
): Promise<{ errors: UserError[] }> {
  type Resp = { customerDefaultAddressUpdate: { customerUserErrors: UserError[] } };
  const data = await storefront<Resp>(
    `mutation ($t: String!, $id: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $t, addressId: $id) {
        customerUserErrors { field message code }
      }
    }`,
    { t: accessToken, id: addressId },
  );
  return { errors: data.customerDefaultAddressUpdate.customerUserErrors };
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
      defaultAddress: { id: string } | null;
      addresses: { nodes: Address[] };
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
        defaultAddress { id }
        addresses(first: 10) { nodes { ${ADDRESS_FIELDS} } }
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
    defaultAddressId: c.defaultAddress?.id ?? null,
    addresses: c.addresses.nodes,
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
