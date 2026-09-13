"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md">
      {/* Visual & Metadata Unit */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">
            {car.brand} {car.model}
          </h3>
          <p className="text-xs text-neutral-500">{car.variant}</p>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-neutral-600">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faCalendar}
              className="h-3 w-3 text-neutral-400"
            />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faGears}
              className="h-3 w-3 text-neutral-400"
            />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium text-neutral-400 block">
              Harga OTR
            </span>
            <span className="text-xs font-extrabold text-neutral-900">
              Rp {car.price.toLocaleString("id-ID")}
            </span>
          </div>

          <Link
            href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${car.brand}%20${car.model}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="h-3.5 w-3.5" />
            Tanya
          </Link>
        </div>
      </div>
    </div>
  );
}
