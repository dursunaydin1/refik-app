import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProgressCard from "@/components/ProgressCard";
import ParticipantList from "@/components/ParticipantList";
import MobileNav from "@/components/MobileNav";
import { MOCK_DASHBOARD_STATS } from "@/lib/mockData";

/**
 * Dashboard Page
 *
 * The main overview for the user after logging in.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background-dark flex flex-col lg:flex-row">
      {/* Sidebar - Persistent on desktop */}
      <Sidebar />

      {/* Main Container */}
      <div className="grow lg:ml-64 flex flex-col pb-24 lg:pb-0">
        <Header />

        <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Welcome Message */}
          <div className="grow space-y-4">
            <h1 className="text-2xl font-bold text-white font-display">
              Selam 👋
            </h1>
            <p className="text-foreground-muted font-display">
              Ramazan'ın {MOCK_DASHBOARD_STATS.dailyGoalProgress}. günü için
              okuyacak {MOCK_DASHBOARD_STATS.remainingPages} sayfan kaldı.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left/Middle Column (Main Stats) */}
            <div className="xl:col-span-2 space-y-8">
              <ProgressCard />

              {/* Secondary Stats/Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted uppercase font-bold tracking-widest">
                      Grup İlerlemesi
                    </p>
                    <p className="text-xl font-bold text-white font-display">
                      %{MOCK_DASHBOARD_STATS.totalGroupProgress}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined">event</span>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted uppercase font-bold tracking-widest">
                      Kalan Gün
                    </p>
                    <p className="text-xl font-bold text-white font-display">
                      {30 - MOCK_DASHBOARD_STATS.dailyGoalProgress} Gün
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar-like Info) */}
            <aside className="space-y-8">
              <ParticipantList />

              {/* Daily Reminder Card */}
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <span className="material-symbols-outlined text-sm">
                    lightbulb
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Günün Hatırlatıcısı
                  </p>
                </div>
                <p className="text-sm text-foreground-muted italic leading-relaxed font-display">
                  "Okumak, ruhun her mevsimde yeniden çiçek açmasıdır."
                </p>
              </div>
            </aside>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
