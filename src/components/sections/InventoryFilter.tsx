"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

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

// Opsi Transmisi dengan tambahan Hybrid
const TRANSMISSION_OPTIONS = ["Automatic", "Manually", "Hybrid"];

interface InventoryFilterProps {
  currentFilters?: {
    brand?: string;
    transmission?: string;
    fuel_type?: string;
    max_price?: string;
    max_km?: string;
  };
  filters?: {
    brand?: string;
    transmission?: string;
    fuel_type?: string;
    max_price?: string;
    max_km?: string;
  };
  onChange?: (key: string, value: string) => void;
  onReset?: () => void;
}

interface CustomDropdownProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (val: string) => void;
}

function CustomSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="block text-xs font-black uppercase tracking-widest text-neutral-600 mb-2.5 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border border-neutral-300 bg-white/90 px-4 py-3.5 text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none transition-colors text-left shadow-sm"
      >
        <span className="truncate">{value || placeholder}</span>
        {/* Chevron Besar */}
        <svg
          className={`h-5 w-5 text-neutral-500 transition-transform duration-[500ms] ease-in-out ${
            isOpen ? "rotate-180 text-neutral-900" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-auto border border-neutral-300 bg-white py-1 text-sm font-medium text-neutral-900 shadow-xl focus:outline-none custom-scrollbar"
        >
          <li
            role="option"
            aria-selected={value === ""}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`cursor-pointer px-4 py-3 hover:bg-neutral-100 transition-colors ${
              value === ""
                ? "bg-neutral-100 text-neutral-950 font-bold"
                : "text-neutral-700"
            }`}
          >
            {placeholder}
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-3 hover:bg-neutral-100 transition-colors ${
                value === opt
                  ? "bg-neutral-100 text-neutral-950 font-bold"
                  : "text-neutral-700"
              }`}
            >
              {opt}
            </li>
          ))}
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
}: InventoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(true);

  const activeBrand = currentFilters?.brand ?? filters?.brand ?? "";
  const activeTransmission =
    currentFilters?.transmission ?? filters?.transmission ?? "";

  // Max price default set to 50 Billion (50.000.000.000)
  const initialMaxPrice = Number(
    currentFilters?.max_price ?? filters?.max_price ?? 50000000000,
  );
  // Max km default set to 500.000
  const initialMaxKm = Number(
    currentFilters?.max_km ?? filters?.max_km ?? 500000,
  );

  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [maxKm, setMaxKm] = useState<number>(initialMaxKm);

  useEffect(() => {
    setMaxPrice(initialMaxPrice);
  }, [initialMaxPrice]);

  useEffect(() => {
    setMaxKm(initialMaxKm);
  }, [initialMaxKm]);

  const handleFilterChange = (key: string, value: string) => {
    if (onChange) {
      onChange(key, value);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setMaxPrice(50000000000);
    setMaxKm(500000);
    if (onReset) {
      onReset();
      return;
    }
    router.push(pathname);
  };

  const formatRupiah = (val: number) => {
    if (val >= 50000000000) return "Unlimited";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatKm = (val: number) => {
    if (val >= 500000) return "Unlimited";
    return `${val.toLocaleString("en-US")} km`;
  };

  return (
    <section
      aria-label="Filter Kendaraan"
      className="relative border border-neutral-200 bg-white p-6 sm:p-8 mb-10 text-neutral-900 shadow-sm"
    >
      {/* Header Filter */}
      <header className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="filter-content"
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <h2 className="text-base font-black uppercase tracking-[0.2em] text-neutral-900 transition-colors group-hover:text-neutral-600">
            Find a Car
          </h2>
          <svg
            className={`h-5 w-5 text-neutral-500 transition-transform duration-[500ms] ease-in-out group-hover:text-neutral-900 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Reset Filters
        </button>
      </header>

      {/* Konten Filter Form */}
      <div
        id="filter-content"
        role="region"
        aria-label="Form Filter Kendaraan"
        className={`grid transition-all duration-[500ms] ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pt-6 overflow-visible"
            : "grid-rows-[0fr] opacity-0 pt-0 overflow-hidden"
        }`}
      >
        <div className={isOpen ? "overflow-visible" : "overflow-hidden"}>
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="border-0 p-0 m-0">
              <legend className="sr-only">Vehicle Search Filters</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                {/* Brand Custom Select */}
                <CustomSelect
                  id="filter-brand"
                  label="Brand"
                  value={activeBrand}
                  options={BRAND_OPTIONS}
                  placeholder="All Brands"
                  onChange={(val) => handleFilterChange("brand", val)}
                />

                {/* Transmission Custom Select */}
                <CustomSelect
                  id="filter-transmission"
                  label="Transmission"
                  value={activeTransmission}
                  options={TRANSMISSION_OPTIONS}
                  placeholder="All Transmissions"
                  onChange={(val) => handleFilterChange("transmission", val)}
                />

                {/* Max Price Slider (Min: 100jt, Max: 50 Milyar) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label
                      htmlFor="filter-max-price"
                      className="text-xs font-black uppercase tracking-widest text-neutral-600"
                    >
                      Max Price
                    </label>
                    <span className="text-xs font-extrabold text-neutral-900 tracking-wide">
                      {formatRupiah(maxPrice)}
                    </span>
                  </div>
                  <input
                    id="filter-max-price"
                    type="range"
                    min="100000000"
                    max="50000000000"
                    step="500000000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    onMouseUp={() =>
                      handleFilterChange(
                        "max_price",
                        maxPrice >= 50000000000 ? "" : maxPrice.toString(),
                      )
                    }
                    onTouchEnd={() =>
                      handleFilterChange(
                        "max_price",
                        maxPrice >= 50000000000 ? "" : maxPrice.toString(),
                      )
                    }
                    className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 appearance-none"
                  />
                </div>

                {/* Max Mileage Slider (Min: 5.000 km, Max: 500.000 km) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label
                      htmlFor="filter-max-km"
                      className="text-xs font-black uppercase tracking-widest text-neutral-600"
                    >
                      Max Mileage
                    </label>
                    <span className="text-xs font-extrabold text-neutral-900 tracking-wide">
                      {formatKm(maxKm)}
                    </span>
                  </div>
                  <input
                    id="filter-max-km"
                    type="range"
                    min="5000"
                    max="500000"
                    step="10000"
                    value={maxKm}
                    onChange={(e) => setMaxKm(Number(e.target.value))}
                    onMouseUp={() =>
                      handleFilterChange(
                        "max_km",
                        maxKm >= 500000 ? "" : maxKm.toString(),
                      )
                    }
                    onTouchEnd={() =>
                      handleFilterChange(
                        "max_km",
                        maxKm >= 500000 ? "" : maxKm.toString(),
                      )
                    }
                    className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 appearance-none"
                  />
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
  );
}
