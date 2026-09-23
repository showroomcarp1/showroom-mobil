"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faClock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { searchCars } from "@/lib/actions/car";
import type { Database } from "@/types/database";

type CarRow = Database["public"]["Tables"]["cars"]["Row"];

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = "car_recent_searches";
const MAX_RECENT_ITEMS = 5;

// Lazy state initializer untuk localStorage
const getInitialRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to read recent searches from localStorage", e);
    return [];
  }
};

export default function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<CarRow[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(
    getInitialRecentSearches,
  );
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock scroll saat modal terbuka
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

  // Simpan kata kunci ke recent searches
  const saveRecentSearch = (searchTerm: string) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;

    setRecentSearches((prev) => {
      const updated = [
        cleanTerm,
        ...prev.filter(
          (item) => item.toLowerCase() !== cleanTerm.toLowerCase(),
        ),
      ].slice(0, MAX_RECENT_ITEMS);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent searches", e);
      }

      return updated;
    });
  };

  // Hapus satu kata kunci dari recent searches
  const removeRecentSearch = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to remove recent search", err);
      }
      return updated;
    });
  };

  // Hapus semua history pencarian
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error("Failed to clear recent searches", err);
    }
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
    }
  };

  // Debounce pencarian ke Supabase
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchCars(trimmedQuery, 6);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Tutup modal dan reset state query
  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    onClose();
  }, [onClose]);

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchQuery = query.trim();
    saveRecentSearch(searchQuery);
    handleClose();
    router.push(`/cars?search=${encodeURIComponent(searchQuery)}`);
  };

  // Pilih dari recent list
  const handleSelectRecent = (searchTerm: string) => {
    saveRecentSearch(searchTerm);
    handleClose();
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          aria-label="Mobile Search Screen"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          /* Background Kaca Transparan / Glassmorphism */
          className="fixed inset-0 z-[60] flex flex-col bg-black text-white"
        >
          {/* Header Bar Pencarian */}
          <header className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            <form
              onSubmit={handleSubmit}
              /* Box Field Pencarian Warna Grey/Abu-abu Jelas */
              className="relative flex-1 flex items-center bg-neutral-900 rounded-[12px] px-3 py-2.5 focus-within:border-neutral-600 transition-colors"
            >
              {isPending ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="w-4 h-4 text-neutral-400 animate-spin pointer-events-none shrink-0"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faSearch}
                  className="w-4 h-4 text-neutral-400 pointer-events-none shrink-0"
                />
              )}

              {/* Teks Input Putih Jelas & Proposional */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search"
                className="w-full ml-3 bg-transparent text-sm font-medium text-white placeholder-neutral-400 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="p-1 bg-white rounded-full text-black"
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-2 h-2 block"
                  />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-semibold text-neutral-300 active:text-white px-2 shrink-0 cursor-pointer"
            >
              Cancel
            </button>
          </header>

          {/* Area Konten Utama */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            {query.trim().length > 0 ? (
              /* Live Search Suggestions */
              <div>
                {/* Header Kategori */}
                <div className="px-6 py-2.5 border-b border-white/5 bg-black/20">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Suggestions
                  </span>
                </div>

                {results.length > 0 ? (
                  <ul className="divide-y divide-white/5">
                    {results.map((car) => {
                      const imageSrc =
                        car.images?.[0] ||
                        car.image_url ||
                        "/images/placeholder.jpg";
                      const displayTitle =
                        car.title || `${car.brand} ${car.model}`.trim();
                      const formattedPrice = car.price
                        ? `IDR ${car.price.toLocaleString("id-ID")}`
                        : "Contact Us";

                      return (
                        <li key={car.id}>
                          <Link
                            href={`/cars/${car.slug || car.id}`}
                            onClick={() => {
                              saveRecentSearch(displayTitle);
                              handleClose();
                            }}
                            className="flex items-center gap-4 px-6 py-3.5 active:bg-white/10 transition-colors"
                          >
                            <figure className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-neutral-800 m-0 border border-white/10">
                              <Image
                                src={imageSrc}
                                alt={displayTitle}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </figure>

                            <div className="flex flex-col justify-center min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                {/* Judul Mobil: Putih Jelas */}
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {displayTitle}
                                </h4>
                                {car.status === "booked" && (
                                  <span className="text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded shrink-0 border border-white/10">
                                    Booked
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 mt-0.5 text-xs">
                                {/* Harga & Tahun */}
                                <span className="font-medium text-neutral-200">
                                  {formattedPrice}
                                </span>
                                <span className="text-neutral-400 font-normal">
                                  {car.year}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  !isPending && (
                    <div className="p-10 text-center text-neutral-400 text-sm">
                      No results found for &quot;
                      <span className="text-white font-medium">{query}</span>
                      &quot;.
                    </div>
                  )
                )}
              </div>
            ) : (
              /* Recent Searches Section */
              <div>
                {recentSearches.length > 0 ? (
                  <div className="py-2">
                    {/* Header Kategori */}
                    <div className="px-6 py-2.5 border-b border-white/5 bg-black/20">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Recent Searches
                      </span>
                    </div>

                    {/* Recent Search Items */}
                    <ul className="divide-y divide-white/5">
                      {recentSearches.map((item, index) => (
                        <li key={index}>
                          <div
                            onClick={() => handleSelectRecent(item)}
                            className="flex items-center justify-between px-6 py-3.5 active:bg-white/10 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="w-4 h-4 text-neutral-400 shrink-0"
                              />
                              {/* Teks Riwayat: Putih Terang Jelas */}
                              <span className="text-sm font-medium text-white truncate">
                                {item}
                              </span>
                            </div>

                            {/* Tombol Hapus */}
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(e, item)}
                              className="p-1.5 text-neutral-400 active:text-white cursor-pointer"
                              aria-label={`Remove ${item} from search history`}
                            >
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="w-4 h-4 block"
                              />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Tombol Clear All */}
                    <div className="mt-6 flex justify-center px-6">
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="text-xs font-medium text-neutral-400 active:text-white py-2 px-4 transition-colors cursor-pointer"
                      >
                        Clear all recent
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-400 text-sm leading-relaxed">
                    Type a car name or brand to search
                  </div>
                )}
              </div>
            )}
          </main>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
