"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CarCardSkeleton } from "@/components/sections/CarCard";

// Brand disesuaikan persis dengan Mega Menu
const BRAND_OPTIONS = [
  "Toyota",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Lexus",
  "Honda",
  "Ferrari",
  "Lamborghini",
  "Land Rover",
  "Hyundai",
  "Audi",
  "Maserati",
  "Aston Martin",
  "Bentley",
  "Rolls-Royce",
  "McLaren",
  "Jaguar",
  "Subaru",
];

const CONDITION_OPTIONS = ["New", "Used", "Exclusive"];

const TRANSMISSION_OPTIONS = [
  "Automatic Transmission",
  "Manual Transmission",
  "Hybrid",
];

// Opsi Max Price Diperbesar khusus Luxury Cars (hingga 100 Milyar IDR)
const PRICE_OPTIONS = [
  { label: "< IDR 1 Billion", value: "1000000000" },
  { label: "< IDR 2.5 Billion", value: "2500000000" },
  { label: "< IDR 5 Billion", value: "5000000000" },
  { label: "< IDR 10 Billion", value: "10000000000" },
  { label: "< IDR 20 Billion", value: "20000000000" },
  { label: "< IDR 35 Billion", value: "35000000000" },
  { label: "< IDR 50 Billion", value: "50000000000" },
  { label: "< IDR 75 Billion", value: "75000000000" },
  { label: "< IDR 100 Billion", value: "100000000000" },
];

// Opsi Preset Mileage (KM)
const MILEAGE_OPTIONS = [
  { label: "< 5,000 km", value: "5000" },
  { label: "< 10,000 km", value: "10000" },
  { label: "< 25,000 km", value: "25000" },
  { label: "< 50,000 km", value: "50000" },
  { label: "< 100,000 km", value: "100000" },
  { label: "< 250,000 km", value: "250000" },
];

interface InventoryFilterProps {
  currentFilters?: {
    brand?: string;
    condition?: string;
    transmission?: string;
    fuel_type?: string;
    max_price?: string;
    max_km?: string;
  };
  filters?: {
    brand?: string;
    condition?: string;
    transmission?: string;
    fuel_type?: string;
    max_price?: string;
    max_km?: string;
  };
  onChange?: (filters: Record<string, string>) => void;
  onReset?: () => void;
  children?: React.ReactNode;
}

interface CustomSelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  id: string;
  label: string;
  value: string;
  options: (string | CustomSelectOption)[];
  placeholder: string;
  onChange: (val: string) => void;
}

/**
 * Custom Dropdown Component
 * Typography tegas berwarna Hitam (Neutral-900) dengan Segitiga Penuh Instan (Tanpa Rotate)
 */
function CustomSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative flex flex-col gap-2.5"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <label
        htmlFor={id}
        className="text-xs font-black uppercase tracking-[0.18em] text-neutral-900 cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex h-14 w-full items-center justify-between border bg-white px-4 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-900 transition-colors duration-200 focus:outline-none ${
          isOpen
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Ikon Segitiga Penuh Langsung Berbalik (Tanpa Animasi Rotate) */}
        <svg className="ml-2 h-3.5 w-3.5 fill-neutral-900" viewBox="0 0 24 24">
          {isOpen ? (
            /* Segitiga Menghadap Ke Atas (Instan) */
            <path d="M12 8l8 8H4l8-8z" />
          ) : (
            /* Segitiga Menghadap Ke Bawah (Instan) */
            <path d="M12 16L4 8h16l-8 8z" />
          )}
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          className="absolute top-[100%] left-0 z-50 mt-1 max-h-64 w-full overflow-auto border border-neutral-300 bg-white py-1 shadow-2xl focus:outline-none custom-scrollbar"
        >
          <li
            role="option"
            aria-selected={value === ""}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`cursor-pointer px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              value === ""
                ? "bg-neutral-900 text-white font-black"
                : "text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {placeholder}
          </li>

          {normalizedOptions.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? "bg-neutral-900 text-white font-black"
                    : "text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function InventoryFilter({
  currentFilters,
  filters,
  onChange,
  onReset,
  children,
}: InventoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper untuk membaca nilai filter awal/terkini dari props/URL
  const getIncomingFilter = (key: string) => {
    return (
      currentFilters?.[key as keyof typeof currentFilters] ??
      filters?.[key as keyof typeof filters] ??
      searchParams.get(key) ??
      ""
    );
  };

  // State Draft Filter
  const [draftFilters, setDraftFilters] = useState(() => ({
    brand: getIncomingFilter("brand"),
    condition: getIncomingFilter("condition"),
    transmission: getIncomingFilter("transmission"),
    max_price: getIncomingFilter("max_price"),
    max_km: getIncomingFilter("max_km"),
  }));

  // Pattern "Adjusting state during render" untuk mencegah error cascading render React
  const [prevParamsString, setPrevParamsString] = useState(() =>
    searchParams.toString(),
  );
  const currentParamsString = searchParams.toString();

  if (prevParamsString !== currentParamsString) {
    setPrevParamsString(currentParamsString);
    setDraftFilters({
      brand: getIncomingFilter("brand"),
      condition: getIncomingFilter("condition"),
      transmission: getIncomingFilter("transmission"),
      max_price: getIncomingFilter("max_price"),
      max_km: getIncomingFilter("max_km"),
    });
  }

  const handleDraftChange = (key: string, value: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (onChange) {
      onChange(draftFilters);
      return;
    }

    const params = new URLSearchParams();

    Object.entries(draftFilters).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleReset = () => {
    const emptyState = {
      brand: "",
      condition: "",
      transmission: "",
      max_price: "",
      max_km: "",
    };

    setDraftFilters(emptyState);

    if (onReset) {
      onReset();
      return;
    }

    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Object.values(draftFilters).some(Boolean);

  return (
    <>
      <section
        aria-label="Vehicle Filters"
        className="relative mb-12 border border-neutral-300 bg-white p-6 sm:p-8 text-neutral-900 shadow-sm"
      >
        {/* Header Filter */}
        <header className="flex items-center justify-between border-b border-neutral-300 pb-5">
          <h2 className="text-[20px] font-black uppercase tracking-[0.2em] text-neutral-900">
            Find A Car
          </h2>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-black uppercase tracking-widest text-neutral-900 hover:underline focus:outline-none"
            >
              Reset Filters
            </button>
          )}
        </header>

        {/* Form Filter Konten */}
        <div className="pt-6">
          <form onSubmit={handleSearchSubmit}>
            <fieldset className="m-0 border-0 p-0">
              <legend className="sr-only">Vehicle Search Parameters</legend>

              {/* Grid 5 Kolom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                {/* Brand Custom Select */}
                <CustomSelect
                  id="filter-brand"
                  label="Brand"
                  value={draftFilters.brand}
                  options={BRAND_OPTIONS}
                  placeholder="All Brands"
                  onChange={(val) => handleDraftChange("brand", val)}
                />

                {/* Condition Custom Select */}
                <CustomSelect
                  id="filter-condition"
                  label="Condition"
                  value={draftFilters.condition}
                  options={CONDITION_OPTIONS}
                  placeholder="All Conditions"
                  onChange={(val) => handleDraftChange("condition", val)}
                />

                {/* Transmission Custom Select */}
                <CustomSelect
                  id="filter-transmission"
                  label="Transmission"
                  value={draftFilters.transmission}
                  options={TRANSMISSION_OPTIONS}
                  placeholder="All Transmissions"
                  onChange={(val) => handleDraftChange("transmission", val)}
                />

                {/* Max Price Custom Select */}
                <CustomSelect
                  id="filter-max-price"
                  label="Max Price"
                  value={draftFilters.max_price}
                  options={PRICE_OPTIONS}
                  placeholder="All Prices"
                  onChange={(val) => handleDraftChange("max_price", val)}
                />

                {/* Max Mileage Custom Select */}
                <CustomSelect
                  id="filter-max-km"
                  label="Max Mileage"
                  value={draftFilters.max_km}
                  options={MILEAGE_OPTIONS}
                  placeholder="All Mileage"
                  onChange={(val) => handleDraftChange("max_km", val)}
                />
              </div>

              {/* Search Button Container */}
              <div className="mt-8 flex items-center justify-end border-t border-neutral-200 pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-3 bg-neutral-900 px-12 text-base font-black uppercase tracking-[0.25em] text-white transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 cursor-pointer rounded-md"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="h-6 w-6 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </section>

      {/* State Loading Skeleton */}
      {isPending ? (
        <section aria-label="Loading Vehicles Grid" className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        children
      )}
    </>
  );
}
