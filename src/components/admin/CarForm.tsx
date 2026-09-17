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

type ImageCategory = "images" | "exterior_images" | "interior_images";

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
  const [uploadingCategory, setUploadingCategory] =
    useState<ImageCategory | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // State terpisah untuk masing-masing kategori gambar
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

  // Helper untuk mendapatkan setter berdasarkan kategori
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

  // Helper untuk mendapatkan list URL berdasarkan kategori
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

  // Handler Upload Foto Universal per Kategori ke Supabase Storage
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

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `cars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(
            `Gagal mengunggah foto ${file.name}: ${uploadError.message}`,
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setList((prev) => [...prev, ...uploadedUrls]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat mengunggah foto.");
      }
    } finally {
      setUploadingCategory(null);
      e.target.value = "";
    }
  };

  // Handler Hapus Gambar per Kategori
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
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat menyimpan data.");
      }
      setLoading(false);
    }
  };

  // Sub-komponen UI untuk Section Pengelolaan Gambar
  const renderImageUploader = (
    category: ImageCategory,
    title: string,
    description: string,
  ) => {
    const currentList = getCategoryList(category);
    const isUploading = uploadingCategory === category;

    return (
      <section className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {title}{" "}
              <span className="text-neutral-500">({currentList.length})</span>
            </h3>
            <p className="text-[11px] text-neutral-500">{description}</p>
          </div>

          <label className="cursor-pointer rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800">
            {isUploading ? "Mengunggah..." : "+ Unggah Foto"}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
            {currentList.map((url, idx) => (
              <figure
                key={`${category}-${idx}`}
                className="group relative aspect-video rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm"
              >
                <Image
                  src={url}
                  alt={`${title} ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(category, idx)}
                  className="absolute top-1.5 right-1.5 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                >
                  Hapus
                </button>
              </figure>
            ))}
          </div>
        ) : (
          <p className="py-2 text-center text-[11px] italic text-neutral-400">
            Belum ada foto dalam kategori ini.
          </p>
        )}
      </section>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 space-y-6 shadow-sm"
    >
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium"
        >
          {errorMsg}
        </div>
      )}

      {/* --- SECTION 1: MANAJEMEN FOTO GALERI --- */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2 w-full">
          Galeri Foto Kendaraan
        </legend>

        {renderImageUploader(
          "images",
          "Foto Utama (Hero)",
          "Foto yang muncul sebagai banner/cover utama kartu mobil.",
        )}

        {renderImageUploader(
          "exterior_images",
          "Galeri Eksterior",
          "Foto bodi luar, velg, lampu, dan tampak samping/belakang.",
        )}

        {renderImageUploader(
          "interior_images",
          "Galeri Interior",
          "Foto kemudi, dasbor, jok, bagasi, dan fitur kabin.",
        )}
      </fieldset>

      {/* --- SECTION 2: IDENTITAS UNIT --- */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2 w-full">
          Identitas Kendaraan
        </legend>

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Merek
            </label>
            <input
              name="brand"
              defaultValue={initialData?.brand || ""}
              required
              placeholder="Honda"
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
              placeholder="Civic"
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
              placeholder="RS Turbo"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>
      </fieldset>

      {/* --- SECTION 3: SPESIFIKASI TEKNIS --- */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2 w-full">
          Spesifikasi Teknis
        </legend>

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
              <option value="Exclusive">Eksklusif (Exclusive)</option>
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
              defaultValue={
                initialData?.transmission || TRANSMISSION_OPTIONS[0]
              }
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
      </fieldset>

      {/* --- SECTION 4: HARGA, STATUS & DESKRIPSI --- */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2 w-full">
          Harga & Publikasi
        </legend>

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

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Deskripsi Unit
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialData?.description || ""}
            placeholder="Tulis deskripsi kondisi kendaraan..."
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </fieldset>

      <div className="pt-2 border-t border-neutral-100 flex justify-end">
        <button
          type="submit"
          disabled={loading || uploadingCategory !== null}
          className="rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Menyimpan Data..."
            : initialData
              ? "Simpan Perubahan"
              : "Tambah Mobil"}
        </button>
      </div>
    </form>
  );
}
