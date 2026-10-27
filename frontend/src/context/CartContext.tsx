import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product, OrderType } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { buildCartEntry, localToday, sameCartLine } from '../utils/cartUtils';

export interface CartEntry {
  id: string;
  productId: string;
  name: string;
  image: string;
  type: OrderType;
  startDate?: string;
  endDate?: string;
  rentalDays?: number;
  unitPrice: number;
  totalPrice: number;
}

interface Options {
  startDate?: string;
  endDate?: string;
  rentalDays?: number;
  includeDamageProtection?: boolean;
}

interface CartContextType {
  items: CartEntry[];
  itemCount: number;
  subtotal: number;
  grandTotal: number;
  addApiProduct: (product: any, type: OrderType, options?: Options) => boolean;
  addToCart: (product: Product, type: OrderType, options?: Options) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const keyFor = (owner: string) => `camera_cart_v1_${owner}`;

function readCart(owner: string): CartEntry[] {
  if (owner === 'guest') return [];
  try {
    const raw = localStorage.getItem(keyFor(owner));
    const saved = JSON.parse(raw || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) =>
      typeof item.id === 'string' &&
      /^[a-f\d]{24}$/i.test(item.productId || '') &&
      ['rent', 'buy'].includes(item.type) &&
      Number.isFinite(item.unitPrice) && item.unitPrice > 0 &&
      Number.isFinite(item.totalPrice) && item.totalPrice > 0
    );
  } catch { return []; }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const owner = user?.id || 'guest';
  const [state, setState] = useState(() => ({ owner, items: readCart(owner) }));

  useEffect(() => {
    setState({ owner, items: readCart(owner) });
  }, [owner]);

  useEffect(() => {
    if (state.owner !== owner || owner === 'guest') return;
    localStorage.setItem(keyFor(owner), JSON.stringify(state.items));
  }, [state, owner]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === keyFor(owner) || event.key === null) {
        setState({ owner, items: readCart(owner) });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [owner]);

  const items = state.owner === owner ? state.items : [];

  const addApiProduct = (product: any, type: OrderType, options: Options = {}) => {
    if (!user) {
      showToast('Please sign in before adding equipment.', 'warning');
      return false;
    }
    try {
      const entry = buildCartEntry(product, type, options) as CartEntry;
      if (items.some((item) => sameCartLine(item, entry))) {
        showToast('This equipment and these dates are already in your cart.', 'info');
        return false;
      }
      setState((previous) => {
        const current = previous.owner === owner ? previous.items : [];
        if (current.some((item) => sameCartLine(item, entry))) return previous;
        return { owner, items: [...current, entry] };
      });
      showToast('Equipment added to your cart.', 'success');
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to add equipment.', 'error');
      return false;
    }
  };

  // Compatibility for the existing ProductCard and QuickView components.
  const addToCart = (product: Product, type: OrderType, options: Options = {}) => {
    const startDate = options.startDate || localToday();
    const end = new Date(`${startDate}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + (options.rentalDays || 3));
    addApiProduct({
      _id: product.id,
      name: product.name,
      image: product.images?.[0],
      available: product.status === 'Available',
      type: product.availableForRent && product.availableForSale ? 'both' : product.availableForRent ? 'rent' : 'sell',
      rentPrice: product.rentPricePerDay,
      sellPrice: product.buyPrice,
    }, type, {
      ...options,
      startDate,
      endDate: options.endDate || end.toISOString().slice(0, 10),
    });
  };

  const removeFromCart = (id: string) => {
    setState((previous) => previous.owner === owner
      ? { owner, items: previous.items.filter((item) => item.id !== id) }
      : previous);
  };

  const clearCart = () => {
    localStorage.removeItem(keyFor(owner));
    setState({ owner, items: [] });
  };
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.totalPrice, 0) * 100) / 100;

  return (
    <CartContext.Provider value={{
      items, itemCount: items.length, subtotal, grandTotal: subtotal,
      addApiProduct, addToCart, removeFromCart, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
