import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/sections/HeroSlider";
import CarCard from "@/components/sections/CarCard";
import { Car } from "@/types/car";

// Data dummy untuk tampilan awal
const dummyCars: Car[] = [
  {
    id: "1",
    slug: "toyota-alphard-2024",
    brand: "Toyota",
    model: "Alphard",
    variant: "2.5 HEV Executive Lounge",
    year: 2024,
    transmission: "Automatic",
    fuel_type: "Hybrid",
    price: 1650000000,
    discount_price: 35000000,
    image_url:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800",
    status: "available",
  },
  {
    id: "2",
    slug: "bmw-330i-msport-2023",
    brand: "BMW",
    model: "330i",
    variant: "M Sport LCI",
    year: 2023,
    transmission: "Automatic",
    fuel_type: "Bensin",
    price: 1240000000,
    discount_price: 50000000,
    image_url:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800",
    status: "available",
  },
  {
    id: "3",
    slug: "hyundai-ioniq-6-2024",
    brand: "Hyundai",
    model: "Ioniq 6",
    variant: "Signature AWD",
    year: 2024,
    transmission: "Automatic",
    fuel_type: "Electric",
    price: 1220000000,
    image_url:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800",
    status: "available",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Section Hero */}
        <HeroSlider />

        {/* Section Listing Mobil */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Unit Pilihan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                  Katalog Mobil Terbaru
                </h2>
              </div>
            </div>

            {/* Grid Mobil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
