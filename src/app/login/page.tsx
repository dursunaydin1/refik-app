"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowRight,
  Lock,
  KeyRound,
  LogIn,
  AlertCircle,
} from "lucide-react";

/**
 * Modern Secure Login Page
 *
 * Features:
 * 1. Phone number gating (Only invited members)
 * 2. Password requirement for ACTIVE users
 * 3. Redirect guidance for PENDING users
 * 4. Persistent sessions (via UserContext/Cookies)
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, user: currentUser } = useUser();

  const [step, setStep] = useState<1 | 2>(1); // 1: Phone, 2: Password
  const [name, setName] = useState(""); // Still allowed for backward compat if needed, but unused in gate
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, skip login page
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Check if phone is authorized and get status
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = await res.json();

      // Check if login was successful immediately (if no password required)
      if (res.ok && data.success) {
        login(data.user);
        router.push("/dashboard");
        return;
      }

      if (res.status === 403) {
        // Gated: Not invited or Pending
        if (data.status === "PENDING") {
          setError(
            "Hesabınız henüz aktif değil. Lütfen davet linkinizi kullanın.",
          );
        } else {
          setError(
            "Bu numara kayıtlı değil. Lütfen yöneticinizden davet isteyin.",
          );
        }
        return;
      }

      // If we reach here and it's 401, it means a password is required
      if (res.status === 401 && data.needsPassword) {
        setStep(2);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Giriş başarısız.");
      }

      // Success! Persist session
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

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <div className="flex flex-col items-center gap-1">
            <Logo size={90} showText={false} />
            <h1 className="text-6xl font-black text-white font-display tracking-[-0.05em]">
              Re<span className="text-primary">fik</span>
            </h1>
          </div>
          <p className="text-foreground-muted font-display text-base tracking-wide">
            {step === 1
              ? "Hoş geldiniz, devam etmek için numaranızı girin."
              : "Güvenliğiniz için şifrenizi girin."}
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          layout
          className="bg-surface border border-border rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNextStep}
                className="space-y-6"
              >
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest font-display pl-1">
                    Telefon Numarası
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xx xxx xx xx"
                      required
                      autoFocus
                      disabled={isLoading}
                      className="w-full bg-background-dark/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display placeholder:text-foreground-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex items-center justify-center w-full h-16 bg-primary text-background-dark rounded-2xl font-bold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <div className="size-6 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Devam Et</span>
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-primary uppercase tracking-widest font-display pl-1">
                      Şifre
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] text-foreground-muted hover:text-white transition-colors cursor-pointer"
                    >
                      Numarayı Değiştir
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoFocus
                      disabled={isLoading}
                      className="w-full bg-background-dark/50 border border-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-display placeholder:text-foreground-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex items-center justify-center w-full h-16 bg-primary text-background-dark rounded-2xl font-bold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <div className="size-6 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Giriş Yap</span>
                      <LogIn className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-center text-foreground-muted uppercase tracking-wider font-bold italic opacity-60">
            "Sizin en hayırlınız, Kur'an'ı öğrenen ve öğretendir."
          </p>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center opacity-10 text-[10px] font-bold uppercase tracking-[0.4em] pointer-events-none">
        Refik Spiritual Companion
      </div>
    </div>
  );
}
