"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

export default function ImageGallery({ images, altText }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImages =
    images && images.length > 0
      ? images
      : ["/images/placeholders/car-placeholder.jpg"];

  // Wajib: Reset pilihan gambar ke indeks 0 setiap kali array images berubah (pindah tab)
  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  return (
    <div className="space-y-3">
      {/* Container Gambar Utama */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImages[selectedIndex] || selectedIndex}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.15 }}
            className="h-full w-full"
          >
            <Image
              src={activeImages[selectedIndex]}
              alt={`${altText} - Foto ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid Thumbnail Gambar (Kotak & Tajam) */}
      {activeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {activeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-32 flex-shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? "border-red-600 opacity-100"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
              aria-label={`Pilih gambar ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${altText} thumbnail ${idx + 1}`}
                fill
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
