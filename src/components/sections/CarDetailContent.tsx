"use client";

import { useState } from "react";
import ImageGallery from "@/components/common/ImageGallery";
import CarImageGrid from "@/components/common/CarImageGrid";
import type { Car } from "@/types/cars";

interface CarDetailContentProps {
  car: Car;
}

export default function CarDetailContent({ car }: CarDetailContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const carTitle =
    car.title || `${car.brand} ${car.model} ${car.variant || ""}`.trim();

  const overviewImages: string[] =
    car.images && car.images.length > 0
      ? car.images
      : car.image_url
        ? [car.image_url]
        : ["/placeholder-car.png"];

  const exteriorImages = car.exterior_images || [];
  const interiorImages = car.interior_images || [];

  const navItems = [
    { id: "overview", label: "OVERVIEW" },
    { id: "spesifikasi", label: "SPESIFIKASI" },
    { id: "eksterior", label: "EKSTERIOR" },
    { id: "interior", label: "INTERIOR" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. FOTO GALERI UTAMA (Selalu Tampil di Paling Atas) */}
      <section className="bg-white">
        <ImageGallery images={overviewImages} altText={carTitle} />
      </section>

      {/* 2. MENU NAV TAB (Berada di Bawah Foto Utama & Sticky) */}
      <nav className="sticky top-0 z-20 border-y border-neutral-200 bg-white/95 backdrop-blur-md">
        <ul className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-xs font-black tracking-widest text-neutral-500 py-3 scrollbar-none touch-pan-x px-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`cursor-pointer transition-colors pb-1 border-b-2 uppercase ${
                    isActive
                      ? "border-red-600 text-black font-black"
                      : "border-transparent text-neutral-400 hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 3. KONTEN BERDASARKAN TAB */}
      <div className="space-y-8 pt-2">
        {/* TAB OVERVIEW: Menampilkan SEMUA Konten (Deskripsi + Eksterior + Interior) */}
        {activeTab === "overview" && (
          <>
            {/* Section Deskripsi */}
            <section className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
                Deskripsi Kendaraan
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 whitespace-pre-line font-medium">
                {car.description ||
                  "Tidak ada deskripsi tambahan untuk unit ini."}
              </p>
            </section>

            {/* Section Eksterior */}
            <section className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
                Galeri Eksterior ({exteriorImages.length})
              </h2>
              <CarImageGrid
                images={exteriorImages}
                altText={`${carTitle} Eksterior`}
              />
            </section>

            {/* Section Interior */}
            <section className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
                Galeri Interior ({interiorImages.length})
              </h2>
              <CarImageGrid
                images={interiorImages}
                altText={`${carTitle} Interior`}
              />
            </section>
          </>
        )}

        {/* TAB SPESIFIKASI ONLY */}
        {activeTab === "spesifikasi" && (
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
              Deskripsi Kendaraan
            </h2>
            <p className="text-xs leading-relaxed text-neutral-700 whitespace-pre-line font-medium">
              {car.description ||
                "Tidak ada deskripsi tambahan untuk unit ini."}
            </p>
          </section>
        )}

        {/* TAB EKSTERIOR ONLY */}
        {activeTab === "eksterior" && (
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
              Galeri Eksterior ({exteriorImages.length})
            </h2>
            <CarImageGrid
              images={exteriorImages}
              altText={`${carTitle} Eksterior`}
            />
          </section>
        )}

        {/* TAB INTERIOR ONLY */}
        {activeTab === "interior" && (
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
              Galeri Interior ({interiorImages.length})
            </h2>
            <CarImageGrid
              images={interiorImages}
              altText={`${carTitle} Interior`}
            />
          </section>
        )}
      </div>
    </div>
  );
}
