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

// Carousel
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

  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const extendedImages =
    images.length > 1 ? [...images, ...images, ...images] : images;
  const originalLength = images.length;

  const x = useMotionValue(0);
  const itemWidth = 300 + 16;
  const totalOriginalWidth = originalLength * itemWidth;

  // Auto scroll
  useEffect(() => {
    if (originalLength <= 1 || isPaused || selectedIndex !== null) return;

    const interval = setInterval(() => {
      const currentX = x.get();
      const targetX = currentX - itemWidth;

      setCurrentIndex((prev) => (prev + 1) % originalLength);

      animate(x, targetX, {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1],
        onComplete: () => {
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

  // Lock scroll on modal
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

  // Keyboard navigation
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

  // Dot click
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

  // Pointer events
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
    setIsPaused(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.current.y);

    if (deltaX > 5 || deltaY > 5) {
      isDragging.current = true;
    }
  };

  // Drag handlers
  const handleDrag = () => {
    if (originalLength <= 1) return;
    const currentX = x.get();

    if (currentX > 0) {
      x.set(currentX - totalOriginalWidth);
    } else if (currentX < -totalOriginalWidth * 2) {
      x.set(currentX + totalOriginalWidth);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsPaused(false);

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

  // Image click
  const handleImageClick = (realIndex: number) => {
    if (!isDragging.current) {
      setSelectedIndex(realIndex);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center bg-neutral-900 border border-neutral-800 text-xs text-neutral-500 font-medium rounded-xs">
        No gallery images available
      </div>
    );
  }

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <section aria-label={`Karusel galeri ${altText}`} className="space-y-4">
      {/* Carousel list */}
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
                className="relative aspect-[4/3] w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[300px] flex-shrink-0 overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer transition-transform duration-300 active:scale-[0.98]"
              >
                <figure className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`${altText} - foto ke-${realIndex + 1}`}
                    fill
                    quality={75}
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 300px"
                    className="object-cover pointer-events-none"
                  />
                </figure>
              </article>
            );
          })}
        </motion.div>
      </div>

      {/* Dots navigation */}
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
              className={`h-2 w-2 rounded-full transition-all duration-300 focus:outline-none ${
                currentIndex % originalLength === idx
                  ? "bg-white scale-125"
                  : "bg-neutral-700 hover:bg-neutral-500"
              }`}
            />
          ))}
        </nav>
      )}

      {/* Lightbox modal */}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Tutup gambar"
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-3xl font-light cursor-pointer z-50 leading-none p-2 focus:outline-none transition-colors"
            >
              ✕
            </button>

            {/* Lightbox content */}
            <div
              className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev button */}
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
                  className="absolute left-1 md:-left-10 z-50 text-neutral-400 hover:text-white cursor-pointer p-1 focus:outline-none transition-colors"
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

              {/* Preview image */}
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

              {/* Next button */}
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
                  className="absolute right-1 md:-right-10 z-50 text-neutral-400 hover:text-white cursor-pointer p-1 focus:outline-none transition-colors"
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
    <main className="space-y-12">
      {/* Hero section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <ImageGallery images={overviewImages} altText={carTitle} />
        </div>

        <aside className="lg:col-span-5">{children}</aside>
      </section>

      {/* Tabs & Content */}
      <section className="space-y-8">
        {/* Sticky Navbar */}
        <nav className="sm:top-20 z-20 bg-neutral-950 py-3 border-b border-neutral-800">
          <ul className="flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`relative py-2 text-xs sm:text-sm md:text-base tracking-[0.15em] font-semibold uppercase transition-colors duration-200 inline-block cursor-pointer ${
                      isActive
                        ? "text-white"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
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

        {/* Tab content */}
        <div className="space-y-12 pt-2">
          {activeTab === "overview" && (
            <>
              {/* Specifications */}
              <section className="space-y-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xs">
                <h2 className="text-base md:text-[20px] font-bold uppercase tracking-[0.15em] text-white">
                  Specifications
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-neutral-300 whitespace-pre-line font-normal tracking-wide">
                  {car.description ||
                    "No additional specification description available for this unit."}
                </p>
              </section>

              {/* Gallery */}
              <section className="space-y-4">
                <h2 className="text-base md:text-[20px] font-bold uppercase tracking-[0.15em] text-white">
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
            <section className="space-y-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xs">
              <p className="text-sm md:text-base leading-relaxed text-neutral-300 whitespace-pre-line font-normal tracking-wide">
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
      </section>
    </main>
  );
}
