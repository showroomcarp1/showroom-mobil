"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("6281234567890");
  const [isSaved, setIsSaved] = useState(false);

  // Form submit handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className="space-y-6">
      {/* Header Pengaturan */}
      <header className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Pengaturan Showroom
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Kelola kontak umum sales dan preferensi sistem admin.
        </p>
      </header>

      {/* Form Card Pengaturan */}
      <div className="max-w-xl rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Input WhatsApp */}
          <div className="space-y-1.5">
            <label
              htmlFor="whatsapp"
              className="block text-xs font-semibold text-neutral-700"
            >
              Nomor WhatsApp Direct Sales
            </label>
            <input
              id="whatsapp"
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Contoh: 6281234567890"
              className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors duration-200"
            />
            <p className="text-[11px] text-neutral-400">
              Gunakan format internasional tanpa tanda + atau spasi (contoh:
              6281...).
            </p>
          </div>

          {/* Notifikasi Berhasil */}
          {isSaved && (
            <div className="rounded-lg bg-neutral-900 text-white text-xs px-3.5 py-2.5 font-medium">
              Perubahan berhasil disimpan!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors duration-200 cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </main>
  );
}
