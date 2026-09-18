"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import ImageGallery from "@/components/common/ImageGallery";
import CarImageGrid from "@/components/common/CarImageGrid";
import type { Car } from "@/types/cars";

interface CarDetailContentProps {
  car: Car;
  children?: React.ReactNode;
}

// Carousel slider
function OverviewGalleryCarousel({
  images,
  altText,
}: {
  images: string[];
  altText: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dragStartPos = useRef({ x: 0, y: 0 });

  const displayImages =
    images.length > 0 ? [...images, ...images, ...images] : [];
  const totalOriginal = images.length;
  const totalSteps = Math.ceil(totalOriginal / 2);

  const x = useMotionValue(0);

  // Lock scroll saat modal buka
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const getTwoItemWidth = () => {
    if (!trackRef.current || !trackRef.current.children[0]) return 0;
    const firstItem = trackRef.current.children[0] as HTMLElement;
    const itemWidth = firstItem.getBoundingClientRect().width;
    const gap = 12;
    return (itemWidth + gap) * 2;
  };

  // Auto-slide logic
  useEffect(() => {
    if (totalOriginal <= 4 || isInteracting) return;

    const triggerSlide = () => {
      const shiftDistance = getTwoItemWidth();
      if (shiftDistance === 0) return;

      const currentX = x.get();
      const nextX = currentX - shiftDistance;

      const maxShift = -shiftDistance * totalSteps * 2;
      if (nextX <= maxShift) {
        x.set(-shiftDistance * totalSteps);
      }

      animate(
        x,
        nextX <= maxShift ? -shiftDistance * (totalSteps + 1) : nextX,
        {
          duration: 4.5,
          ease: [0.25, 1, 0.5, 1],
        },
      );

      setStepIndex((prev) => (prev + 1) % totalSteps);
    };

    const intervalId = setInterval(triggerSlide, 8000);
    const timeoutId = setTimeout(() => {
      triggerSlide();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [x, totalOriginal, totalSteps, isInteracting]);

  if (totalOriginal === 0) {
    return (
      <div className="p-8 text-center bg-neutral-50 text-xs text-neutral-400 font-medium">
        No gallery images available
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
    >
      {/* Slider track */}
      <div
        ref={containerRef}
        className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
      >
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragElastic={0.08}
          dragTransition={{
            power: 0.05,
            timeConstant: 800,
          }}
          onPointerDown={(e) => {
            dragStartPos.current = { x: e.clientX, y: e.clientY };
          }}
          onDragStart={() => setIsInteracting(true)}
          onDragEnd={() => {
            setIsInteracting(false);
            const shiftDistance = getTwoItemWidth();
            if (shiftDistance === 0) return;

            const currentX = x.get();
            const nearestStep = Math.round(currentX / shiftDistance);
            const targetX = nearestStep * shiftDistance;

            const normalizedStep =
              ((Math.abs(nearestStep) % totalSteps) + totalSteps) % totalSteps;
            setStepIndex(normalizedStep);

            animate(x, targetX, {
              duration: 2.5,
              ease: [0.25, 1, 0.5, 1],
            });
          }}
          className="flex gap-3 w-full"
        >
          {displayImages.map((img, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                const distanceX = Math.abs(e.clientX - dragStartPos.current.x);
                const distanceY = Math.abs(e.clientY - dragStartPos.current.y);

                if (distanceX < 6 && distanceY < 6) {
                  setSelectedImage(img);
                }
              }}
              className="relative aspect-4/3 w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] md:w-[calc((100%-36px)/4)] flex-shrink-0 overflow-hidden bg-neutral-100 select-none cursor-pointer"
            >
              <Image
                src={img}
                alt={`${altText} - ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover pointer-events-none"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots indicator */}
      {totalOriginal > 4 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isActive = idx === stepIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const shiftDistance = getTwoItemWidth();
                  if (shiftDistance === 0) return;

                  setStepIndex(idx);
                  const targetX = -shiftDistance * idx;

                  animate(x, targetX, {
                    duration: 3.0,
                    ease: [0.25, 1, 0.5, 1],
                  });
                }}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 w-2 rounded-full transition-all duration-700 ${
                  isActive
                    ? "bg-black scale-125"
                    : "bg-neutral-300 hover:bg-neutral-500"
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
          >
            {/* Close btn */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 md:top-8 md:right-8 text-white text-3xl md:text-4xl font-light cursor-pointer z-50 leading-none select-none"
            >
              ✕
            </button>

            {/* Modal image */}
            <div
              className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={altText}
                fill
                className="object-contain select-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Car detail content
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
      {/* Top section: Gallery left & info right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery left */}
        <section className="lg:col-span-7">
          <ImageGallery images={overviewImages} altText={carTitle} />
        </section>

        {/* Info right */}
        <section className="lg:col-span-5">{children}</section>
      </div>

      {/* Bottom section: Nav tabs & content */}
      <div className="space-y-8 border-t border-neutral-100 pt-6">
        {/* Nav tabs */}
        <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-md py-3 border-b border-neutral-100">
          <ul className="flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className="relative py-2 text-sm md:text-base tracking-[0.15em] font-semibold uppercase text-neutral-900 transition-colors duration-300 hover:text-neutral-500 inline-block cursor-pointer"
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
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
          {/* Overview tab */}
          {activeTab === "overview" && (
            <>
              {/* Description box bg #f2f2f2 tanpa rounded */}
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

          {/* Specs tab */}
          {activeTab === "spesifikasi" && (
            <section className="space-y-3 bg-[#f2f2f2] p-6">
              <p className="text-sm md:text-base leading-relaxed text-neutral-700 whitespace-pre-line font-normal tracking-wide">
                {car.description ||
                  "No additional specification description available for this unit."}
              </p>
            </section>
          )}

          {/* Exterior tab */}
          {activeTab === "eksterior" && (
            <section className="space-y-4">
              <CarImageGrid
                images={exteriorImages}
                altText={`${carTitle} Exterior`}
              />
            </section>
          )}

          {/* Interior tab */}
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
