import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import InventoryFilter from "@/components/sections/InventoryFilter";
import CarCard, { CarCardSkeleton } from "@/components/sections/CarCard";
import HeroVideo from "@/components/sections/HeroVideo";
import type {
  Car,
  ConditionType,
  TransmissionType,
  FuelType,
} from "@/types/cars";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

type CarRow = Database["public"]["Tables"]["cars"]["Row"];

type SearchParamsType = {
  search?: string;
  brand?: string;
  condition?: string;
  transmission?: string;
  fuel_type?: string;
  max_price?: string;
  max_km?: string;
  location?: string;
  type?: string;
  price?: string;
  year?: string;
};

interface SearchParamsProps {
  searchParams: Promise<SearchParamsType>;
}

// Sub-komponen Async untuk fetching data Supabase
async function CarsListContent({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const resolvedSearchParams = await searchParams;
  const {
    search,
    brand,
    condition,
    transmission,
    fuel_type,
    max_price,
    max_km,
  } = resolvedSearchParams;

  const supabase = await createClient();
  let query = supabase
    .from("cars")
    .select("*")
    .in("status", ["available", "booked"])
    .order("created_at", { ascending: false });

  if (search && search.trim() !== "") {
    const cleanSearch = search.trim();
    const pattern = `%${cleanSearch}%`;
    query = query.or(
      `title.ilike.${pattern},brand.ilike.${pattern},model.ilike.${pattern}`,
    );
  }

  if (brand && brand !== "All") {
    query = query.ilike("brand", `%${brand}%`);
  }
  if (condition && condition !== "All") {
    query = query.eq("condition", condition as ConditionType);
  }
  if (transmission && transmission !== "All") {
    query = query.eq("transmission", transmission as TransmissionType);
  }
  if (fuel_type && fuel_type !== "All") {
    query = query.eq("fuel_type", fuel_type as FuelType);
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

  const carList: Car[] = ((cars as CarRow[]) || []).map((car) => ({
    ...car,
    condition: car.condition as ConditionType,
    transmission: car.transmission as TransmissionType,
    fuel_type: car.fuel_type as FuelType,
  })) as unknown as Car[];

  const hasActiveFilters = Boolean(
    search ||
    (brand && brand !== "All") ||
    (condition && condition !== "All") ||
    (transmission && transmission !== "All") ||
    (fuel_type && fuel_type !== "All") ||
    max_price ||
    max_km,
  );

  return (
    <section aria-label="Vehicle Listing" className="pt-6">
      {search && search.trim() !== "" && (
        <div className="mb-8 pb-3 border-b border-neutral-800 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-100 capitalize">
            &ldquo;{search}&rdquo;
          </h2>

          <Link
            href="/cars"
            scroll={false}
            className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors shrink-0"
          >
            Reset
          </Link>
        </div>
      )}

      {carList.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <p className="text-xs text-neutral-400 font-light tracking-[0.2em] uppercase mb-6">
            No Vehicles Found
          </p>
          {hasActiveFilters && (
            <Link
              href="/cars"
              scroll={false}
              className="px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              Reset
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-300">
          {carList.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </section>
  );
}

// Loading Skeleton Fallback
function CarsLoadingSkeleton() {
  return (
    <div className="pt-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Main Page Component dengan Suspense Boundary
export default async function CarsListingPage({
  searchParams,
}: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="bg-neutral-950 min-h-screen text-neutral-100 pb-16">
      <section className="relative w-full h-[90vh] min-h-[650px] max-h-[950px] bg-neutral-950 overflow-hidden">
        <HeroVideo
          poster="/images/hero-video-poster.jpg"
          videoUrl="https://oaznjzwrcyjclrxjplqp.supabase.co/storage/v1/object/public/car-videos/video.mp4"
        />
      </section>

      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-28 sm:-mt-32">
        <InventoryFilter
          currentFilters={{
            brand: resolvedSearchParams.brand || "",
            condition: resolvedSearchParams.condition || "",
            transmission: resolvedSearchParams.transmission || "",
            fuel_type: resolvedSearchParams.fuel_type || "",
            max_price: resolvedSearchParams.max_price || "",
            max_km: resolvedSearchParams.max_km || "",
          }}
        >
          <Suspense fallback={<CarsLoadingSkeleton />}>
            <CarsListContent searchParams={searchParams} />
          </Suspense>
        </InventoryFilter>
      </div>
    </main>
  );
}