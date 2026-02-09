import React from "react";
import ReadingHeader from "@/components/ReadingHeader";
import ReadingFooter from "@/components/ReadingFooter";
import { MOCK_QURAN_PAGE } from "@/lib/mockData";

/**
 * Reading View Page
 *
 * Focused interface for reading the Quranic meal.
 */
export default function ReadingPage() {
  return (
    <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center selection:bg-primary/30 relative overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 size-[500px] rounded-full bg-primary blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 size-[500px] rounded-full bg-primary blur-[120px]"></div>
      </div>

      <ReadingHeader />

      {/* Main Content Area */}
      <main className="relative pt-32 pb-48 w-full max-w-3xl px-6 md:px-12">
        {/* Sura Info Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3 font-display">
            {MOCK_QURAN_PAGE.suraName}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display">
            Ayet {MOCK_QURAN_PAGE.verses[0].number} —{" "}
            {MOCK_QURAN_PAGE.verses[MOCK_QURAN_PAGE.verses.length - 1].number}
          </h1>
          <div className="w-16 h-1 bg-primary/20 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Serif Reading Body */}
        <article className="reading-text space-y-12 animate-in fade-in duration-1000 delay-300">
          {MOCK_QURAN_PAGE.verses.map((verse) => (
            <div key={verse.number} className="relative group">
              {/* Verse Number Indicator */}
              <span className="text-primary font-display font-black text-4xl float-left mr-5 mt-1 leading-none opacity-20 group-hover:opacity-100 transition-opacity">
                {verse.number}.
              </span>
              <p className="text-foreground/90 leading-relaxed text-justify lg:text-left">
                {verse.text}
              </p>
            </div>
          ))}

          {/* Contextual Decorative Element */}
          <div className="flex justify-center py-16">
            <div className="flex gap-6 opacity-20">
              <span className="material-symbols-outlined scale-75">
                star_outline
              </span>
              <span className="material-symbols-outlined scale-125 text-primary logo-glow">
                auto_awesome
              </span>
              <span className="material-symbols-outlined scale-75">
                star_outline
              </span>
            </div>
          </div>
        </article>
      </main>

      {/* Side Navigation Floating Buttons (Desktop) */}
      <div className="fixed top-1/2 -translate-y-1/2 left-8 hidden xl:flex flex-col items-center gap-3 group cursor-pointer animate-in fade-in slide-in-from-left-4 duration-1000">
        <button className="size-16 rounded-full flex items-center justify-center bg-surface border border-border shadow-lg hover:border-primary/50 hover:bg-surface-hover transition-all">
          <span className="material-symbols-outlined text-foreground-muted group-hover:text-primary transition-colors">
            chevron_left
          </span>
        </button>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground-muted group-hover:text-primary transition-colors font-display">
          Önceki
        </span>
      </div>

      <div className="fixed top-1/2 -translate-y-1/2 right-8 hidden xl:flex flex-col items-center gap-3 group cursor-pointer animate-in fade-in slide-in-from-right-4 duration-1000">
        <button className="size-16 rounded-full flex items-center justify-center bg-surface border border-border shadow-lg hover:border-primary/50 hover:bg-surface-hover transition-all">
          <span className="material-symbols-outlined text-foreground-muted group-hover:text-primary transition-colors">
            chevron_right
          </span>
        </button>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground-muted group-hover:text-primary transition-colors font-display">
          Sonraki
        </span>
      </div>

      <ReadingFooter />
    </div>
  );
}
