import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getRamadanDay,
  getRamadanStatus,
  RAMADAN_START,
  RAMADAN_END,
} from "@/lib/ramadanDates";

/**
 * Dashboard API Route
 *
 * Fetches group progress, user specific progress, and participant list.
 * Only counts progress entries within the Ramadan 2026 date range.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID gereklidir." },
        { status: 400 },
      );
    }

    // Get User and their Group
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        group: {
          include: {
            members: {
              include: {
                progress: {
                  where: {
                    updatedAt: { gte: RAMADAN_START, lte: RAMADAN_END },
                  },
                },
              },
            },
          },
        },
        progress: {
          where: {
            updatedAt: { gte: RAMADAN_START, lte: RAMADAN_END },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 },
      );
    }

    // Only count progress within Ramadan dates
    const userProgress = user.progress.length;

    // Calculate Group Stats
    const membersCount = user.group?.members.length || 0;
    const groupProgress =
      user.group?.members.reduce((acc, member) => {
        const memberDays = member.progress.length;
        return acc + (memberDays / 30) * 100;
      }, 0) || 0;

    const ramadanStatus = getRamadanStatus();

    const stats = {
      userProgressPercentage: Math.round((userProgress / 30) * 100),
      totalGroupProgress: Math.round(groupProgress / (membersCount || 1)),
      dailyGoalProgress: userProgress,
      remainingPages: 20,
      currentJuz:
        ramadanStatus === "before"
          ? 1
          : ramadanStatus === "after"
            ? 30
            : getRamadanDay(),
      ramadanStatus,
      members:
        user.group?.members.map((m) => ({
          id: m.id,
          name: m.name,
          progress: Math.round((m.progress.length / 30) * 100),
          status: m.progress.length >= userProgress ? "completed" : "reading",
        })) || [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Veriler alınırken bir hata oluştu." },
      { status: 500 },
    );
  }
}
