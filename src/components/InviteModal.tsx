"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber }),
      });

      const data = await res.json();

      if (res.ok) {
        setInviteLink(data.inviteLink);
        setStatus("success");
      } else {
        setStatus("error");
        setError(data.error || "Davet oluşturulamadı.");
      }
    } catch (err) {
      setStatus("error");
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const resetForm = () => {
    setName("");
    setPhoneNumber("");
    setInviteLink("");
    setStatus("idle");
    setError("");
  };

  const resetAndClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={resetAndClose}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-surface border border-border w-full max-w-md rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-foreground-muted hover:text-white hover:bg-white/10 rounded-full p-2 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group">
              <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                person_add
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">
                Yeni Üye Davet Et
              </h2>
              <p className="text-foreground-muted text-sm mt-1">
                Üye bilgilerini girerek kişiye özel davet linki oluştur.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleGenerateLink}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] pl-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Üye adı ve soyadı"
                    className="w-full bg-background-dark/50 border border-border rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] pl-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full bg-background-dark/50 border border-border rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display"
                  />
                </div>

                {status === "error" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-14 bg-primary text-background-dark rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all glow-primary flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === "loading" ? (
                    <div className="size-5 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Davet Linki Oluştur</span>
                      <span className="material-symbols-outlined text-sm">
                        link
                      </span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-background-dark/50 border border-emerald-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-emerald-500/10 scale-150">
                    <span className="material-symbols-outlined text-6xl">
                      check_circle
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">
                      Özel Davet Linki Hazır
                    </p>
                    <p className="text-white text-sm font-mono break-all mt-2 opacity-80">
                      {inviteLink}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full h-14 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/20"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? "done" : "content_copy"}
                  </span>
                  {copied ? "Linki Kopyalandı!" : "WhatsApp İçin Kopyala"}
                </button>

                <button
                  onClick={resetForm}
                  className="w-full text-center text-xs text-foreground-muted hover:text-white transition-colors uppercase tracking-widest font-bold pt-2 cursor-pointer"
                >
                  Yeni Bir Üye Daha Ekle
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
