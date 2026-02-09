"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user } = useUser();

  const displayName = user?.name || "Misafir";
  const displayRole = user?.role || "Kullanıcı";
  const avatarText = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <header className="flex items-center justify-between p-6 lg:px-8 border-b border-border bg-background-dark/80 backdrop-blur-md sticky top-0 z-30">
      <div className="grow max-w-xl">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            placeholder="Sure veya ayet ara..."
            className="w-full bg-surface border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-display"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <button className="size-10 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground-muted hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-surface"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white font-display">
              {displayName}
            </p>
            <p className="text-[10px] text-primary uppercase font-bold tracking-widest">
              {displayRole === "ADMIN" ? "Grup Lideri" : "Üye"}
            </p>
          </div>
          <div className="size-10 rounded-xl border border-border bg-surface flex items-center justify-center text-primary font-bold font-display">
            {avatarText}
          </div>
        </div>
      </div>
    </header>
  );
}
