import { createContext, useContext, useReducer, useEffect } from "react";
import { addCheckout, updateProductStock } from "../services/cartService";

const CartContext = createContext();

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      const exists = state.items.find(i => i.productId === action.item.productId);
      return {
        ...state,
        items: exists
          ? state.items.map(i =>
              i.productId === action.item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [...state.items, { ...action.item, quantity: 1 }],
      };
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.id),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.id ? { ...i, quantity: action.qty } : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "LOADING":
      return { ...state, isLoading: true };
    case "DONE":
      return { ...state, isLoading: false };
    case "ERROR":
      return { ...state, error: action.message };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (item) => dispatch({ type: "ADD", item });
  const removeFromCart = (id) => dispatch({ type: "REMOVE", id });
  const updateQuantity = (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  const checkout = async () => {
    dispatch({ type: "LOADING" });
    try {
      for (const item of state.items) {
        await updateProductStock(item.productId, item.quantity);
      }
      await addCheckout(state.items);
      dispatch({ type: "CLEAR" });
      dispatch({ type: "DONE" });
      return { success: true };
    } catch (err) {
      dispatch({ type: "ERROR", message: err.message || "Checkout failed" });
      return { success: false, error: err.message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearError,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
