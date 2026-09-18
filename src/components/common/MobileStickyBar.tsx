"use client";

import Link from "next/link";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faHouse, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

interface MobileStickyBarProps {
  carTitle: string;
  year: number;
}

export default function MobileStickyBar({
  carTitle,
  year,
}: MobileStickyBarProps) {
  const whatsappInquireMsg = encodeURIComponent(
    `Hello, I am interested in the ${carTitle} (${year}). Please let me know more details.`,
  );

  const whatsappTestDriveMsg = encodeURIComponent(
    `Hello, I would like to schedule a Test Drive for the ${carTitle} (${year}).`,
  );

  return (
    <aside
      aria-label="Mobile Action Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 lg:hidden"
    >
      <div className="flex items-center justify-between w-full">
        {/* BUTTON HOME */}
        <Link
          href="/"
          aria-label="Return to Home"
          className="flex flex-1 items-center justify-center py-3.5 text-neutral-900 border-r border-neutral-200 transition-colors active:bg-neutral-50"
        >
          <FontAwesomeIcon
            icon={faHouse}
            className="h-5 w-5 text-neutral-900"
          />
        </Link>

        {/* BUTTON CONTACT US */}
        <a
          href={`https://wa.me/6281234567890?text=${whatsappInquireMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[2] items-center justify-center gap-2 py-3.5 text-xs font-extrabold uppercase tracking-widest text-neutral-900 border-r border-neutral-200 transition-colors active:bg-neutral-50"
        >
          <FontAwesomeIcon
            icon={faWhatsapp}
            className="h-5 w-5 text-neutral-900"
          />
          <span>WhatsApp</span>
        </a>

        {/* BUTTON TEST DRIVE */}
        <a
          href={`https://wa.me/6281234567890?text=${whatsappTestDriveMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[2] items-center justify-center gap-2 py-3.5 text-xs font-extrabold uppercase tracking-widest text-neutral-900 transition-colors active:bg-neutral-50"
        >
          <FontAwesomeIcon
            icon={faCalendarCheck}
            className="h-4 w-4 text-neutral-900"
          />
          <span>Test Drive</span>
        </a>
      </div>
    </aside>
  );
}
