"use client";

import React, { useState, useEffect } from "react";
import NotificationManager from "@/components/NotificationManager";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function SettingsPage() {
  const { user, login } = useUser();

  // Profile State
  const [name, setName] = useState(user?.name || "");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Sync user data
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Güncelleme başarısız.");
      }

      // Update local context
      if (user) {
        login({
          ...user,
          name: data.user.name,
        });
      }

      setMessage({ text: "Profil güncellendi.", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center p-6 pb-24">
      <header className="w-full max-w-md flex items-center mb-8 pt-4 justify-between">
        <div className="flex items-center">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer mr-2"
          >
            <span className="material-symbols-outlined text-foreground-muted">
              arrow_back
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white font-display">Ayarlar</h1>
        </div>
      </header>

      <main className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {message && (
          <div
            className={`p-4 rounded-xl border text-sm font-bold ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground-muted uppercase tracking-wider">
            Profil Bilgileri
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-foreground-muted pl-1">
                İsim Soyisim
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-background-dark font-bold py-4 rounded-xl transition-all cursor-pointer font-display active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </form>
        </section>

        <hr className="border-border/50" />

        <NotificationManager />
      </main>
    </div>
  );
}
