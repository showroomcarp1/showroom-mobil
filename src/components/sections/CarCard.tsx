"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types/cars";
import { incrementCarViews } from "@/lib/actions/car";
import CarBadge from "@/components/sections/CarBadge";

interface CarCardProps {
  car: Car;
  variant?: "default" | "compact";
}

export function CarCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center text-center p-2 rounded-md">
        <div className="h-24 w-32 sm:h-36 sm:w-56 bg-neutral-900 border border-neutral-800 rounded-md mb-2 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
        <div className="h-3 w-20 sm:w-28 bg-neutral-800 rounded-md relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-neutral-900 border border-neutral-800 p-0 rounded-md sm:rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-[16/10] w-full bg-neutral-800 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />

      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between space-y-3 sm:space-y-4">
        <div>
          <div className="h-4 sm:h-6 bg-neutral-800 rounded-xs w-11/12 mb-2 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
          <div className="h-4 sm:h-6 bg-neutral-800 rounded-xs w-3/4 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />

          <div className="mt-3 flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 sm:h-4 bg-neutral-800 rounded-xs w-8 sm:w-14 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            <div className="h-2.5 sm:h-3 w-[1px] bg-neutral-800" />
            <div className="h-3 sm:h-4 bg-neutral-800 rounded-xs w-12 sm:w-20 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
          </div>
        </div>

        <div className="pt-2.5 sm:pt-4 border-t border-neutral-800 space-y-1.5">
          <div className="h-2.5 sm:h-3 bg-neutral-800 rounded-xs w-16 sm:w-24 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
          <div className="h-5 sm:h-7 bg-neutral-800 rounded-xs w-28 sm:w-44 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
        </div>
      </div>
    </div>
  );
}

function formatTransmission(transmission?: string | null) {
  if (!transmission) return null;
  const transLower = transmission.toLowerCase();

  if (transLower.includes("manual")) {
    return "MT";
  } else if (
    transLower.includes("automatic") ||
    transLower.includes("otomatis")
  ) {
    return "AT";
  }

  return transmission;
}

