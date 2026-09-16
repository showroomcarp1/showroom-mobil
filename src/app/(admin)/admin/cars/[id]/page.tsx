import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CarForm from "@/components/admin/CarForm";
import { Car } from "@/types/cars";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  // 1. Unwrap Promise params (persyaratan Next.js 15+)
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  // 2. Inisialisasi Supabase Server Client
  const supabase = await createClient();

  // 3. Fetch data mobil berdasarkan ID dengan type assertion aman
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", decodedId)
    .maybeSingle();

  // 4. Jika data tidak ditemukan atau terjadi error pada query
  if (error || !data) {
    notFound();
  }

  const car = data as Car;

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Edit Data Mobil
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Ubah spesifikasi, harga OTR, atau potongan diskon unit ID: {car.id}
        </p>
      </header>

      {/* 5. Pass data lama mobil ke CarForm via initialData */}
      <CarForm initialData={car} />
    </main>
  );
}
