"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function ActivationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Davet linki geçersiz veya eksik.");
    }
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("error");
        setError(data.error || "Aktivasyon sırasında bir hata oluştu.");
      }
    } catch (err) {
      setStatus("error");
      setError("Sunucuya bağlanılamadı.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-4 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-outfit">
          Tebrikler!
        </h2>
        <p className="text-gray-600">
          Hesabınız başarıyla aktifleştirildi. Giriş ekranına
          yönlendiriliyorsunuz...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 font-outfit">
          Hoş Geldiniz
        </h2>
        <p className="text-gray-600 mt-2">
          Lütfen hesabınız için güvenli bir şifre belirleyin.
        </p>
      </div>

      <form onSubmit={handleActivate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yeni Şifre
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Şifre Tekrar
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={status === "loading" || !token}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Hesabımı Aktifleştir"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl space-y-8"
      >
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold tracking-tight text-gray-900 font-outfit">
            Re<span className="text-emerald-600">fik</span>
          </span>

          <div className="mt-8 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-50 overflow-hidden shadow-inner bg-gray-100">
              <img
                src="/images/img.png"
                alt="Dursun AYDIN"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          }
        >
          <ActivationForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
