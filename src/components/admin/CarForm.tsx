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

interface CarFormProps {
  initialData?: Car | null;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CarForm({ initialData }: CarFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // State untuk menampung URL Gambar hasil Upload/Initial Data
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : initialData?.image_url
        ? [initialData.image_url]
        : [],
  );

  // Handler Upload Foto Lokal ke Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg("");

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `cars/${fileName}`;

        // Upload file ke bucket 'car-images' di Supabase
        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(
            `Gagal mengunggah foto ${file.name}: ${uploadError.message}`,
          );
        }

        // Ambil Public URL setelah sukses upload
        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat mengunggah foto.");
      }
    } finally {
      setUploading(false);
      // Reset value input file agar bisa memilih file yang sama jika perlu
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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

    const payload = {
      title: inputTitle,
      slug: finalSlug,
      brand,
      model,
      variant,
      year: Number(formData.get("year")),
      mileage: Number(formData.get("mileage")) || 0,
      price: Number(formData.get("price")),
      discount_price: Number(formData.get("discount_price")) || 0,
      condition: ((formData.get("condition") as string) ||
        "New") as ConditionType,
      transmission: formData.get("transmission") as TransmissionType,
      fuel_type: formData.get("fuel_type") as FuelType,
      description: (formData.get("description") as string) || "",
      status: (formData.get("status") as CarStatus) || "available",
      images: images,
      image_url: images[0] || "",
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
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat menyimpan data.");
      }
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 space-y-5 shadow-sm"
    >
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Upload Foto dari Komputer (File Input) */}
      <div className="space-y-2 border-b border-neutral-100 pb-4">
        <label className="block text-xs font-semibold text-neutral-700">
          Upload Foto Mobil dari Perangkat
        </label>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors">
            {uploading ? "Mengunggah..." : "Pilih File Foto"}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-[11px] text-neutral-500">
            Bisa pilih lebih dari satu foto (.jpg, .png, .webp)
          </span>
        </div>

        {/* Preview Galeri Foto */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative group aspect-video rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50"
              >
                <Image
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-[10px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Judul & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Judul Tampilan Mobil
          </label>
          <input
            name="title"
            defaultValue={initialData?.title || ""}
            placeholder="Honda Civic RS Turbo"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Slug URL Custom
          </label>
          <input
            name="slug"
            defaultValue={initialData?.slug || ""}
            placeholder="honda-civic-rs-turbo"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Brand, Model, Varian */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Merek
          </label>
          <input
            name="brand"
            defaultValue={initialData?.brand || ""}
            required
            placeholder="Merek"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Model
          </label>
          <input
            name="model"
            defaultValue={initialData?.model || ""}
            required
            placeholder="Model"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Varian
          </label>
          <input
            name="variant"
            defaultValue={initialData?.variant || ""}
            placeholder="Varian"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Spesifikasi Teknis & Kondisi */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Kondisi Unit
          </label>
          <select
            name="condition"
            defaultValue={initialData?.condition || "New"}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          >
            <option value="New">Baru (New)</option>
            <option value="Used">Bekas (Used)</option>
            <option value="Exclusive">Esklusif (Exclusive)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Tahun
          </label>
          <input
            type="number"
            name="year"
            defaultValue={initialData?.year || new Date().getFullYear()}
            required
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Kilometer
          </label>
          <input
            type="number"
            name="mileage"
            defaultValue={initialData?.mileage || 0}
            placeholder="0"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Transmisi
          </label>
          <select
            name="transmission"
            defaultValue={initialData?.transmission || TRANSMISSION_OPTIONS[0]}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          >
            {TRANSMISSION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Bahan Bakar
          </label>
          <select
            name="fuel_type"
            defaultValue={initialData?.fuel_type || FUEL_OPTIONS[0]}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          >
            {FUEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Harga & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Harga OTR (Rp)
          </label>
          <input
            type="number"
            name="price"
            defaultValue={initialData?.price || ""}
            required
            placeholder="Masukkan Harga"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Diskon (Rp)
          </label>
          <input
            type="number"
            name="discount_price"
            defaultValue={initialData?.discount_price || 0}
            placeholder="0"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Status Unit
          </label>
          <select
            name="status"
            defaultValue={initialData?.status || "available"}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          >
            <option value="available">Tersedia</option>
            <option value="sold">Terjual</option>
          </select>
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1">
          Deskripsi
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description || ""}
          placeholder="Tulis deskripsi kondisi kendaraan..."
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "Menyimpan Data..."
          : initialData
            ? "Simpan Perubahan"
            : "Tambah Mobil"}
      </button>
    </form>
  );
}
