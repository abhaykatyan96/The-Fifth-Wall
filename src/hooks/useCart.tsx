'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types/database';

export interface CartItemEntry {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
}

interface CartContextType {
  items: CartItemEntry[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalInPaise: number;
  discountInPaise: number;
  shippingInPaise: number;
  totalInPaise: number;
  couponCode: string | null;
  couponMessage: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tfw_luxury_cart';
const COUPON_STORAGE_KEY = 'tfw_luxury_coupon';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemEntry[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountInPaise, setDiscountInPaise] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setCouponCode(storedCoupon);
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant | null) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.product.id === product.id && (variant ? it.variant?.id === variant.id : !it.variant)
      );

      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }

      return [...prev, { product, variant: variant || null, quantity }];
    });

    setIsCartDrawerOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (it) => !(it.product.id === productId && (variantId ? it.variant?.id === variantId : !it.variant))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.product.id === productId && (variantId ? it.variant?.id === variantId : !it.variant)) {
          return { ...it, quantity };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountInPaise(0);
    setCouponMessage(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const subtotalInPaise = items.reduce((acc, it) => {
    const price = it.variant ? it.variant.price_in_paise : it.product.price_in_paise;
    return acc + price * it.quantity;
  }, 0);

  // Recalculate coupon discount whenever subtotal changes
  useEffect(() => {
    if (!couponCode || subtotalInPaise === 0) {
      setDiscountInPaise(0);
      return;
    }

    async function revalidate() {
      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode, subtotalInPaise }),
        });
        const data = await res.json();
        if (data.success) {
          setDiscountInPaise(data.data.discountInPaise);
        } else {
          setCouponCode(null);
          setDiscountInPaise(0);
          setCouponMessage(data.error || 'Coupon no longer applicable');
          localStorage.removeItem(COUPON_STORAGE_KEY);
        }
      } catch {
        // Fallback
      }
    }
    revalidate();
  }, [couponCode, subtotalInPaise]);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalInPaise }),
      });
      const data = await res.json();

      if (data.success) {
        setCouponCode(data.data.code);
        setDiscountInPaise(data.data.discountInPaise);
        setCouponMessage(data.data.message);
        localStorage.setItem(COUPON_STORAGE_KEY, data.data.code);
        return { success: true, message: data.data.message };
      } else {
        return { success: false, message: data.error || 'Failed to apply coupon' };
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error validating coupon';
      return { success: false, message };
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountInPaise(0);
    setCouponMessage(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  // Free shipping above ₹4,999 (499900 paise)
  const shippingInPaise = subtotalInPaise >= 499900 || subtotalInPaise === 0 ? 0 : 49900;
  const totalInPaise = Math.max(0, subtotalInPaise - discountInPaise + shippingInPaise);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalInPaise,
        discountInPaise,
        shippingInPaise,
        totalInPaise,
        couponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
