import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AutoHigh | Luxury Cars Showroom",
    template: "%s | Showroom Mobil",
  },
  description:
    "Temukan mobil pilihan terbaik dengan penawaran harga OTR transparan dan jaminan kondisi unit terawat.",
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
