"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navItems = [
    { label: "BERANDA", href: "/" },
    { label: "KOLEKSI MOBIL", href: "/cars" },
    { label: "PENAWARAN", href: "/promo" },
    { label: "LOGIN STAFF", href: "/admin/login" },
  ];

  // Lock scroll latar belakang saat menu aktif
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

  // Varian Animasi Fluid & Staggered
const menuVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden lg:hidden">
          {/* Backdrop Gelap Pekat Fluid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/98 backdrop-blur-3xl cursor-pointer"
          />

          {/* Wrapper Presisi di Tengah Layar */}
          <div className="relative z-10 flex h-full w-full items-center justify-center px-8">
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="w-full max-w-xs text-center flex flex-col items-center justify-center"
            >
              {/* Navigasi Utama Staggered */}
              <nav className="flex flex-col gap-6 w-full">
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 text-2xl font-black tracking-[0.2em] text-white transition-all duration-300 hover:text-neutral-400 active:scale-95"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Pembatas Minimalis & Tombol Fluid */}
              <motion.div
                variants={itemVariants}
                className="mt-10 pt-8 border-t border-neutral-800/80 w-full flex flex-col items-center"
              >
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group relative w-full overflow-hidden rounded-sm bg-white py-4 text-center text-neutral-950 font-extrabold text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-neutral-200 active:scale-[0.97] shadow-2xl"
                >
                  <span className="relative z-10">HUBUNGI SALES</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
