"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import InviteModal from "@/components/InviteModal";

export default function GroupPage() {
  const router = useRouter();
  const { user } = useUser();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    if (user?.groupId) {
      fetchMembers();
    } else if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/group/members?groupId=${user?.groupId}`);
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error("Grup üyeleri yüklenemedi:", err);
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

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } else {
        const data = await res.json();
        alert(data.error || "Hata oluştu.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenInvite = () => {
    setIsInviteOpen(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center p-6 pb-32">
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-foreground-muted">
              arrow_back
            </span>
          </button>
          <h1 className="text-2xl font-bold text-white font-display">
            Grup Detayları
          </h1>
        </div>

        {user.role === "ADMIN" && (
          <button
            onClick={handleOpenInvite}
            className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Davet Et
          </button>
        )}
      </header>

      <main className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Group Stats/Info would go here */}
        <section className="bg-surface border border-border rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-8xl">group</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-1">Refik Grubu</h2>
            <p className="text-foreground-muted text-sm">
              Ramazan boyunca birlikte okuyan dostlar.
            </p>
            <div className="mt-4 flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary font-display">
                  {members.length}
                </p>
                <p className="text-[10px] text-foreground-muted uppercase font-bold tracking-widest">
                  Üye
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Member List */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-widest pl-2">
            Katılımcılar
          </h3>

          <div className="grid gap-3">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-2xl hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{member.name}</p>
                      <p className="text-xs text-foreground-muted">
                        {member.role === "ADMIN" ? "Grup Yöneticisi" : "Üye"}
                      </p>
                    </div>
                  </div>

                  {user.role === "ADMIN" && member.id !== user.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all cursor-pointer"
                      title="Gruptan Çıkar"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        person_remove
                      </span>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-3xl">
                <span className="material-symbols-outlined text-4xl text-foreground-muted mb-2 opacity-20">
                  group_off
                </span>
                <p className="text-foreground-muted">Henüz kimse yok.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
