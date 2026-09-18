import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/sections/HeroSlider";
import CarCard from "@/components/sections/CarCard";
import { createClient } from "@/lib/supabase/server";
import type { Car } from "@/types/cars";

export const revalidate = 0; // Memastikan data selalu fresh

export default async function HomePage() {
  const supabase = await createClient();

  // Query katalog mobil dari Supabase
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data mobil:", error.message);
  }

  // Transformasi null pada mileage ke undefined agar sesuai tipe Car
  const carList: Car[] = (cars || []).map((car) => ({
    ...car,
    mileage: car.mileage ?? undefined,
    discount_price: car.discount_price ?? undefined,
    description: car.description ?? undefined,
    image_url: car.image_url ?? undefined,
    images: car.images ?? undefined,
    exterior_images: car.exterior_images ?? undefined,
    interior_images: car.interior_images ?? undefined,
    features: car.features ?? undefined,
  })) as Car[];

  return (
    <>
      <Navbar />
      <main>
        {/* Section Hero */}
        <HeroSlider />

        {/* Section Listing Mobil */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Unit Pilihan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                  Katalog Mobil Terbaru
                </h2>
              </div>
            </div>

            {/* Grid Mobil / Empty State */}
            {carList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {carList.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center">
                <p className="text-sm font-medium text-neutral-500">
                  Belum ada unit mobil yang tersedia saat ini.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
