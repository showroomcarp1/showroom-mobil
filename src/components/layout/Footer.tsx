import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          {/* Kolom Logo Brand & Deskripsi */}
          <div className="md:col-span-1 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/hero_logo.png"
                  alt="Showroom Logo"
                  width={200}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>
              <p className="mt-6 text-sm leading-relaxed text-neutral-400 font-normal">
                Dealer resmi penyedia kendaraan roda empat berkualitas dengan
                garansi resmi dan layanan purna jual terbaik.
              </p>
            </div>
          </div>

          {/* Kolom Navigasi */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-[0.25em] text-white">
              Navigasi
            </h3>
            <ul className="mt-6 space-y-3.5 text-sm font-medium">
              <li>
                <Link
                  href="/cars"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Katalog Unit
                </Link>
              </li>
              <li>
                <Link
                  href="/promo"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Promo & Diskon
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Jam Operasional */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-[0.25em] text-white">
              Jam Operasional
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-neutral-400">
              <li className="flex justify-between border-b border-neutral-900 pb-2.5">
                <span>Senin - Jumat:</span>
                <span className="font-semibold text-white">08.00 - 17.00</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-2.5">
                <span>Sabtu:</span>
                <span className="font-semibold text-white">08.00 - 15.00</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-2.5">
                <span>Minggu / Libur:</span>
                <span className="font-semibold text-neutral-500">Tutup</span>
              </li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-[0.25em] text-white">
              Hubungi Kami
            </h3>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3.5">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mt-1 h-4 w-4 text-neutral-400 flex-shrink-0"
                />
                <span className="text-neutral-300 leading-relaxed">
                  Jl. Raya Utama No. 123, Jakarta Selatan
                </span>
              </li>
              <li className="flex items-center gap-3.5">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="h-4 w-4 text-neutral-400 flex-shrink-0"
                />
                <span className="text-neutral-300">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3.5">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-4 w-4 text-neutral-400 flex-shrink-0"
                />
                <span className="text-neutral-300">info@autolux.co.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 border-t border-neutral-900 pt-8 text-left text-[15px] font-semibold uppercase text-neutral-500">
          <p>&copy; {new Date().getFullYear()} AutoHigh Car Showroom</p>
        </div>
      </div>
    </footer>
  );
}
