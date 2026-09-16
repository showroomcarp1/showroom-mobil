import { createClient } from "@/lib/supabase/server";
import InventoryFilter from "@/components/sections/InventoryFilter";
import CarCard from "@/components/sections/CarCard";
import { Car } from "@/types/cars";

export const revalidate = 0;

interface SearchParamsProps {
  searchParams: Promise<{
    brand?: string;
    transmission?: string;
    fuel_type?: string;
    max_price?: string;
    max_km?: string;
    location?: string;
    type?: string;
    price?: string;
    year?: string;
  }>;
}

export default async function CarsListingPage({
  searchParams,
}: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  const {
    brand,
    transmission,
    fuel_type,
    max_price,
    max_km,
    location,
    type,
    price,
    year,
  } = resolvedSearchParams;

  const supabase = await createClient();
  let query = supabase
    .from("cars")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  // Filter Query Handling
  if (brand && brand !== "All") {
    query = query.ilike("brand", `%${brand}%`);
  }
  if (transmission && transmission !== "All") {
    query = query.eq("transmission", transmission);
  }
  if (fuel_type && fuel_type !== "All") {
    query = query.eq("fuel_type", fuel_type);
  }
  if (type && type !== "All") {
    query = query.ilike("body_type", `%${type}%`);
  }
  if (location && location !== "All") {
    query = query.ilike("location", `%${location}%`);
  }
  if (max_price) {
    query = query.lte("price", Number(max_price));
  }
  if (max_km) {
    query = query.lte("mileage", Number(max_km));
  }

  const { data: cars, error } = await query;

  if (error) {
    console.error("Failed to fetch vehicles from Supabase:", error.message);
  }

  const carList = (cars as Car[]) || [];

  return (
    <main className="bg-white min-h-screen text-neutral-950 pb-16">
      {/* Hero Video Banner Besar */}
      <section className="relative w-full h-[80vh] min-h-[550px] max-h-[800px] bg-neutral-950">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/video/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Main Inventory Content (Dinaikkan setengah ke dalam video menggunakan -mt-24 dan relative z-30) */}
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24">
        {/* Filter Section (Mengambang) */}
        <section aria-label="Vehicle Filters">
          <InventoryFilter
            currentFilters={{
              brand: brand || "",
              transmission: transmission || "",
              fuel_type: fuel_type || "",
              max_price: max_price || "",
              max_km: max_km || "",
            }}
          />
        </section>

        {/* Grid Daftar Mobil Full-Width */}
        <section aria-label="Vehicle Listing" className="pt-6">
          {carList.length === 0 ? (
            <div className="border border-neutral-200 bg-neutral-50 p-16 text-center rounded-lg">
              <p className="text-xs text-neutral-500 font-bold tracking-[0.2em] uppercase">
                No Vehicles Match Your Criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {carList.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
