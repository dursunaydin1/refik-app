import type { Metadata } from "next";
import { Lexend, Lora } from "next/font/google";
import "./globals.css";

/**
 * Lexend - Modern sans-serif font
 * Used for: UI elements, headings, buttons
 */
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/**
 * Lora - Elegant serif font
 * Used for: Quran meal reading text
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Refik - Ramazan Okuma Arkadaşı",
  description:
    "Ramazan boyunca Kur'an mealini arkadaşlarınla birlikte, kaldığın yerden ve sakin bir şekilde takip et.",
  keywords: ["kuran", "meal", "ramazan", "hatim", "okuma", "refik"],
  authors: [{ name: "Refik Team" }],
  openGraph: {
    title: "Refik - Ramazan Okuma Arkadaşı",
    description: "Yoluna eşlik eden bir okuma arkadaşı.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${lexend.variable} ${lora.variable} antialiased bg-background-dark text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
