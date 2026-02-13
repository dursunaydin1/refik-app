"use client";

import React from "react";
import Logo from "./Logo";

import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import InviteModal from "./InviteModal";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Share2,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Panel",
      path: "/dashboard",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Okuma",
      path: "/reading",
    },
    { icon: <Users className="w-5 h-5" />, label: "Grup", path: "/group" },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Ayarlar",
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleOpenInvite = () => {
    setIsInviteOpen(true);
  };

  return (
    <>
      <div className="hidden lg:flex flex-col w-64 min-h-screen bg-surface border-r border-border p-6 fixed">
        <Logo className="mb-10" />

        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-display cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "text-foreground-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin Specific Action */}
          {user?.role === "ADMIN" && (
            <div className="pt-4 mt-4 border-t border-white/5">
              <button
                onClick={handleOpenInvite}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all font-display cursor-pointer shadow-lg shadow-primary/20"
              >
                <Share2 className="w-5 h-5" />
                <span>Grup Daveti</span>
              </button>
            </div>
          )}
        </nav>

        <div className="pt-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 active:scale-95 transition-all font-display cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
}
