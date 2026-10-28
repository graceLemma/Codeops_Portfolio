import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow Pro | Capstone Project',
  description: 'Production-grade task management built for CodeOps Module 3 Capstone.',
  openGraph: {
    title: 'TaskFlow Pro',
    description: 'Secure, high-performance team task collaboration.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-black min-h-screen flex flex-col">
        <header className="border-b bg-white py-4 px-6 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">TaskFlow Pro</h1>
          <nav className="space-x-4 text-sm font-medium">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          </nav>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
        <footer className="border-t bg-white py-4 text-center text-xs text-gray-500">
          IBT College Canada CodeOps · Frontend Capstone Build
        </footer>
      </body>
    </html>
  );
}