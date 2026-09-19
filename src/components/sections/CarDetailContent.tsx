"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ImageGallery from "@/components/common/ImageGallery";
import CarImageGrid from "@/components/common/CarImageGrid";
import type { Car } from "@/types/cars";

interface CarDetailContentProps {
  car: Car;
  children?: React.ReactNode;
}

// Carousel slider versi optimal (Ringan & Responsive)
function OverviewGalleryCarousel({
  images,
  altText,
}: {
  images: string[];
  altText: string;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center bg-neutral-50 text-xs text-neutral-400 font-medium">
        No gallery images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Slider Container Menggunakan Native Scrollbar Murni */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className="snap-start relative aspect-[4/3] w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[220px] flex-shrink-0 overflow-hidden bg-neutral-100 cursor-pointer transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            <Image
              src={img}
              alt={`${altText} - ${idx + 1}`}
              fill
              quality={65}
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 220px"
              className="object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 text-white text-3xl font-light cursor-pointer z-50 leading-none"
            >
              ✕
            </button>

            <div
              className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={altText}
                fill
                quality={85}
                className="object-contain select-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CarDetailContent({
  car,
  children,
}: CarDetailContentProps) {
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

  const combinedGallery = [...exteriorImages, ...interiorImages];
  const combinedImages =
    combinedGallery.length > 0 ? combinedGallery : overviewImages;

  const navItems = [
    { id: "overview", label: "OVERVIEW" },
    { id: "spesifikasi", label: "SPECIFICATIONS" },
    { id: "eksterior", label: "EXTERIOR" },
    { id: "interior", label: "INTERIOR" },
  ];

  return (
    <div className="space-y-12">
      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <section className="lg:col-span-7">
          <ImageGallery images={overviewImages} altText={carTitle} />
        </section>

        <section className="lg:col-span-5">{children}</section>
      </div>

      {/* Bottom section */}
      <div className="space-y-8 border-t border-neutral-100 pt-6">
        <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-md py-3 border-b border-neutral-100">
          <ul className="flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className="relative py-2 text-sm md:text-base tracking-[0.15em] font-semibold uppercase text-neutral-900 transition-colors duration-200 hover:text-neutral-500 inline-block cursor-pointer"
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-12 pt-2">
          {activeTab === "overview" && (
            <>
              <section className="space-y-3 bg-[#f2f2f2] p-6">
                <h2 className="text-base md:text-[24px] font-black uppercase tracking-[0.2em] text-neutral-900">
                  Specifications
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-neutral-700 whitespace-pre-line font-normal tracking-wide">
                  {car.description ||
                    "No additional specification description available for this unit."}
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-base md:text-[24px] font-black uppercase tracking-[0.2em] text-neutral-900">
                  Gallery
                </h2>
                <OverviewGalleryCarousel
                  images={combinedImages}
                  altText={carTitle}
                />
              </section>
            </>
          )}

          {activeTab === "spesifikasi" && (
            <section className="space-y-3 bg-[#f2f2f2] p-6">
              <p className="text-sm md:text-base leading-relaxed text-neutral-700 whitespace-pre-line font-normal tracking-wide">
                {car.description ||
                  "No additional specification description available for this unit."}
              </p>
            </section>
          )}

          {activeTab === "eksterior" && (
            <section className="space-y-4">
              <CarImageGrid
                images={exteriorImages}
                altText={`${carTitle} Exterior`}
              />
            </section>
          )}

          {activeTab === "interior" && (
            <section className="space-y-4">
              <CarImageGrid
                images={interiorImages}
                altText={`${carTitle} Interior`}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
