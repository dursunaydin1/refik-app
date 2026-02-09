"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useUser } from "@/context/UserContext";

/**
 * Login Page
 *
 * Simple authentication using Name and Phone Number.
 * Communicates with /api/auth/login.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber: phone }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Sunucudan beklenmedik bir yanıt geldi (JSON değil).");
      }

      if (!response.ok) {
        throw new Error(data.error || "Giriş başarısız.");
      }

      // Success! Persist session in context
      login(data.user);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Error Catch:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Logo size={60} showText={false} />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white font-display">
              Hoş Geldin
            </h1>
            <p className="text-foreground-muted font-display">
              Refik yolculuğuna devam etmek için bilgilerini gir.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-surface border border-border rounded-3xl p-8 space-y-6 shadow-2xl"
        >
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
                <span className="material-symbols-outlined text-base">
                  error
                </span>
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-bold text-primary uppercase tracking-widest font-display pl-1"
              >
                Ad Soyad
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Dursun AYDIN"
                  required
                  className="w-full bg-background-dark/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display placeholder:text-foreground-muted/50"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-bold text-primary uppercase tracking-widest font-display pl-1"
              >
                Telefon Numarası
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors">
                  call
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xx xxx xx xx"
                  required
                  className="w-full bg-background-dark/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display placeholder:text-foreground-muted/50"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex items-center justify-center w-full h-16 bg-primary text-background-dark rounded-2xl font-bold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-display disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="size-6 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Giriş Yap</span>
                <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">
                  login
                </span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-foreground-muted uppercase tracking-wider font-bold italic leading-relaxed">
            "Sizin en hayırlınız, Kur'an'ı öğrenen ve öğretendir."
          </p>
        </form>

        {/* Helper Link */}
        <p className="text-center text-sm font-display">
          <span className="text-foreground-muted">
            Henüz bir grubun yok mu?
          </span>{" "}
          <button className="text-primary font-bold hover:underline">
            Davet İste
          </button>
        </p>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center opacity-20 text-[10px] font-bold uppercase tracking-[0.4em] pointer-events-none">
        Refik Spiritual Companion
      </div>
    </div>
  );
}
