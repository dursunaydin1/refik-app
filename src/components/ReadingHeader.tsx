import React from "react";
import Link from "next/link";
import { MOCK_QURAN_PAGE } from "@/lib/mockData";

export default function ReadingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </Link>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-white font-display">
              {MOCK_QURAN_PAGE.juz}. Cüz — Sayfa {MOCK_QURAN_PAGE.pageNumber}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-foreground-muted uppercase tracking-widest font-bold">
              <span>{MOCK_QURAN_PAGE.suraName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer hover:text-white group">
            <span className="material-symbols-outlined text-xl text-foreground-muted group-hover:text-white transition-colors">
              settings
            </span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer hover:text-white group">
            <span className="material-symbols-outlined text-xl text-foreground-muted group-hover:text-white transition-colors">
              ios_share
            </span>
          </button>
        </div>
      </div>

      {/* Juz Progress Bar */}
      <div className="w-full h-[2px] bg-white/5">
        <div
          className="h-full bg-primary glow-primary transition-all duration-500"
          style={{ width: "65%" }}
        ></div>
      </div>
    </header>
  );
}
