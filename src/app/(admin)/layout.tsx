"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";
import {
  faCar,
  faGauge,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

// Data Navigasi Sidebar
const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: faGauge },
  { href: "/admin/cars", label: "Katalog Mobil", icon: faCar },
  { href: "/admin/cars/new", label: "Tambah Unit", icon: faPlus },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Jika halaman login, tampilkan konten penuh tanpa sidebar/header
  if (pathname === "/admin/login") {
    return (
      <main className="min-h-screen bg-white text-neutral-900">{children}</main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex font-sans antialiased">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-neutral-200 bg-white hidden md:flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Header Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <FontAwesomeIcon icon={faCar} className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest text-neutral-900 uppercase">
                Admin Panel
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                Showroom Suite
              </span>
            </div>
          </div>

          {/* Menu Navigasi */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-neutral-100 text-neutral-900 font-semibold"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`h-3.5 w-3.5 ${
                      isActive ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Navigation */}
        <footer className="pt-4 border-t border-neutral-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            <span>Kembali ke Utama</span>
          </Link>
        </footer>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header Navigasi */}
        <header className="border-b border-neutral-200 bg-white px-5 py-4 flex items-center justify-between md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <FontAwesomeIcon icon={faCar} className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
          >
            Web Utama
          </Link>
        </header>

        {/* Page Content Viewport */}
        <main className="p-6 md:p-10 flex-1 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
