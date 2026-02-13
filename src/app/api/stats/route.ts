import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Stats API Route
 *
 * Optimized to fetch only necessary data to avoid database locks.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 1. Get User specifically for streak and total read
    const userWithProgress = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        groupId: true,
        progress: {
          orderBy: { day: "desc" },
          select: {
            day: true,
            isCompleted: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!userWithProgress) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Calculate Statistics
    const totalPagesRead = userWithProgress.progress.length;

    // Calculate Streak
    let currentStreak = 0;
    if (userWithProgress.progress.length > 0) {
      let lastDay = userWithProgress.progress[0].day;
      currentStreak = 1;
      for (let i = 1; i < userWithProgress.progress.length; i++) {
        if (userWithProgress.progress[i].day === lastDay - 1) {
          currentStreak++;
          lastDay = userWithProgress.progress[i].day;
        } else {
          break;
        }
      }
    }

    // 3. Prepare Chart Data (Last 30 entries)
    const chartData = [...userWithProgress.progress]
      .reverse() // Back to ascending for chart
      .slice(-30)
      .map((p) => ({
        name: `Gün ${p.day}`,
        completed: p.isCompleted ? 1 : 0,
        fullDate: p.updatedAt.toISOString(),
      }));

    // 4. Leaderboard (Sequential query)
    let leaderboard: any[] = [];
    if (userWithProgress.groupId) {
      const groupMembers = await prisma.user.findMany({
        where: { groupId: userWithProgress.groupId },
        select: {
          id: true,
          name: true,
          progress: {
            where: { isCompleted: true },
            select: { id: true },
          },
        },
      });

      leaderboard = groupMembers
        .map((member) => ({
          id: member.id,
          name: member.name || "İsimsiz",
          totalRead: member.progress.length,
        }))
        .sort((a, b) => b.totalRead - a.totalRead)
        .slice(0, 5);
    }

    return NextResponse.json({
      stats: {
        totalRead: totalPagesRead,
        streak: currentStreak,
      },
      chartData,
      leaderboard,
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
