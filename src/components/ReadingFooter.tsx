"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface ReadingFooterProps {
  day: number;
}

export default function ReadingFooter({ day }: ReadingFooterProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

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
          pageNumber: day * 20, // Approximate page number based on day
          dayNumber: day,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.hatimCompleted) {
          router.push("/completion");
        } else {
          router.push("/dashboard");
        }
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
          className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 font-display text-lg disabled:opacity-50 cursor-pointer hover:shadow-primary/40"
        >
          {isSaving ? (
            <div className="size-6 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">task_alt</span>
              {day}. Gün Tamamlandı
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
