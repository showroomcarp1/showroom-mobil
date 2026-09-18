"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faFacebookF,
  faYoutube,
  faXTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import BrandsMegaMenu from "./BrandsMegaMenu";
import { createClient } from "@/lib/supabase/client";

// Data Navigasi
const NAV_ITEMS = [
  { href: "/brands", label: "Brands", hasDropdown: true },
  { href: "/newcar", label: "New Cars" },
  { href: "/secondcar", label: "Second Cars" },
  { href: "/exclusive", label: "Exclusive" },
  { href: "/facility", label: "Our Facilities" },
];

// Data Social Media
const SOCIAL_LINKS = [
  { href: "https://wa.me/6281234567890", label: "WhatsApp", icon: faWhatsapp },
  { href: "https://instagram.com", label: "Instagram", icon: faInstagram },
  { href: "https://facebook.com", label: "Facebook", icon: faFacebookF },
  { href: "https://youtube.com", label: "YouTube", icon: faYoutube },
  { href: "https://twitter.com", label: "X / Twitter", icon: faXTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: faLinkedinIn },
];

// Kurva Easing Fluid Liquid
const FLUID_EASE = [0.76, 0, 0.24, 1] as const;

// Animasi Panel Kaca Slide Buka/Tutup
const drawerVariants: Variants = {
  closed: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: FLUID_EASE },
  },
  open: {
    x: "0%",
    transition: { duration: 0.8, ease: FLUID_EASE },
  },
};

// Animasi Gelombang Kaca Melengkung pada Sisi Panel
const curveVariants: Variants = {
  initial: {
    d: "M100 0 L100 1000 L100 1000 Q-100 500 100 0 Z",
  },
  open: {
    d: "M100 0 L100 1000 L100 1000 Q100 500 100 0 Z",
    transition: { duration: 1, ease: FLUID_EASE },
  },
  closed: {
    d: "M100 0 L100 1000 L100 1000 Q-100 500 100 0 Z",
    transition: { duration: 0.8, ease: FLUID_EASE },
  },
};

