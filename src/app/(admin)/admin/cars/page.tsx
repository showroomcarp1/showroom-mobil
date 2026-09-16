import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/admin/DataTable";
import { Car } from "@/types/cars";

export const revalidate = 0;

export default async function AdminCarsPage() {
  const supabase = await createClient();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch cars:", error.message);
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Kelola Katalog Unit
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Daftar lengkap seluruh mobil yang terdaftar di database.
        </p>
      </header>

      {/* Tabel Inventaris Terhubung Supabase */}
      <DataTable cars={(cars as Car[]) || []} />
    </main>
  );
}
