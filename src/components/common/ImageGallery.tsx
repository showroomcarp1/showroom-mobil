"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`,
      );
      document.documentElement.classList.add(
        "overflow-hidden",
        "pr-[var(--scrollbar-width)]",
      );
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.documentElement.classList.remove(
        "overflow-hidden",
        "pr-[var(--scrollbar-width)]",
      );
      document.documentElement.style.removeProperty("--scrollbar-width");
    }

    return () => {
      document.documentElement.classList.remove(
        "overflow-hidden",
        "pr-[var(--scrollbar-width)]",
      );
      document.documentElement.style.removeProperty("--scrollbar-width");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  return (
    <section aria-label={`Galeri foto ${altText}`} className="space-y-4">
      <figure className="group relative aspect-[18/12] w-full overflow-hidden bg-neutral-950">
        <Image
          src={activeImages[selectedIndex]}
          alt={`${altText} - Utama`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          className="object-cover object-center cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />

        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Tampilkan gambar ukuran penuh"
          className="absolute bottom-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded focus:opacity-100"
        >
          <svg
            viewBox="0 0 32 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-8 w-8 text-white"
            aria-hidden="true"
          >
            <path d="M2 7V2h6M24 2h6v5M2 17v5h6M24 22h6v-5" />
          </svg>
        </button>
      </figure>

      {activeImages.length > 1 && (
        <nav aria-label="Thumbnail galeri">
          <ul className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {activeImages.map((img, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <li key={idx} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    aria-label={`Lihat foto ${idx + 1}`}
                    aria-current={isSelected ? "true" : "false"}
                    className={`relative h-16 w-24 sm:h-20 sm:w-32 overflow-hidden bg-neutral-900 transition-opacity duration-150 ${
                      isSelected
                        ? "ring-2 ring-neutral-900 opacity-100"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${altText} thumbnail ${idx + 1}`}
                      fill
                      loading="lazy"
                      decoding="async"
                      sizes="128px"
                      className="object-cover object-center"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Tutup tampilan gambar"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2 text-3xl font-light cursor-pointer z-50 leading-none focus:outline-none"
          >
            ✕
          </button>

          <figure
            className="relative h-full w-full max-w-6xl max-h-[85vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImages[selectedIndex]}
              alt={`${altText} - Foto ${selectedIndex + 1}`}
              fill
              sizes="100vw"
              priority
              className="object-contain select-none"
            />

            {activeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Gambar sebelumnya"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors z-20 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Gambar selanjutnya"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors z-20 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="h-6 w-6" />
                </button>
              </>
            )}

            <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-widest text-neutral-300 bg-black/60 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {activeImages.length}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
