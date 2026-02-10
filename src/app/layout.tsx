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
  manifest: "/manifest.json",
  themeColor: "#09090b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Refik",
  },
  openGraph: {
    title: "Refik - Ramazan Okuma Arkadaşı",
    description: "Yoluna eşlik eden bir okuma arkadaşı.",
    type: "website",
  },
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${lexend.variable} ${lora.variable} antialiased bg-background-dark text-foreground`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
