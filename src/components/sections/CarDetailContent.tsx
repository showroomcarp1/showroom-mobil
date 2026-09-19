"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  PanInfo,
} from "framer-motion";
import Image from "next/image";
import ImageGallery from "@/components/common/ImageGallery";
import CarImageGrid from "@/components/common/CarImageGrid";
import type { Car } from "@/types/cars";

interface CarDetailContentProps {
  car: Car;
  children?: React.ReactNode;
}

function OverviewGalleryCarousel({
  images,
  altText,
}: {
  images: string[];
  altText: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // pointer tracker bedakan drag vs click
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // duplikasi array gambar untuk seamless loop (3 set)
  const extendedImages =
    images.length > 1 ? [...images, ...images, ...images] : images;
  const originalLength = images.length;

  const x = useMotionValue(0);
  const itemWidth = 300 + 16; // width 300px + gap 16px
  const totalOriginalWidth = originalLength * itemWidth;

  // Auto scroll: berpindah 1 item dengan lembut, lalu berhenti sejenak
  useEffect(() => {
    if (originalLength <= 1 || isPaused || selectedIndex !== null) return;

    const interval = setInterval(() => {
      const currentX = x.get();
      const targetX = currentX - itemWidth;

      // Update dot indicator
      setCurrentIndex((prev) => (prev + 1) % originalLength);

      // Animasi geser 1 step dengan lembut (1.2 detik)
      animate(x, targetX, {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1],
        onComplete: () => {
          // Seamless reset jika sudah melewati set ke-2
          if (Math.abs(targetX) >= totalOriginalWidth * 2) {
            x.set(targetX + totalOriginalWidth);
          }
        },
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [
    originalLength,
    isPaused,
    selectedIndex,
    itemWidth,
    totalOriginalWidth,
    x,
  ]);

  // disable body scroll
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  // keyboard nav
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % originalLength : 0,
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + originalLength) % originalLength : 0,
        );
      } else if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, originalLength]);

  // dot click handler
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    const currentX = x.get();

    const currentSet = Math.floor(Math.abs(currentX) / totalOriginalWidth) || 0;
    const targetX = -(currentSet * totalOriginalWidth + index * itemWidth);

    animate(x, targetX, {
      duration: 1.2,
      ease: [0.25, 1, 0.5, 1],
    });
  };

  // mousedown/touchstart handler
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
    setIsPaused(true); // Mati saat disentuh/didrag
  };

  // mousemove/touchmove handler
  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.current.y);

    if (deltaX > 5 || deltaY > 5) {
      isDragging.current = true;
    }
  };

  // realtime seamless wrap saat drag
  const handleDrag = () => {
    if (originalLength <= 1) return;
    const currentX = x.get();

    if (currentX > 0) {
      x.set(currentX - totalOriginalWidth);
    } else if (currentX < -totalOriginalWidth * 2) {
      x.set(currentX + totalOriginalWidth);
    }
  };

  // drag end handler
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsPaused(false); // Aktifkan kembali saat dilepas

    if (originalLength <= 1) return;

    const currentX = x.get();
    const velocityX = info.velocity.x;

    const targetIndex = Math.round((-currentX - velocityX * 0.2) / itemWidth);
    const rawIndex =
      ((targetIndex % originalLength) + originalLength) % originalLength;

    setCurrentIndex(rawIndex);

    animate(x, -targetIndex * itemWidth, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        const finalX = -targetIndex * itemWidth;
        if (Math.abs(finalX) >= totalOriginalWidth * 2) {
          x.set(finalX + totalOriginalWidth);
        } else if (finalX > 0) {
          x.set(finalX - totalOriginalWidth);
        }
      },
    });
  };

  // image click handler
  const handleImageClick = (realIndex: number) => {
    if (!isDragging.current) {
      setSelectedIndex(realIndex);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center bg-neutral-50 text-xs text-neutral-400 font-medium">
        No gallery images available
      </div>
    );
  }

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <section aria-label={`Karusel galeri ${altText}`} className="space-y-4">
      {/* carousel container */}
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none py-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          style={{ x }}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="flex gap-4 touch-pan-y"
        >
          {extendedImages.map((img, idx) => {
            const realIndex = idx % originalLength;
            return (
              <article
                key={idx}
                onClick={() => handleImageClick(realIndex)}
                className="relative aspect-[4/3] w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[300px] flex-shrink-0 overflow-hidden bg-neutral-100 cursor-pointer transition-transform duration-300 active:scale-[0.98]"
              >
                <Image
                  src={img}
                  alt={`${altText} - foto ke-${realIndex + 1}`}
                  fill
                  quality={75}
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 300px"
                  className="object-cover pointer-events-none"
                />
              </article>
            );
          })}
        </motion.div>
      </div>

      {/* dots indicator */}
      {originalLength > 1 && (
        <nav
          aria-label="Navigasi slide foto"
          className="flex items-center justify-center gap-2 pt-1"
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Buka slide foto ${idx + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                currentIndex % originalLength === idx
                  ? "bg-neutral-900 scale-110"
                  : "bg-neutral-300"
              }`}
            />
          ))}
        </nav>
      )}

      {/* modal lightbox */}
      <AnimatePresence>
        {selectedImage && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Tampilan foto ${altText}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 cursor-zoom-out"
          >
            {/* button close */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Tutup gambar"
              className="absolute top-5 right-5 text-white text-3xl font-light cursor-pointer z-50 leading-none p-2 focus:outline-none"
            >
              ✕
            </button>

            {/* modal container */}
            <div
              className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* button prev */}
              {originalLength > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) =>
                      prev !== null
                        ? (prev - 1 + originalLength) % originalLength
                        : 0,
                    );
                  }}
                  aria-label="Foto sebelumnya"
                  className="absolute left-1 md:-left-10 z-50 text-white cursor-pointer p-1 focus:outline-none"
                >
                  <svg
                    className="w-8 h-12 md:w-10 md:h-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* image preview */}
              <figure className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage}
                  alt={`${altText} - foto ke-${selectedIndex + 1}`}
                  fill
                  quality={85}
                  className="object-contain select-none"
                  priority
                />
              </figure>

              {/* button next */}
              {originalLength > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) =>
                      prev !== null ? (prev + 1) % originalLength : 0,
                    );
                  }}
                  aria-label="Foto selanjutnya"
                  className="absolute right-1 md:-right-10 z-50 text-white cursor-pointer p-1 focus:outline-none"
                >
                  <svg
                    className="w-8 h-12 md:w-10 md:h-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
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
      {/* main section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <section className="lg:col-span-7">
          <ImageGallery images={overviewImages} altText={carTitle} />
        </section>

        <section className="lg:col-span-5">{children}</section>
      </div>

      {/* tab section */}
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

        {/* tab content */}
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
