import CarForm from "@/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Tambah Unit Mobil
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Isi formulir berikut untuk menambahkan stok baru ke katalog.
        </p>
      </header>

      {/* Form Input Data */}
      <CarForm />
    </main>
  );
}
