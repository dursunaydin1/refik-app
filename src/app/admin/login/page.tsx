"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useUser } from "@/context/UserContext";
import {
  Phone,
  Lock,
  LockKeyholeOpen,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

/**
 * Admin Login Page
 *
 * Professional restricted entry for administrators.
 * Only requires Phone Number and Password.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user: currentUser } = useUser();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, skip login page
  React.useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Name is omitted for professional admin login as they should already exist
        body: JSON.stringify({ phoneNumber: phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Giriş başarısız.");
      }

      // Success! Persist session in context
      login(data.user);
      router.push("/dashboard");
    } catch (err: any) {
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
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <Logo size={90} showText={false} />
            <h1 className="text-5xl font-black text-white font-display tracking-tightest">
              Refik{" "}
              <span className="text-primary/70 font-light tracking-widest text-lg ml-1 uppercase">
                Core
              </span>
            </h1>
            <p className="text-foreground-muted font-display text-xs tracking-[0.4em] opacity-50 uppercase pt-1">
              Yönetim Terminali
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-surface border border-border rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden"
        >
          {/* Admin Badge */}
          <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[9px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-[0.2em] border-l border-b border-primary/20">
            Authorized Access
          </div>

          <div className="space-y-4 pt-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Phone Input */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] font-display pl-1 opactiy-80"
              >
                Telefon Numarası
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xx xxx xx xx"
                  required
                  className="w-full bg-background-dark/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 hover:border-primary/30 transition-all font-display placeholder:text-foreground-muted/50 cursor-text"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] font-display pl-1 opacity-80"
              >
                Yönetici Şifresi
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-background-dark/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 hover:border-primary/30 transition-all font-display placeholder:text-foreground-muted/50 cursor-text"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex items-center justify-center w-full h-16 bg-primary text-background-dark rounded-2xl font-bold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-display disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-primary/30"
          >
            {isLoading ? (
              <div className="size-6 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Oturumu Başlat</span>
                <LockKeyholeOpen className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm font-display">
          <button
            onClick={() => router.push("/login")}
            className="text-foreground-muted hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Standart Giriş Sayfasına Dön
          </button>
        </p>
      </div>
    </div>
  );
}
