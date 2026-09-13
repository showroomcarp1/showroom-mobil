"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

export default function ImageGallery({ images, altText }: ImageGalleryProps) {
  // Indeks foto aktif
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Jika gambar kosong, gunakan gambar default
  const activeImages =
    images.length > 0 ? images : ["/images/placeholders/car-placeholder.jpg"];

  return (
    <div className="space-y-3">
      {/* Container Gambar Utama */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <Image
              src={activeImages[selectedIndex]}
              alt={`${altText} - Foto ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid Thumbnail Gambar */}
      {activeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {activeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                selectedIndex === idx
                  ? "border-neutral-900 ring-2 ring-neutral-900/10"
                  : "border-neutral-200 opacity-60 hover:opacity-100"
              }`}
              aria-label={`Pilih gambar ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${altText} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
