import { CartProvider } from "./CartContext";
import { Header } from "./Header";
import { Menu } from "./Menu";
import { CheckoutPanel } from "./CheckoutPanel";

export default function App() {
  return (
    <CartProvider>
      <div className="app-layout">
        <Header />
        <main className="content">
          <Menu />
          <CheckoutPanel />
        </main>
      </div>
    </CartProvider>
  );
}