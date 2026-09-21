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
import { deleteCar, updateCarStatus } from "@/lib/actions/car";
import { formatRupiah } from "@/lib/utils/formatters";

// types
interface DataTableProps {
  cars: Car[];
}

export default function DataTable({ cars }: DataTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // delete car
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

  // update status
  const handleStatusChange = async (
    id: string,
    newStatus: "available" | "booked" | "sold",
  ) => {
    setIsUpdatingStatus(id);
    try {
      await updateCarStatus(id, newStatus);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal memperbarui status.");
      }
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  return (
    <section
      aria-label="Manajemen Inventaris Mobil"
      className="border border-neutral-200 bg-white text-neutral-900 rounded-lg overflow-hidden shadow-sm"
    >
      {/* header table */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">
            Inventaris Mobil
          </h2>
          <p className="text-xs font-medium text-neutral-500 mt-0.5">
            Total Unit Terdaftar:{" "}
            <span className="text-neutral-900 font-semibold">
              {cars.length}
            </span>
          </p>
        </div>

        <Link
          href="/admin/cars/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-900 px-4 text-xs font-semibold text-white rounded-md transition-opacity hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 shrink-0"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          <span>Tambah Unit</span>
        </Link>
      </header>

      {/* table container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only">
            Daftar inventaris mobil terdaftar
          </caption>

          {/* table head */}
          <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <tr>
              <th scope="col" className="px-5 py-3">
                Unit Mobil
              </th>
              <th scope="col" className="px-5 py-3">
                Tahun
              </th>
              <th scope="col" className="px-5 py-3">
                Transmisi
              </th>
              <th scope="col" className="px-5 py-3">
                Harga OTR
              </th>
              <th scope="col" className="px-5 py-3">
                Status
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          {/* table body */}
          <tbody className="divide-y divide-neutral-200 text-sm font-normal text-neutral-800">
            {cars.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-neutral-400 font-medium"
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
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    {/* unit mobil */}
                    <td className="px-5 py-3.5 align-middle max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100 rounded">
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
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="font-semibold text-neutral-900 text-sm line-clamp-2 leading-snug">
                            {displayTitle}
                          </p>
                          <span className="text-[11px] font-normal text-neutral-400 truncate mt-0.5">
                            ID: {car.slug || car.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* tahun */}
                    <td className="px-5 py-3.5 align-middle font-medium text-neutral-700 whitespace-nowrap">
                      {car.year}
                    </td>

                    {/* transmisi */}
                    <td className="px-5 py-3.5 align-middle font-medium text-neutral-700 whitespace-nowrap capitalize">
                      {car.transmission}
                    </td>

                    {/* harga */}
                    <td className="px-5 py-3.5 align-middle font-semibold text-neutral-900 whitespace-nowrap">
                      {formatRupiah(
                        car.discount_price
                          ? car.price - car.discount_price
                          : car.price,
                      )}
                    </td>

                    {/* status */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <select
                        value={car.status || "available"}
                        disabled={isUpdatingStatus === car.id}
                        onChange={(e) =>
                          handleStatusChange(
                            car.id,
                            e.target.value as "available" | "booked" | "sold",
                          )
                        }
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border cursor-pointer focus:outline-none ${
                          car.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : car.status === "booked"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-neutral-100 text-neutral-700 border-neutral-200"
                        }`}
                      >
                        <option
                          value="available"
                          className="bg-white text-neutral-900 font-medium"
                        >
                          Tersedia
                        </option>
                        <option
                          value="booked"
                          className="bg-white text-neutral-900 font-medium"
                        >
                          Booked
                        </option>
                        <option
                          value="sold"
                          className="bg-white text-neutral-900 font-medium"
                        >
                          Terjual
                        </option>
                      </select>
                    </td>

                    {/* aksi */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/cars/${car.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center border border-neutral-200 bg-white text-neutral-600 rounded-md transition-all hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none"
                          title="Edit Unit & Gambar"
                          aria-label={`Edit ${displayTitle}`}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="h-3.5 w-3.5"
                          />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(car.id)}
                          disabled={isDeleting === car.id}
                          className="inline-flex h-8 w-8 items-center justify-center border border-red-600 bg-red-600 text-white rounded-md transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer focus:outline-none"
                          title="Hapus Unit"
                          aria-label={`Hapus ${displayTitle}`}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="h-3.5 w-3.5"
                          />
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
