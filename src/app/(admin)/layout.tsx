"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCar,
  faGauge,
  faPlus,
  faGear,
  faRightFromBracket,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/client";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";

interface AdminNavItem {
  href: string;
  label: string;
  icon: IconDefinition;
}

const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: faGauge },
  { href: "/admin/cars", label: "Katalog Mobil", icon: faCar },
  { href: "/admin/cars/new", label: "Tambah Unit", icon: faPlus },
  { href: "/admin/settings", label: "Pengaturan", icon: faGear },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  // Callback Logout - Instance Supabase dipanggil di dalam fungsi (hanya saat diklik)
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return (
      <main className="min-h-screen bg-white text-neutral-900">{children}</main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex font-sans antialiased">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-neutral-200 bg-white hidden md:flex flex-col justify-between p-4 shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          {/* Header Minimalis */}
          <div className="px-3 py-2 border-b border-neutral-100">
            <span className="text-[20px] font-bold tracking-tight text-neutral-900">
              Admin Panel
            </span>
          </div>

          {/* Navigasi Utama */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-4 text-[13px] font-semibold transition-all duration-300 active:scale-[0.98] ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`h-3.5 w-3.5 ${
                      isActive ? "text-white" : "text-neutral-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <footer className="pt-3 border-t border-neutral-200 space-y-1">
          <Link
            href="/cars"
            className="flex items-center gap-3 rounded-md px-3 py-3 bg-blue-600 text-[15px] font-medium text-white transition-all duration-150 active:scale-[0.98]"
          >
            <FontAwesomeIcon
              icon={faGlobe}
              className="h-3.5 w-3.5 text-white"
            />
            <span>Halaman Utama</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-md px-3 py-3 text-[15px] font-semibold bg-red-600 text-white transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="h-3.5 w-3.5 text-white"
            />
            <span>Logout</span>
          </button>
        </footer>
      </aside>

      {/* Main Area Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header */}
        <header className="border-b border-neutral-200 bg-white px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-20">
          <span className="text-[15px] font-bold text-neutral-900">
            Admin Panel
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md bg-blue-600 px-2.5 py-2 text-xs font-semibold text-white"
            >
              Beranda
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-2.5 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="p-6 md:p-8 flex-1 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
