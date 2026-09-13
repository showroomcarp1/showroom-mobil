import ImageGallery from "@/components/common/ImageGallery";
import CreditCalculator from "@/components/sections/CreditCalculator";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faGasPump, faGears, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { formatRupiah } from "@/lib/utils/formatters";

export default function CarDetailPage({ params }: { params: { slug: string } }) {
  // Mockup data detail
  const car = {
    brand: "Toyota",
    model: "Alphard",
    variant: "2.5 HEV Executive Lounge",
    year: 2024,
    transmission: "Automatic",
    fuel_type: "Hybrid",
    price: 1650000000,
    discount_price: 35000000,
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800",
    ],
    description: "MPV Luxury premium dengan kenyamanan kabin luar biasa dan efisiensi mesin hybrid terkini.",
  };

  const finalPrice = car.discount_price ? car.price - car.discount_price : car.price;

  return (
    <main className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Kolom Kiri: Galeri Foto & Deskripsi */}
          <div className="lg:col-span-7 space-y-8">
            <ImageGallery images={car.images} altText={`${car.brand} ${car.model}`} />

            <article className="border-t border-neutral-100 pt-6">
              <h2 className="text-lg font-bold text-neutral-900">Deskripsi Kendaraan</h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">{car.description}</p>
            </article>
          </div>

          {/* Kolom Kanan: Detail Harga & Simulasi Kredit */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase text-neutral-400">{car.brand}</span>
                <h1 className="text-2xl font-extrabold text-neutral-900">
                  {car.model} {car.variant}
                </h1>
              </div>

              {/* Ringkasan Spek */}
              <div className="flex justify-between border-y border-neutral-100 py-3 text-xs text-neutral-600">
                <div className="flex items-center gap-1"><FontAwesomeIcon icon={faCalendar} className="text-neutral-400" /> {car.year}</div>
                <div className="flex items-center gap-1"><FontAwesomeIcon icon={faGears} className="text-neutral-400" /> {car.transmission}</div>
                <div className="flex items-center gap-1"><FontAwesomeIcon icon={faGasPump} className="text-neutral-400" /> {car.fuel_type}</div>
              </div>

              {/* Harga OTR */}
              <div>
                {car.discount_price && car.discount_price > 0 && (
                  <span className="block text-xs text-neutral-400 line-through">{formatRupiah(car.price)}</span>
                )}
                <span className="text-2xl font-black text-neutral-900">{formatRupiah(finalPrice)}</span>
              </div>

              {/* CTA WhatsApp */}
              <a
                href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(
                  `${car.brand} ${car.model}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
                Tanya Sales via WhatsApp
              </a>
            </div>

            {/* Component Kalkulator Kredit */}
            <CreditCalculator carPrice={finalPrice} />
          </aside>
        </div>
      </div>
    </main>
  );
}