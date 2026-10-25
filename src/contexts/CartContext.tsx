import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Tool } from "@/data/tools";

export interface CartItem {
  slug: string;
  name: string;
  price: string;
  priceValue: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (tool: Tool) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "toofixitt.cart.v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    add: (tool) =>
      setItems((curr) =>
        curr.some((i) => i.slug === tool.slug)
          ? curr
          : [...curr, { slug: tool.slug, name: tool.name, price: tool.price, priceValue: tool.priceValue }],
      ),
    remove: (slug) => setItems((curr) => curr.filter((i) => i.slug !== slug)),
    clear: () => setItems([]),
    has: (slug) => items.some((i) => i.slug === slug),
    count: items.length,
    total: items.reduce((s, i) => s + (i.priceValue || 0), 0),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};