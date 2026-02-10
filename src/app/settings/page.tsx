"use client";

import React, { useState, useEffect } from "react";
import NotificationManager from "@/components/NotificationManager";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function SettingsPage() {
  const { user, login } = useUser();
  const [activeTab, setActiveTab] = useState<"profile" | "group">("profile");

  // Profile State
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Group State
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");

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

  // Fetch Group Data for Admins
  useEffect(() => {
    if (user?.role === "ADMIN" && user.groupId && activeTab === "group") {
      fetch(`/api/group/members?groupId=${user.groupId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.members) {
            setGroupMembers(data.members);
            // Fetch group name? We don't have it in context efficiently,
            // but usually, admin knows. Let's assume we might need to fetch group details separately
            // or just use what we have. For now, let's just list members.
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user, activeTab]);

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
          password: newPassword || undefined,
          currentPassword: currentPassword || undefined,
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
          hasPassword: data.user.hasPassword,
        });
      }

      setMessage({ text: "Profil güncellendi.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Bu üyeyi gruptan çıkarmak istediğinize emin misiniz?"))
      return;

    try {
      const res = await fetch("/api/group/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REMOVE_MEMBER",
          adminId: user?.id,
          groupId: user?.groupId,
          memberId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGroupMembers((prev) => prev.filter((m) => m.id !== memberId));
      alert("Üye çıkarıldı.");
    } catch (error: any) {
      alert(error.message);
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
        {user?.role === "ADMIN" && (
          <div className="flex bg-surface-lighter rounded-lg p-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "profile" ? "bg-primary text-background-dark" : "text-foreground-muted hover:text-white"}`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab("group")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "group" ? "bg-primary text-background-dark" : "text-foreground-muted hover:text-white"}`}
            >
              Grup
            </button>
          </div>
        )}
      </header>

      <main className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {message && (
          <div
            className={`p-4 rounded-xl border text-sm font-bold ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        {activeTab === "profile" && (
          <>
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

                <div className="p-4 bg-surface border border-border rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      lock
                    </span>
                    Güvenlik & Şifre
                  </h3>

                  {user?.hasPassword && (
                    <div className="space-y-1">
                      <label className="text-xs text-foreground-muted pl-1">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-surface-lighter border border-border rounded-xl p-3 text-white focus:border-primary outline-none transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-foreground-muted pl-1">
                      {user?.hasPassword ? "Yeni Şifre" : "Şifre Oluştur"}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={
                        user?.hasPassword
                          ? "Değiştirmek istemiyorsanız boş bırakın"
                          : "Yeni şifre belirleyin"
                      }
                      className="w-full bg-surface-lighter border border-border rounded-xl p-3 text-white focus:border-primary outline-none transition-all"
                    />
                  </div>
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
          </>
        )}

        {activeTab === "group" && user?.role === "ADMIN" && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-foreground-muted uppercase tracking-wider">
              Grup Yönetimi
            </h2>

            <div className="space-y-2">
              {groupMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-surface-lighter flex items-center justify-center text-foreground-muted font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {member.role === "ADMIN" ? "Yönetici" : "Üye"}
                      </p>
                    </div>
                  </div>

                  {member.id !== user.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Gruptan Çıkar"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        person_remove
                      </span>
                    </button>
                  )}
                </div>
              ))}
              {groupMembers.length === 0 && (
                <p className="text-center text-foreground-muted py-4">
                  Üye bulunamadı.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
