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
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCMcnxE5O2UNtO9NG5K2MOu1MnYVv6GUBVDj281afr8cwEGtapaeCPJ7qQ1MeWps_MCiAFr2YEbqyMiTKbI-Eo_N3btenZsaFQOjUX2ZlepAVBHcNDUMfjsq72dTLEUozkT9bAlGZZcArGRKgAIzeAbX2cpOPyWShxAXd3qig1R1W24ZDjHiOdpMPIgZ5cyNYP9pu22ky3i4yAbI7M7YDc0DbTcZEy23Th6cOSym7twGioP2666iYneNGS0O8MjbKl1AU331kfUQu_o",
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

export const MOCK_QURAN_PAGE = {
  juz: 12,
  pageNumber: 224,
  suraName: "Hûd Suresi",
  verses: [
    {
      number: 1,
      text: "Rahman ve Rahim olan Allah'ın adıyla. Elif. Lâm. Râ. Bu öyle bir kitaptır ki, ayetleri muhkem kılınmış, sonra da her şeyden haberdar olan hikmet sahibi Allah tarafından ayrı ayrı açıklanmıştır.",
    },
    {
      number: 2,
      text: "Ta ki, Allah'tan başkasına kulluk etmeyesiniz. Kuşkusuz ben size O'nun katından gönderilmiş bir uyarıcı ve müjdeleyiciyim.",
    },
    {
      number: 3,
      text: "Ve Rabbinizden bağışlanma dileyin, sonra O'na tövbe edin ki, sizi belirlenmiş bir süreye kadar güzel bir şekilde yaşatsın ve her fazilet sahibine faziletinin karşılığını versin. Eğer yüz çevirirseniz, ben sizin adınıza büyük bir günün azabından korkarım.",
    },
    {
      number: 4,
      text: "Dönüşünüz yalnız Allah'adır. O, her şeye kadirdir. Haberiniz olsun ki, onlar O'ndan gizlenmek için göğüslerini dürerler. Bilmiş olun ki, onlar örtülerine büründükleri zaman bile Allah onların neyi gizlediklerini ve neyi açığa vurduklarını bilir. Çünkü O, gönüllerin özünü bilendir.",
    },
    {
      number: 5,
      text: "Yeryüzünde hiçbir canlı yoktur ki, rızkı Allah'a ait olmasın. O, onun durduğu yeri de, emanet edildiği yeri de bilir. Bunların hepsi apaçık bir kitaptadır.",
    },
  ],
};
