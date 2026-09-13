"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export const BRAND_CARDS = [
  { name: "BMW", slug: "bmw", image: "/images/brands/bmw.png" },
  {
    name: "Mercedes-Benz",
    slug: "mercedes-benz",
    image: "/images/brands/mercedes.png",
  },
  { name: "Porsche", slug: "porsche", image: "/images/brands/porsche.png" },
  { name: "Ferrari", slug: "ferrari", image: "/images/brands/ferrari.png" },
  {
    name: "Lamborghini",
    slug: "lamborghini",
    image: "/images/brands/lamborghini.png",
  },
  {
    name: "Land Rover",
    slug: "land-rover",
    image: "/images/brands/landrover.png",
  },

  { name: "Mini", slug: "Mini", image: "/images/brands/mini.png" },
  { name: "Audi", slug: "audi", image: "/images/brands/audi.png" },
  { name: "Maserati", slug: "maserati", image: "/images/brands/maserati.png" },
  {
    name: "Aston Martin",
    slug: "aston-martin",
    image: "/images/brands/astonmartin.png",
  },
  { name: "Bentley", slug: "bentley", image: "/images/brands/bentley.png" },
  {
    name: "Rolls-Royce",
    slug: "rolls-royce",
    image: "/images/brands/rollsroyce.png",
  },
  { name: "McLaren", slug: "mclaren", image: "/images/brands/mclaren.png" },
  { name: "Jaguar", slug: "jaguar", image: "/images/brands/jaguar.png" },
  { name: "Subaru", slug: "subaru", image: "/images/brands/subaru.png" },

  { name: "Lexus", slug: "lexus", image: "/images/brands/lexus.png" },
  { name: "Honda", slug: "honda", image: "/images/brands/honda.png" },
  { name: "Toyota", slug: "toyota", image: "/images/brands/toyota.png" },
];

export default function BrandsMegaMenu() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-0 top-full mt-7 w-[1100px] bg-white text-neutral-900 shadow- rounded-md border border-neutral-200 z-50 p-8 overflow-visible"
    >
      {/* Dropdown  */}
      <div className="absolute -top-3 left-12 w-6 h-6 bg-white border-t border-l border-neutral-200 rotate-45 z-10" />

      {/* Header Mega Menu */}
      <header className="pb-4 mb-6 border-b border-neutral-200 relative z-20">
        <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">
          Select a brand
        </h2>
      </header>

      {/* Navigasi Brand */}
      <nav
        aria-label="Brands Navigation"
        className="max-h-[600px] overflow-y-auto px-2 custom-scrollbar relative z-20"
      >
        <ul className="grid grid-cols-3 gap-6 pb-2 group/list">
          {BRAND_CARDS.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/cars?brand=${brand.slug}`}
                className="group block relative z-10 hover:z-30"
              >
                {/* Frame Foto d */}
                <div className="relative h-56 w-full rounded-md bg-white border border-neutral-200 shadow-sm p-6 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover/list:brightness-50 group-hover:!brightness-100">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1200px) 33vw, 350px"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a3a3a3;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #737373;
        }
      `}</style>
    </motion.section>
  );
}
