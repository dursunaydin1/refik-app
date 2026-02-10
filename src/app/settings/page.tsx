"use client";

import React from "react";
import NotificationManager from "@/components/NotificationManager";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center p-6 pb-24">
      <header className="w-full max-w-md flex items-center mb-8 pt-4">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-foreground-muted">
            arrow_back
          </span>
        </Link>
        <h1 className="text-xl font-bold text-white ml-2 font-display">
          Ayarlar
        </h1>
      </header>

      <main className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <NotificationManager />

        <div className="p-4 bg-surface border border-border rounded-xl opacity-50 pointer-events-none">
          <h3 className="font-bold text-white mb-2 font-display">
            Profil Düzenle
          </h3>
          <p className="text-sm text-foreground-muted">
            Bu özellik yakında eklenecek.
          </p>
        </div>
      </main>
    </div>
  );
}
