"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

export default function ImageGallery({ images, altText }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImages =
    images && images.length > 0
      ? images
      : ["/images/placeholders/car-placeholder.jpg"];

  // Sync index saat prop images berubah
  const [prevImages, setPrevImages] = useState(images);
  if (images !== prevImages) {
    setPrevImages(images);
    setSelectedIndex(0);
  }

  // Handle navigasi Lightbox (Next / Prev / ESC)
  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === 0 ? activeImages.length - 1 : prev - 1,
    );
  }, [activeImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === activeImages.length - 1 ? 0 : prev + 1,
    );
  }, [activeImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  return (
    <section aria-label={`Galeri Foto ${altText}`} className="space-y-4">
      {/* Gambar utama dengan elemen semantik figure */}
      <figure className="group relative aspect-[18/12] sm:aspect-[18/12] w-full overflow-hidden bg-neutral-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImages[selectedIndex] || selectedIndex}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <Image
              src={activeImages[selectedIndex]}
              alt={`${altText} - Foto Utama ${selectedIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Tombol Perbesar / Focus (Efek Out Melebar/Zoom Out) */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Tampilkan gambar ukuran penuh"
          title="Perbesar Gambar"
          className="absolute bottom-4 right-4 z-20 flex items-center justify-center bg-transparent text-white opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:opacity-100 focus:scale-100"
        >
          <svg
            viewBox="0 0 32 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
            className="h-10 w-11 text-white"
            aria-hidden="true"
          >
            {/* Siku Kiri Atas */}
            <path d="M2 7V2h6" />
            {/* Siku Kanan Atas */}
            <path d="M24 2h6v5" />
            {/* Siku Kiri Bawah */}
            <path d="M2 17v5h6" />
            {/* Siku Kanan Bawah */}
            <path d="M24 22h6v-5" />
          </svg>
        </button>
      </figure>

      {/* Navigasi Thumbnail Gambar */}
      {activeImages.length > 1 && (
        <nav aria-label="Navigasi Thumbnail Gambar">
          <ul className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {activeImages.map((img, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <li key={idx} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    aria-label={`Tampilkan foto ke-${idx + 1}`}
                    aria-current={isSelected ? "true" : "false"}
                    className={`relative h-16 w-28 sm:h-20 sm:w-36 overflow-hidden transition-all duration-200 cursor-pointer ${
                      isSelected ? "opacity-100" : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${altText} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Dialog Modal Fullscreen (Lightbox) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Tampilan Gambar Penuh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Tombol Tutup / Close Mark X (Dipertahankan Besar & Menggunakan SVG) */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Tutup tampilan gambar"
              className="absolute top-6 right-6 z-50 flex h-14 w-14 items-center justify-center bg-transparent text-white drop-shadow-md focus:outline-none cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="h-10 w-10 text-white"
                aria-hidden="true"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {/* Container Konten Gambar Modal */}
            <figure
              className="relative h-full w-full max-w-6xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={activeImages[selectedIndex]}
                    alt={`${altText} - Tampilan Penuh Foto ${selectedIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Tombol Navigasi Kiri / Kanan */}
              {activeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label="Gambar sebelumnya"
                    className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center bg-transparent text-white drop-shadow-md focus:outline-none cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="h-10 w-10"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Gambar selanjutnya"
                    className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center bg-transparent text-white drop-shadow-md focus:outline-none cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="h-10 w-10"
                    />
                  </button>
                </>
              )}

              {/* Teks Indikator Semantik FIGCAPTION */}
              <figcaption className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-widest text-neutral-300">
                {selectedIndex + 1} / {activeImages.length}
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
