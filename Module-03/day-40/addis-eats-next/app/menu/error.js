'use client';

import { useEffect } from 'react';

export default function MenuError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong loading the menu!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Try again
      </button>
    </div>
  );
}