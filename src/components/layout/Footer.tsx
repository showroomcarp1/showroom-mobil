import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      {/* Area padding diperluas ke atas & bawah (py-32 md:py-40) */}
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-20">
          {/* Kolom Logo Brand */}
          <div className="md:col-span-1 flex flex-col justify-start">
            <Link href="/" className="inline-block">
              <Image
                src="/images/hero_logo.png"
                alt="Showroom Logo"
                width={320}
                height={96}
                className="h-20 md:h-24 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Kolom Navigation */}
          <div>
            <h3 className="text-[25px] font-extrabold uppercase tracking-[0.25em] text-white">
              Navigation
            </h3>
            <ul className="mt-6 space-y-4 text-[20px] font-semibold">
              <li>
                <Link
                  href="/cars"
                  className="text-neutral-400 hover:text-white transition-colors duration-800 ease-linear"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/promo"
                  className="text-neutral-400 hover:text-white transition-colors duration-800 ease-linear"
                >
                  New Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors duration-800 ease-linear"
                >
                  Second Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors duration-800 ease-linear"
                >
                  Exclusive
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors duration-800 ease-linear"
                >
                  Our Facilities
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors duration-800 ease-linear"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Business Hours */}
          <div>
            <h3 className="text-[25px] font-extrabold uppercase tracking-[0.25em] text-white">
              Operating Hours
            </h3>
            <ul className="mt-6 space-y-4 text-base text-neutral-400">
              <li className="flex justify-between border-b border-neutral-900 pb-3">
                <span>Monday - Friday:</span>
                <span className="font-semibold text-white">08.00 - 17.00</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-3">
                <span>Saturday:</span>
                <span className="font-semibold text-white">08.00 - 15.00</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-3">
                <span>Sunday / Holiday:</span>
                <span className="font-semibold text-neutral-500">Closed</span>
              </li>
            </ul>
          </div>

          {/* Kolom Contact Us */}
          <div>
            <h3 className="text-[25px] font-extrabold uppercase tracking-[0.25em] text-white">
              Contact Us
            </h3>
            <ul className="mt-6 space-y-4 text-base">
              <li className="flex items-start gap-3.5">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mt-1 h-5 w-5 text-neutral-400 flex-shrink-0"
                />
                <span className="text-neutral-300 leading-relaxed">
                  Jl. Raya Utama No. 123, Jakarta Selatan
                </span>
              </li>
              <li className="flex items-center gap-3.5">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="h-5 w-5 text-neutral-400 flex-shrink-0"
                />
                <span className="text-neutral-300">+62 821-1396-3222</span>
              </li>
              <li className="flex items-center gap-3.5">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-5 w-5 text-neutral-400 flex-shrink-0"
                />
                <span className="text-neutral-300">adm.autohigh@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-24 border-t border-neutral-900 pt-10 text-left text-base font-semibold text-neutral-500">
          <p>&copy; AutoHigh Car Showroom {new Date().getFullYear()} </p>
        </div>
      </div>
    </footer>
  );
}
