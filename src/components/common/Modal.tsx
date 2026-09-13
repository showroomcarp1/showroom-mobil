"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-neutral-100"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-base font-bold text-neutral-900">{title}</h3>
              {/* Tombol Tutup */}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200"
                aria-label="Tutup modal"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </div>

            {/* Isi Konten Modal */}
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}