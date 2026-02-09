import React from "react";

export default function ReadingFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center pointer-events-none z-40">
      {/* Finish for Today Button */}
      <div className="pointer-events-auto w-full max-w-md">
        <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 font-display text-lg">
          <span className="material-symbols-outlined">task_alt</span>
          Bugünlük Bitti
        </button>
      </div>

      {/* Navigation Hint (Mobile) */}
      <div className="pointer-events-auto flex justify-between w-full max-w-md mt-6 lg:hidden">
        <button className="flex items-center gap-1 text-foreground-muted font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors font-display">
          <span className="material-symbols-outlined text-sm">
            chevron_left
          </span>
          Önceki
        </button>
        <button className="flex items-center gap-1 text-foreground-muted font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors font-display">
          Sonraki
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </div>
    </footer>
  );
}
