'use client';

import { useActionState } from 'react';
import { submitOrder } from '../actions';

const initialState = { success: false, error: null };

export default function CheckoutPage() {
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      {state?.error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{state.error}</div>
      )}
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input type="text" name="name" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input type="text" name="phone" placeholder="+251..." required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Delivery Address</label>
          <textarea name="address" required className="w-full border p-2 rounded" />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {isPending ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}