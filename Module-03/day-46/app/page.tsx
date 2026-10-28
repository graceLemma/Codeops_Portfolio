import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-12 py-12 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          Module 3 Capstone Build
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Manage Tasks with Precision & Speed
        </h1>
        <p className="text-lg text-gray-600">
          A fully optimized, secure Next.js 14 application demonstrating enterprise-grade architecture, rigorous authentication boundaries, and flawless responsive design.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Open Dashboard
          </Link>
          <Link href="/signin" className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}