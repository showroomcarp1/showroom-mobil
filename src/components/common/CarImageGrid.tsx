"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CarImageGridProps {
  images: string[];
  altText: string;
}

export default function CarImageGrid({ images, altText }: CarImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const cachedImages = useRef<Set<string>>(new Set());

  // Prefetch gambar secara instan ke cache memori browser
  const prefetchImage = useCallback((src: string) => {
    if (!src || cachedImages.current.has(src)) return;
    const img = new window.Image();
    img.src = src;
    cachedImages.current.add(src);
  }, []);

  // Kunci scrollbar tanpa menyebabkan layout shift pada body / elemen fixed
  useEffect(() => {
    if (selectedImage) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );
      document.documentElement.classList.add("overflow-hidden", "pr-[var(--scrollbar-width)]");
    } else {
      document.documentElement.classList.remove("overflow-hidden", "pr-[var(--scrollbar-width)]");
      document.documentElement.style.removeProperty("--scrollbar-width");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden", "pr-[var(--scrollbar-width)]");
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, [selectedImage]);

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 text-neutral-400 text-xs font-medium">
        Foto tidak tersedia untuk kategori ini.
      </div>
    );
  }

  return (
    <section aria-label={`Galeri foto ${altText}`} className="space-y-4">
      {/* Grid Foto Semantik */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => {
                setIsLoaded(cachedImages.current.has(img));
                setSelectedImage(img);
              }}
              onMouseEnter={() => prefetchImage(img)}
              onFocus={() => prefetchImage(img)}
              onTouchStart={() => prefetchImage(img)}
              aria-label={`Buka tampilan penuh foto ${idx + 1} dari ${altText}`}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 cursor-pointer transition-transform duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <Image
                src={img}
                alt={`${altText} foto ke-${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox Modal Semantik */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Tampilan Gambar Penuh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }} // Transisi instan
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          >
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Tutup tampilan gambar"
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white text-3xl font-light cursor-pointer z-50 p-2 leading-none transition-colors focus:outline-none"
            >
              ✕
            </button>

            {/* Container Gambar & Skeleton Loader */}
            <figure
              className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Skeleton Animation */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-neutral-900/80 animate-pulse rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}

              <Image
                src={selectedImage}
                alt={altText}
                fill
                sizes="100vw"
                priority
                unoptimized
                onLoad={() => {
                  setIsLoaded(true);
                  if (selectedImage) cachedImages.current.add(selectedImage);
                }}
                className={`object-contain select-none transition-opacity duration-150 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}