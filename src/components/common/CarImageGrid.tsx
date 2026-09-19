"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CarImageGridProps {
  images: string[];
  altText: string;
}

export default function CarImageGrid({ images, altText }: CarImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Helper fungsi prefetch gambar ke browser cache
  const prefetchImage = useCallback((src: string) => {
    if (typeof window !== "undefined" && src) {
      const img = new window.Image();
      img.src = src;
    }
  }, []);

  // Lock scroll background saat modal dibuka
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

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 text-neutral-400 text-xs font-medium">
        Foto tidak tersedia untuk kategori ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid Foto Semantik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedImage(img)}
            onMouseEnter={() => prefetchImage(img)}
            onFocus={() => prefetchImage(img)}
            onTouchStart={() => prefetchImage(img)}
            aria-label={`Buka foto ${altText} ${idx + 1}`}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 cursor-pointer transition-all text-left focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <Image
              src={img}
              alt={`${altText} ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Tampilan Gambar Penuh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
          >
            {/* Tombol Close di Pojok Kanan Atas */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Tutup tampilan gambar"
              className="absolute top-5 right-5 md:top-8 md:right-8 text-white text-3xl md:text-4xl font-light cursor-pointer z-50 leading-none select-none focus:outline-none"
            >
              ✕
            </button>

            {/* Container Gambar */}
            <figure
              className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={altText}
                fill
                sizes="100vw"
                className="object-contain select-none"
              />
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
