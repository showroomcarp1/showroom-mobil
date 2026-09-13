"use client";

import { useState } from "react";
import { Car, TransmissionType, FuelType, CarStatus } from "@/types/car";
import { createCar, updateCar } from "@/lib/actions/car";
import { TRANSMISSION_OPTIONS, FUEL_OPTIONS } from "@/lib/constants/inventory";
import { CarFormSchemaType } from "@/lib/validations/car";

interface CarFormProps {
  initialData?: Car | null;
}

export default function CarForm({ initialData }: CarFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    const payload: CarFormSchemaType = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      variant: formData.get("variant") as string,
      year: Number(formData.get("year")),
      price: Number(formData.get("price")),
      discount_price: Number(formData.get("discount_price")) || 0,
      transmission: formData.get("transmission") as TransmissionType,
      fuel_type: formData.get("fuel_type") as FuelType,
      description: (formData.get("description") as string) || "",
      status: (formData.get("status") as CarStatus) || "available",
      features: [],
    };

    try {
      if (initialData?.id) {
        await updateCar(initialData.id, payload);
      } else {
        await createCar(payload);
      }
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Merek
          </label>
          <input
            name="brand"
            defaultValue={initialData?.brand || ""}
            required
            placeholder="Toyota"
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
            placeholder="Alphard"
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
            required
            placeholder="2.5 HEV"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Harga OTR (Rp)
          </label>
          <input
            type="number"
            name="price"
            defaultValue={initialData?.price || ""}
            required
            placeholder="1500000000"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Diskon / Potongan (Rp)
          </label>
          <input
            type="number"
            name="discount_price"
            defaultValue={initialData?.discount_price || 0}
            placeholder="20000000"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1">
          Deskripsi Deskriptif
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description || ""}
          placeholder="Kondisi istimewa, bebas banjir dan kecelakaan..."
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
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
