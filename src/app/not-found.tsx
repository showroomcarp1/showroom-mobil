import Link from "next/link";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Header Teks Singkat & Tipografi Minimalis */}
        <div className="space-y-3">
          <p className="text-4xl font-extrabold tracking-tight text-neutral-900">
            404
          </p>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Page not found
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500">
            The page or vehicle you’re looking for doesn’t exist or has been
            moved.
          </p>
        </div>

        {/* Tombol Sederhana Tanpa Shadow & Tanpa Panah */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/cars"
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 focus:outline-none"
          >
            Find a Car
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none"
          >
            <FontAwesomeIcon icon={faHouse} className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
