"use client";

import React from "react";
import Logo from "./Logo";

import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUser();

  const navItems = [
    { icon: "dashboard", label: "Panel", path: "/dashboard" },
    { icon: "menu_book", label: "Okuma", path: "/reading" },
    { icon: "group", label: "Grup", path: "/group" },
    { icon: "settings", label: "Ayarlar", path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="hidden lg:flex flex-col w-64 min-h-screen bg-surface border-r border-border p-6 fixed">
      <Logo className="mb-10" />

      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-display ${
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-foreground-muted hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Admin Specific Action */}
        {user?.role === "ADMIN" && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/20 text-accent font-bold hover:bg-accent/30 transition-all font-display">
              <span className="material-symbols-outlined">share</span>
              <span>Grup Daveti</span>
            </button>
          </div>
        )}
      </nav>

      <div className="pt-6 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all font-display"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
