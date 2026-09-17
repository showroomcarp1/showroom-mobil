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
  faCar,
  faTags,
  faImages,
  faGauge,
  faHeading,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

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
    title: "",
    brand: BRANDS[0].name,
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

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setFormData((prev) => ({
      ...prev,
      brand: newBrand,
      title: `${newBrand} ${prev.model} ${prev.variant}`.trim(),
    }));
  };

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
      const slug = `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      await createCar({
        ...formData,
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

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <Link
            href="/admin/cars"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" /> Kembali
            ke Daftar
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-neutral-950">
            Tambah Unit Baru
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Isi spesifikasi lengkap dan kelompokkan foto unit sesuai kriteria.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: INFORMASI DASAR */}
        <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-900">
              <FontAwesomeIcon icon={faHeading} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Judul & Identitas Mobil
              </h2>
              <p className="text-xs text-neutral-500">
                Merek, model, varian, dan nama tampilan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Brand *
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleBrandChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              >
                {BRANDS.map((b) => (
                  <option key={b.slug} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Model *
              </label>
              <input
                type="text"
                name="model"
                required
                placeholder="Contoh: Serie 3 / C-Class"
                value={formData.model}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Varian
              </label>
              <input
                type="text"
                name="variant"
                placeholder="Contoh: 320i M Sport"
                value={formData.variant}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Judul Tampilan Unit (Otomatis Terbuat) *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-bold text-neutral-900 bg-neutral-50 focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </section>

        {/* SECTION 2: SPESIFIKASI TEKNIS & HARGA */}
        <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-900">
              <FontAwesomeIcon icon={faGauge} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Spesifikasi & Harga
              </h2>
              <p className="text-xs text-neutral-500">
                Kondisi, bahan bakar, transmisi, dan harga
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Kondisi *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Transmisi *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              >
                {TRANSMISSION_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
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
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              >
                {FUEL_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Tahun *
              </label>
              <input
                type="number"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Kilometer (KM)
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Harga OTR (Rp) *
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Potongan Diskon (Rp)
              </label>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3.5 py-2 text-xs font-medium focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Deskripsi Kendaraan
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Jelaskan kondisi unit, fitur unggulan, garansi, atau catatan penting..."
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 p-3 text-xs font-medium focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </section>

        {/* SECTION 3: UPLOAD FOTO DIKELOMPOKKAN */}
        <section className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <div className="p-2 rounded-md bg-neutral-100 text-neutral-900">
              <FontAwesomeIcon icon={faImages} className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Galeri Foto Kategori
              </h2>
              <p className="text-xs text-neutral-500">
                Unggah foto berdasarkan bagian kendaraan
              </p>
            </div>
          </div>

          {/* Upload Main/Overview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
              1. Foto Utama / Overview * (Wajib ada min. 1 foto)
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
                    className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-md aspect-4/3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="h-5 w-5 text-neutral-400"
                />
                <span className="text-[11px] font-bold text-neutral-700 mt-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
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
                    className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-md aspect-4/3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="h-5 w-5 text-neutral-400"
                />
                <span className="text-[11px] font-bold text-neutral-700 mt-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
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
                    className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-md aspect-4/3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  className="h-5 w-5 text-neutral-400"
                />
                <span className="text-[11px] font-bold text-neutral-700 mt-1">
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
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Link
            href="/admin/cars"
            className="rounded-md border border-neutral-300 px-6 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-8 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
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
        </div>
      </form>
    </div>
  );
}
