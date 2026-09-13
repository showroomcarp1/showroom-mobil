import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility gabungan clsx & tailwind-merge untuk merapikan className
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}