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
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/client";
import FontAwesomeIcon from "@/components/common/FontAwesomeIcon";

// types
interface AdminNavItem {
  href: string;
  label: string;
  icon: IconDefinition;
}

// nav items
const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: faGauge },
  { href: "/admin/cars", label: "Katalog Mobil", icon: faCar },
  { href: "/admin/cars/new", label: "Tambah Mobil", icon: faPlus },
  { href: "/admin/settings", label: "Pengaturan", icon: faGear },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  // logout
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // page login
  if (pathname === "/admin/login") {
    return (
      <main className="min-h-screen bg-white text-neutral-900">{children}</main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex font-sans antialiased">
      {/* sidebar */}
      <aside className="w-16 md:w-64 border-r border-neutral-200 bg-white flex flex-col justify-between p-2 md:p-4 shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          {/* brand header */}
          <header className="px-1 md:px-3 py-2 border-b border-neutral-100">
            <span className="hidden md:block text-[30px] font-bold tracking-tight text-neutral-900 truncate">
              Panel Admin
            </span>
          </header>

          {/* nav links */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center md:justify-start gap-3 rounded-md px-3 py-4 text-[13px] font-semibold active:scale-[0.98] ${
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
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* sidebar footer */}
        <footer className="pt-3 border-t border-neutral-200 space-y-1">
          <Link
            href="/cars"
            className="flex items-center justify-center md:justify-start gap-3 rounded-md px-3 py-3 bg-blue-600 text-[15px] font-medium text-white transition-all duration-150 active:scale-[0.98]"
          >
            <FontAwesomeIcon
              icon={faHouse}
              className="h-3.5 w-3.5 text-white"
            />
            <span className="hidden md:inline">Halaman Utama</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start gap-3 rounded-md px-3 py-3 text-[15px] font-semibold bg-red-600 text-white transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="h-3.5 w-3.5 text-white"
            />
            <span className="hidden md:inline">Logout</span>
          </button>
        </footer>
      </aside>

      {/* main content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
