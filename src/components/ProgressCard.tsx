import React from "react";
import { MOCK_DASHBOARD_STATS } from "@/lib/mockData";

export default function ProgressCard() {
  const percentage = (MOCK_DASHBOARD_STATS.dailyGoalProgress / 20) * 100;

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 size-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        {/* Circular Progress (Simplified for mock) */}
        <div className="relative size-32 flex items-center justify-center">
          <svg className="size-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-primary/10"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={364.4}
              strokeDashoffset={364.4 - (364.4 * percentage) / 100}
              className="text-primary drop-shadow-[0_0_8px_rgba(19,236,200,0.5)]"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white font-display">
              %{Math.round(percentage)}
            </span>
            <span className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold">
              Bugün
            </span>
          </div>
        </div>

        <div className="grow space-y-4">
          <div className="space-y-1">
            <h4 className="text-primary text-sm font-bold uppercase tracking-widest font-display">
              Günlük Hedef
            </h4>
            <h3 className="text-3xl font-bold text-white font-display">
              {MOCK_DASHBOARD_STATS.currentJuz}. Cüz
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted font-display">
                Okunan: {MOCK_DASHBOARD_STATS.dailyGoalProgress} Sayfa
              </span>
              <span className="text-primary font-bold font-display">
                Kalan: {MOCK_DASHBOARD_STATS.remainingPages}
              </span>
            </div>
            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary glow-primary rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <a
            href="/reading"
            className="w-full md:w-auto bg-primary text-background-dark font-bold px-8 py-3 rounded-xl glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-display"
          >
            <span className="material-symbols-outlined">menu_book</span>
            Okumaya Devam Et
          </a>
        </div>
      </div>
    </div>
  );
}
