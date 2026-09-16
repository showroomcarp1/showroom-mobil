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

export default function CarCard({ car, variant = "default" }: CarCardProps) {
  const displayTitle = car.title || `${car.brand} ${car.model}`.trim();
  const targetUrl = `/cars/${car.slug || car.id}`;

  const mainImage =
    car.images && car.images.length > 0 && car.images[0]
      ? car.images[0]
      : car.image_url ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E";

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(car.price);

  const formattedMileage =
    typeof car.mileage === "number"
      ? `${car.mileage.toLocaleString("id-ID")} km`
      : car.mileage || null;

  // Track view secara background
  const handleTrackClick = () => {
    if (car.id) {
      incrementCarViews(car.id).catch(() => {});
    }
  };

  // Filter metadata yang valid untuk pemisah garis vertikal
  const metadataItems = [
    car.year ? `${car.year}` : null,
    formattedMileage,
    car.transmission ? car.transmission : null,
  ].filter(Boolean);

  // Variant Compact
  if (variant === "compact") {
    return (
      <Link
        href={targetUrl}
        onClick={handleTrackClick}
        className="group relative flex flex-col items-center text-center p-2 rounded-lg transition-colors duration-200 hover:bg-neutral-100/70"
      >
        <div className="relative h-28 w-44 sm:h-36 sm:w-56 overflow-hidden">
          {car.condition && (
            <div className="absolute top-1 left-1 z-10 pointer-events-none scale-75 origin-top-left">
              <CarBadge condition={car.condition} />
            </div>
          )}
          <Image
            src={mainImage}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 176px, 224px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized={mainImage.startsWith("data:")}
          />
        </div>
        <h4 className="mt-2 text-xs font-semibold tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
          {displayTitle}
        </h4>
      </Link>
    );
  }

  // Variant Default (Clean & Seamless Professional)
  return (
    <article className="group relative flex flex-col w-full bg-white p-3.5 sm:p-4 rounded-lg transition-colors duration-200 hover:bg-neutral-50/80">
      <Link
        href={targetUrl}
        onClick={handleTrackClick}
        className="flex flex-col h-full justify-between"
      >
        {/* Visual Gambar Utama */}
        <div className="relative aspect-4/3 w-full overflow-hidden flex items-center justify-center">
          {car.condition && (
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <CarBadge condition={car.condition} />
            </div>
          )}
          <Image
            src={mainImage}
            alt={displayTitle}
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            unoptimized={mainImage.startsWith("data:")}
          />
        </div>

        {/* Informasi Utama */}
        <div className="mt-3 flex flex-col flex-1 justify-between">
          <div>
            {/* Judul Mobil */}
            <h3 className="text-sm sm:text-[20px] font-bold text-neutral-900 leading-snug tracking-tight transition-colors line-clamp-2 min-h-[2.5rem]">
              {displayTitle}
            </h3>

            {/* Sub-Info Metadata: Tanpa titik/bullet, menggunakan separator vertikal (line divide) yang sangat tipis */}
            {metadataItems.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center text-xs text-neutral-500 font-medium">
                {metadataItems.map((item, index) => (
                  <span key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-2 h-3 w-[1px] bg-neutral-200 inline-block" />
                    )}
                    <span className="capitalize">{item}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blok Harga */}
          <div className="mt-3.5 pt-2.5 border-t border-neutral-100">
            <span className="block text-[13px] font-normal text-neutral-500">
              Prices Starting From
            </span>
            <p className="text-base sm:text-lg font-bold text-red-600 tracking-tight leading-tight mt-0.5">
              {formattedPrice}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
