import React from "react";
import Logo from "./Logo";

const navItems = [
  { icon: "dashboard", label: "Panel", active: true },
  { icon: "menu_book", label: "Okuma", active: false },
  { icon: "group", label: "Grup", active: false },
  { icon: "settings", label: "Ayarlar", active: false },
];

export default function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col w-64 min-h-screen bg-surface border-r border-border p-6 fixed">
      <Logo className="mb-10" />

      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-display ${
              item.active
                ? "bg-primary/10 text-primary font-bold shadow-sm"
                : "text-foreground-muted hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all font-display">
          <span className="material-symbols-outlined">logout</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
