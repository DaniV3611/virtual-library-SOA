import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./useAuth";
import { API_ENDPOINT } from "../config";
import { CartItem } from "../types/cart";

// Define cart item type

// Define cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (bookId: string) => Promise<boolean>;
  removeFromCart: (bookId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  reloadCart: () => Promise<void>;
}

// Create the context
const CartContext = createContext<CartContextType | null>(null);

// CartProvider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated, authToken } = useAuth();

  const fetchCartItems = async () => {
    if (isAuthenticated && authToken) {
      try {
        const response = await fetch(`${API_ENDPOINT}/cart`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (err: any) {
        console.error("Error loading cart items:", err);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated]);

  const addToCart = async (bookId: string) => {
    if (isAuthenticated && authToken) {
      try {
        const response = await fetch(`${API_ENDPOINT}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ book_id: bookId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }

        await fetchCartItems(); // Refresh cart items after adding
        return true;
      } catch (err: any) {
        console.error("Error adding item to cart:", err);
        return false;
      }
    }
    return false; // Not authenticated
  };

  const removeFromCart = async (bookId: string) => {
    if (isAuthenticated && authToken) {
      try {
        const response = await fetch(`${API_ENDPOINT}/cart/${bookId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to remove item from cart");
        }

        await fetchCartItems();
        return true;
      } catch (err: any) {
        console.error("Error removing item from cart:", err);
        return false;
      }
    }
    return false;
  };

  const clearCart = async () => {
    return false;
  };

  const reloadCart = async () => {
    fetchCartItems();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        reloadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default useCart;
