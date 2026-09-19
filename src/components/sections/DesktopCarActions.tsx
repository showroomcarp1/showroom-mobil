"use client";

import { useState, useEffect, FormEvent } from "react";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faCalendarCheck,
  faCar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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

  // submit handler
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

  return (
    <>
      {/* action buttons */}
      <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveModal("booking")}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-neutral-800 active:scale-[0.99]"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4" />
          <span>Book Now</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal("testdrive")}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-neutral-800 active:scale-[0.99]"
        >
          <FontAwesomeIcon icon={faCar} className="h-4 w-4" />
          <span>Schedule Test Drive</span>
        </button>
      </div>

      {/* seamless modal */}
      {activeModal && (
        <dialog
          open
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 w-full h-full border-0 m-0 max-w-none max-h-none overflow-y-auto"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-100 transition-all">
            {/* modal header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  {activeModal === "booking"
                    ? "Book Vehicle"
                    : "Schedule Test Drive"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {activeModal === "booking"
                    ? "Reserve your visit to inspect this unit"
                    : "Select your preferred date & time"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-neutral-400 hover:text-black p-1 rounded-md transition-colors -mr-1 -mt-1"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </div>

            {/* car summary card */}
            <div className="my-4 p-3 bg-neutral-50/80 rounded-xl border border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-neutral-400 font-medium">
                  Vehicle
                </p>
                <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                  {car.title}
                </p>
              </div>
              {car.price && (
                <div className="text-right">
                  <p className="text-[11px] text-neutral-400 font-medium">
                    Price
                  </p>
                  <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                    Rp {car.price.toLocaleString("id-ID")}
                  </p>
                </div>
              )}
            </div>

            {/* modal form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-neutral-50/80 border border-neutral-200/80 px-3 py-2 text-xs text-neutral-900 transition-all focus:bg-white focus:border-black focus:outline-none placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  autoComplete="tel"
                  placeholder="+62 812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-neutral-50/80 border border-neutral-200/80 px-3 py-2 text-xs text-neutral-900 transition-all focus:bg-white focus:border-black focus:outline-none placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  {activeModal === "booking"
                    ? "Arrival Schedule"
                    : "Test Drive Schedule"}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="w-full rounded-lg bg-neutral-50/80 border border-neutral-200/80 px-3 py-2 text-xs text-neutral-900 transition-all focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg bg-neutral-50/80 border border-neutral-200/80 px-3 py-2 text-xs text-neutral-900 transition-all focus:bg-white focus:border-black focus:outline-none placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* modal actions */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="w-1/2 rounded-lg border border-neutral-200/80 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 rounded-lg bg-black py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
