"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Car,
  TransmissionType,
  FuelType,
  CarStatus,
  ConditionType,
} from "@/types/cars";
import { createCar, updateCar } from "@/lib/actions/car";
import { TRANSMISSION_OPTIONS, FUEL_OPTIONS } from "@/lib/constants/inventory";
import { createClient } from "@/lib/supabase/client";

const BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Land Rover",
  "Mini",
  "Audi",
  "Maserati",
  "Aston Martin",
  "Bentley",
  "Rolls-Royce",
  "McLaren",
  "Jaguar",
  "Subaru",
  "Lexus",
  "Honda",
  "Toyota",
  "Hyundai",
  "Kia",
  "Mazda",
  "Nissan",
  "Mitsubishi",
] as const;

interface CarFormProps {
  initialData?: Car | null;
}

type ImageCategory = "images" | "exterior_images" | "interior_images";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeInitialDiscount(price: number, discount: number): number {
  if (!discount || discount <= 0) return 0;
  if (discount <= 100 && price > 0) {
    return Math.round((price * discount) / 100);
  }
  return discount;
}

function calculatePercent(price: number, discountCut: number): number {
  if (!price || !discountCut) return 0;
  return Math.min(100, Math.max(0, Math.round((discountCut / price) * 100)));
}

export default function CarForm({ initialData }: CarFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingCategory, setUploadingCategory] =
    useState<ImageCategory | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [discountMode, setDiscountMode] = useState<"fixed" | "percentage">(
    "percentage",
  );

  const [priceValue, setPriceValue] = useState<number>(
    () => initialData?.price || 0,
  );
  const [discountPriceValue, setDiscountPriceValue] = useState<number>(() => {
    const p = initialData?.price || 0;
    const dp = initialData?.discount_price || 0;
    return normalizeInitialDiscount(p, dp);
  });

  const [discountPercentValue, setDiscountPercentValue] = useState<number>(
    () => {
      const p = initialData?.price || 0;
      const dp = initialData?.discount_price || 0;
      const normalizedCut = normalizeInitialDiscount(p, dp);
      return calculatePercent(p, normalizedCut);
    },
  );

  // Handler Perubahan Harga OTR
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value) || 0;
    setPriceValue(newPrice);

    if (discountMode === "percentage") {
      const calculatedCut = Math.round((newPrice * discountPercentValue) / 100);
      setDiscountPriceValue(calculatedCut);
    } else {
      setDiscountPercentValue(calculatePercent(newPrice, discountPriceValue));
    }
  };

  // Handler Perubahan Persentase Diskon (%)
  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value === "" ? 0 : Number(e.target.value);
    const percent = Math.min(100, Math.max(0, raw));
    setDiscountPercentValue(percent);

    const calculatedCut = Math.round((priceValue * percent) / 100);
    setDiscountPriceValue(calculatedCut);
  };

  // Handler Perubahan Nominal Potongan (Rp)
  const handleFixedDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const cutAmount = e.target.value === "" ? 0 : Number(e.target.value);
    setDiscountPriceValue(cutAmount);
    setDiscountPercentValue(calculatePercent(priceValue, cutAmount));
  };

  // Handler Ganti Mode (% / Rp)
  const handleModeChange = (mode: "fixed" | "percentage") => {
    setDiscountMode(mode);
    if (mode === "percentage") {
      const calculatedCut = Math.round(
        (priceValue * discountPercentValue) / 100,
      );
      setDiscountPriceValue(calculatedCut);
    } else {
      setDiscountPercentValue(calculatePercent(priceValue, discountPriceValue));
    }
  };

  // State Foto Galeri
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : initialData?.image_url
        ? [initialData.image_url]
        : [],
  );
  const [exteriorImages, setExteriorImages] = useState<string[]>(
    initialData?.exterior_images || [],
  );
  const [interiorImages, setInteriorImages] = useState<string[]>(
    initialData?.interior_images || [],
  );

  const getCategorySetter = (category: ImageCategory) => {
    switch (category) {
      case "exterior_images":
        return setExteriorImages;
      case "interior_images":
        return setInteriorImages;
      default:
        return setImages;
    }
  };

  const getCategoryList = (category: ImageCategory) => {
    switch (category) {
      case "exterior_images":
        return exteriorImages;
      case "interior_images":
        return interiorImages;
      default:
        return images;
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: ImageCategory,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCategory(category);
    setErrorMsg("");

    const setList = getCategorySetter(category);

    try {
      const uploadedUrls: string[] = [];
      const fileList = Array.from(files);

      for (const file of fileList) {
        const fileExt = file.name.split(".").pop();
        const uniqueId =
          typeof window !== "undefined" && window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `${file.name.replace(/[^a-zA-Z0-9]/g, "")}-${file.size}`;

        const fileName = `${uniqueId}.${fileExt}`;
        const filePath = `cars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(filePath, file);

        if (uploadError)
          throw new Error(`Upload gagal: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setList((prev) => [...prev, ...uploadedUrls]);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengunggah foto.",
      );
    } finally {
      setUploadingCategory(null);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (category: ImageCategory, index: number) => {
    const setList = getCategorySetter(category);
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const brand = (formData.get("brand") as string) || "";
    const model = (formData.get("model") as string) || "";
    const variant = (formData.get("variant") as string) || "";
    const inputTitle =
      (formData.get("title") as string) ||
      `${brand} ${model} ${variant}`.trim();

    const inputSlug = (formData.get("slug") as string)?.trim();
    const finalSlug =
      inputSlug ||
      initialData?.slug ||
      generateSlug(inputTitle) ||
      `car-${Date.now()}`;

    const finalDiscountCut =
      discountMode === "percentage"
        ? Math.round((priceValue * discountPercentValue) / 100)
        : discountPriceValue;

    const payload = {
      title: inputTitle,
      slug: finalSlug,
      brand,
      model,
      variant,
      year: Number(formData.get("year")),
      mileage: Number(formData.get("mileage")) || 0,
      price: priceValue,
      discount_price: finalDiscountCut,
      condition: ((formData.get("condition") as string) ||
        "New") as ConditionType,
      transmission: formData.get("transmission") as TransmissionType,
      fuel_type: formData.get("fuel_type") as FuelType,
      description: (formData.get("description") as string) || "",
      status: (formData.get("status") as CarStatus) || "available",
      images: images,
      exterior_images: exteriorImages,
      interior_images: interiorImages,
      image_url: images[0] || exteriorImages[0] || interiorImages[0] || "",
    };

    try {
      if (initialData?.id) {
        await updateCar(initialData.id, payload);
      } else {
        await createCar(payload);
      }
      router.push("/admin/cars");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan data.");
      setLoading(false);
    }
  };

  const renderImageUploader = (
    category: ImageCategory,
    title: string,
    description: string,
  ) => {
    const currentList = getCategoryList(category);
    const isUploading = uploadingCategory === category;

    return (
      <section className="space-y-3 rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
              {title}{" "}
              <span className="text-neutral-500 font-bold">
                ({currentList.length})
              </span>
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium">
              {description}
            </p>
          </div>

          <label className="cursor-pointer rounded-md bg-neutral-950 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800">
            {isUploading ? "MENGUNGGAH..." : "+ UNGGAH FOTO"}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploadingCategory !== null}
              onChange={(e) => handleFileUpload(e, category)}
              className="hidden"
            />
          </label>
        </header>

        {currentList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {currentList.map((url, idx) => (
              <figure
                key={`${category}-${idx}`}
                className="group relative aspect-4/3 rounded-md border border-neutral-200 bg-white overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`${title} ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(category, idx)}
                  className="absolute top-2 right-2 rounded bg-neutral-950/90 hover:bg-red-600 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider transition-colors"
                >
                  Hapus
                </button>
              </figure>
            ))}
          </div>
        ) : (
          <p className="py-2 text-center text-xs italic text-neutral-400 font-medium">
            Belum ada foto dalam kategori ini.
          </p>
        )}
      </section>
    );
  };

  const finalNetPrice = Math.max(0, priceValue - discountPriceValue);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl rounded-md border border-neutral-200 bg-white p-6 space-y-8 shadow-xs"
    >
      {errorMsg && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-3.5 text-xs text-red-700 font-bold uppercase tracking-wide"
        >
          {errorMsg}
        </div>
      )}

      {/* --- SECTION 1: GALERI FOTO --- */}
      <fieldset className="space-y-4">
        <legend className="text-base font-black uppercase tracking-tight text-neutral-950 border-b border-neutral-200 pb-2 w-full">
          Galeri Foto Kendaraan
        </legend>

        {renderImageUploader(
          "images",
          "1. Foto Utama / Cover",
          "Tampilan utama di kartu dan katalog mobil.",
        )}

        {renderImageUploader(
          "exterior_images",
          "2. Galeri Eksterior",
          "Foto bodi luar, velg, lampu, dan tampak samping/belakang.",
        )}

        {renderImageUploader(
          "interior_images",
          "3. Galeri Interior",
          "Foto kemudi, dasbor, jok, bagasi, dan fitur kabin.",
        )}
      </fieldset>

      {/* --- SECTION 2: IDENTITAS UNIT --- */}
      <fieldset className="space-y-4">
        <legend className="text-base font-black uppercase tracking-tight text-neutral-950 border-b border-neutral-200 pb-2 w-full">
          Identitas Unit Mobil
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Judul Tampilan Mobil
            </label>
            <input
              name="title"
              defaultValue={initialData?.title || ""}
              placeholder="Contoh: Honda Civic RS 1.5 Turbo"
              className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Slug URL Custom (Opsional)
            </label>
            <input
              name="slug"
              defaultValue={initialData?.slug || ""}
              placeholder="honda-civic-rs-turbo"
              className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none bg-neutral-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Merek / Brand *
            </label>
            {/* DROPDOWN SELECT BRAND */}
            <select
              name="brand"
              defaultValue={initialData?.brand || BRANDS[0]}
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            >
              {BRANDS.map((brandName) => (
                <option key={brandName} value={brandName}>
                  {brandName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Model *
            </label>
            <input
              name="model"
              defaultValue={initialData?.model || ""}
              required
              placeholder="Civic"
              className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Varian
            </label>
            <input
              name="variant"
              defaultValue={initialData?.variant || ""}
              placeholder="RS Turbo"
              className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            />
          </div>
        </div>
      </fieldset>

      {/* --- SECTION 3: SPESIFIKASI TEKNIS --- */}
      <fieldset className="space-y-4">
        <legend className="text-base font-black uppercase tracking-tight text-neutral-950 border-b border-neutral-200 pb-2 w-full">
          Spesifikasi Teknis
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Kondisi *
            </label>
            <select
              name="condition"
              defaultValue={initialData?.condition || "New"}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Exclusive">Exclusive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Tahun *
            </label>
            <input
              type="number"
              name="year"
              defaultValue={initialData?.year || new Date().getFullYear()}
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Kilometer (KM)
            </label>
            <input
              type="number"
              name="mileage"
              defaultValue={initialData?.mileage || 0}
              placeholder="0"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Transmisi *
            </label>
            <select
              name="transmission"
              defaultValue={
                initialData?.transmission || TRANSMISSION_OPTIONS[0]
              }
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            >
              {TRANSMISSION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Bahan Bakar *
            </label>
            <select
              name="fuel_type"
              defaultValue={initialData?.fuel_type || FUEL_OPTIONS[0]}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
            >
              {FUEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* --- SECTION 4: HARGA & DISKON --- */}
      <fieldset className="space-y-4">
        <legend className="text-base font-black uppercase tracking-tight text-neutral-950 border-b border-neutral-200 pb-2 w-full">
          Harga & Skema Diskon
        </legend>

        <div className="p-4 bg-neutral-50 rounded-md border border-neutral-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Harga OTR (Rp) *
              </label>
              <input
                type="number"
                name="price"
                value={priceValue || ""}
                onChange={handlePriceChange}
                required
                placeholder="Contoh: 1000000000"
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-base font-black text-neutral-950 focus:border-neutral-950 focus:outline-none bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Mode Input Diskon
                </label>
                <div className="flex rounded-md border border-neutral-300 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => handleModeChange("percentage")}
                    className={`px-3 py-1 text-xs font-black uppercase rounded-xs transition-colors ${
                      discountMode === "percentage"
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    Persen (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("fixed")}
                    className={`px-3 py-1 text-xs font-black uppercase rounded-xs transition-colors ${
                      discountMode === "fixed"
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    Nominal (Rp)
                  </button>
                </div>
              </div>

              {discountMode === "percentage" ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercentValue || ""}
                      onChange={handlePercentChange}
                      placeholder="10"
                      className="w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:border-neutral-950 focus:outline-none bg-white pr-7"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-400">
                      %
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      readOnly
                      value={`Rp ${discountPriceValue.toLocaleString("id-ID")}`}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2.5 text-xs font-bold text-neutral-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={discountPriceValue || ""}
                  onChange={handleFixedDiscountChange}
                  placeholder="Masukkan nominal rupiah potongan..."
                  className="w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:border-neutral-950 focus:outline-none bg-white"
                />
              )}
            </div>
          </div>

          {/* Ringkasan Kalkulasi Harga Bersih */}
          {priceValue > 0 && (
            <div className="pt-3 border-t border-neutral-200 flex flex-wrap justify-between items-center text-xs gap-2">
              <span className="font-bold text-neutral-600 uppercase tracking-wider">
                Kalkulasi Harga Akhir:
              </span>
              <div className="flex items-baseline gap-2">
                {discountPriceValue > 0 && (
                  <span className="text-xs text-neutral-400 line-through font-semibold">
                    Rp {priceValue.toLocaleString("id-ID")}
                  </span>
                )}
                <span className="text-lg font-black text-red-600 tracking-tight">
                  Rp {finalNetPrice.toLocaleString("id-ID")}
                </span>
                {discountPriceValue > 0 && (
                  <span className="text-[10px] font-black uppercase bg-red-600 text-white px-1.5 py-0.5 rounded-xs">
                    HEBAT! DISKON {discountPercentValue}% (POTONGAN Rp{" "}
                    {discountPriceValue.toLocaleString("id-ID")})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Status Publikasi Unit *
          </label>
          <select
            name="status"
            defaultValue={initialData?.status || "available"}
            className="w-full sm:w-1/3 rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold focus:border-neutral-950 focus:outline-none"
          >
            <option value="available">Tersedia (Available)</option>
            <option value="sold">Terjual (Sold)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Deskripsi & Fitur Utama
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialData?.description || ""}
            placeholder="Tuliskan spesifikasi lengkap, catatan garansi, atau kondisi fisik mobil..."
            className="w-full rounded-md border border-neutral-300 p-3.5 text-xs font-medium focus:border-neutral-950 focus:outline-none"
          />
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-neutral-300 px-6 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors uppercase tracking-wider"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading || uploadingCategory !== null}
          className="rounded-md bg-neutral-950 px-8 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors uppercase tracking-wider cursor-pointer"
        >
          {loading
            ? "MENYIMPAN..."
            : initialData
              ? "SIMPAN PERUBAHAN"
              : "TAMBAH MOBIL"}
        </button>
      </div>
    </form>
  );
}
