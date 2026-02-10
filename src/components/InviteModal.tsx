"use client";

import React, { useState } from "react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  inviteCode,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Selam! Ramazan'da Kur'an mealini birlikte okumak için seni Refik'e davet ediyorum.\n\nGrup Davet Kodu: ${inviteCode}\nUygulama: ${window.location.origin}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopyalama başarısız:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Refik Daveti",
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.error("Paylaşım başarısız:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-surface border border-border w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground-muted hover:text-white hover:bg-white/10 rounded-full p-2 transition-all active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="space-y-6 text-center">
          <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl font-variation-icon">
              person_add
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white font-display">
              Grup Daveti
            </h2>
            <p className="text-foreground-muted text-sm font-display">
              Arkadaşlarını davet etmek için kodu veya linki paylaş.
            </p>
          </div>

          <div className="bg-background-dark/50 border border-border p-5 rounded-2xl space-y-3">
            <p className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold">
              DAVET KODU
            </p>
            <p className="text-3xl font-mono font-bold text-primary tracking-tighter">
              {inviteCode}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-4 bg-surface-lighter border border-border rounded-xl font-bold text-white hover:bg-white/10 active:scale-95 transition-all font-display text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? "check" : "content_copy"}
              </span>
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-4 bg-primary text-background-dark rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all font-display text-sm glow-primary cursor-pointer shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
