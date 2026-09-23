import { Suspense } from "react";

// Paksa halaman untuk selalu di-render dinamis agar tidak bentrok dengan static generation
export const dynamic = "force-dynamic";

function PromoContent() {
  return (
    <main className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-neutral-100 pb-4">
          <h1 className="text-3xl font-extrabold text-neutral-900">
            Promo & Penawaran Eksklusif
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Dapatkan cashback menarik dan bunga kredit ringan khusus bulan ini.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-2">
            <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
              Promo Terbatas
            </span>
            <h2 className="text-lg font-bold text-neutral-900">
              Program DP Ringan 10% All Unit
            </h2>
            <p className="text-xs text-neutral-600">
              Nikmati kemudahan kepemilikan kendaraan dengan DP terjangkau dan
              proses instan.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default function PromoPage() {
  return (
    <Suspense fallback={<div className="py-28 text-center">Loading...</div>}>
      <PromoContent />
    </Suspense>
  );
}
