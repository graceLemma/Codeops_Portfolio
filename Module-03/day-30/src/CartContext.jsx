import { createContext, useContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import { cartReducer } from "./cartReducer";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Calculate derived total on every render (never stored in state to prevent state drift)
  const total = state.items.reduce((sum, item) => sum + item.price, 0);

  // Memoise context value object reference to prevent unnecessary child re-renders
  const value = useMemo(
    () => ({
      items: state.items,
      dispatch,
      total,
    }),
    [state.items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}