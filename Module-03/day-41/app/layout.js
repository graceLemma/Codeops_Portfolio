import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Providers } from "./providers";

export const metadata = {
  title: "Mesob House",
  description: "Ethiopian food, delivered.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "Food-ordering frontend for Addis Ababa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white py-4 shadow-sm">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4">
            <a href="/" className="text-xl font-bold text-orange-600">Addis Eats 🇪🇹</a>
            <div className="space-x-4">
              <a href="/menu" className="hover:text-orange-600">Menu</a>
              <a href="/cart" className="hover:text-orange-600">Cart</a>
              <a href="/checkout" className="hover:text-orange-600">Checkout</a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}