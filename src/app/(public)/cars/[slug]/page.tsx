import { createPublicClient } from "@/lib/supabase/public";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import CarDetailContent from "@/components/sections/CarDetailContent";
import MobileStickyBar from "@/components/common/MobileStickyBar";
import DesktopCarActions from "@/components/sections/DesktopCarActions";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faGasPump,
  faGears,
  faCalendar,
  faRoad,
  faChevronRight,
  faCar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import type { Car, ConditionType } from "@/types/cars";

interface CarDetailPageProps {
  params: Promise<{ slug: string }>;
}

const conditionBreadcrumbLabel: Record<ConditionType, string> = {
  New: "NEW CAR",
  Used: "USED CAR",
  Exclusive: "EXCLUSIVE CAR",
};

function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

const getCachedCar = unstable_cache(
  async (slugParam: string): Promise<Car | null> => {
    const supabase = createPublicClient();
    let carData: Car | null = null;

    const { data: dataBySlug } = await supabase
      .from("cars")
      .select("*")
      .eq("slug", slugParam)
      .maybeSingle();

    carData = dataBySlug as Car | null;

    if (!carData && (isUUID(slugParam) || !isNaN(Number(slugParam)))) {
      const { data: dataById } = await supabase
        .from("cars")
        .select("*")
        .eq("id", slugParam)
        .maybeSingle();

      carData = dataById as Car | null;
    }

    return carData;
  },
  ["car-detail-cache-key"],
  { revalidate: 3600, tags: ["cars"] },
);

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const resolvedParams = await params;
  const rawParam = decodeURIComponent(resolvedParams.slug);

  const car = await getCachedCar(rawParam);

  if (!car) {
    notFound();
  }

  const rawPrice = car.price || 0;
  const rawDiscount = car.discount_price || 0;

  let discountCutAmount = 0;
  let discountPercentage = 0;

  if (rawDiscount > 0 && rawPrice > 0) {
    if (rawDiscount <= 100) {
      discountPercentage = rawDiscount;
      discountCutAmount = Math.round((rawPrice * rawDiscount) / 100);
    } else {
      discountCutAmount = rawDiscount;
      discountPercentage = Math.min(
        100,
        Math.max(0, Math.round((rawDiscount / rawPrice) * 100)),
      );
    }
  }

  const hasDiscount = discountCutAmount > 0;
  const finalPrice = Math.max(0, rawPrice - discountCutAmount);

  const carTitle =
    car.title || `${car.brand} ${car.model} ${car.variant || ""}`.trim();

  const whatsappInquireMsg = encodeURIComponent(
    `Hello, I am interested in the ${carTitle} (${car.year}). Please let me know more details.`,
  );

  return (
    <main className="bg-white pt-3 lg:pt-6 pb-28 lg:pb-20 text-neutral-900 relative min-h-screen">
      <nav aria-label="Breadcrumb" className="bg-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-500 font-medium tracking-wide">
            <li>
              <Link
                href="/cars"
                prefetch={true}
                className="text-neutral-500 hover:text-black uppercase tracking-wider transition-colors"
              >
                Home
              </Link>
            </li>

            <li
              aria-hidden="true"
              className="flex items-center text-neutral-300 select-none"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 stroke-[2]"
              />
            </li>

            <li>
              <Link
                href="/cars"
                prefetch={true}
                className="text-neutral-500 hover:text-black uppercase tracking-wider transition-colors"
              >
                {conditionBreadcrumbLabel[car.condition] || "Car"}
              </Link>
            </li>

            <li
              aria-hidden="true"
              className="flex items-center text-neutral-300 select-none"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 stroke-[2]"
              />
            </li>

            <li>
              <span className="text-neutral-700 uppercase tracking-wider">
                {car.brand}
              </span>
            </li>

            <li
              aria-hidden="true"
              className="flex items-center text-neutral-300 select-none"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 stroke-[2]"
              />
            </li>

            <li className="min-w-0">
              <span
                aria-current="page"
                className="font-semibold text-neutral-900 truncate max-w-[120px] sm:max-w-[260px] block"
                title={carTitle}
              >
                {carTitle}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <CarDetailContent car={car}>
          <article className="space-y-4">
            {/* Header: Border bawah dihapus */}
            <header className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900 leading-tight">
                {carTitle}
              </h1>
              <div className="pt-1">
                <span className="block text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-widest">
                  Price
                </span>
                <div className="flex flex-wrap items-baseline gap-3 mt-0.5">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 tracking-tight">
                    IDR {finalPrice.toLocaleString("id-ID")}
                  </p>
                  {hasDiscount && (
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-medium text-neutral-400 line-through">
                        IDR {rawPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-xs tracking-wider">
                        Save {discountPercentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Spesifikasi: Border atas spesifikasi menggantikan border header, padding per baris dibuat lebih padat (py-2.5) */}
            <section aria-label="Spesifikasi Utama">
              <dl className="divide-y divide-neutral-100 border-y border-neutral-100">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faCar}
                      className="h-4 w-4 text-neutral-400"
                      aria-hidden="true"
                    />
                    Brand
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.brand}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="h-4 w-4 text-neutral-400"
                      aria-hidden="true"
                    />
                    Condition
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.condition}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="h-4 w-4 text-neutral-400"
                      aria-hidden="true"
                    />
                    Year
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.year}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="h-4 w-4 text-neutral-400"
                      aria-hidden="true"
                    />
                    Mileage
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.mileage
                      ? `${Number(car.mileage).toLocaleString("en-US")} km`
                      : "-"}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faGears}
                      className="h-4 w-4 text-neutral-400"
                      aria-hidden="true"
                    />
                    Transmission
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.transmission}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faGasPump}
                      className="h-4 w-4 text-neutral-400"
                      aria-hidden="true"
                    />
                    Fuel Type
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.fuel_type}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 3 Button Desktop Inline (Otomatis terdorong lebih ke atas) */}
            <DesktopCarActions
              car={car}
              whatsappInquireMsg={whatsappInquireMsg}
            />
          </article>
        </CarDetailContent>
      </div>

      <MobileStickyBar carTitle={carTitle} year={car.year} car={car} />
    </main>
  );
}
