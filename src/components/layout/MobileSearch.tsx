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

const getInitialRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

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
        console.error("Failed to save recent search", e);
      }

      return updated;
    });
  };

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

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error("Failed to clear recent searches", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
    }
  };

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

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    onClose();
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchQuery = query.trim();
    saveRecentSearch(searchQuery);
    handleClose();
    router.push(`/cars?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSelectRecent = (searchTerm: string) => {
    saveRecentSearch(searchTerm);
    handleClose();
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          aria-label="Pencarian Mobil Mobile"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[60] flex flex-col bg-black text-white"
        >
          {/* Header search */}
          <header className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            {/* Form search */}
            <form
              onSubmit={handleSubmit}
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

              {/* Input field */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search"
                autoFocus
                style={{ fontSize: "16px" }}
                className="w-full ml-3 bg-transparent text-base font-medium text-white placeholder-neutral-400 focus:outline-none pr-1"
              />

              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 text-black shrink-0 cursor-pointer transition-colors"
                  aria-label="Clear input"
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-2.5 h-2.5 block"
                    style={{ width: "10px", height: "10px" }}
                  />
                </button>
              )}
            </form>

            {/* Cancel button */}
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-semibold text-neutral-300 active:text-white px-2 shrink-0 cursor-pointer"
            >
              Cancel
            </button>
          </header>

          {/* Konten utama */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            {query.trim().length > 0 ? (
              <article>
                <header className="px-6 py-2.5 border-b border-white/5 bg-black/20">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Suggestions
                  </span>
                </header>

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
                                <h3 className="text-sm font-semibold text-white truncate">
                                  {displayTitle}
                                </h3>
                                {car.status === "booked" && (
                                  <span className="text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded shrink-0 border border-white/10">
                                    Booked
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 mt-0.5 text-[18px]">  
                                <span className="font-semibold text-[#b89563]">
                                  {formattedPrice}
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
                    <p className="p-10 text-center text-neutral-400 text-sm">
                      No results found for &quot;
                      <span className="text-white font-medium">{query}</span>
                      &quot;.
                    </p>
                  )
                )}
              </article>
            ) : (
              <article>
                {recentSearches.length > 0 ? (
                  <div className="py-2">
                    <header className="px-6 py-2.5 border-b border-white/5 bg-black/20">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Recent Searches
                      </span>
                    </header>

                    <nav>
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
                                <span className="text-sm font-medium text-white truncate">
                                  {item}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => removeRecentSearch(e, item)}
                                className="p-1.5 text-neutral-400 active:text-white cursor-pointer"
                                aria-label={`Remove ${item}`}
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
                    </nav>

                    <footer className="mt-6 flex justify-center px-6">
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="text-xs font-medium text-neutral-400 active:text-white py-2 px-4 transition-colors cursor-pointer"
                      >
                        Clear all recent
                      </button>
                    </footer>
                  </div>
                ) : (
                  <p className="p-12 text-center text-neutral-400 text-sm leading-relaxed">
                    Type a car name or brand to search
                  </p>
                )}
              </article>
            )}
          </main>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
