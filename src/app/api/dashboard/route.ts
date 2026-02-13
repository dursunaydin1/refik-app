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

    // 1. Get User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        groupId: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 },
      );
    }

    // 2. Get User Progress (Sequential)
    const userProgressCount = await prisma.progress.count({
      where: {
        userId: user.id,
        updatedAt: { gte: RAMADAN_START, lte: RAMADAN_END },
      },
    });

    // 3. Get Group Members and their progress counts
    let members: any[] = [];
    let groupProgressSum = 0;
    let membersCount = 0;

    if (user.groupId) {
      const groupWithMembers = await prisma.group.findUnique({
        where: { id: user.groupId },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              progress: {
                where: {
                  updatedAt: { gte: RAMADAN_START, lte: RAMADAN_END },
                },
                select: { id: true },
              },
            },
          },
        },
      });

      if (groupWithMembers) {
        membersCount = groupWithMembers.members.length;
        members = groupWithMembers.members.map((m) => {
          const mProgressCount = m.progress.length;
          groupProgressSum += (mProgressCount / 30) * 100;

          return {
            id: m.id,
            name: m.name,
            progress: Math.round((mProgressCount / 30) * 100),
            status:
              mProgressCount >= userProgressCount ? "completed" : "reading",
          };
        });
      }
    }

    const ramadanStatus = getRamadanStatus();

    const stats = {
      userProgressPercentage: Math.round((userProgressCount / 30) * 100),
      totalGroupProgress: Math.round(groupProgressSum / (membersCount || 1)),
      dailyGoalProgress: userProgressCount,
      remainingPages: 20,
      currentJuz:
        ramadanStatus === "before"
          ? 1
          : ramadanStatus === "after"
            ? 30
            : getRamadanDay(),
      ramadanStatus,
      members,
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
