"use client";

import React from "react";
import { ConditionType } from "@/types/cars";

interface CarBadgeProps {
  condition: ConditionType;
  className?: string;
}

export default function CarBadge({ condition, className = "" }: CarBadgeProps) {
  // Warna elegan & creamy tanpa border dan tanpa shadow untuk tampilan seamless
  const styles: Record<ConditionType, string> = {
    New: "bg-[#F5F2EB] text-[#1C1917]", // Soft Warm Cream
    Used: "bg-[#000000] text-[#FFFFFF]", // Muted Sand Stone
    Exclusive: "bg-[#FDF0D5] text-[#78350F]", // Creamy Champagne Gold
  };

  return (
    <span
      className={`absolute top-0 left-0 z-10 inline-flex items-center rounded-br-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest ${styles[condition]} ${className}`}
    >
      {condition}
    </span>
  );
}
