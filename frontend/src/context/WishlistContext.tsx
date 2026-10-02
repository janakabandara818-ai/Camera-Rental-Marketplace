import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string, name?: string) => void;
  removeFromWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cinevault_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['prod-sony-fx6-cinema', 'prod-aputure-600d-pro'];
      }
    }
    return ['prod-sony-fx6-cinema', 'prod-aputure-600d-pro'];
  });

  useEffect(() => {
    localStorage.setItem('cinevault_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const isInWishlist = (id: string) => wishlistIds.includes(id);

  const toggleWishlist = (id: string, name?: string) => {
    if (wishlistIds.includes(id)) {
      setWishlistIds((prev) => prev.filter((item) => item !== id));
      showToast(`Removed ${name || 'item'} from your wishlist`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, id]);
      showToast(`Saved ${name || 'item'} to your wishlist`, 'success');
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlistIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, isInWishlist, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
