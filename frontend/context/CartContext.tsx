"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "@/lib/types";

interface CartContextValue {
  cart: CartLine[];
  cartOpen: boolean;
  count: number;
  subtotal: number;
  addItem: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ppp-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // Corrupt or unavailable storage — start empty.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable — cart stays in memory.
    }
  }, [cart]);

  const addItem: CartContextValue["addItem"] = (line) => {
    const qty = line.qty ?? 1;
    setCart((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (existing) {
        return prev.map((l) => (l.id === line.id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { ...line, qty }];
    });
    setCartOpen(true);
  };

  const setQty = (id: string, qty: number) =>
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)));

  const removeItem = (id: string) => setCart((prev) => prev.filter((l) => l.id !== id));

  const clearCart = () => setCart([]);

  const count = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.unitPrice * l.qty, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        count,
        subtotal,
        addItem,
        setQty,
        removeItem,
        clearCart,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
