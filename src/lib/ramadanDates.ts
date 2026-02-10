/**
 * Ramadan 2026 Calendar Utility for Turkey
 *
 * Diyanet İşleri Başkanlığı takvimine göre:
 * - Ramazan Başlangıcı: 19 Şubat 2026 (Perşembe)
 * - Ramazan Süresi: 29 gün
 * - Ramazan Sonu: 19 Mart 2026 (Perşembe, son oruç)
 * - Bayram: 20 Mart 2026
 */

// Ramazan'ın 1. günü (Türkiye saat dilimi)
export const RAMADAN_START = new Date("2026-02-19T00:00:00+03:00");
export const RAMADAN_DAYS = 29; // 2026 yılı 29 gün
export const RAMADAN_END = new Date("2026-03-19T23:59:59+03:00");

/**
 * Bugünün Ramazan'daki gün numarasını döndürür.
 * Ramazan başlamadıysa 0, bittiyse 30 döner.
 */
export function getRamadanDay(): number {
  const now = new Date();

  // Ramazan henüz başlamadı
  if (now < RAMADAN_START) {
    return 0;
  }

  // Ramazan bitti
  if (now > RAMADAN_END) {
    return 30; // Hatim tamamlandı sinyali
  }

  // Ramazan devam ediyor
  const diffMs = now.getTime() - RAMADAN_START.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // 1-indexed (1. gün, 2. gün, ...)
}

/**
 * Ramazan'a kaç gün kaldığını döndürür.
 * Ramazan başladıysa 0 döner.
 */
export function getDaysUntilRamadan(): number {
  const now = new Date();
  if (now >= RAMADAN_START) return 0;

  const diffMs = RAMADAN_START.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Ramazan durumunu döndürür.
 */
export function getRamadanStatus(): "before" | "during" | "after" {
  const now = new Date();
  if (now < RAMADAN_START) return "before";
  if (now > RAMADAN_END) return "after";
  return "during";
}

/**
 * Belirli bir günün Cüz numarasını döndürür.
 * 30 cüz / 29 gün = Son gün 2 cüz okunur (29 ve 30).
 * Basitlik için: gün = cüz (1-29), son gün ekstra cüz 30.
 */
export function getJuzForDay(day: number): number[] {
  if (day <= 0 || day > 30) return [];
  if (day === 29) return [29, 30]; // Son gün 2 cüz
  return [day];
}
