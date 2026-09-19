"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarImageGridProps {
  images: string[];
  altText: string;
}

export default function CarImageGrid({ images, altText }: CarImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => setSelectedImage(img)}
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

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 md:p-10 cursor-zoom-out animate-in fade-in duration-150"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Tutup tampilan gambar"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light cursor-pointer z-50 p-2 leading-none focus:outline-none"
          >
            ✕
          </button>

          <figure
            className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={altText}
              fill
              sizes="100vw"
              priority
              className="object-contain select-none"
            />
          </figure>
        </div>
      )}
    </section>
  );
}