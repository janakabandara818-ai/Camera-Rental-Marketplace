import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, RentalBooking, PurchaseOrder, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER_RENTALS, INITIAL_USER_ORDERS } from '../data/mockData';
import { useToast } from './ToastContext';

interface EquipmentContextType {
  products: Product[];
  rentals: RentalBooking[];
  orders: PurchaseOrder[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  addRentalBooking: (bookingData: Omit<RentalBooking, 'id' | 'trackingNumber'>) => RentalBooking;
  addPurchaseOrder: (orderData: Omit<PurchaseOrder, 'id' | 'trackingNumber'>) => PurchaseOrder;
  returnRental: (id: string) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cinevault_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [rentals, setRentals] = useState<RentalBooking[]>(() => {
    const saved = localStorage.getItem('cinevault_rentals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_RENTALS;
      }
    }
    return INITIAL_USER_RENTALS;
  });

  const [orders, setOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('cinevault_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_ORDERS;
      }
    }
    return INITIAL_USER_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('cinevault_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cinevault_rentals', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem('cinevault_orders', JSON.stringify(orders));
  }, [orders]);

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added ${newProduct.name} to gear inventory`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Equipment updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from catalog`, 'info');
  };

  const addReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const currentReviews = prod.reviews || [];
          const updatedReviews = [newRev, ...currentReviews];
          const newAvg =
            updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) /
            updatedReviews.length;
          return {
            ...prod,
            reviews: updatedReviews,
            rating: Number(newAvg.toFixed(2)),
            reviewCount: updatedReviews.length
          };
        }
        return prod;
      })
    );
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  const addRentalBooking = (
    bookingData: Omit<RentalBooking, 'id' | 'trackingNumber'>
  ): RentalBooking => {
    const id = `RNT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `FDX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-US`;
    const newBooking: RentalBooking = {
      ...bookingData,
      id,
      trackingNumber
    };
    setRentals((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const addPurchaseOrder = (
    orderData: Omit<PurchaseOrder, 'id' | 'trackingNumber'>
  ): PurchaseOrder => {
    const id = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `UPS-1Z${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const newOrder: PurchaseOrder = {
      ...orderData,
      id,
      trackingNumber
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const returnRental = (id: string) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Returned' as const } : r))
    );
    showToast('Return initiated! Prepaid shipping label generated and emailed.', 'success');
  };

  return (
    <EquipmentContext.Provider
      value={{
        products,
        rentals,
        orders,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        addRentalBooking,
        addPurchaseOrder,
        returnRental
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};
