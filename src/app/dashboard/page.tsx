"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProgressCard from "@/components/ProgressCard";
import ParticipantList from "@/components/ParticipantList";
import MobileNav from "@/components/MobileNav";
import { useUser } from "@/context/UserContext";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/dashboard?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch stats:", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-primary animate-pulse font-display font-bold">
          Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col lg:flex-row">
      <Sidebar />

      <div className="grow lg:ml-64 flex flex-col pb-24 lg:pb-0">
        <Header />

        <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          <div className="grow space-y-4">
            <h1 className="text-2xl font-bold text-white font-display">
              Selam {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="text-foreground-muted font-display">
              {stats?.dailyGoalProgress > 0
                ? `Ramazan'ın ${stats.dailyGoalProgress}. gününü tamamladın.`
                : "Bugünkü okumana henüz başlamadın."}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <ProgressCard
                percentage={stats?.userProgressPercentage}
                currentJuz={stats?.currentJuz}
                dailyGoalProgress={stats?.dailyGoalProgress}
                remainingPages={stats?.remainingPages}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined font-variation-icon">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted uppercase font-bold tracking-widest text-[10px]">
                      Grup İlerlemesi
                    </p>
                    <p className="text-xl font-bold text-white font-display">
                      %{stats?.totalGroupProgress || 0}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined font-variation-icon text-accent">
                      event
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted uppercase font-bold tracking-widest text-[10px]">
                      Kalan Gün
                    </p>
                    <p className="text-xl font-bold text-white font-display">
                      {30 - (stats?.dailyGoalProgress || 0)} Gün
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <ParticipantList members={stats?.members} />

              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <span className="material-symbols-outlined text-sm font-variation-icon">
                    lightbulb
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-[10px]">
                    Günün Hatırlatıcısı
                  </p>
                </div>
                <p className="text-sm text-foreground-muted italic leading-relaxed font-display">
                  "Okumak, ruhun her mevsimde yeniden çiçek açmasıdır."
                </p>
              </div>

              {/* Admin Notification Test Button */}
              {user?.role === "ADMIN" && (
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                  <h3 className="font-bold text-white font-display">
                    Yönetici Paneli
                  </h3>
                  <button
                    onClick={async () => {
                      if (confirm("Herkese bildirim gönderilsin mi?")) {
                        await fetch("/api/notifications/send", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: "all",
                            title: "Hatırlatma",
                            body: "Bugünkü okumanı yapmayı unutma! 📖",
                          }),
                        });
                        alert("Bildirimler gönderildi!");
                      }
                    }}
                    className="w-full bg-surface-lighter hover:bg-surface-hover border border-border text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer font-display flex items-center justify-center gap-2 active:scale-95 text-sm"
                  >
                    <span className="material-symbols-outlined">send</span>
                    Hatırlatma Gönder
                  </button>
                </div>
              )}
            </aside>
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}
