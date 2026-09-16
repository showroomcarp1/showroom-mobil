import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/common/ImageGallery";
import CreditCalculator from "@/components/sections/CreditCalculator";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faGasPump,
  faGears,
  faCalendar,
  faRoad,
} from "@fortawesome/free-solid-svg-icons";
import type { Car } from "@/types/cars";

interface CarDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const resolvedParams = await params;
  const rawParam = decodeURIComponent(resolvedParams.slug);
  const supabase = await createClient();

  // 1. Cari berdasarkan 'slug'
  const { data: carBySlug } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", rawParam)
    .maybeSingle();

  let car = carBySlug as Car | null;

  // 2. Fallback: Cari berdasarkan 'id' jika slug tidak ditemukan
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

  const finalPrice = car.discount_price
    ? car.price - car.discount_price
    : car.price;

  const carTitle =
    car.title || `${car.brand} ${car.model} ${car.variant || ""}`.trim();

  const carImages: string[] =
    car.images && car.images.length > 0
      ? car.images
      : car.image_url
        ? [car.image_url]
        : ["/placeholder-car.png"];

  // Format Mileage dengan aman (baik bertipe number maupun string)
  const formattedMileage =
    car.mileage !== undefined && car.mileage !== null
      ? typeof car.mileage === "number"
        ? car.mileage.toLocaleString("id-ID")
        : Number(car.mileage).toLocaleString("id-ID")
      : null;

  return (
    <main className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Gallery & Deskripsi */}
          <div className="lg:col-span-7 space-y-8">
            <ImageGallery images={carImages} altText={carTitle} />
            <article className="border-t border-neutral-100 pt-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Deskripsi Kendaraan
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 whitespace-pre-line">
                {car.description ||
                  "Tidak ada deskripsi tambahan untuk unit ini."}
              </p>
            </article>
          </div>

          {/* Sidebar Detail & Kredit */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {car.brand}
                </span>
                <h1 className="text-2xl font-extrabold text-neutral-900">
                  {carTitle}
                </h1>
              </div>

              <div className="flex items-center justify-between border-y border-neutral-100 py-3 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-neutral-400"
                  />
                  <span>{car.year}</span>
                </div>
                {formattedMileage && (
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={faRoad}
                      className="text-neutral-400"
                    />
                    <span>{formattedMileage} km</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faGears}
                    className="text-neutral-400"
                  />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faGasPump}
                    className="text-neutral-400"
                  />
                  <span>{car.fuel_type}</span>
                </div>
              </div>

              <div>
                {Boolean(car.discount_price && car.discount_price > 0) && (
                  <span className="block text-xs text-neutral-400 line-through">
                    Rp {car.price.toLocaleString("id-ID")}
                  </span>
                )}
                <span className="text-2xl font-black text-red-600">
                  Rp {finalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo, saya tertarik dengan unit ${carTitle}. Apakah masih tersedia?`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
                Tanya Sales via WhatsApp
              </a>
            </div>

            <CreditCalculator carPrice={finalPrice} />
          </aside>
        </div>
      </div>
    </main>
  );
}