export default function CarCard({ car, variant = "default" }: CarCardProps) {
  const displayTitle = car.title || `${car.brand} ${car.model}`.trim();
  const targetUrl = `/cars/${car.slug || car.id}`;

  const mainImage =
    car.images && car.images.length > 0 && car.images[0]
      ? car.images[0]
      : car.image_url ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23171717'/%3E%3C/svg%3E";

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

  const formattedOriginalPrice = `IDR ${rawPrice.toLocaleString("id-ID")}`;
  const formattedFinalPrice = `IDR ${finalPrice.toLocaleString("id-ID")}`;

  const formattedMileage =
    typeof car.mileage === "number"
      ? `${car.mileage.toLocaleString("id-ID")} km`
      : car.mileage || null;

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isBooked) {
      e.preventDefault();
      return;
    }
    if (car.id) {
      incrementCarViews(car.id).catch(() => {});
    }
  };

  const metadataItems = [
    car.year ? `${car.year}` : null,
    formattedMileage,
    formatTransmission(car.transmission),
  ].filter(Boolean);

  const isDataImage = mainImage.startsWith("data:");
  const isBooked = car.status === "booked";

  if (variant === "compact") {
    return (
      <article className={isBooked ? "opacity-60 cursor-not-allowed" : ""}>
        <Link
          href={isBooked ? "#" : targetUrl}
          prefetch={!isBooked}
          onClick={handleTrackClick}
          aria-disabled={isBooked}
          tabIndex={isBooked ? -1 : undefined}
          className={`relative flex flex-col items-center text-center p-0 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800 transition-colors duration-150 ${
            isBooked
              ? "pointer-events-none select-none"
              : "hover:border-neutral-700"
          }`}
        >
          <figure className="relative h-28 w-36 sm:h-40 sm:w-60 overflow-hidden bg-neutral-950 w-full rounded-t-md">
            {car.condition && !isBooked && (
              <div className="absolute top-0 left-0 z-10 pointer-events-none scale-75 origin-top-left">
                <CarBadge condition={car.condition} />
              </div>
            )}

            {hasDiscount && !isBooked && (
              <span className="absolute top-1.5 right-1.5 z-10 bg-red-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs tracking-wider">
                -{discountPercentage}%
              </span>
            )}

            {isBooked && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-neutral-950/60">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  BOOKED
                </span>
              </div>
            )}

            <Image
              src={mainImage}
              alt={displayTitle}
              fill
              loading="lazy"
              decoding="async"
              quality={60}
              sizes="(max-width: 640px) 144px, 240px"
              className={`object-cover ${isBooked ? "grayscale opacity-50" : ""}`}
              unoptimized={isDataImage}
            />
          </figure>

          <div className="p-1.5 w-full">
            <h4 className="text-[11px] sm:text-sm font-bold tracking-tight text-white line-clamp-1 uppercase">
              {displayTitle}
            </h4>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={`relative flex flex-col w-full bg-neutral-900 rounded-md sm:rounded-lg overflow-hidden  ${
        isBooked ? "opacity-75 cursor-not-allowed" : "hover:bg-neutral-900/90"
      }`}
    >
      <Link
        href={isBooked ? "#" : targetUrl}
        prefetch={!isBooked}
        onClick={handleTrackClick}
        aria-disabled={isBooked}
        tabIndex={isBooked ? -1 : undefined}
        className={`flex flex-col h-full justify-between ${
          isBooked ? "pointer-events-none select-none" : ""
        }`}
      >
        {/* Figure / Gambar */}
        <figure className="relative aspect-[4/3] sm:aspect-[14/10] w-full overflow-hidden flex items-center justify-center bg-neutral-950 border-b border-neutral-800/60 rounded-t-md sm:rounded-t-lg">
          {car.condition && !isBooked && (
            <div className="absolute top-0 left-0 z-10 pointer-events-none scale-90 sm:scale-100 origin-top-left">
              <CarBadge condition={car.condition} />
            </div>
          )}

          {hasDiscount && !isBooked && (
            <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 bg-red-600 text-white text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs tracking-wider shadow-md">
              -{discountPercentage}%
            </span>
          )}

          {isBooked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-neutral-950/70">
              <span className="text-white text-sm sm:text-xl font-black uppercase tracking-[0.2em]">
                BOOKED
              </span>
            </div>
          )}

          <Image
            src={mainImage}
            alt={displayTitle}
            fill
            loading="lazy"
            decoding="async"
            quality={75}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover ${isBooked ? "grayscale opacity-50" : ""}`}
            unoptimized={isDataImage}
          />
        </figure>

        {/* Konten Utama Card */}
        <section className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
          <header>
            <h3
              className={`text-xs sm:text-lg font-bold leading-snug tracking-tight line-clamp-2 min-h-[2rem] sm:min-h-[3.2rem] uppercase ${
                isBooked ? "text-neutral-500" : "text-white"
              }`}
            >
              {displayTitle}
            </h3>

            {metadataItems.length > 0 && (
              <div className="mt-2 sm:mt-3 flex flex-wrap items-center text-[10px] sm:text-sm text-neutral-300 font-medium uppercase tracking-wide">
                {metadataItems.map((item, index) => (
                  <span key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-1.5 sm:mx-2.5 h-2.5 sm:h-3 w-[1px] bg-neutral-700 inline-block" />
                    )}
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            )}
          </header>

          <footer className="mt-3 sm:mt-4 pt-2.5 sm:pt-3">
            <span className="block text-[9px] sm:text-xs font-semibold text-white uppercase tracking-wider leading-none">
              Cash Price
            </span>

            <div className="mt-1 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <p
                className={`text-sm sm:text-xl font-extrabold tracking-tight leading-tight ${
                  isBooked ? "text-neutral-500" : "text-[#b89563]"
                }`}
              >
                {formattedFinalPrice}
              </p>

              {hasDiscount && !isBooked && (
                <span className="relative inline-block text-[10px] sm:text-sm font-medium text-neutral-500 after:content-[''] after:absolute after:left-0 after:top-1/2 after:w-full after:h-[1px] after:bg-current after:-translate-y-1/2 after:-rotate-3">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
          </footer>
        </section>
      </Link>
    </article>
  );
}
