"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CarCardSkeleton } from "@/components/sections/CarCard";

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
  className?: string;
}

function CustomSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  className = "",
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
      className={`relative flex flex-col gap-1.5 ${className}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <label
        htmlFor={id}
        className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-300 cursor-pointer select-none"
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
        className={`group flex h-12 xl:h-14 w-full items-center justify-between border bg-neutral-900/70 px-3.5 py-2.5 text-[11px] xl:text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-none ${
          isOpen
            ? "border-white bg-neutral-900"
            : "border-neutral-700/60 hover:border-neutral-400 hover:bg-neutral-900/90"
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
          className="ml-2 h-3.5 w-3.5 fill-white shrink-0"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path d="M12 8l8 8H4l8-8z" />
          ) : (
            <path d="M12 16L4 8h16l-8 8z" />
          )}
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          className="absolute top-[100%] left-0 z-[100] mt-1 max-h-60 w-full overflow-auto border border-neutral-700 bg-neutral-950/95 backdrop-blur-md py-1 shadow-2xl focus:outline-none custom-scrollbar"
        >
          <li
            role="option"
            aria-selected={value === ""}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`cursor-pointer px-4 py-3 text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors ${
              value === ""
                ? "bg-white text-black font-black"
                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
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
                className={`cursor-pointer px-4 py-3 text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? "bg-white text-black font-black"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
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

  const getIncomingFilter = (key: string) => {
    return (
      currentFilters?.[key as keyof typeof currentFilters] ??
      filters?.[key as keyof typeof filters] ??
      searchParams.get(key) ??
      ""
    );
  };

  const [draftFilters, setDraftFilters] = useState(() => ({
    brand: getIncomingFilter("brand"),
    condition: getIncomingFilter("condition"),
    transmission: getIncomingFilter("transmission"),
    max_price: getIncomingFilter("max_price"),
    max_km: getIncomingFilter("max_km"),
  }));

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
        className="relative z-30 w-screen left-1/2 -translate-x-1/2 -mt-32 sm:-mt-40 xl:-mt-48 mb-2 sm:mb-15 border-y border-white/10 bg-black/50 backdrop-blur-md text-white shadow-2xl transition-all"
      >
        <div className="w-full px-4 sm:px-8 xl:px-12 py-8 sm:py-10 xl:py-12">
          <form onSubmit={handleSearchSubmit}>
            <fieldset className="m-0 border-0 p-0">
              <legend className="sr-only">Vehicle Search Parameters</legend>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 xl:gap-5 items-end">
                <CustomSelect
                  id="filter-brand"
                  label="Brand"
                  value={draftFilters.brand}
                  options={BRAND_OPTIONS}
                  placeholder="All Brands"
                  onChange={(val) => handleDraftChange("brand", val)}
                  className="col-span-1"
                />

                <CustomSelect
                  id="filter-condition"
                  label="Condition"
                  value={draftFilters.condition}
                  options={CONDITION_OPTIONS}
                  placeholder="All Conditions"
                  onChange={(val) => handleDraftChange("condition", val)}
                  className="col-span-1"
                />

                <CustomSelect
                  id="filter-transmission"
                  label="Transmission"
                  value={draftFilters.transmission}
                  options={TRANSMISSION_OPTIONS}
                  placeholder="All Transmissions"
                  onChange={(val) => handleDraftChange("transmission", val)}
                  className="col-span-1"
                />

                <CustomSelect
                  id="filter-max-price"
                  label="Max Price"
                  value={draftFilters.max_price}
                  options={PRICE_OPTIONS}
                  placeholder="All Prices"
                  onChange={(val) => handleDraftChange("max_price", val)}
                  className="col-span-1"
                />

                <CustomSelect
                  id="filter-max-km"
                  label="Max Mileage"
                  value={draftFilters.max_km}
                  options={MILEAGE_OPTIONS}
                  placeholder="All Mileage"
                  onChange={(val) => handleDraftChange("max_km", val)}
                  className="col-span-1"
                />

                {/* Tombol Search & Reset */}
                <div className="col-span-1 flex flex-col gap-1.5 justify-end h-full">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[10px] xl:text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white self-end lg:self-start transition-colors mb-0.5"
                    >
                      Reset
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 xl:h-14 w-full items-center justify-center bg-white hover:bg-neutral-200 text-black font-black uppercase tracking-[0.2em] text-xs xl:text-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black cursor-pointer rounded-none shadow-md"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin text-black"
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
                      </span>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </section>

      {/* State Loading Skeleton */}
      {isPending ? (
        <section aria-label="Loading Vehicles Grid" className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
