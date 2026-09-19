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
    <section
      aria-label="Manajemen Inventaris Mobil"
      className="border border-neutral-300 bg-white text-neutral-900 shadow-sm rounded-xl overflow-hidden"
    >
      {/* Header Tabel */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-neutral-300">
        <div>
          <h2 className="text-xl font-black uppercase tracking-[0.15em] text-neutral-900">
            Inventaris Mobil
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-1">
            Total Unit Terdaftar:{" "}
            <span className="text-neutral-900 font-black">{cars.length}</span>
          </p>
        </div>

        <Link
          href="/admin/cars/new"
          className="inline-flex h-12 items-center justify-center gap-2.5 bg-neutral-900 px-6 text-xs font-black uppercase tracking-[0.2em] text-white transition-opacity duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-neutral-900 focus:ring-offset-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          <span>Tambah Unit</span>
        </Link>
      </header>

      {/* Container Tabel */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs font-bold uppercase tracking-wider text-neutral-900 border-collapse">
          <caption className="sr-only">
            Daftar inventaris mobil terdaftar
          </caption>

          <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-900 font-black">
            <tr>
              <th scope="col" className="px-6 py-4">
                Unit Mobil
              </th>
              <th scope="col" className="px-6 py-4">
                Tahun
              </th>
              <th scope="col" className="px-6 py-4">
                Transmisi
              </th>
              <th scope="col" className="px-6 py-4">
                Harga OTR
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {cars.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-neutral-400 font-bold uppercase tracking-wider"
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
                  <tr key={car.id}>
                    {/* Column 1: Unit Mobil */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden border border-neutral-300 bg-neutral-100 rounded-md">
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
                                className="h-5 w-5"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-black text-neutral-900 text-sm tracking-wide line-clamp-1">
                            {displayTitle}
                          </p>
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">
                            ID: {car.slug || car.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Tahun */}
                    <td className="px-6 py-4 align-middle font-bold text-neutral-900">
                      {car.year}
                    </td>

                    {/* Column 3: Transmisi */}
                    <td className="px-6 py-4 align-middle font-bold text-neutral-900 whitespace-nowrap">
                      {car.transmission}
                    </td>

                    {/* Column 4: Harga OTR */}
                    <td className="px-6 py-4 align-middle font-black text-neutral-900 whitespace-nowrap text-sm">
                      {formatRupiah(
                        car.discount_price
                          ? car.price - car.discount_price
                          : car.price,
                      )}
                    </td>

                    {/* Column 5: Status */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${
                          car.status === "available"
                            ? "bg-emerald-600 text-white"
                            : "bg-neutral-100 text-neutral-600 "
                        }`}
                      >
                        {car.status === "available" ? "Tersedia" : "Terjual"}
                      </span>
                    </td>

                    {/* Column 6: Aksi */}
                    <td className="px-6 py-4 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cars/${car.id}`}
                          className="inline-flex h-10 w-10 items-center justify-center border border-neutral-300 bg-white text-neutral-800 rounded-lg transition-opacity hover:opacity-75 focus:outline-none"
                          title="Edit Unit & Gambar"
                          aria-label={`Edit ${displayTitle}`}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="h-4 w-4"
                          />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(car.id)}
                          disabled={isDeleting === car.id}
                          className="inline-flex h-10 w-10 items-center justify-center border border-red-600 bg-red-600 text-white rounded-lg transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer focus:outline-none"
                          title="Hapus Unit"
                          aria-label={`Hapus ${displayTitle}`}
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
