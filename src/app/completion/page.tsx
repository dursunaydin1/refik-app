"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Medal, Quote, Home } from "lucide-react";

export default function CompletionPage() {
  const { user } = useUser();

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#13ecc8", "#ffffff", "#eab308"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#13ecc8", "#ffffff", "#eab308"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-foreground flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 space-y-8 max-w-lg animate-in fade-in zoom-in duration-1000">
        <div className="size-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-primary/30 shadow-[0_0_30px_rgba(19,236,200,0.4)]">
          <Medal className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white">
            Tebrikler {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-xl text-primary font-display font-medium">
            Ramazan Hatmini Tamamladın 🤲
          </p>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl relative">
          <Quote className="w-10 h-10 text-foreground-muted/10 absolute -top-4 -left-2" />
          <p className="text-lg italic text-foreground-muted font-display leading-relaxed">
            "Allah kabul etsin. Okuduğun her harf şefaatçin, her ayet yoluna
            ışık olsun. Nice Ramazanlara, nice hatimlere..."
          </p>
        </div>

        <div className="pt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-background-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
