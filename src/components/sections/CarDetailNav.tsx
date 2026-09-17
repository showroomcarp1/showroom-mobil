"use client";

interface CarDetailNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CarDetailNav({
  activeTab,
  setActiveTab,
}: CarDetailNavProps) {
  const navItems = [
    { id: "overview", label: "OVERVIEW" },
    { id: "spesifikasi", label: "SPESIFIKASI" },
    { id: "eksterior", label: "EKSTERIOR" },
    { id: "interior", label: "INTERIOR" },
  ];

  return (
    <nav className="sticky top-0 z-30 border-y border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <ul className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-xs font-black tracking-widest text-neutral-500 py-1 px-4 scrollbar-none touch-pan-x">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="py-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`cursor-pointer transition-colors pb-1 border-b-2 uppercase ${
                    isActive
                      ? "border-red-600 text-black font-black"
                      : "border-transparent text-neutral-500 hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
