"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartTotal, type CartLine, type Money } from "@/lib/commerce/types";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: Money;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addLine: (line: Omit<CartLine, "quantity">) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sori-cart-v1";

/* Plafonne une quantité au stock réel Shopify quand il est connu. */
const capQty = (q: number, max?: number) =>
  typeof max === "number" ? Math.max(1, Math.min(q, max)) : q;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  /* Hydratation depuis localStorage (client uniquement). */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* stockage indisponible : panier en mémoire */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const addLine = useCallback((line: Omit<CartLine, "quantity">) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        /* on rafraîchit maxQuantity (le stock a pu changer) et on plafonne */
        return prev.map((l) =>
          l.variantId === line.variantId
            ? { ...l, maxQuantity: line.maxQuantity, quantity: capQty(l.quantity + 1, line.maxQuantity) }
            : l,
        );
      }
      return [...prev, { ...line, quantity: capQty(1, line.maxQuantity) }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) =>
            l.variantId === variantId ? { ...l, quantity: capQty(quantity, l.maxQuantity) } : l,
          ),
    );
  }, []);

  const removeLine = useCallback(
    (variantId: string) => setQuantity(variantId, 0),
    [setQuantity],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      total: cartTotal(lines),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addLine,
      setQuantity,
      removeLine,
      clear: () => setLines([]),
    }),
    [lines, isOpen, addLine, setQuantity, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé sous <CartProvider>");
  return ctx;
}
