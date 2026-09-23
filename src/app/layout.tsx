import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. TAMBAHKAN IMPORT FONTAWESOME DI SINI:
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// 2. MATIKAN INJEKSI CSS OTOMATIS SUPAYA TIDAK BENTROK
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Konfigurasi viewport PWA
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

// Konfigurasi Metadata + PWA + Icons
export const metadata: Metadata = {
  title: {
    default: "AutoHigh | Luxury Cars Showroom",
    template: "%s | Showroom Mobil",
  },
  description:
    "Temukan mobil pilihan terbaik dengan penawaran harga OTR transparan dan jaminan kondisi unit terawat.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AutoHigh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="h-full bg-neutral-950 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
