"use client";

import Link from "next/link";
import { ArrowLeft, Settings, Share2 } from "lucide-react";

interface ReadingHeaderProps {
  juz: number;
  suraName: string;
  day: number;
}

export default function ReadingHeader({
  juz,
  suraName,
  day,
}: ReadingHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center p-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-white font-display">
              {juz}. Cüz — {day}. Gün
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-foreground-muted uppercase tracking-widest font-bold">
              <span>{suraName} Suresi</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer hover:text-white group">
            <Settings className="w-5 h-5 text-foreground-muted group-hover:text-white transition-colors" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer hover:text-white group">
            <Share2 className="w-5 h-5 text-foreground-muted group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Juz Progress Bar */}
      <div className="w-full h-[2px] bg-white/5">
        <div
          className="h-full bg-primary glow-primary transition-all duration-500"
          style={{ width: `${Math.round((day / 29) * 100)}%` }}
        ></div>
      </div>
    </header>
  );
}
