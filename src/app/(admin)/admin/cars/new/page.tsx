"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createCar } from "@/lib/actions/car";
import {
  ConditionType,
  TransmissionType,
  FuelType,
  CarStatus,
  CONDITION_OPTIONS,
  TRANSMISSION_OPTIONS,
  FUEL_OPTIONS,
} from "@/types/cars";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faSpinner,
  faCloudArrowUp,
  faXmark,
  faGauge,
  faHeading,
  faImages,
  faPercent,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";

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

interface CarFormData {
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  condition: ConditionType;
  price: number;
  discount_price: number;
  description: string;
  status: CarStatus;
}

export default function NewCarPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State Kontrol Mode Diskon (Persen vs Nominal Rupiah)
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const [formData, setFormData] = useState<CarFormData>({
    title: "",
    brand: BRANDS[0],
    model: "",
    variant: "",
    year: new Date().getFullYear(),
    mileage: 0,
    transmission: TRANSMISSION_OPTIONS[0],
    fuel_type: FUEL_OPTIONS[0],
    condition: CONDITION_OPTIONS[0],
    price: 0,
    discount_price: 0,
    description: "",
    status: "available",
  });

  const [images, setImages] = useState<string[]>([]);
  const [exteriorImages, setExteriorImages] = useState<string[]>([]);
  const [interiorImages, setInteriorImages] = useState<string[]>([]);

  const generateTitle = (brand: string, model: string, variant: string) => {
    return `${brand} ${model} ${variant}`.replace(/\s+/g, " ").trim();
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setFormData((prev) => ({
      ...prev,
      brand: newBrand,
      title: generateTitle(newBrand, prev.model, prev.variant),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const isNumberField = [
      "year",
      "price",
      "discount_price",
      "mileage",
    ].includes(name);

    setFormData((prev) => {
      const parsedValue = isNumberField
        ? value === ""
          ? 0
          : Number(value)
        : value;

      const updated = {
        ...prev,
        [name]: parsedValue,
      };

      // Recalculate discount nominal ketika harga OTR berubah saat mode persentase aktif
      if (name === "price" && discountType === "percentage") {
        const calculatedDiscount = Math.round(
          ((parsedValue as number) * discountPercent) / 100,
        );
        updated.discount_price = calculatedDiscount;
      }

      // Sinkronkan persen jika input rupiah potongan diubah secara manual
      if (name === "discount_price" && discountType === "fixed") {
        const p = updated.price;
        const d = parsedValue as number;
        if (p > 0) {
          setDiscountPercent(
            Math.min(100, Math.max(0, Math.round((d / p) * 100))),
          );
        }
      }

      if (name === "model" || name === "variant") {
        const brand = updated.brand;
        const model = name === "model" ? value : updated.model;
        const variant = name === "variant" ? value : updated.variant;
        updated.title = generateTitle(brand, model, variant);
      }

      return updated;
    });
  };

  // Handler Ganti Mode Diskon (% / Rp)
  const handleDiscountTypeChange = (type: "percentage" | "fixed") => {
    setDiscountType(type);
    if (type === "percentage") {
      const calculatedDiscount = Math.round(
        (formData.price * discountPercent) / 100,
      );
      setFormData((prev) => ({ ...prev, discount_price: calculatedDiscount }));
    } else {
      if (formData.price > 0 && formData.discount_price > 0) {
        setDiscountPercent(
          Math.min(
            100,
            Math.max(
              0,
              Math.round((formData.discount_price / formData.price) * 100),
            ),
          ),
        );
      }
    }
  };

  // Handler Input Persentase Diskon (0 - 100%)
  const handleDiscountPercentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    const clampedPercent = Math.min(100, Math.max(0, val));
    setDiscountPercent(clampedPercent);

    if (discountType === "percentage") {
      const calculatedDiscount = Math.round(
        (formData.price * clampedPercent) / 100,
      );
      setFormData((prev) => ({ ...prev, discount_price: calculatedDiscount }));
    }
  };

  const uploadFiles = async (files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `units/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }
    return uploadedUrls;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: "main" | "exterior" | "interior",
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls = await uploadFiles(files);
      if (category === "main") setImages((prev) => [...prev, ...urls]);
      if (category === "exterior")
        setExteriorImages((prev) => [...prev, ...urls]);
      if (category === "interior")
        setInteriorImages((prev) => [...prev, ...urls]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Harap unggah minimal 1 foto utama.");
      return;
    }

    setLoading(true);
    try {
      const cleanTitle =
        formData.title || `${formData.brand} ${formData.model}`.trim();
      const slug = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

      const finalDiscountCut =
        discountType === "percentage"
          ? Math.round((formData.price * discountPercent) / 100)
          : formData.discount_price;

      await createCar({
        ...formData,
        title: cleanTitle,
        discount_price: finalDiscountCut,
        slug,
        images,
        exterior_images: exteriorImages,
        interior_images: interiorImages,
      });

      router.push("/admin/cars");
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan unit mobil.");
    } finally {
      setLoading(false);
    }
  };

  const finalNetPrice = Math.max(0, formData.price - formData.discount_price);

  return (
    <main className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header Utama */}
      <header className="border-b border-neutral-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Tambah Unit Baru
        </h1>
        <p className="text-xs text-neutral-500 mt-1 font-normal">
          Kelola katalog kendaraan dengan spesifikasi teknis dan galeri foto
          yang rapi.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: INFORMASI DASAR */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-700">
              <FontAwesomeIcon icon={faHeading} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Judul & Identitas Mobil
              </h2>
              <p className="text-xs text-neutral-500">
                Merek, model, varian, dan judul tampilan di katalog.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Merek / Brand *
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleBrandChange}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                {BRANDS.map((brandName) => (
                  <option key={brandName} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Model *
              </label>
              <input
                type="text"
                name="model"
                required
                placeholder="Contoh: Civic / Serie 3"
                value={formData.model}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Varian
              </label>
              <input
                type="text"
                name="variant"
                placeholder="Contoh: RS Turbo / M Sport"
                value={formData.variant}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Judul Tampilan Unit (Otomatis) *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </section>

        {/* SECTION 2: SPESIFIKASI TEKNIS & HARGA */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-700">
              <FontAwesomeIcon icon={faGauge} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Spesifikasi & Harga
              </h2>
              <p className="text-xs text-neutral-500">
                Kondisi teknis, transmisi, harga OTR, dan skema diskon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Kondisi *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Transmisi *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                {TRANSMISSION_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Bahan Bakar *
              </label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                {FUEL_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                <option value="available">Tersedia (Available)</option>
                <option value="reserved">Dipesan (Reserved)</option>
                <option value="sold">Terjual (Sold)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Tahun *
              </label>
              <input
                type="number"
                name="year"
                required
                value={formData.year || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Kilometer (KM)
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* HARGA & DISKON SECTION */}
          <div className="p-4 bg-neutral-50/80 rounded-md border border-neutral-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Harga OTR (Rp) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="Contoh: 1000000000"
                  value={formData.price || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-sm font-bold text-neutral-900 focus:border-neutral-900 focus:outline-none bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Mode Diskon
                  </label>
                  <div className="flex rounded border border-neutral-300 bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange("percentage")}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-xs flex items-center gap-1 transition-colors ${
                        discountType === "percentage"
                          ? "bg-neutral-900 text-white font-semibold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faPercent}
                        className="h-2.5 w-2.5"
                      />
                      Persen (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange("fixed")}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-xs flex items-center gap-1 transition-colors ${
                        discountType === "fixed"
                          ? "bg-neutral-900 text-white font-semibold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="h-2.5 w-2.5"
                      />
                      Nominal (Rp)
                    </button>
                  </div>
                </div>

                {discountType === "percentage" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="10"
                        value={discountPercent || ""}
                        onChange={handleDiscountPercentChange}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-7 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none bg-white"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                        %
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        readOnly
                        value={`Rp ${(formData.discount_price || 0).toLocaleString("id-ID")}`}
                        className="w-full rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-500 bg-neutral-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="number"
                    name="discount_price"
                    placeholder="Masukkan nominal rupiah potongan..."
                    value={formData.discount_price || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none bg-white"
                  />
                )}
              </div>
            </div>

            {/* Panel Ringkasan Harga Akhir */}
            {formData.price > 0 && (
              <div className="pt-3 border-t border-neutral-200 flex flex-wrap justify-between items-center text-xs gap-2">
                <span className="font-medium text-neutral-600">
                  Kalkulasi Harga Bersih:
                </span>
                <div className="flex items-baseline gap-2">
                  {formData.discount_price > 0 && (
                    <span className="text-xs text-neutral-400 line-through">
                      Rp {formData.price.toLocaleString("id-ID")}
                    </span>
                  )}
                  <span className="text-base font-bold text-red-600">
                    Rp {finalNetPrice.toLocaleString("id-ID")}
                  </span>
                  {formData.discount_price > 0 && (
                    <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-xs">
                      Hemat {discountPercent}% (Rp{" "}
                      {formData.discount_price.toLocaleString("id-ID")})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Deskripsi Unit
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Jelaskan kondisi unit, fitur unggulan, garansi, atau catatan penting..."
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 p-3 text-xs font-normal text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </section>

        {/* SECTION 3: UPLOAD FOTO DIKELOMPOKKAN */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-700">
              <FontAwesomeIcon icon={faImages} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Galeri Foto Kategori
              </h2>
              <p className="text-xs text-neutral-500">
                Unggah foto kendaraan sesuai bagiannya.
              </p>
            </div>
          </div>

          {/* Upload Main/Overview */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700">
              1. Foto Utama / Cover * (Wajib minimal 1 foto)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-4/3 rounded-md overflow-hidden border border-neutral-200 group"
                >
                  <img
                    src={url}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-neutral-900/80 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-md aspect-4/3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="h-5 w-5 text-neutral-400"
                />
                <span className="text-[11px] font-semibold text-neutral-700 mt-1">
                  Upload Utama
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, "main")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Eksterior */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <label className="block text-xs font-semibold text-neutral-700">
              2. Foto Eksterior
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {exteriorImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-4/3 rounded-md overflow-hidden border border-neutral-200"
                >
                  <img
                    src={url}
                    alt="Exterior"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExteriorImages((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute top-1 right-1 bg-neutral-900/80 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-md aspect-4/3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="h-5 w-5 text-neutral-400"
                />
                <span className="text-[11px] font-semibold text-neutral-700 mt-1">
                  Upload Eksterior
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, "exterior")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Interior */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <label className="block text-xs font-semibold text-neutral-700">
              3. Foto Interior
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {interiorImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-4/3 rounded-md overflow-hidden border border-neutral-200"
                >
                  <img
                    src={url}
                    alt="Interior"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setInteriorImages((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute top-1 right-1 bg-neutral-900/80 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-md aspect-4/3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="h-5 w-5 text-neutral-400"
                />
                <span className="text-[11px] font-semibold text-neutral-700 mt-1">
                  Upload Interior
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, "interior")}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Submit Action */}
        <footer className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Link
            href="/admin/cars"
            className="rounded-md border border-neutral-300 px-5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading || uploading ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin h-3.5 w-3.5"
                />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Simpan Unit ke Katalog</span>
            )}
          </button>
        </footer>
      </form>
    </main>
  );
}
