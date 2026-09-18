"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "@/types/cars";
import { incrementCarViews } from "@/lib/actions/car";
import CarBadge from "@/components/sections/CarBadge";

interface CarCardProps {
  car: Car;
  variant?: "default" | "compact";
}

// Skeleton loading (Kembali persis seperti milik kamu)
export function CarCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center text-center p-2 rounded-md animate-pulse">
        <div className="h-24 w-32 sm:h-36 sm:w-56 bg-neutral-200 rounded-md sm:rounded-none mb-2" />
        <div className="h-3 w-20 sm:w-28 bg-neutral-200 rounded-sm" />
      </div>
    );
  }

return (
  <div className="flex flex-col w-full bg-white p-3 sm:p-4 rounded-md animate-pulse">
    <div className="aspect-4/3 w-full bg-neutral-200 rounded-md sm:rounded-none" />
    <div className="mt-3 sm:mt-3 flex flex-col flex-1 justify-between">
      <div>
        {/* Skeleton Judul diperbesar di mobile (h-4.5 / 18px) */}
        <div className="h-4.5 sm:h-5 bg-neutral-200 rounded-sm w-5/6 mb-1.5" />
        <div className="h-4.5 sm:h-5 bg-neutral-200 rounded-sm w-2/3" />

        {/* Skeleton Metadata */}
        <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2">
          <div className="h-3.5 sm:h-3 bg-neutral-200 rounded-sm w-10 sm:w-12" />
          <div className="h-3 w-[1px] bg-neutral-200" />
          <div className="h-3.5 sm:h-3 bg-neutral-200 rounded-sm w-14 sm:w-16" />
          <div className="h-3 w-[1px] bg-neutral-200" />
          <div className="h-3.5 sm:h-3 bg-neutral-200 rounded-sm w-8 sm:w-12" />
        </div>
      </div>

      {/* Skeleton Harga */}
      <div className="mt-3 sm:mt-4 pt-2 border-t border-neutral-100 space-y-1.5">
        <div className="h-3 sm:h-3 bg-neutral-200 rounded-sm w-24 sm:w-28" />
        <div className="h-5 sm:h-6 bg-neutral-200 rounded-sm w-32 sm:w-36" />
      </div>
    </div>
  </div>
);
}

// Helper untuk format teks transmisi (Manual/Automatic -> MT/AT khusus Mobile)
function formatTransmission(transmission?: string | null) {
  if (!transmission) return null;
  const transLower = transmission.toLowerCase();

  let mobileText = transmission;
  if (transLower.includes("manual")) mobileText = "MT";
  else if (transLower.includes("automatic") || transLower.includes("otomatis"))
    mobileText = "AT";

  return (
    <span>
      <span className="inline sm:hidden">{mobileText}</span>
      <span className="hidden sm:inline">{transmission}</span>
    </span>
  );
}

// Card utama
export default function CarCard({ car, variant = "default" }: CarCardProps) {
  const displayTitle = car.title || `${car.brand} ${car.model}`.trim();
  const targetUrl = `/cars/${car.slug || car.id}`;

  const mainImage =
    car.images && car.images.length > 0 && car.images[0]
      ? car.images[0]
      : car.image_url ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E";

  // Kalkulasi diskon
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

  // Format angka harga
  const formattedOriginalPrice = `IDR ${rawPrice.toLocaleString("id-ID")}`;
  const formattedFinalPrice = `IDR ${finalPrice.toLocaleString("id-ID")}`;

  const formattedMileage =
    typeof car.mileage === "number"
      ? `${car.mileage.toLocaleString("id-ID")} km`
      : car.mileage || null;

  const handleTrackClick = () => {
    if (car.id) {
      incrementCarViews(car.id).catch(() => {});
    }
  };

  const metadataItems = [
    car.year ? `${car.year}` : null,
    formattedMileage,
    formatTransmission(car.transmission),
  ].filter(Boolean);

  // Variant compact
  if (variant === "compact") {
    return (
      <article>
        <Link
          href={targetUrl}
          onClick={handleTrackClick}
          className="group relative flex flex-col items-center text-center p-1.5 sm:p-2 rounded-md transition-colors duration-200 hover:bg-neutral-100/70"
        >
          <figure className="relative h-24 w-32 sm:h-36 sm:w-56 overflow-hidden rounded-md sm:rounded-none">
            {car.condition && (
              <div className="absolute top-0 left-0 z-10 pointer-events-none scale-75 origin-top-left">
                <CarBadge condition={car.condition} />
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-1.5 right-1.5 z-10 bg-red-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs tracking-wider">
                -{discountPercentage}%
              </span>
            )}
            <Image
              src={mainImage}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 50vw, 224px"
              className="object-cover"
              unoptimized={mainImage.startsWith("data:")}
            />
          </figure>
          <h4 className="mt-1.5 text-[11px] sm:text-xs font-bold tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1 uppercase">
            {displayTitle}
          </h4>
        </Link>
      </article>
    );
  }

  // Variant default
  return (
    <motion.article
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative flex flex-col w-full bg-white transition-colors duration-200 hover:bg-neutral-50/80 overflow-hidden border border-neutral-100 sm:border-none"
    >
      <Link
        href={targetUrl}
        onClick={handleTrackClick}
        className="flex flex-col h-full justify-between"
      >
        {/* Gambar utama */}
        <figure className="relative aspect-4/3 w-full overflow-hidden flex items-center justify-center rounded-t-md sm:rounded-none">
          {car.condition && (
            <div className="absolute top-0 left-0 z-10 pointer-events-none">
              <CarBadge condition={car.condition} />
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 rounded-xs tracking-wider">
              -{discountPercentage}%
            </span>
          )}

          <Image
            src={mainImage}
            alt={displayTitle}
            fill
            priority={false}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
            unoptimized={mainImage.startsWith("data:")}
          />
        </figure>

        {/* Info & Harga */}
        <section className="mt-2 sm:mt-3 flex flex-col flex-1 justify-between p-2 sm:p-0">
          <header>
            <h3 className="text-sm sm:text-[18px] font-bold text-neutral-950 leading-snug tracking-tight transition-colors line-clamp-2 min-h-[2.2rem] sm:min-h-[2.6rem] uppercase">
              {displayTitle}
            </h3>

            {metadataItems.length > 0 && (
              <div className="mt-1 sm:mt-2 flex flex-wrap items-center text-[10px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">
                {metadataItems.map((item, index) => (
                  <span key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-1 sm:mx-2 h-2.5 sm:h-3 w-[1px] bg-neutral-300 inline-block" />
                    )}
                    <span className="truncate max-w-[70px] sm:max-w-none">
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </header>

          <footer className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-neutral-200">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider leading-none">
              Prices Starting From
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <p className="text-base sm:text-xl font-bold text-red-600 tracking-tight leading-tight">
                {formattedFinalPrice}
              </p>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs font-medium text-neutral-400 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
          </footer>
        </section>
      </Link>
    </motion.article>
  );
}
