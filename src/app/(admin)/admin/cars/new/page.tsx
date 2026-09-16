"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createCar } from "@/lib/actions/car";
import type {
  ConditionType,
  TransmissionType,
  FuelType,
  CarStatus,
} from "@/types/cars";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faSpinner,
  faCloudArrowUp,
  faXmark,
  faCar,
  faTags,
  faImages,
  faGauge,
  faHeading,
} from "@fortawesome/free-solid-svg-icons";

// Data Konstan
const BRANDS = [
  { name: "BMW", slug: "bmw" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "Porsche", slug: "porsche" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Land Rover", slug: "land-rover" },
  { name: "Mini", slug: "mini" },
  { name: "Audi", slug: "audi" },
  { name: "Maserati", slug: "maserati" },
  { name: "Aston Martin", slug: "aston-martin" },
  { name: "Bentley", slug: "bentley" },
  { name: "Rolls-Royce", slug: "rolls-royce" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Jaguar", slug: "jaguar" },
  { name: "Subaru", slug: "subaru" },
  { name: "Lexus", slug: "lexus" },
  { name: "Honda", slug: "honda" },
  { name: "Toyota", slug: "toyota" },
] as const;

// Interface State Form
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

  const [formData, setFormData] = useState<CarFormData>({
    title: "BMW ",
    brand: BRANDS[0].name,
    model: "",
    variant: "",
    year: new Date().getFullYear(),
    mileage: 0,
    transmission: "Automatic",
    fuel_type: "Petrol",
    condition: "New",
    price: 0,
    discount_price: 0,
    description: "",
    status: "available",
  });

  const [images, setImages] = useState<string[]>([]);

  // Update Brand sekaligus generate rekomendasi Judul
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setFormData((prev) => {
      const autoTitle = `${newBrand} ${prev.model} ${prev.variant}`.trim();
      return {
        ...prev,
        brand: newBrand,
        title: autoTitle,
      };
    });
  };

  // Handler Perubahan Input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          name === "year" ||
          name === "price" ||
          name === "discount_price" ||
          name === "mileage"
            ? Number(value)
            : value,
      };

      if (name === "model" || name === "variant") {
        const brand = updated.brand;
        const model = name === "model" ? value : updated.model;
        const variant = name === "variant" ? value : updated.variant;
        updated.title = `${brand} ${model} ${variant}`.trim();
      }

      return updated;
    });
  };

  // Handler Upload Gambar
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      alert("Maksimal total foto yang dapat diunggah adalah 10 foto.");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}.${fileExt}`;
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

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal mengunggah foto. Pastikan bucket 'car-images' tersedia.",
      );
    } finally {
      setUploading(false);
    }
  };

  // Hapus Gambar
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Harap unggah minimal 1 foto unit kendaraan.");
      return;
    }

    setLoading(true);

    try {
      const slug = `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

      await createCar({
        ...formData,
        slug,
        images,
      });

      router.push("/admin/cars");
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan unit mobil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header Utama Navigasi */}
      <header className="border-b border-neutral-200 pb-6">
        <h1 className="text-[30px] font-black tracking-tight text-neutral-950 sm:text-[30px]">
          Tambah Unit Baru
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Kelola rincian data spesifikasi, harga, serta dokumentasi visual
          kendaraan.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Dokumentasi Foto */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900">
                <FontAwesomeIcon icon={faImages} className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Foto Kendaraan
                </h2>
                <p className="text-xs text-neutral-500">
                  Unggah hingga 10 foto (Format JPG/PNG, Maks. 5MB/file)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-400">
              {images.length} / 10 Foto
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
            {images.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="relative group aspect-4/3 rounded-md overflow-hidden border border-neutral-200 bg-neutral-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Preview foto ke-${idx + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                  title="Hapus foto"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-3 w-3 block" />
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50 hover:bg-neutral-100/80 transition-all rounded-xl aspect-4/3 flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                {uploading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="h-6 w-6 text-neutral-600 animate-spin"
                  />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      className="h-6 w-6 text-neutral-400 mb-2"
                    />
                    <span className="text-xs font-bold text-neutral-700">
                      Pilih Foto
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">
                      Bisa pilih beberapa
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        {/* Section 2: Judul Display & Merek/Model */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900">
              <FontAwesomeIcon icon={faHeading} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Judul & Identitas Utama
              </h2>
              <p className="text-xs text-neutral-500">
                Penamaan unit yang akan muncul sebagai judul halaman/kartu
                katalog.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Judul Penampilan Unit (Title) *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                required
                placeholder="Contoh: BMW M3 Competition Package 2023"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Judul ini akan ditampilkan paling menonjol pada halaman depan
                katalog.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div>
                <label
                  htmlFor="brand"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                >
                  Merek (Brand) *
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleBrandChange}
                  className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
                >
                  {BRANDS.map((b) => (
                    <option key={b.slug} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="model"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                >
                  Model *
                </label>
                <input
                  id="model"
                  type="text"
                  name="model"
                  required
                  placeholder="Ketik Model (Contoh: M3 / X5 / Civic)"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="variant"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                >
                  Varian / Tipe
                </label>
                <input
                  id="variant"
                  type="text"
                  name="variant"
                  placeholder="Contoh: Competition / VRZ / Type R"
                  value={formData.variant}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Spesifikasi Teknis & Kondisi */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900">
              <FontAwesomeIcon icon={faCar} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Spesifikasi Teknis & Kondisi
              </h2>
              <p className="text-xs text-neutral-500">
                Data kondisi kendaraan, spesifikasi perakitan mesin, dan
                transmisi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label
                htmlFor="condition"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Kondisi Unit *
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-semibold focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              >
                <option value="New">Baru (New)</option>
                <option value="Used">Bekas (Used)</option>
                <option value="Exclusive">Esklusif (Exclusive)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Tahun Pembuatan *
              </label>
              <input
                id="year"
                type="number"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="transmission"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Transmisi *
              </label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              >
                <option value="Automatic">Automatic (AT)</option>
                <option value="Manually">Manually (MT)</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fuel_type"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Bahan Bakar *
              </label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              >
                <option value="Petrol">Bensin (Petrol)</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric (Listrik)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 4: Kilometer, Harga & Deskripsi */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-900">
              <FontAwesomeIcon icon={faTags} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Penggunaan & Penawaran Harga
              </h2>
              <p className="text-xs text-neutral-500">
                Informasi Jarak Tempuh (Kilometer), penetapan harga OTR, serta
                potongan harga.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="mileage"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5"
              >
                <FontAwesomeIcon
                  icon={faGauge}
                  className="h-3 w-3 text-neutral-500"
                />
                Kilometer / Jarak Tempuh (KM) *
              </label>
              <input
                id="mileage"
                type="number"
                name="mileage"
                required
                min="0"
                placeholder="Contoh: 15000"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Harga OTR (Rp) *
              </label>
              <input
                id="price"
                type="number"
                name="price"
                required
                min="0"
                placeholder="1250000000"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="discount_price"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
              >
                Potongan Harga / Diskon (Rp)
              </label>
              <input
                id="discount_price"
                type="number"
                name="discount_price"
                min="0"
                placeholder="0"
                value={formData.discount_price}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
            >
              Deskripsi Catatan Kendaraan
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Catatan kondisi fisik, kelengkapan riwayat servis resmi, status pajak, dll."
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-200 p-4 text-sm font-medium focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-hidden transition-all bg-neutral-50/50 focus:bg-white"
            />
          </div>
        </section>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
          <Link
            href="/admin/cars"
            className="rounded-md border border-neutral-300 px-6 py-3 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-8 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all  disabled:opacity-50 cursor-pointer"
          >
            {loading && (
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin h-3.5 w-3.5"
              />
            )}
            Simpan Unit Ke Katalog
          </button>
        </div>
      </form>
    </div>
  );
}
