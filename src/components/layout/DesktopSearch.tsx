"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";

// TAMBAHKAN onClear?: () => void DI SINI
interface DesktopSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onClear?: () => void;
}

export default function DesktopSearch({
  isOpen,
  onClose,
  initialQuery = "",
  onClear, // Terima prop onClear di sini
}: DesktopSearchProps) {
  const router = useRouter();

  const [query, setQuery] = useState<string>(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] =
    useState<string>(initialQuery);

  if (prevInitialQuery !== initialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleClear = () => {
    setQuery("");
    if (onClear) {
      onClear();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchQuery = query.trim();
    handleClose();
    router.push(`/cars?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-6 sm:px-12 text-white"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="absolute top-8 right-8 text-whitee transition-colors p-3 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="w-8 h-8" />
          </button>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center border-b border-neutral-700 pb-4"
            >

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="TYPE TO SEARCH..."
                className="w-full bg-transparent text-2xl sm:text-4xl font-light uppercase tracking-widest text-white placeholder-neutral-600 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-neutral-400 hover:text-white transition-colors p-2 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </form>

            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mt-4">
              Press Enter to search
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
