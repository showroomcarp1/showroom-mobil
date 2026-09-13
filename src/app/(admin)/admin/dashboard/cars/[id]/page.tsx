import CarForm from "@/components/admin/CarForm";

export default function EditCarPage({ params }: { params: { id: string } }) {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Edit Data Mobil
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Ubah spesifikasi, harga OTR, atau potongan diskon unit ID: {params.id}
        </p>
      </header>

      {/* Form Edit Data */}
      <CarForm />
    </main>
  );
}
