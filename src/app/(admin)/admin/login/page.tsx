"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic autentikasi login
  };

  return (
    <div className="min-h-screen w-full bg-white flex font-sans relative">
      {/* Tombol X Mark Besar Tanpa Hover BG */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
        <Link
          href="/cars"
          aria-label="back to home page"
          className="p-2 text-neutral-900 hover:text-neutral-500 transition-colors duration-800 inline-block"
        >
          <FontAwesomeIcon icon={faXmark} className="h-12 w-12" />
        </Link>
      </div>

      {/* Sisi Kiri: Visual Gambar Hero */}
      <div className="hidden lg:block relative w-1/2 xl:w-3/5 bg-neutral-900">
        <Image
          src="/images/hero.jpg"
          alt="Showroom Hero Image"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Sisi Kanan: Form Login Minimalis */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white">
        {/* Spacer Top */}
        <div className="h-8" />

        {/* Form Container */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto">
          {/* Header Identity diganti dengan Logo */}
          <div className="mb-10">
            <Image
              src="/images/logo.png"
              alt="Showroom Logo"
              width={160}
              height={50}
              priority
              className="h-auto w-auto max-h-12 object-contain"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700 block">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-white border border-neutral-300 rounded-lg py-2.5 px-3.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
              />
            </div>

            {/* Input Password dengan Toggle Mata */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700 block">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-neutral-400 hover:text-neutral-900 transition-colors duration-300 focus:outline-none"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="h-4 w-4"
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-neutral-900 hover:bg-black text-white font-semibold text-[15px] py-3 rounded-lg transition-colors duration-300 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
