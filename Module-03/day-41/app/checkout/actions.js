"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(9, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
});

export async function placeOrder(prevState, formData) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  const validation = orderSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // Process order logic here...
  
  return { success: true };
}



"use server";

import { redirect } from "next/navigation";

export async function submitOrder(formData) {
  const name = formData.get("name");
  const address = formData.get("address");

  // Server-side validation
  if (!name || !address) {
    return { error: "All fields are required." };
  }

  // Process the order backend logic here...
  
  redirect("/orders/success");
}