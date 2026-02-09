export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gradient-mesh">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary logo-glow">
            <span className="material-symbols-outlined text-5xl">
              auto_awesome
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white font-display">
            Refik
          </h1>
        </div>

        {/* Brand Narrative */}
        <div className="space-y-4">
          <p className="text-xl font-medium text-primary uppercase tracking-[0.2em]">
            Tasarım Sistemi Testi
          </p>
          <p className="text-2xl italic text-foreground-muted font-serif leading-relaxed px-4">
            "Yoluna eşlik eden bir okuma arkadaşı."
          </p>
        </div>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Card 1: Colors & Typography */}
          <div className="p-6 rounded-xl bg-surface border border-border text-left space-y-3">
            <h3 className="font-bold text-lg text-white">Renkler & Fontlar</h3>
            <div className="flex gap-2">
              <div
                className="size-8 rounded-full bg-primary"
                title="Primary"
              ></div>
              <div
                className="size-8 rounded-full bg-accent"
                title="Accent"
              ></div>
              <div
                className="size-8 rounded-full bg-background-dark border border-border"
                title="BG Dark"
              ></div>
            </div>
            <p className="text-sm text-foreground-muted">
              Yazı tipi:{" "}
              <span className="font-display font-bold">Lexend (Display)</span>
            </p>
          </div>

          {/* Card 2: Interaction */}
          <div className="p-6 rounded-xl bg-surface border border-border text-left space-y-4">
            <h3 className="font-bold text-lg text-white">Etkileşim</h3>
            <button className="w-full bg-primary text-background-dark font-bold py-3 rounded-full glow-primary transition-all active:scale-95">
              Katıl ve Başla
            </button>
            <p className="text-xs text-center text-foreground-muted italic">
              Buton: rounded-full + glow + scale
            </p>
          </div>
        </div>

        {/* Reading Text Test */}
        <div className="mt-12 p-8 rounded-2xl bg-surface/50 border border-border/30 text-left">
          <h4 className="text-xs uppercase tracking-widest text-primary font-bold mb-4">
            Okuma Metni Testi (Lora)
          </h4>
          <article className="reading-text text-foreground-muted">
            Bu öyle bir kitaptır ki, ayetleri muhkem kılınmış, sonra da her
            şeyden haberdar olan hikmet sahibi Allah tarafından ayrı ayrı
            açıklanmıştır.
          </article>
        </div>

        {/* Navigation Hint */}
        <p className="text-sm text-foreground-muted pt-8">
          Next.js 16 + Tailwind v4 + TypeScript
        </p>
      </div>
    </main>
  );
}
