"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function ReadingFooter() {
  const router = useRouter();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  // For MVP, we use mock values for day and page
  const handleFinish = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          pageNumber: 245, // In a real app, this would come from the current scroll position or page index
          dayNumber: 12, // Calculated based on Ramadan start date
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Save failure:", error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center pointer-events-none z-40">
      {/* Finish for Today Button */}
      <div className="pointer-events-auto w-full max-w-md">
        <button
          onClick={handleFinish}
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 font-display text-lg disabled:opacity-50"
        >
          {isSaving ? (
            <div className="size-6 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">task_alt</span>
              Bugünlük Bitti
            </>
          )}
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
