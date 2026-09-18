"use client";

import { useState } from "react";
import Image from "next/image";

interface CarImageGridProps {
  images: string[];
  altText: string;
}

export default function CarImageGrid({ images, altText }: CarImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 text-neutral-400 text-xs font-medium">
        Foto tidak tersedia untuk kategori ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid Foto Kotak-Kotak Sedang */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 cursor-pointer transition-all"
          >
            <Image
              src={img}
              alt={`${altText} ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Preview saat diklik */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full aspect-[16/9] overflow-hidden">
            <Image
              src={selectedImage}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-2  text-white rounded-full p-2 text-[30px] font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
