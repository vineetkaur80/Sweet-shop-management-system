import React, { createContext, useContext, useState } from "react";
import type { Sweet } from "../types";

interface CartItem extends Sweet {
  cartQty: number; // How many the user wants to buy
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (sweet: Sweet) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (sweet: Sweet) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === sweet._id);
      if (existing) {
        // Don't add more if it exceeds stock
        if (existing.cartQty >= sweet.quantity) return prev;
        return prev.map((item) =>
          item._id === sweet._id ? { ...item, cartQty: item.cartQty + 1 } : item
        );
      }
      return [...prev, { ...sweet, cartQty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
