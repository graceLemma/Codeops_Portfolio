'use server';

import { redirect } from 'next/navigation';

export async function submitOrder(prevState, formData) {
  const name = formData.get('name');
  const phone = formData.get('phone');
  const address = formData.get('address');

  // Server-side validation rules
  if (!name || name.length < 2) {
    return { success: false, error: 'Valid name is required.' };
  }
  if (!phone || !phone.startsWith('+251')) {
    return { success: false, error: 'Valid Ethiopian phone number starting with +251 is required.' };
  }
  if (!address) {
    return { success: false, error: 'Delivery address cannot be empty.' };
  }

  // Simulate order persistence logic here...

  redirect('/checkout/success');
}