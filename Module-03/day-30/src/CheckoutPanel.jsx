import { useCart } from "./CartContext";

export function CheckoutPanel() {
  const { items, total, dispatch } = useCart();

  if (items.length === 0) {
    return (
      <aside className="checkout-panel">
        <h3>Your Order</h3>
        <p>Your cart is empty.</p>
      </aside>
    );
  }

  return (
    <aside className="checkout-panel">
      <h3>Your Order</h3>
      <ul className="cart-items">
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <span>{item.name} - {item.price} ETB</span>
            <button
              type="button"
              onClick={() => dispatch({ type: "remove", id: item.id })}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h4>Total: {total} ETB</h4>
      <button type="button" onClick={() => dispatch({ type: "clear" })}>
        Clear Order
      </button>
    </aside>
  );
}