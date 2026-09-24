"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faInstagram,
  faFacebookF,
  faYoutube,
  faXTwitter,
  faLinkedinIn,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";

import MobileSearch from "./MobileSearch";
import DesktopSearch from "@/components/layout/DesktopSearch";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
}

interface SocialLink {
  href: string;
  label: string;
  icon: IconDefinition;
}

// Nav items
const NAV_ITEMS: NavItem[] = [
  { href: "/newcar", label: "New Cars" },
  { href: "/secondcar", label: "Second Cars" },
  { href: "/exclusive", label: "Exclusive" },
  { href: "/facility", label: "Our Facilities" },
];

const SOCIAL_LINKS: readonly SocialLink[] = [
  { href: "https://wa.me/6283120996468", label: "WhatsApp", icon: faWhatsapp },
  { href: "https://instagram.com", label: "Instagram", icon: faInstagram },
  { href: "https://facebook.com", label: "Facebook", icon: faFacebookF },
  { href: "https://youtube.com", label: "YouTube", icon: faYoutube },
  { href: "https://twitter.com", label: "X / Twitter", icon: faXTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: faLinkedinIn },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearchInUrl = searchParams.get("search") || "";

  // State
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<"EN" | "ID">("EN");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>(currentSearchInUrl);
  const [prevSearchInUrl, setPrevSearchInUrl] = useState<string>(currentSearchInUrl);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const SMOOTH_EASE = useMemo(() => [0.16, 1, 0.3, 1] as const, []);

  // Sync query URL
  if (prevSearchInUrl !== currentSearchInUrl) {
    setPrevSearchInUrl(currentSearchInUrl);
    setSearchQuery(currentSearchInUrl);
  }

  // Fungsi untuk reset pencarian URL ketika di-clear pada Search Bar
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    
    // Redirect / Update URL tanpa param search agar CarCard ter-reset
    if (pathname === "/cars") {
      router.push(`/cars${params.toString() ? `?${params.toString()}` : ""}`);
    } else {
      router.push("/cars");
    }
  }, [pathname, router, searchParams]);

  // Drawer Animation (Kiri ke Kanan)
  const drawerVariants: Variants = useMemo(
    () => ({
      closed: {
        x: "-100%",
        transition: { duration: 0.45, ease: SMOOTH_EASE },
      },
      open: {
        x: "0%",
        transition: { duration: 0.5, ease: SMOOTH_EASE },
      },
    }),
    [SMOOTH_EASE]
  );

  const menuListVariants: Variants = useMemo(
    () => ({
      closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
      open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
    }),
    []
  );

  const menuItemVariants: Variants = useMemo(
    () => ({
      closed: {
        opacity: 0,
        x: -40,
        transition: { duration: 0.3, ease: SMOOTH_EASE },
      },
      open: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: SMOOTH_EASE },
      },
    }),
    [SMOOTH_EASE]
  );

  // Supabase Auth Check
  useEffect(() => {
    const supabase = createClient();

    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white transition-all duration-300">
        <div className="w-full px-4 sm:px-10 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Left: Hamburger Button (Kiri) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleMenu}
                className="relative z-50 flex items-center gap-3 group focus:outline-none cursor-pointer text-white"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {/* 2 Line Hamburger */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <motion.span
                    className={`absolute w-8 h-[2px] rounded-full block origin-center transition-colors duration-300 ${
                      isMenuOpen
                        ? "bg-white"
                        : "bg-white group-hover:bg-neutral-300"
                    }`}
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      y: isMenuOpen ? 0 : -4,
                    }}
                    transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                  />
                  <motion.span
                    className={`absolute w-8 h-[2px] rounded-full block origin-center transition-colors duration-300 ${
                      isMenuOpen
                        ? "bg-white"
                        : "bg-white group-hover:bg-neutral-300"
                    }`}
                    animate={{
                      rotate: isMenuOpen ? -45 : 0,
                      y: isMenuOpen ? 0 : 4,
                    }}
                    transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                  />
                </div>

                <span className="hidden sm:inline-block text-xs font-semibold tracking-[0.2em] uppercase">
                  MENU
                </span>
              </button>
            </div>

            {/* Center: Logo (Tengah) */}
            <Link
              href="/cars"
              className="absolute left-1/2 -translate-x-1/2 flex items-center shrink-0 z-10"
              aria-label="Homepage"
            >
              <figure className="relative h-10 sm:h-12 w-36 sm:w-52 m-0">
                <Image
                  src="/images/logo.png"
                  alt="Showroom Logo"
                  fill
                  priority
                  className="object-contain object-center filter brightness-0 invert"
                />
              </figure>
            </Link>

            {/* Right: Desktop Search & Mobile Search Icon (Kanan) */}
            <div className="flex items-center gap-5 sm:gap-8 text-xs font-semibold tracking-[0.18em] uppercase">
              {/* Search Desktop */}
              <button
                type="button"
                onClick={() => setIsDesktopSearchOpen(true)}
                className="hidden lg:block hover:text-neutral-300 transition-colors cursor-pointer"
                aria-label="Open Search"
              >
                SEARCH
              </button>

              {/* Language Selector (Desktop Only) */}
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={isLangDropdownOpen}
                >
                  <span>{language === "EN" ? "ENGLISH" : "INDONESIA"}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-2.5 h-2.5 transition-transform duration-300 ${
                      isLangDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-32 bg-black/90 backdrop-blur-md border border-neutral-800 py-2 text-left shadow-2xl z-50"
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage("EN");
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer ${
                            language === "EN"
                              ? "text-white font-bold"
                              : "text-neutral-400"
                          }`}
                        >
                          English
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage("ID");
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer ${
                            language === "ID"
                              ? "text-white font-bold"
                              : "text-neutral-400"
                          }`}
                        >
                          Indonesia
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Mobile (Ikon Kaca Pembesar di Kanan) */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                className="lg:hidden p-2 text-white hover:text-neutral-300 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Open Mobile Search"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="w-5 h-5 text-current"
                  style={{ width: "1.25rem", height: "1.25rem" }} // Kunci ukuran inline CSS agar terhindar dari ketiadaan CSS Tailwind saat SSR
                />
              </button>
            </div>
          </div>
        </div>

        {/* Panel Drawer Sisi Kiri */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Aside Drawer (Left side) */}
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={drawerVariants}
                className="fixed top-0 left-0 z-40 h-screen w-full sm:w-[480px] bg-black/90 backdrop-blur-md text-white px-8 sm:px-12 py-10 flex flex-col justify-between"
                aria-label="Navigation Drawer"
              >
                <div className="h-10 w-full shrink-0 relative z-10" />

                {/* Nav Links */}
                <nav
                  aria-label="Drawer Navigation Links"
                  className="my-auto py-6 relative z-10"
                >
                  <motion.ul variants={menuListVariants} className="space-y-6">
                    {NAV_ITEMS.map((item) => (
                      <motion.li key={item.href} variants={menuItemVariants}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="block text-3xl sm:text-4xl font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors duration-300"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </nav>

                {/* Footer Drawer (Mirip dengan gambar rujukan Richard Mille) */}
                <motion.footer
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: SMOOTH_EASE }}
                  className="pt-6 border-t border-white/10 space-y-6 shrink-0 relative z-10"
                >
                  <div>
                    <Link
                      href={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
                      onClick={closeMenu}
                      className="inline-flex items-center gap-2.5 text-[18px] uppercase tracking-[0.2em] font-semibold text-white hover:opacity-80 transition-opacity"
                    >
                      <span>{isLoggedIn ? "Dashboard" : "Log In"}</span>
                    </Link>
                  </div>

                  {/* Social Media & Bahasa (Layout Sejajar) */}
                  <div className="flex items-center justify-between pt-2">
                    <address className="not-italic">
                      <ul className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((soc) => (
                          <li key={soc.label}>
                            <a
                              href={soc.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={soc.label}
                              className="p-1 text-neutral-400 hover:text-white transition-colors block"
                            >
                              <FontAwesomeIcon
                                icon={soc.icon}
                                className="h-4 w-4"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </address>

                    {/* Bahasa switcher horizontal di bawah sesuai gambar rujukan */}
                    <div className="flex items-center gap-3 text-xs tracking-wider font-semibold">
                      <button
                        type="button"
                        onClick={() => setLanguage("EN")}
                        className={`transition-colors cursor-pointer ${
                          language === "EN"
                            ? "text-white font-bold"
                            : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        EN
                      </button>
                      <span className="text-neutral-700">/</span>
                      <button
                        type="button"
                        onClick={() => setLanguage("ID")}
                        className={`transition-colors cursor-pointer ${
                          language === "ID"
                            ? "text-white font-bold"
                            : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        ID
                      </button>
                    </div>
                  </div>
                </motion.footer>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Search */}
      <DesktopSearch
        isOpen={isDesktopSearchOpen}
        onClose={() => setIsDesktopSearchOpen(false)}
        initialQuery={searchQuery}
        onClear={handleClearSearch}
      />

      {/* Mobile Search */}
      <MobileSearch
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}