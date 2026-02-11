"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import InviteModal from "./InviteModal";

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const navItems = [
    { icon: "dashboard", label: "Panel", path: "/dashboard" },
    { icon: "menu_book", label: "Okuma", path: "/reading" },
    { icon: "group", label: "Grup", path: "/group" },
    { icon: "settings", label: "Ayarlar", path: "/settings" },
    { icon: "share", label: "Davet", action: "invite", adminOnly: true },
  ];

  const handleOpenInvite = () => {
    setIsInviteOpen(true);
  };

  return (
    <>
      <nav className="lg:hidden fixed bottom-1 left-4 right-4 bg-surface/90 backdrop-blur-xl border border-white/10 z-50 px-6 py-4 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "ADMIN") return null;

            const isActive = pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() =>
                  item.action === "invite"
                    ? handleOpenInvite()
                    : router.push(item.path || "/")
                }
                className={`flex flex-col items-center gap-1 transition-all active:scale-90 cursor-pointer ${
                  item.adminOnly
                    ? "text-primary font-bold drop-shadow-[0_0_8px_rgba(19,236,200,0.5)]" // Bright Mint for Invite
                    : isActive
                      ? "text-primary"
                      : "text-foreground-muted hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${isActive ? "font-variation-icon-fill" : ""}`}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
}
