"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroClient() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Navigation
  const handleNavigate = (path: string = "/cars") => {
    if (isNavigating) return;

    if (buttonRef.current && containerRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const xPercent =
        ((btnRect.left + btnRect.width / 2 - containerRect.left) /
          containerRect.width) *
        100;
      const yPercent =
        ((btnRect.top + btnRect.height / 2 - containerRect.top) /
          containerRect.height) *
        100;

      setZoomOrigin(`${xPercent}% ${yPercent}%`);
    }

    setIsNavigating(true);

    setTimeout(() => {
      router.push(path);
    }, 650);
  };

  return (
    <section
      ref={containerRef}
      aria-label="Hero Section"
      className="relative h-screen w-full overflow-hidden bg-white flex items-center justify-center"
    >
      {/* Zoom container */}
      <motion.div
        animate={
          isNavigating
            ? {
                scale: 12,
                opacity: [1, 1, 0],
                filter: "blur(10px) brightness(0.8)",
              }
            : {
                scale: 1,
                opacity: 1,
                filter: "blur(0px) brightness(1)",
              }
        }
        transition={{
          duration: 0.65,
          ease: [0.7, 0, 0.15, 1],
        }}
        style={{ transformOrigin: zoomOrigin }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Main content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center flex flex-col items-center">
          {/* Logo */}
          <header className="mb-8">
            <motion.button
              type="button"
              onClick={() => handleNavigate("/cars")}
              initial={{ opacity: 0, y: -20 }}
              animate={
                isNavigating
                  ? { opacity: 0, y: -30, filter: "blur(8px)" }
                  : { opacity: 1, y: 0 }
              }
              transition={{ duration: isNavigating ? 0.25 : 0.8 }}
              whileHover={!isNavigating ? { scale: 1.02 } : {}}
              whileTap={!isNavigating ? { scale: 0.98 } : {}}
              className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg"
              aria-label="AutoHigh Homepage"
            >
              <div className="relative h-28 w-80 sm:h-44 sm:w-[520px]">
                <Image
                  src="/images/hero_logo.png"
                  alt="AutoHigh Logo"
                  fill
                  priority
                  className="object-contain filter invert"
                />
              </div>
            </motion.button>
          </header>

          {/* Description */}
          <article className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={
                isNavigating
                  ? { opacity: 0, scale: 0.8, filter: "blur(6px)" }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{
                duration: isNavigating ? 0.2 : 0.6,
                delay: isNavigating ? 0 : 0.2,
              }}
              className="text-[14px] sm:text-2xl font-medium text-neutral-900 leading-relaxed tracking-wide"
            >
              Welcome to AutoHigh Official Website. AutoHigh is a luxury car
              dealership offering a curated selection of premium vehicles.
            </motion.p>
          </article>

          {/* Actions */}
          <nav className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            {/* Primary button */}
            <motion.button
              ref={buttonRef}
              type="button"
              onClick={() => handleNavigate("/cars")}
              animate={
                isNavigating
                  ? {
                      backgroundColor: "#000000",
                      borderColor: "#000000",
                      boxShadow: "0px 0px 100px 30px rgba(0,0,0,0.9)",
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden w-full sm:w-auto px-10 py-4 border border-black bg-transparent text-black font-extrabold text-base uppercase tracking-widest transition-all duration-700 ease-in hover:bg-black hover:text-white active:scale-[0.98] cursor-pointer"
            >
              <span className="relative z-10">Get your dream car</span>
              {isNavigating && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                  className="absolute inset-0 bg-black z-20"
                />
              )}
            </motion.button>

            {/* Secondary button */}
            <motion.a
              href="https://wa.me/6283120996468"
              target="_blank"
              rel="noopener noreferrer"
              animate={
                isNavigating
                  ? { opacity: 0, x: 40, filter: "blur(6px)" }
                  : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.25 }}
              className="w-full sm:w-auto px-10 py-4 border border-black bg-black text-white font-extrabold text-base uppercase tracking-widest transition-all duration-700 ease-in hover:bg-transparent hover:text-black active:scale-[0.98] cursor-pointer"
            >
              Contact US
            </motion.a>
          </nav>
        </div>
      </motion.div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.45 }}
            className="pointer-events-none fixed inset-0 z-50 bg-black"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
