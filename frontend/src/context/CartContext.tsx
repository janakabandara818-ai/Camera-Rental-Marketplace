import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderType } from '../types';
import { useToast } from './ToastContext';

interface AddToCartOptions {
  startDate?: string;
  endDate?: string;
  rentalDays?: number;
  includeDamageProtection?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, type: OrderType, options?: AddToCartOptions) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateRentalDates: (cartItemId: string, startDate: string, endDate: string, days: number) => void;
  toggleDamageProtection: (cartItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  damageProtectionFee: number;
  securityDeposit: number;
  estimatedTax: number;
  shippingFee: number;
  grandTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cinevault_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cinevault_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, type: OrderType, options?: AddToCartOptions) => {
    const today = new Date().toISOString().split('T')[0];
    const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

    const startDate = options?.startDate || today;
    const endDate = options?.endDate || threeDaysLater;
    const rentalDays = options?.rentalDays || 3;
    const includeDamageProtection = options?.includeDamageProtection ?? true;

    // Check if duplicate already in cart
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id && item.type === type
    );

    if (existingIndex > -1 && type === 'buy') {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      setItems(updated);
      showToast(`Updated quantity for ${product.name}`, 'success');
      return;
    }

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      product,
      type,
      quantity: 1,
      startDate: type === 'rent' ? startDate : undefined,
      endDate: type === 'rent' ? endDate : undefined,
      rentalDays: type === 'rent' ? rentalDays : undefined,
      includeDamageProtection: type === 'rent' ? includeDamageProtection : undefined
    };

    setItems((prev) => [newItem, ...prev]);
    showToast(
      type === 'rent'
        ? `Added ${product.name} to cart for ${rentalDays} days rental`
        : `Added ${product.name} to cart for purchase`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    const found = items.find((i) => i.id === cartItemId);
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
    if (found) {
      showToast(`Removed ${found.product.name} from cart`, 'info');
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
    );
  };

  const updateRentalDates = (
    cartItemId: string,
    startDate: string,
    endDate: string,
    days: number
  ) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === cartItemId
          ? {
              ...i,
              startDate,
              endDate,
              rentalDays: Math.max(1, days)
            }
          : i
      )
    );
  };

  const toggleDamageProtection = (cartItemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === cartItemId
          ? { ...i, includeDamageProtection: !i.includeDamageProtection }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    if (item.type === 'rent') {
      const days = item.rentalDays || 1;
      return acc + item.product.rentPricePerDay * days * item.quantity;
    } else {
      return acc + item.product.buyPrice * item.quantity;
    }
  }, 0);

  const damageProtectionFee = items.reduce((acc, item) => {
    if (item.type === 'rent' && item.includeDamageProtection) {
      const days = item.rentalDays || 1;
      // 10% daily damage protection waiver
      return acc + item.product.rentPricePerDay * 0.1 * days * item.quantity;
    }
    return acc;
  }, 0);

  const securityDeposit = items.reduce((acc, item) => {
    if (item.type === 'rent') {
      return acc + (item.product.depositRequired || 0) * item.quantity;
    }
    return acc;
  }, 0);

  const shippingFee = items.length > 0 ? (subtotal > 1000 ? 0 : 45) : 0;
  const estimatedTax = subtotal * 0.0825; // 8.25% standard sales tax
  const grandTotal = subtotal + damageProtectionFee + estimatedTax + shippingFee;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalDates,
        toggleDamageProtection,
        clearCart,
        subtotal,
        damageProtectionFee,
        securityDeposit,
        estimatedTax,
        shippingFee,
        grandTotal,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
