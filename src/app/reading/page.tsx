"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReadingHeader from "@/components/ReadingHeader";
import ReadingFooter from "@/components/ReadingFooter";
import { fetchJuz, type JuzData } from "@/lib/quranService";
import {
  getRamadanDay,
  getRamadanStatus,
  getJuzForDay,
} from "@/lib/ramadanDates";

function ReadingContent() {
  const searchParams = useSearchParams();
  const [juzData, setJuzData] = useState<JuzData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine the day from query param or from Ramadan calendar
  const dayParam = searchParams.get("day");
  const currentDay = dayParam ? parseInt(dayParam, 10) : getRamadanDay();
  const juzNumbers = getJuzForDay(currentDay);

  useEffect(() => {
    if (juzNumbers.length === 0) return;

    setLoading(true);
    setError(null);

    // Fetch the first Juz (for days with 2 Juz, we concatenate)
    Promise.all(juzNumbers.map((j) => fetchJuz(j)))
      .then((results) => {
        // Merge multiple Juz into one view
        const merged: JuzData = {
          juzNumber: juzNumbers[0],
          sections: results.flatMap((r) => r.sections),
          totalVerses: results.reduce((acc, r) => acc + r.totalVerses, 0),
        };
        setJuzData(merged);
      })
      .catch((err) => {
        setError(err.message || "Meal yüklenirken bir hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, [currentDay]);

  // Pre-Ramadan: show countdown message
  if (getRamadanStatus() === "before" && !dayParam) {
    return (
      <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
            schedule
          </span>
          <h1 className="text-3xl font-bold text-white font-display">
            Ramazan Henüz Başlamadı
          </h1>
          <p className="text-foreground-muted text-lg leading-relaxed">
            Kuran meali okuma programı, Ramazan'ın ilk günü olan{" "}
            <span className="text-primary font-bold">19 Şubat 2026</span>{" "}
            tarihinde başlayacak.
          </p>
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <p className="text-sm text-foreground-muted font-display uppercase tracking-widest mb-2">
              Ramazan'a Kalan Süre
            </p>
            <p className="text-5xl font-black text-primary font-display">
              {Math.max(
                0,
                Math.ceil(
                  (new Date("2026-02-19T00:00:00+03:00").getTime() -
                    Date.now()) /
                    (1000 * 60 * 60 * 24),
                ),
              )}{" "}
              gün
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary font-bold font-display hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground-muted font-display">
            Meal yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md">
          <span className="material-symbols-outlined text-5xl text-red-400">
            error
          </span>
          <p className="text-red-300 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary font-bold font-display hover:underline cursor-pointer"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!juzData) return null;

  const firstSection = juzData.sections[0];

  return (
    <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center selection:bg-primary/30 relative overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 size-[500px] rounded-full bg-primary blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 size-[500px] rounded-full bg-primary blur-[120px]"></div>
      </div>

      <ReadingHeader
        juz={juzData.juzNumber}
        suraName={firstSection?.surahName || ""}
        day={currentDay}
      />

      {/* Main Content Area */}
      <main className="relative pt-32 pb-48 w-full max-w-3xl px-6 md:px-12">
        {juzData.sections.map((section, sectionIndex) => (
          <div key={`${section.surahNumber}-${sectionIndex}`}>
            {/* Sura Info Header */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3 font-display">
                {section.surahName} Suresi
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
                Ayet {section.verses[0].number} —{" "}
                {section.verses[section.verses.length - 1].number}
              </h2>
              <div className="w-16 h-1 bg-primary/20 mx-auto mt-8 rounded-full"></div>
            </div>

            {/* Verses */}
            <article className="reading-text space-y-12 animate-in fade-in duration-1000 delay-300">
              {section.verses.map((verse) => (
                <div
                  key={`${section.surahNumber}-${verse.number}`}
                  className="relative group"
                >
                  <span className="text-primary font-display font-black text-4xl float-left mr-5 mt-1 leading-none opacity-20 group-hover:opacity-100 transition-opacity">
                    {verse.number}.
                  </span>
                  <p className="text-foreground/90 leading-relaxed text-justify lg:text-left">
                    {verse.text}
                  </p>
                </div>
              ))}
            </article>

            {/* Section Divider (between surahs) */}
            {sectionIndex < juzData.sections.length - 1 && (
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
            )}
          </div>
        ))}

        {/* End of Juz Decoration */}
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
      </main>

      <ReadingFooter day={currentDay} />
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-dark text-foreground flex items-center justify-center">
          <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      }
    >
      <ReadingContent />
    </Suspense>
  );
}
