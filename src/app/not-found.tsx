import Link from "next/link";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faHouse, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-4 max-w-md">
        <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-600">
          404 Error
        </span>

        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-xs leading-relaxed text-neutral-500">
          Halaman atau unit mobil yang Anda cari tidak tersedia, telah dihapus, atau alamat URL yang Anda tuju salah.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
            Lihat Katalog
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <FontAwesomeIcon icon={faHouse} className="h-3.5 w-3.5" />
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}