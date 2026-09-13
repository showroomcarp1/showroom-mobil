export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <header className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Pengaturan Showroom
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Atur profil kontak WhatsApp sales dan opsi tampilan.
        </p>
      </header>

      <div className="max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Nomor WhatsApp Direct Sales
          </label>
          <input
            type="text"
            defaultValue="6281234567890"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <button className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:opacity-90">
          Simpan Perubahan
        </button>
      </div>
    </main>
  );
}
