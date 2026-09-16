"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faPenToSquare,
  faTrash,
  faPlus,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import { Car } from "@/types/cars";
import { deleteCar } from "@/lib/actions/car";
import { formatRupiah } from "@/lib/utils/formatters";

interface DataTableProps {
  cars: Car[];
}

export default function DataTable({ cars }: DataTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus unit mobil ini?")) {
      setIsDeleting(id);
      try {
        await deleteCar(id);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Gagal menghapus unit.");
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-neutral-100">
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Inventaris Mobil
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Total unit terdaftar: {cars.length}
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          Tambah Unit
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-600">
          <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-900 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Unit Mobil</th>
              <th className="px-6 py-3.5">Tahun</th>
              <th className="px-6 py-3.5">Transmisi</th>
              <th className="px-6 py-3.5">Harga OTR</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cars.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-neutral-400"
                >
                  Belum ada data unit mobil.
                </td>
              </tr>
            ) : (
              cars.map((car) => {
                const thumbnail =
                  car.images && car.images.length > 0
                    ? car.images[0]
                    : car.image_url || null;
                const displayTitle =
                  car.title ||
                  `${car.brand} ${car.model} ${car.variant || ""}`.trim();

                return (
                  <tr
                    key={car.id}
                    className="hover:bg-neutral-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={displayTitle}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                              <FontAwesomeIcon
                                icon={faCar}
                                className="h-4 w-4"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">
                            {displayTitle}
                          </p>
                          <span className="block text-[10px] text-neutral-500">
                            Slug: {car.slug || car.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{car.year}</td>
                    <td className="px-6 py-4">{car.transmission}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {formatRupiah(
                        car.discount_price
                          ? car.price - car.discount_price
                          : car.price,
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          car.status === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        {car.status === "available" ? "Tersedia" : "Terjual"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/cars/${car.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100"
                        title="Edit Unit & Gambar"
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="h-3.5 w-3.5"
                        />
                      </Link>
                      <button
                        onClick={() => handleDelete(car.id)}
                        disabled={isDeleting === car.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                        title="Hapus Unit"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="h-3.5 w-3.5"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
