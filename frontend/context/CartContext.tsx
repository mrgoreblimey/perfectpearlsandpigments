"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { pullSavedCart, persistCart } from "@/lib/cart/actions";
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
const PULL_FLAG = "ppp_cart_pull";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  const reconciledRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Hydrate the fast device cart from localStorage.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // Corrupt or unavailable storage — start empty.
    }
  }, []);

  // 2. Reconcile with the customer's saved cart once on load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await pullSavedCart();
      if (cancelled) return;
      setLoggedIn(res.loggedIn);
      if (res.loggedIn) {
        if (res.pull) {
          // Just logged in — adopt the server-merged cart outright.
          setCart(res.cart);
        } else if (res.cart.length) {
          // Returning session: restore saved cart only if this device is empty.
          setCart((prev) => (prev.length ? prev : res.cart));
        }
      }
      reconciledRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 3. Catch the just-logged-in transition after a server-action redirect
  //    (the provider doesn't remount, so watch navigation + the pull flag).
  useEffect(() => {
    if (!reconciledRef.current) return;
    if (typeof document === "undefined" || !document.cookie.includes(`${PULL_FLAG}=1`)) return;
    let cancelled = false;
    (async () => {
      const res = await pullSavedCart();
      if (cancelled || !res.loggedIn) return;
      setLoggedIn(true);
      setCart(res.cart);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Persist the device cart to localStorage on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable — cart stays in memory.
    }
  }, [cart]);

  // 4. Debounced save to the customer's server cart while signed in.
  useEffect(() => {
    if (!loggedIn || !reconciledRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persistCart(cart);
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [cart, loggedIn]);

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
