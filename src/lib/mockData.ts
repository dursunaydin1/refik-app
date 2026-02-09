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
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCMcnxE5O2UNtO9NG5K2MOu1MnYVv6GUBVDj281afr8cwEGtapaeCPJ7qQ1MeWps_MCiAFr2YEbqmMiTKbI-Eo_N3btenZsaFQOjUX2ZlepAVBHcNDUMfjsq72dTLEUozkT9bAlGZZcArGRKgAIzeAbX2cpOPyWShxAXd3qig1R1W24ZDjHiOdpMPIgZ5cyNYP9pu22ky3i4yAbI7M7YDc0DbTcZEy23Th6cOSym7twGioP2666iYneNGS0O8MjbKl1AU331kfUQu_o",
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
