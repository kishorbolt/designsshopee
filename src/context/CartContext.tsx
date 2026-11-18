import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, CartItem } from '../types';
import { isPlayTent } from '../utils/whatsapp';

interface ToastState {
  message: string;
  productName?: string;
  visible: boolean;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => boolean;
  buyNow: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toast: ToastState | null;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'designs_shopee_cart_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        // Security filter: strictly filter out Pop-Up Kids Play Tent if ever present in storage
        return parsed.filter(item => !isPlayTent(item) && typeof item.price === 'number' && item.price > 0);
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    }
    return [];
  });

  const [toast, setToast] = useState<ToastState | null>(null);
  const navigate = useNavigate();

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const showToast = (message: string, productName?: string) => {
    setToast({ message, productName, visible: true });
    setTimeout(() => {
      setToast(prev => (prev ? { ...prev, visible: false } : null));
    }, 3500);
  };

  const hideToast = () => {
    setToast(null);
  };

  // Add product to shopping cart
  const addToCart = (product: Product, quantity: number = 1): boolean => {
    // ENFORCE RULE: Pop-Up Kids Play Tent or items without price CANNOT be added to cart
    if (isPlayTent(product) || product.enquiryOnly || product.price === null || product.price <= 0) {
      showToast('This item is available for direct WhatsApp enquiry only.', product.name);
      return false;
    }

    const qty = Math.max(1, quantity);

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          image: product.image,
          thumbnail: product.thumbnail || product.image,
          price: product.price as number,
          mrp: product.mrp || null,
          quantity: qty
        };
        return [...prevItems, newItem];
      }
    });

    showToast(`Added to Cart (${qty})`, product.name);
    return true;
  };

  // Buy Now: Add to cart & immediately navigate to /checkout
  const buyNow = (product: Product, quantity: number = 1) => {
    if (isPlayTent(product) || product.enquiryOnly || product.price === null) {
      navigate(`/product/${product.slug}`);
      return;
    }

    addToCart(product, quantity);
    navigate('/checkout');
  };

  // Update quantity (prevents negative values; removes if 0)
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, Math.floor(quantity)) } : item
      )
    );
  };

  // Remove individual product
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear cart storage', e);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        toast,
        hideToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

