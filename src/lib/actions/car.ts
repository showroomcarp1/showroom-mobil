"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { revalidatePath, unstable_cache } from "next/cache";
import type {
  ConditionType,
  TransmissionType,
  FuelType,
  CarStatus,
} from "@/types/cars";
import type { Database } from "@/types/database";

type CarRow = Database["public"]["Tables"]["cars"]["Row"];
type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
type CarUpdate = Database["public"]["Tables"]["cars"]["Update"];

// Anonymous Supabase Client khusus untuk Fetch Data Publik tanpa Overhead Cookies
const getAnonSupabase = () =>
  createPublicClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export interface CreateCarInput {
  title: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  mileage?: number;
  condition?: ConditionType;
  transmission: TransmissionType;
  fuel_type: FuelType;
  price: number;
  discount_price?: number;
  description?: string;
  status?: CarStatus;
  images?: string[];
  exterior_images?: string[];
  interior_images?: string[];
  image_url?: string;
  slug: string;
  views?: number;
}

export type UpdateCarInput = Partial<CreateCarInput>;

export async function createCar(data: CreateCarInput): Promise<void> {
  const supabase = await createClient();

  const payload: CarInsert = {
    title: data.title,
    brand: data.brand,
    model: data.model,
    variant: data.variant ?? "",
    year: data.year,
    mileage: data.mileage ?? null,
    condition: data.condition ?? "Used",
    transmission: data.transmission,
    fuel_type: data.fuel_type,
    price: data.price,
    discount_price: data.discount_price ?? null,
    description: data.description ?? null,
    status: data.status ?? "available",
    images: data.images ?? null,
    exterior_images: data.exterior_images ?? null,
    interior_images: data.interior_images ?? null,
    image_url: data.image_url ?? (data.images?.[0] || null),
    slug: data.slug,
    views: data.views ?? 0,
    features: null,
  };

  const { error } = await supabase.from("cars").insert(payload);

  if (error) {
    throw new Error(`Gagal menyimpan data unit: ${error.message}`);
  }

  revalidatePath("/admin/cars");
  revalidatePath("/");
}

export async function updateCar(
  id: string,
  data: UpdateCarInput,
): Promise<void> {
  const supabase = await createClient();

  const payload: CarUpdate = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.brand !== undefined && { brand: data.brand }),
    ...(data.model !== undefined && { model: data.model }),
    ...(data.variant !== undefined && { variant: data.variant }),
    ...(data.year !== undefined && { year: data.year }),
    ...(data.mileage !== undefined && { mileage: data.mileage ?? null }),
    ...(data.condition !== undefined && { condition: data.condition }),
    ...(data.transmission !== undefined && { transmission: data.transmission }),
    ...(data.fuel_type !== undefined && { fuel_type: data.fuel_type }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.discount_price !== undefined && {
      discount_price: data.discount_price,
    }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.images !== undefined && { images: data.images }),
    ...(data.exterior_images !== undefined && {
      exterior_images: data.exterior_images,
    }),
    ...(data.interior_images !== undefined && {
      interior_images: data.interior_images,
    }),
    ...(data.image_url !== undefined && { image_url: data.image_url }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.views !== undefined && { views: data.views }),
  };

  const { error } = await supabase.from("cars").update(payload).eq("id", id);

  if (error) {
    throw new Error(`Gagal memperbarui data unit: ${error.message}`);
  }

  revalidatePath("/admin/cars");
  revalidatePath(`/cars/${data.slug || id}`);
  revalidatePath("/");
}

export async function deleteCar(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("cars").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus unit: ${error.message}`);
  }

  revalidatePath("/admin/cars");
  revalidatePath("/");
}

// OPTIMASI: Jalankan increment tanpa membatalkan cache halaman utama (revalidatePath dihapus)
export async function incrementCarViews(carId: string): Promise<void> {
  const supabase = getAnonSupabase();

  const { error: rpcError } = await supabase.rpc("increment_car_views", {
    car_id: carId,
  });

  if (rpcError) {
    const { data } = await supabase
      .from("cars")
      .select("views")
      .eq("id", carId)
      .single();

    const currentViews = data?.views ?? 0;

    await supabase
      .from("cars")
      .update({ views: currentViews + 1 })
      .eq("id", carId);
  }
}

// OPTIMASI: Gunakan unstable_cache agar query trending tersimpan di memory server selama 10 menit
export const getTrendingCars = unstable_cache(
  async (limit = 6): Promise<CarRow[]> => {
    const supabase = getAnonSupabase();

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("status", "available")
      .order("views", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Gagal mengambil data mobil trending:", error.message);
      return [];
    }

    return data ?? [];
  },
  ["trending-cars"],
  { revalidate: 600, tags: ["cars"] },
);
