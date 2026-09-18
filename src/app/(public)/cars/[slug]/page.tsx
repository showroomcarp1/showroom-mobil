import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import CarDetailContent from "@/components/sections/CarDetailContent";
import MobileStickyBar from "@/components/common/MobileStickyBar";
import DesktopFloatingBar from "@/components/sections/DesktopFloatingBar";
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

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const resolvedParams = await params;
  const rawParam = decodeURIComponent(resolvedParams.slug);
  const supabase = await createClient();

  const { data: carBySlug } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", rawParam)
    .maybeSingle();

  let car = carBySlug as Car | null;

  if (!car) {
    const { data: carById } = await supabase
      .from("cars")
      .select("*")
      .eq("id", rawParam)
      .maybeSingle();

    car = carById as Car | null;
  }

  if (!car) {
    notFound();
  }

  // Logika kalkulasi diskon aman & konsisten dengan komponen Card
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

  const whatsappTestDriveMsg = encodeURIComponent(
    `Hello, I would like to schedule a Test Drive for the ${carTitle} (${car.year}).`,
  );

  return (
    <main className="bg-white pt-3 lg:pt-6 pb-28 lg:pb-20 text-neutral-900 relative">
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="bg-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-400 overflow-x-auto whitespace-nowrap scrollbar-none">
            <li>
              <Link
                href="/cars"
                className="font-normal hover:text-black transition-colors"
              >
                HOME
              </Link>
            </li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2 w-2 text-neutral-300"
            />
            <li>
              <Link
                href="/cars"
                className="font-normal hover:text-black transition-colors"
              >
                {conditionBreadcrumbLabel[car.condition] || "CAR"}
              </Link>
            </li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2 w-2 text-neutral-300"
            />
            <li>
              <span className="font-normal text-neutral-400">{car.brand}</span>
            </li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2 w-2 text-neutral-300"
            />
            <li>
              <span className="font-extrabold text-black truncate max-w-[200px] inline-block align-bottom">
                {carTitle}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Detail container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <CarDetailContent car={car}>
          {/* Header & info panel */}
          <article className="space-y-6">
            <header className="space-y-2 border-b border-neutral-100 pb-5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900 leading-tight">
                {carTitle}
              </h1>
              <div className="pt-2">
                <span className="block text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-widest">
                  Price
                </span>
                <div className="flex flex-wrap items-baseline gap-3 mt-1">
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

            {/* Spesifikasi utama berbaris (list style) */}
            <section aria-label="Spesifikasi Utama">
              <dl className="divide-y divide-neutral-100 border-y border-neutral-100">
                {/* Brand */}
                <div className="flex items-center justify-between py-3">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faCar}
                      className="h-4 w-4 text-neutral-400"
                    />
                    Brand
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.brand}
                  </dd>
                </div>

                {/* Condition */}
                <div className="flex items-center justify-between py-3">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="h-4 w-4 text-neutral-400"
                    />
                    Condition
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.condition}
                  </dd>
                </div>

                {/* Year */}
                <div className="flex items-center justify-between py-3">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="h-4 w-4 text-neutral-400"
                    />
                    Year
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.year}
                  </dd>
                </div>

                {/* Mileage */}
                <div className="flex items-center justify-between py-3">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="h-4 w-4 text-neutral-400"
                    />
                    Mileage
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.mileage
                      ? `${Number(car.mileage).toLocaleString("en-US")} km`
                      : "-"}
                  </dd>
                </div>

                {/* Transmission */}
                <div className="flex items-center justify-between py-3">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faGears}
                      className="h-4 w-4 text-neutral-400"
                    />
                    Transmission
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.transmission}
                  </dd>
                </div>

                {/* Fuel type */}
                <div className="flex items-center justify-between py-3">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    <FontAwesomeIcon
                      icon={faGasPump}
                      className="h-4 w-4 text-neutral-400"
                    />
                    Fuel Type
                  </dt>
                  <dd className="text-sm font-bold text-neutral-900 uppercase">
                    {car.fuel_type}
                  </dd>
                </div>
              </dl>
            </section>
          </article>
        </CarDetailContent>
      </div>

      {/* Floating contact bar */}
      <DesktopFloatingBar
        whatsappInquireMsg={whatsappInquireMsg}
        whatsappTestDriveMsg={whatsappTestDriveMsg}
      />
      <MobileStickyBar carTitle={carTitle} year={car.year} />
    </main>
  );
}
