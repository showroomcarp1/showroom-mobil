"use client";

import { useState, useEffect, FormEvent } from "react";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faCalendarCheck,
  faBookmark,
  faHeadset,
  faXmark,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import type { Car } from "@/types/cars";
import { updateCarStatus } from "@/lib/actions/car"; // Import Server Action
import { useRouter } from "next/navigation";

interface DesktopCarActionsProps {
  car: Car;
  whatsappInquireMsg: string;
}

type ModalType = "booking" | "testdrive" | null;

export default function DesktopCarActions({
  car,
  whatsappInquireMsg,
}: DesktopCarActionsProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const PHONE_NUMBER = "6283120996468";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Jalankan Server Action untuk ubah status ke booked
      if (activeModal === "booking") {
        await updateCarStatus(car.id, "booked");
        router.refresh();
      }

      // 2. Format pesan WhatsApp
      const carName = car.title || `${car.brand} ${car.model}`.trim();
      const carPrice = car.price
        ? `Rp ${car.price.toLocaleString("id-ID")}`
        : "Menyesuaikan";

      let message = "";

      if (activeModal === "booking") {
        message =
          `*BOOKING UNIT MOBIL*\n\n` +
          `*Detail Mobil:*\n` +
          `- Mobil: ${carName}\n` +
          `- Harga: ${carPrice}\n\n` +
          `*Data Pemesan:*\n` +
          `- Nama: ${name}\n` +
          `- No. Telp: ${phone}\n` +
          `- Perkiraan Datang: ${date}\n` +
          `- Catatan: ${notes || "-"}`;
      } else if (activeModal === "testdrive") {
        message =
          `*PENGAJUAN TEST DRIVE*\n\n` +
          `*Detail Mobil:*\n` +
          `- Mobil: ${carName}\n\n` +
          `*Data Pemohon:*\n` +
          `- Nama: ${name}\n` +
          `- No. Telp: ${phone}\n` +
          `- Jadwal Test Drive: ${date}\n` +
          `- Catatan: ${notes || "-"}`;
      }

      // 3. Buka tab WhatsApp
      const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      closeModal();
    } catch (err) {
      console.error("Gagal mengupdate status:", err);
      alert("Gagal melakukan booking. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveModal("booking")}
          className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <FontAwesomeIcon icon={faBookmark} className="h-4 w-4" />
          <span>Booking</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal("testdrive")}
          className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4" />
          <span>Test Drive</span>
        </button>

        <a
          href={`https://wa.me/${PHONE_NUMBER}?text=${whatsappInquireMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <FontAwesomeIcon icon={faHeadset} className="h-4 w-4" />
          <span>Bantuan</span>
        </a>
      </div>

      {activeModal && (
        <dialog
          open
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 w-full h-full border-0 m-0 max-w-none max-h-none overflow-y-auto"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 transition-all border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-xl font-bold text-black flex items-center gap-2">
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
                className="text-neutral-400 hover:text-black p-1 rounded-lg transition-colors"
                aria-label="Tutup modal"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-500 uppercase font-semibold">
                Unit Pilihan
              </p>
              <p className="text-sm font-bold text-black">{car.title}</p>
              {activeModal === "booking" && car.price && (
                <p className="text-xs text-black font-semibold mt-0.5">
                  Rp {car.price.toLocaleString("id-ID")}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nomor WhatsApp/HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 083120996468"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  {activeModal === "booking"
                    ? "Perkiraan Datang *"
                    : "Rencana Tanggal & Jam Test Drive *"}
                </label>
                <input
                  type={activeModal === "booking" ? "date" : "datetime-local"}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Catatan / Pertanyaan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Opsional..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="w-1/2 rounded-md border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 rounded-md bg-black py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses..." : "Kirim ke WA"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
