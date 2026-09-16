"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function HeroSlider() {
  return (
    <section className="relative bg-neutral-900 pt-32 pb-20 text-white overflow-hidden">
      {/* Subtly Textured Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge Pengenalan */}
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Showroom Resmi & Terpercaya
          </span>

          {/* Judul Utama */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Temukan Mobil Impian Dengan Penawaran Terbaik.
          </h1>

          {/* Deskripsi */}
          <p className="mt-4 text-base text-neutral-400 sm:text-lg">
            Koleksi unit terbaru dan tersertifikasi. Kemudahan transaksi,
            simulasi kredit fleksibel, dan garansi resmi dealer.
          </p>

          {/* Tombol Aksi */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100"
            >
              Lihat Katalog Unit
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
            </Link>
            <Link
              href="/promo"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/40 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
            >
              Promo Bulan Ini
            </Link>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 backdrop-blur-md shadow-2xl">
          <form
            action="/cars"
            method="GET"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {/* Input Merek */}
            <div>
              <label
                htmlFor="brand"
                className="block text-xs font-medium text-neutral-400 mb-1"
              >
                Merek
              </label>
              <select
                id="brand"
                name="brand"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
              >
                <option value="">Semua Merek</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="BMW">BMW</option>
              </select>
            </div>

            {/* Input Transmisi */}
            <div>
              <label
                htmlFor="transmission"
                className="block text-xs font-medium text-neutral-400 mb-1"
              >
                Transmisi
              </label>
              <select
                id="transmission"
                name="transmission"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
              >
                <option value="">Semua Transmisi</option>
                <option value="Automatic">Automatic</option>
                <option value="Manually">Manually</option>
              </select>
            </div>

            {/* Input Range Harga */}
            <div>
              <label
                htmlFor="price_range"
                className="block text-xs font-medium text-neutral-400 mb-1"
              >
                Rentang Harga
              </label>
              <select
                id="price_range"
                name="price_range"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
              >
                <option value="">Semua Harga</option>
                <option value="0-300000000">&lt; Rp 300 Juta</option>
                <option value="300000000-600000000">Rp 300 - 600 Juta</option>
                <option value="600000000-1000000000">
                  Rp 600 Juta - 1 Miliar
                </option>
                <option value="1000000000+">&gt; Rp 1 Miliar</option>
              </select>
            </div>

            {/* Tombol Submit Search */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
                Cari Mobil
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
