"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGauge, faCar, faTags, faGear, faSignOut } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: faGauge },
    { label: "Daftar Mobil", href: "/admin/dashboard/cars", icon: faCar },
    { label: "Kelola Promo", href: "/admin/dashboard/promo", icon: faTags },
    { label: "Pengaturan", href: "/admin/dashboard/settings", icon: faGear },
  ];

  return (
    <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col justify-between min-h-screen">
      <div>
        {/* Header Admin */}
        <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
            ADM
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900">AutoLux Admin</h2>
            <span className="text-[10px] text-neutral-400">Panel Kelola Portal</span>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className={`h-4 w-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tombol Logout */}
      <div className="p-4 border-t border-neutral-100">
        <button
          onClick={() => {
            // Logic Logout
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOut} className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}