// Animasi Stagger Menu
const menuListVariants: Variants = {
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

// Animasi Item Menu
const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: 80,
    transition: { duration: 0.5, ease: FLUID_EASE },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: FLUID_EASE },
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBrandsHovered, setIsBrandsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status sesi user dari Supabase Auth
  useEffect(() => {
    const supabase = createClient();

    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUserSession();

    // Listener perubahan status auth (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Lock scroll saat menu terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Detector scroll logo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu handler
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 relative z-10"
            aria-label="Homepage"
          >
            <div className="relative h-16 w-48 sm:w-60">
              {/* Logo Biasa (Di Lapisan Bawah) */}
              <Image
                src="/images/logo.png"
                alt="Showroom Logo"
                fill
                priority
                className="object-contain object-left z-0"
              />

              {/* Big Logo: HANYA tampil di Desktop (md:block), Belum Scrolled, dan KHUSUS di /cars */}
              {!isScrolled && pathname === "/cars" && (
                <div className="hidden md:block absolute -top-2 left-0 w-56 sm:w-72 h-28 sm:h-32 transition-all duration-300 pointer-events-none z-10">
                  <Image
                    src="/images/big_logo.png"
                    alt="Showroom Large Logo"
                    fill
                    priority
                    className="object-contain object-left drop-shadow-sm pointer-events-auto"
                  />
                </div>
              )}
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex flex-1 ml-8 sm:ml-12"
          >
            <ul className="flex items-center gap-7 lg:gap-10 py-2">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.href}
                  onMouseEnter={() =>
                    item.hasDropdown && setIsBrandsHovered(true)
                  }
                  onMouseLeave={() =>
                    item.hasDropdown && setIsBrandsHovered(false)
                  }
                  className="relative py-6"
                >
                  <Link
                    href={item.href}
                    className="relative py-1 text-sm md:text-base tracking-[0.15em] font-semibold uppercase text-neutral-900 transition-colors duration-300 hover:text-neutral-500 inline-block"
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300 ease-out ${
                        pathname === item.href ||
                        (item.hasDropdown && isBrandsHovered)
                          ? "w-full"
                          : "w-0 hover:w-full"
                      }`}
                    />
                  </Link>

                  {/* Dropdown Mega Menu */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {isBrandsHovered && <BrandsMegaMenu key="mega-menu" />}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Toggle Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="relative z-50 flex items-center p-2 group focus:outline-none cursor-pointer"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Garis atas */}
                <motion.span
                  className={`absolute w-8 h-[2px] rounded-full block origin-center transition-colors duration-300 ${
                    isMenuOpen
                      ? "bg-white"
                      : "bg-black group-hover:bg-neutral-600"
                  }`}
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 0 : -5,
                  }}
                  whileHover={{
                    y: isMenuOpen ? 0 : -7,
                  }}
                  transition={{ duration: 0.5, ease: FLUID_EASE }}
                />

                {/* Garis bawah */}
                <motion.span
                  className={`absolute w-8 h-[2px] rounded-full block origin-center transition-colors duration-300 ${
                    isMenuOpen
                      ? "bg-white"
                      : "bg-black group-hover:bg-neutral-600"
                  }`}
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? 0 : 5,
                  }}
                  whileHover={{
                    y: isMenuOpen ? 0 : 7,
                  }}
                  transition={{ duration: 0.5, ease: FLUID_EASE }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Panel Menu */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>
            {/* Backdrop Mask Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: FLUID_EASE }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Panel Hitam Glass Gelombang tanpa Shadow */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              className="fixed top-0 right-0 z-40 h-screen w-full sm:w-[500px] bg-black/75 backdrop-blur-md text-white px-8 sm:px-12 py-12 flex flex-col justify-between overflow-visible shadow-none"
              style={{
                boxShadow: "none",
              }}
              aria-label="Side Navigation Panel"
            >
              {/* Gelombang Kaca Melengkung Sisi Kiri */}
              <div className="absolute top-0 -left-[99px] w-[100px] h-full pointer-events-none fill-black/75">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <motion.path
                    variants={curveVariants}
                    initial="initial"
                    animate="open"
                    exit="closed"
                  />
                </svg>
              </div>

              {/* Spacing Atas */}
              <div
                className="h-10 w-full shrink-0 relative z-10"
                aria-hidden="true"
              />

              {/* Nav Menu Drawer */}
              <motion.nav
                aria-label="Drawer Secondary Navigation"
                variants={menuListVariants}
                className="my-auto py-6 relative z-10"
              >
                <ul className="space-y-6">
                  {NAV_ITEMS.map((item) => (
                    <motion.li key={item.href} variants={menuItemVariants}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block text-3xl sm:text-4xl font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors duration-300 ease-in-out"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              {/* Footer Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2, ease: FLUID_EASE }}
                className="pt-8 border-t border-white/10 space-y-6 shrink-0 relative z-10"
              >
                {/* Dynamic Login / Dashboard Link */}
                <div>
                  <Link
                    href={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
                    onClick={closeMenu}
                    className="group inline-flex items-center gap-2.5 text-[20px] uppercase tracking-[0.2em] font-semibold text-white"
                  >
                    <span>{isLoggedIn ? "Dashboard" : "Log In"}</span>
                  </Link>
                </div>

                {/* Social Media Links */}
                <div className="pt-1">
                  <address className="not-italic flex items-center gap-4">
                    {SOCIAL_LINKS.map((soc) => (
                      <a
                        key={soc.label}
                        href={soc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={soc.label}
                        className="p-1 text-neutral-400 hover:text-white transition-colors duration-300 ease-in-out"
                      >
                        <FontAwesomeIcon icon={soc.icon} className="h-4 w-4" />
                      </a>
                    ))}
                  </address>
                </div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
