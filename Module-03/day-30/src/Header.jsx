import { useCart } from "./CartContext";

export function Header() {
  const { items, total } = useCart();

  return (
    <header className="header">
      <h1>Addis Eats</h1>
      <div className="cart-badge">
        <span>Cart: <strong>{items.length}</strong> items</span>
        <span> ({total} ETB)</span>
      </div>
    </header>
  );
}