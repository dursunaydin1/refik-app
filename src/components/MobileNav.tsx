import React from "react";

const navItems = [
  { icon: "dashboard", label: "Panel", active: true },
  { icon: "menu_book", label: "Okuma", active: false },
  { icon: "group", label: "Grup", active: false },
  { icon: "settings", label: "Ayarlar", active: false },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-40 px-6 pb-6 pt-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.active ? "text-primary" : "text-foreground-muted"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
