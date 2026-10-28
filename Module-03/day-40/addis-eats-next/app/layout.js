import './globals.css';

export const metadata = {
  title: 'Addis Eats',
  description: 'Authentic Ethiopian food ordering application built on Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b p-4 flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-orange-600">Addis Eats</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:underline">Home</a>
            <a href="/menu" className="hover:underline">Menu</a>
            <a href="/cart" className="hover:underline">Cart</a>
            <a href="/checkout" className="hover:underline">Checkout</a>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}