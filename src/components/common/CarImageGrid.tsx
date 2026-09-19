"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarImageGridProps {
  images: string[];
  altText: string;
}

export default function CarImageGrid({ images, altText }: CarImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex !== null) {
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
    };
  }, [selectedIndex]);

  // Kontrol panah keyboard & ESC
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : 0,
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : 0,
        );
      } else if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 text-neutral-400 text-xs font-medium">
        Foto tidak tersedia untuk kategori ini.
      </div>
    );
  }

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <section aria-label={`Galeri foto ${altText}`} className="space-y-4">
      {/* Grid Gambar */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Buka foto ${idx + 1} dari ${altText}`}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <Image
                src={img}
                alt={`${altText} foto ke-${idx + 1}`}
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-200 ease-out"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox / Modal */}
      {selectedImage && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tampilan foto ${altText}`}
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 md:p-10 cursor-zoom-out animate-in fade-in duration-150"
        >
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Tutup tampilan gambar"
            className="absolute top-4 right-4 text-white text-3xl font-light cursor-pointer z-50 p-2 leading-none focus:outline-none"
          >
            ✕
          </button>

          {/* Container Foto & Chevron Samping */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chevron Kiri Putih Tebal */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev !== null
                      ? (prev - 1 + images.length) % images.length
                      : 0,
                  );
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-1 md:-left-10 z-50 text-white cursor-pointer p-1 focus:outline-none"
              >
                <svg
                  className="w-8 h-12 md:w-10 md:h-16 drop-shadow-sm"
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

            {/* Gambar Penuh */}
            <figure className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage}
                alt={`${altText} foto ke-${selectedIndex + 1}`}
                fill
                sizes="100vw"
                priority
                className="object-contain select-none"
              />
            </figure>

            {/* Chevron Kanan Putih Tebal */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev !== null ? (prev + 1) % images.length : 0,
                  );
                }}
                aria-label="Foto selanjutnya"
                className="absolute right-1 md:-right-10 z-50 text-white cursor-pointer p-1 focus:outline-none"
              >
                <svg
                  className="w-8 h-12 md:w-10 md:h-16 drop-shadow-sm"
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
        </div>
      )}
    </section>
  );
}
