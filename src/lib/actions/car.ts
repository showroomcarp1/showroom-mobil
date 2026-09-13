"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CarPayload {
  slug: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  transmission: "Automatic" | "Manual" | "CVT";
  fuel_type: "Bensin" | "Diesel" | "Hybrid" | "Electric";
  price: number;
  discount_price?: number;
  description?: string;
  features?: string[];
  status?: "available" | "sold" | "reserved";
}

export async function createCar(payload: CarPayload) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .insert([payload as never])
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambah data mobil: ${error.message}`);
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  return data;
}

export async function updateCar(id: string, payload: Partial<CarPayload>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .update({ ...payload, updated_at: new Date().toISOString() } as never)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui data mobil: ${error.message}`);
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  return data;
}
