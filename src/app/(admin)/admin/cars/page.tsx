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
      <header className="border-b border-neutral-200 pb-5">
        <h1 className="text-[30px] font-bold text-neutral-900 tracking-normal">
          Kelola Katalog Mobil
        </h1>
      </header>

      {/* Tabel Inventaris Terhubung Supabase */}
      <DataTable cars={(cars as Car[]) || []} />
    </main>
  );
}
