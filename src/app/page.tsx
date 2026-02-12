import React from "react";
import Logo from "@/components/Logo";
import { MOCK_INVITER, MOCK_FEATURES } from "@/lib/mockData";
import { Sparkles, ArrowRight, Users, Zap, Heart } from "lucide-react";

/**
 * Landing Page (Giriş/Karşılama Sayfası)
 *
 * This is the first screen users see when they visit the site or click an invite link.
 */
export default function LandingPage() {
  // Icon mapping for mock features
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "groups":
        return <Users className="w-6 h-6 text-primary" />;
      case "auto_awesome":
        return <Zap className="w-6 h-6 text-primary" />;
      case "volunteer_activism":
        return <Heart className="w-6 h-6 text-primary" />;
      default:
        return <Sparkles className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden gradient-mesh">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
          <Logo />
          <button className="text-sm font-medium text-foreground-muted hover:text-primary transition-colors font-display cursor-pointer">
            Hakkımızda
          </button>
        </header>

        {/* Main Content */}
        <main className="grow flex items-center justify-center px-6">
          <div className="max-w-2xl w-full text-center space-y-12">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium font-display mx-auto">
                <Sparkles className="w-4 h-4" />
                Ramazan Yolculuğu
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white font-display">
                Ramazan boyunca Kur’an mealini birlikte takip ediyoruz.
              </h1>

              {/* Inviter Info (Mock Data) */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-emerald-500/20 shadow-xl object-cover"
                    src={MOCK_INVITER.avatarUrl}
                    alt={MOCK_INVITER.name}
                  />
                </div>
                <p className="text-lg text-foreground-muted font-display">
                  Bu yolculuğa{" "}
                  <span className="font-semibold text-primary">
                    {MOCK_INVITER.name}
                  </span>{" "}
                  davet etti.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col items-center gap-6 text-center">
              <a
                href="/login"
                className="group relative flex items-center justify-center w-full max-w-sm h-16 bg-primary text-background-dark rounded-xl font-bold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-display cursor-pointer"
              >
                <span className="truncate">Katıl ve Başla</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <p className="text-sm text-foreground-muted max-w-xs mx-auto italic font-display">
                "Huzurlu, yargısız ve samimi bir okuma deneyimi için
                tasarlandı."
              </p>
            </div>
          </div>
        </main>

        {/* Feature Cards */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="p-6 rounded-xl bg-surface border border-border space-y-4 transition-colors hover:bg-surface-hover"
              >
                {getIcon(feature.icon)}
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground-muted font-display leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto px-6 py-12 mt-auto border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-8">
              <a
                className="text-sm text-foreground-muted hover:text-primary transition-colors font-display"
                href="#"
              >
                Gizlilik
              </a>
              <a
                className="text-sm text-foreground-muted hover:text-primary transition-colors font-display"
                href="#"
              >
                Kullanım Şartları
              </a>
              <a
                className="text-sm text-foreground-muted hover:text-primary transition-colors font-display"
                href="#"
              >
                İletişim
              </a>
            </div>
            <p className="text-sm text-foreground-muted font-display">
              © 2024 Refik. Huzurlu ve yargısız bir Kur'an yolculuğu.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
