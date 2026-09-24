"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faHouse,
  faCalendarCheck,
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

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // Tutup jika ditarik kebawah lebih dari 80px atau disentak dengan velositas > 300
    if (info.offset.y > 80 || info.velocity.y > 300) {
      closeModal();
    }
  };

  const displayCarTitle = car?.title || carTitle || "Vehicle Unit";
  const displayCarPrice = car?.price
    ? `Rp ${car.price.toLocaleString("id-ID")}`
    : "N/A";

  const whatsappInquireMsg = encodeURIComponent(
    `Hello CS, I need assistance regarding the ${displayCarTitle}${
      year ? ` (${year})` : ""
    }.`,
  );

  const formatDateTime = (dtStr: string) => {
    if (!dtStr) return "-";
    const dt = new Date(dtStr);
    return dt.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeModal === "booking" && car?.id) {
        await updateCarStatus(car.id, "booked");
        router.refresh();
      }

      const formattedSchedule = formatDateTime(datetime);
      let message = "";

      if (activeModal === "booking") {
        message =
          `*CAR BOOKING REQUEST*\n\n` +
          `*Car Details:*\n` +
          `- Vehicle: ${displayCarTitle}\n` +
          `- Price: ${displayCarPrice}\n\n` +
          `*Customer Information:*\n` +
          `- Name: ${name}\n` +
          `- Phone: ${phone}\n` +
          `- Expected Arrival: ${formattedSchedule}\n` +
          `- Notes: ${notes || "-"}`;
      } else if (activeModal === "testdrive") {
        message =
          `*TEST DRIVE REQUEST*\n\n` +
          `*Car Details:*\n` +
          `- Vehicle: ${displayCarTitle}\n\n` +
          `*Applicant Information:*\n` +
          `- Name: ${name}\n` +
          `- Phone: ${phone}\n` +
          `- Schedule: ${formattedSchedule}\n` +
          `- Notes: ${notes || "-"}`;
      }

      const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      closeModal();
    } catch (err) {
      console.error("Failed to process action:", err);
      alert("An error occurred, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* bottom navigation bar */}
      <aside
        aria-label="Mobile Bottom Navigation"
        className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe"
      >
        <div className="grid grid-cols-4 items-center w-full h-16">
          {/* 1. Home */}
          <Link
            href="/cars"
            aria-label="Return to Home"
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors border-r border-neutral-200"
          >
            <FontAwesomeIcon icon={faHouse} className="h-5 w-5 text-black" />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Home
            </span>
          </Link>

          {/* 2. Booking */}
          <button
            type="button"
            onClick={() => setActiveModal("booking")}
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors border-r border-neutral-200"
          >
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="h-5 w-5 text-black"
            />
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
            <FontAwesomeIcon icon={faCar} className="h-5 w-5 text-black" />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Test Drive
            </span>
          </button>

          {/* 4. Support */}
          <a
            href={`https://wa.me/${PHONE_NUMBER}?text=${whatsappInquireMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full gap-1 text-black active:bg-neutral-100 transition-colors"
          >
            <FontAwesomeIcon icon={faHeadset} className="h-5 w-5 text-black" />
            <span className="text-[11px] font-semibold tracking-tight text-black">
              Support
            </span>
          </a>
        </div>
      </aside>

      {/* modal dialog with optimized framer-motion */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop / Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Draggable Bottom Sheet Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 32,
                stiffness: 350,
                mass: 0.8,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              dragSnapToOrigin
              onDragEnd={handleDragEnd}
              style={{ willChange: "transform" }}
              className="relative w-full sm:max-w-md rounded-t-2xl bg-white p-5 sm:p-6 border-t border-neutral-200 z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Dragger Bar Area */}
              <div className="w-full flex justify-center pb-4  cursor-grab active:cursor-grabbing touch-none select-none">
                <div className="w-12 h-1 rounded-full bg-neutral-300" />
              </div>

              {/* Header */}
              <div className="border-b border-neutral-200 pb-3">
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={activeModal === "booking" ? faCalendarCheck : faCar}
                    className="text-black"
                  />
                  {activeModal === "booking"
                    ? "Book Vehicle"
                    : "Schedule Test Drive"}
                </h2>
              </div>

              {/* Car Summary */}
              <div className="my-3 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                  Selected Unit
                </p>
                <p className="text-sm font-bold text-black">
                  {displayCarTitle} {year ? `(${year})` : ""}
                </p>
                {activeModal === "booking" && (
                  <p className="text-xs text-black font-semibold mt-0.5">
                    Price: {displayCarPrice}
                  </p>
                )}
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    autoComplete="tel"
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {activeModal === "booking"
                      ? "Arrival Date & Time *"
                      : "Test Drive Date & Time *"}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Optional requests or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-neutral-50"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-semibold text-black active:bg-neutral-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white active:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Send"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
