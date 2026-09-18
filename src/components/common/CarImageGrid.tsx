"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CarImageGridProps {
  images: string[];
  altText: string;
}

export default function CarImageGrid({ images, altText }: CarImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      {/* Grid Foto */}
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
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
              className="absolute top-5 right-5 md:top-8 md:right-8 text-white text-3xl md:text-4xl font-light cursor-pointer z-50 leading-none select-none"
            >
              ✕
            </button>

            {/* Container Gambar */}
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
