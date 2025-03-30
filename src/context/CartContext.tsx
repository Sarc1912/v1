'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  productId: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);



  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const value = {
    cart,
    cartCount,
    addToCart: (productId: number, quantity = 1) => {
      setCart(prev => {
        const existing = prev.find(item => item.productId === productId);
        return existing 
          ? prev.map(item => 
              item.productId === productId 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          : [...prev, { productId, quantity }];
      });
    },
    removeFromCart: (productId: number) => {
      setCart(prev => prev.filter(item => item.productId !== productId));
    },
    updateQuantity: (productId: number, quantity = 0) => {
      setCart(prev => 
        prev.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0)
      );
    },
    clearCart: () => setCart([])
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);