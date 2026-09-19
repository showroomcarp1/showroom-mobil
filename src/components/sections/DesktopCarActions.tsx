"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faCalendarCheck, faCar } from "@fortawesome/free-solid-svg-icons";
import type { Car } from "@/types/cars";
import { updateCarStatus } from "@/lib/actions/car";
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

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [datetime, setDatetime] = useState("");
  const [notes, setNotes] = useState("");

  const PHONE_NUMBER = "6283120996468";

  // scroll lock
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
    setDatetime("");
    setNotes("");
  };

  // format datetime display for WA
  const formatDateTime = (dtStr: string) => {
    if (!dtStr) return "-";
    const dt = new Date(dtStr);
    return dt.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // submit handler (Fungsi tetap sama 100%)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // update status
      if (activeModal === "booking") {
        await updateCarStatus(car.id, "booked");
        router.refresh();
      }

      // wa message format
      const carName = car.title || `${car.brand} ${car.model}`.trim();
      const carPrice = car.price
        ? `Rp ${car.price.toLocaleString("id-ID")}`
        : "N/A";
      const formattedSchedule = formatDateTime(datetime);

      let message = "";

      if (activeModal === "booking") {
        message =
          `*CAR BOOKING REQUEST*\n\n` +
          `*Car Details:*\n` +
          `- Vehicle: ${carName}\n` +
          `- Price: ${carPrice}\n\n` +
          `*Customer Information:*\n` +
          `- Name: ${name}\n` +
          `- Phone: ${phone}\n` +
          `- Expected Arrival: ${formattedSchedule}\n` +
          `- Notes: ${notes || "-"}`;
      } else if (activeModal === "testdrive") {
        message =
          `*TEST DRIVE REQUEST*\n\n` +
          `*Car Details:*\n` +
          `- Vehicle: ${carName}\n\n` +
          `*Applicant Information:*\n` +
          `- Name: ${name}\n` +
          `- Phone: ${phone}\n` +
          `- Schedule: ${formattedSchedule}\n` +
          `- Notes: ${notes || "-"}`;
      }

      // open wa
      const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      closeModal();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainImageUrl =
    car.image_url || car.images?.[0] || "/images/car-placeholder.jpg";
  const carTitleDisplay = car.title || `${car.brand} ${car.model}`.trim();

  return (
    <>
      {/* Action Buttons */}
      <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveModal("booking")}
          className="flex items-center justify-center gap-2.5 bg-[#0073e6] px-5 py-3 text-[16px] font-medium text-white transition-all duration-150 hover:bg-[#005bb5]"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4" />
          <span>Book Now</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal("testdrive")}
          className="flex items-center justify-center gap-2.5 bg-[#0073e6] px-5 py-3 text-[16px] font-medium text-white transition-all duration-150 hover:bg-[#005bb5]"
        >
          <FontAwesomeIcon icon={faCar} className="h-4 w-4" />
          <span>Schedule Test Drive</span>
        </button>
      </div>

      {/* Modern Dealer Style Large Modal */}
      {activeModal && (
        <dialog
          open
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 w-full h-full border-0 m-0 max-w-none max-h-none overflow-y-auto"
        >
          <div className="relative w-full max-w-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden text-neutral-800">
            {/* Header Modal */}
            <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 bg-white">
              <h2
                id="modal-title"
                className="text-xl sm:text-2xl font-light text-neutral-800 tracking-tight"
              >
                {activeModal === "booking"
                  ? "Book Vehicle"
                  : "Schedule Test Drive"}
              </h2>
              {/* Tombol Close SVG tanpa hover effect & ukuran fleksibel */}
              <button
                type="button"
                onClick={closeModal}
                className="p-4 text-neutral-800 border-l border-neutral-200 flex items-center justify-center ml-auto -mr-6 -my-4 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 sm:w-8 sm:h-8"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            {/* Container Ringkasan Mobil (Abu-Abu) */}
            <article className="bg-[#f4f4f5] p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-neutral-200">
              <div className="relative w-full sm:w-64 h-40 shrink-0 bg-neutral-200 rounded-sm overflow-hidden">
                <Image
                  src={mainImageUrl}
                  alt={carTitleDisplay}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-left w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                  {carTitleDisplay}
                </h3>
                <p className="text-xs text-neutral-500 font-mono uppercase mt-1">
                  ID / VIN: {car.id ? car.id.slice(0, 18) : "N/A"}
                </p>
                {car.price && (
                  <p className="text-lg font-bold text-neutral-800 mt-3">
                    Rp {car.price.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </article>

            {/* Form Input Line-Style */}
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-6 bg-white"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-neutral-500 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:border-black focus:outline-none transition-colors placeholder:text-neutral-300"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-neutral-500 mb-1"
                >
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  name="phone"
                  autoComplete="tel"
                  placeholder="+62 812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:border-black focus:outline-none transition-colors placeholder:text-neutral-300"
                />
              </div>

              <div>
                <label
                  htmlFor="scheduleDateTime"
                  className="block text-sm font-medium text-neutral-500 mb-1"
                >
                  {activeModal === "booking"
                    ? "Arrival Schedule"
                    : "Test Drive Schedule"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="scheduleDateTime"
                  type="datetime-local"
                  required
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:border-black focus:outline-none transition-colors text-neutral-700"
                />
              </div>

              <div>
                <label
                  htmlFor="notesText"
                  className="block text-sm font-medium text-neutral-500 mb-1"
                >
                  Message / Notes
                </label>
                <textarea
                  id="notesText"
                  rows={2}
                  placeholder="Add optional notes or special requests..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:border-black focus:outline-none transition-colors placeholder:text-neutral-300 resize-none"
                />
              </div>

              {/* Footer Modal / Action Buttons */}
              <footer className="pt-4 flex items-center justify-end border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0073e6] hover:bg-[#005bb5] text-white font-bold px-8 py-3 text-sm tracking-wide uppercase transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isSubmitting
                    ? "Processing..."
                    : activeModal === "booking"
                      ? "Submit"
                      : "Submit"}
                </button>
              </footer>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
