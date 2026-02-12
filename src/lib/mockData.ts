/**
 * Mock Data for Refik App
 *
 * Used during development for Landing Page, Dashboard, and Admin views.
 * Will be replaced by actual database calls (Prisma) in later steps.
 */

export const MOCK_APP_STATE = {
  activeDay: 12, // Ramazan'ın 12. günü
};

export const MOCK_INVITER = {
  name: "Dursun AYDIN",
  avatarUrl: "/images/img.png",
};

export const MOCK_FEATURES = [
  {
    id: "community",
    icon: "groups",
    title: "Toplulukla Oku",
    description:
      "Okuma sürecini dostlarınla paylaş, beraber hatim yolculuğuna çık.",
  },
  {
    id: "tracking",
    icon: "auto_awesome",
    title: "Kolay Takip",
    description:
      "Her gün için belirlenen mealleri kolayca oku, nerede kaldığını unutma.",
  },
  {
    id: "zen",
    icon: "volunteer_activism",
    title: "Yargısız Alan",
    description:
      "Sadece okumaya odaklan, huzurlu ve sade bir arayüzle maneviyatı hisset.",
  },
];

export const MOCK_GROUP_MEMBERS = [
  {
    id: "1",
    name: "Dursun AYDIN",
    avatarUrl: MOCK_INVITER.avatarUrl,
    progress: 85,
    status: "reading", // reading, completed, not_started
    lastRead: "Bakara 282",
  },
  {
    id: "2",
    name: "Ahmet Yılmaz",
    avatarUrl: "https://i.pravatar.cc/150?u=ahmet",
    progress: 100,
    status: "completed",
    lastRead: "Ali İmran 200",
  },
  {
    id: "3",
    name: "Mehmet Demir",
    avatarUrl: "https://i.pravatar.cc/150?u=mehmet",
    progress: 40,
    status: "reading",
    lastRead: "Bakara 120",
  },
  {
    id: "4",
    name: "Ayşe Kaya",
    avatarUrl: "https://i.pravatar.cc/150?u=ayse",
    progress: 0,
    status: "not_started",
    lastRead: "-",
  },
];

export const MOCK_DASHBOARD_STATS = {
  totalGroupProgress: 65,
  dailyGoalProgress: 14, // 14 sayfa / 20 sayfa
  remainingPages: 6,
  currentJuz: 12,
};

// MOCK_QURAN_PAGE has been removed. Real Quran data is now
// fetched from alquran.cloud API via src/lib/quranService.ts
