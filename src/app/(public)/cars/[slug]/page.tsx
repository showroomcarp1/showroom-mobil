import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import CreditCalculator from "@/components/sections/CreditCalculator";
import CarDetailContent from "@/components/sections/CarDetailContent";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faGasPump,
  faGears,
  faCalendar,
  faRoad,
  faChevronRight,
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

  const finalPrice = car.discount_price
    ? car.price - car.discount_price
    : car.price;

  const carTitle =
    car.title || `${car.brand} ${car.model} ${car.variant || ""}`.trim();

  return (
    <main className="bg-white pt-6 pb-20 text-neutral-900">
      {/* SEMANTIC BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-neutral-100 bg-white py-2"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 overflow-x-auto whitespace-nowrap">
            <li>
              <Link href="/" className="hover:text-black transition-colors">
                HOME
              </Link>
            </li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2 w-2 text-neutral-300"
            />
            <li>
              <Link href="/cars" className="hover:text-black transition-colors">
                {conditionBreadcrumbLabel[car.condition] || "CAR"}
              </Link>
            </li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2 w-2 text-neutral-300"
            />
            <li>
              <span className="text-neutral-500">{car.brand}</span>
            </li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2 w-2 text-neutral-300"
            />
            <li className="text-black font-black truncate max-w-[200px]">
              {carTitle}
            </li>
          </ol>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* KONTEN UTAMA: Menangani Nav Tab Interaktif & Galeri */}
          <section className="lg:col-span-7 space-y-6">
            <CarDetailContent car={car} />
          </section>

          {/* SIDEBAR KANAN: Detail & Simulasi */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <div className="border border-neutral-200 bg-white p-6 space-y-6 rounded-none">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {car.brand}
                </span>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight mt-0.5">
                  {carTitle}
                </h1>
              </div>

              <div className="grid grid-cols-4 gap-2 border-y border-neutral-100 py-4 text-center text-xs text-neutral-800">
                <div className="flex flex-col items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="h-4 w-4 text-neutral-400"
                  />
                  <span className="font-bold text-[11px]">{car.year}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faRoad}
                    className="h-4 w-4 text-neutral-400"
                  />
                  <span className="font-bold text-[11px]">
                    {car.mileage
                      ? `${Number(car.mileage).toLocaleString("id-ID")} km`
                      : "-"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faGears}
                    className="h-4 w-4 text-neutral-400"
                  />
                  <span className="font-bold text-[11px]">
                    {car.transmission}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faGasPump}
                    className="h-4 w-4 text-neutral-400"
                  />
                  <span className="font-bold text-[11px]">{car.fuel_type}</span>
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-red-600 tracking-tight">
                  Rp {finalPrice.toLocaleString("id-ID")}
                </div>
              </div>

              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo, saya tertarik dengan unit ${carTitle}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-none bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors"
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
