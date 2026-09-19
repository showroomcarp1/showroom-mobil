"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faHouse,
  faCalendarCheck,
  faBookmark,
  faXmark,
  faCar,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import type { Car } from "@/types/cars";
import { updateCarStatus } from "@/lib/actions/car";

interface MobileStickyBarProps {
  carTitle?: string;
  year?: number;
  car?: Car;
}

type ModalType = "booking" | "testdrive" | null;

export default function MobileStickyBar({
  carTitle,
  year,
  car,
}: MobileStickyBarProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const PHONE_NUMBER = "6283120996468";

  // Mencegah background scroll saat modal aktif
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  const closeModal = () => {
    setActiveModal(null);
    setName("");
    setPhone("");
    setDate("");
    setNotes("");
  };

  const displayCarTitle = car?.title || carTitle || "Unit Mobil";
  const displayCarPrice = car?.price
    ? `Rp ${car.price.toLocaleString("id-ID")}`
    : "Menyesuaikan";

  const whatsappInquireMsg = encodeURIComponent(
    `Halo CS, saya butuh bantuan mengenai unit ${displayCarTitle}${
      year ? ` (${year})` : ""
    }.`,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Jika aksi booking, update status mobil di Supabase menjadi "booked"
      if (activeModal === "booking" && car?.id) {
        await updateCarStatus(car.id, "booked");
        router.refresh();
      }

      let message = "";

      if (activeModal === "booking") {
        message =
          `*BOOKING UNIT MOBIL*\n\n` +
          `*Detail Mobil:*\n` +
          `- Mobil: ${displayCarTitle}\n` +
          `- Harga: ${displayCarPrice}\n\n` +
          `*Data Pemesan:*\n` +
          `- Nama: ${name}\n` +
          `- No. Telp: ${phone}\n` +
          `- Perkiraan Datang: ${date}\n` +
          `- Catatan: ${notes || "-"}`;
      } else if (activeModal === "testdrive") {
        message =
          `*PENGAJUAN TEST DRIVE*\n\n` +
          `*Detail Mobil:*\n` +
          `- Mobil: ${displayCarTitle}\n\n` +
          `*Data Pemohon:*\n` +
          `- Nama: ${name}\n` +
          `- No. Telp: ${phone}\n` +
          `- Jadwal Test Drive: ${date}\n` +
          `- Catatan: ${notes || "-"}`;
      }

      const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      closeModal();
    } catch (err) {
      console.error("Gagal memproses aksi:", err);
      alert("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Bottom Sticky Bar - Hanya tampil di Mobile (Tersembunyi di Desktop/lg:hidden) */}
      <aside
        aria-label="Mobile Bottom Navigation"
        className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe"
      >
        <div className="grid grid-cols-4 items-center w-full h-16">
          {/* 1. Beranda */}
          <Link
            href="/"
            aria-label="Return to Home"
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors border-r border-neutral-200"
          >
            <FontAwesomeIcon icon={faHouse} className="h-5 w-5 text-black" />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Beranda
            </span>
          </Link>

          {/* 2. Booking */}
          <button
            type="button"
            onClick={() => setActiveModal("booking")}
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors border-r border-neutral-200"
          >
            <FontAwesomeIcon icon={faBookmark} className="h-5 w-5 text-black" />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Booking
            </span>
          </button>

          {/* 3. Test Drive */}
          <button
            type="button"
            onClick={() => setActiveModal("testdrive")}
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors border-r border-neutral-200"
          >
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="h-5 w-5 text-black"
            />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Test Drive
            </span>
          </button>

          {/* 4. Bantuan / CS (Paling Kanan) */}
          <a
            href={`https://wa.me/${PHONE_NUMBER}?text=${whatsappInquireMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors"
          >
            <FontAwesomeIcon icon={faHeadset} className="h-5 w-5 text-black" />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Bantuan
            </span>
          </a>
        </div>
      </aside>

      {/* Pop-up Modal Form */}
      {activeModal && (
        <dialog
          open
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 w-full h-full border-0 m-0 max-w-none max-h-none overflow-y-auto"
        >
          {/* Container Modal (Slide Up Style) */}
          <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-xl bg-white p-5 sm:p-6 transition-all border-t border-neutral-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <FontAwesomeIcon
                  icon={activeModal === "booking" ? faBookmark : faCar}
                  className="text-black"
                />
                {activeModal === "booking"
                  ? "Booking Mobil"
                  : "Jadwal Test Drive"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-neutral-400 hover:text-black p-1 rounded-full transition-colors active:bg-neutral-100"
                aria-label="Tutup modal"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            {/* Information Mobil Terdeteksi */}
            <div className="my-3 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
              <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                Unit Pilihan
              </p>
              <p className="text-sm font-bold text-black">
                {displayCarTitle} {year ? `(${year})` : ""}
              </p>
              {activeModal === "booking" && (
                <p className="text-xs text-black font-semibold mt-0.5">
                  Harga: {displayCarPrice}
                </p>
              )}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nomor Telepon / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="083120996468"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {activeModal === "booking"
                    ? "Perkiraan Datang *"
                    : "Rencana Tanggal & Jam Test Drive *"}
                </label>
                <input
                  type={activeModal === "booking" ? "date" : "datetime-local"}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Isi jika ada pesan khusus..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                />
              </div>

              {/* Action Buttons Native Style */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-semibold text-black active:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white active:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses..." : "Kirim WhatsApp"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
