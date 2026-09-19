import { createClient } from "@/lib/supabase/server";
import InventoryFilter from "@/components/sections/InventoryFilter";
import CarCard from "@/components/sections/CarCard";
import HeroVideo from "@/components/sections/HeroVideo";
import type {
  Car,
  ConditionType,
  TransmissionType,
  FuelType,
} from "@/types/cars";
import type { Database } from "@/types/database";

// Apple-style: Manfaatkan Edge Cache selama 60 detik agar render instan
export const revalidate = 60;

type CarRow = Database["public"]["Tables"]["cars"]["Row"];

interface SearchParamsProps {
  searchParams: Promise<{
    brand?: string;
    condition?: string;
    transmission?: string;
    fuel_type?: string;
    max_price?: string;
    max_km?: string;
  }>;
}

export default async function CarsListingPage({
  searchParams,
}: SearchParamsProps) {
  const { brand, condition, transmission, fuel_type, max_price, max_km } =
    await searchParams;

  const supabase = await createClient();

  // Optimasi 1: Ambil hanya kolom yang dibutuhkan untuk listing, bukan '*'
  let query = supabase
    .from("cars")
    .select(
      "id, title, brand, model, year, price, mileage, condition, transmission, fuel_type, image_url, status, created_at",
    )
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (brand && brand !== "All") query = query.ilike("brand", `%${brand}%`);
  if (condition && condition !== "All")
    query = query.eq("condition", condition as ConditionType);
  if (transmission && transmission !== "All")
    query = query.eq("transmission", transmission as TransmissionType);
  if (fuel_type && fuel_type !== "All")
    query = query.eq("fuel_type", fuel_type as FuelType);
  if (max_price) query = query.lte("price", Number(max_price));
  if (max_km) query = query.lte("mileage", Number(max_km));

  const { data: cars, error } = await query;

  if (error) {
    console.error("Failed to fetch vehicles from Supabase:", error.message);
  }

  const carList: Car[] = ((cars as CarRow[]) || []).map((car) => ({
    ...car,
    condition: car.condition as ConditionType,
    transmission: car.transmission as TransmissionType,
    fuel_type: car.fuel_type as FuelType,
  })) as unknown as Car[];

  return (
    <main className="bg-white min-h-screen text-neutral-950 pb-16">
      {/* Hero Video Section */}
      <section className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] bg-neutral-950 overflow-hidden">
        <HeroVideo
          poster="/images/hero-video-poster.jpg"
          webmSrc="/video/video.webm"
          mp4Src="/video/video.mp4"
        />
      </section>

      {/* Main Inventory */}
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24">
        <InventoryFilter
          currentFilters={{
            brand: brand || "",
            condition: condition || "",
            transmission: transmission || "",
            fuel_type: fuel_type || "",
            max_price: max_price || "",
            max_km: max_km || "",
          }}
        >
          <section aria-label="Vehicle Listing" className="pt-6">
            {carList.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-xs text-neutral-500 font-bold tracking-[0.2em] uppercase">
                  No Vehicles Match Your Criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 transition-all duration-300">
                {carList.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </section>
        </InventoryFilter>
      </div>
    </main>
  );
}
