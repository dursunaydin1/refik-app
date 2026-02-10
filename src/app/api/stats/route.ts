import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        group: {
          include: {
            members: {
              include: {
                progress: true,
              },
            },
          },
        },
        progress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Calculate Statistics
    const totalPagesRead = user.progress.length; // Assuming 1 progress entry = 1 page/day completed

    // Calculate Streak
    // Sort progress by day descending
    const sortedProgress = [...user.progress].sort((a, b) => b.day - a.day);
    let currentStreak = 0;
    // This is a simplified streak calculation based on "day" numbers
    // In a real calendar app, we'd check dates.
    // Assuming 'day' increments by 1 for each day of Ramazan.
    if (sortedProgress.length > 0) {
      // Simple logic: if last read was today or yesterday (relative to max day in system), count streak
      // For this MVP, we will just count consecutive progress entries from the latest one backwards
      let lastDay = sortedProgress[0].day;
      currentStreak = 1;
      for (let i = 1; i < sortedProgress.length; i++) {
        if (sortedProgress[i].day === lastDay - 1) {
          currentStreak++;
          lastDay = sortedProgress[i].day;
        } else {
          break;
        }
      }
    }

    // 2. Prepare Chart Data (Last 30 entries)
    // We want to show activity. Map progress to a simple array.
    // For recharts: [{ name: 'Gün 1', pages: 1 }, ...]
    const chartData = user.progress
      .sort((a, b) => a.day - b.day)
      .slice(-30) // Last 30 records
      .map((p) => ({
        name: `Gün ${p.day}`,
        completed: p.isCompleted ? 1 : 0,
        fullDate: p.updatedAt.toISOString(),
      }));

    // 3. Leaderboard
    // Rank group members by total pages read
    let leaderboard: any[] = [];
    if (user.group) {
      leaderboard = user.group.members
        .map((member) => ({
          id: member.id,
          name: member.name || "İsimsiz",
          totalRead: member.progress.filter((p) => p.isCompleted).length,
        }))
        .sort((a, b) => b.totalRead - a.totalRead) // Descending
        .slice(0, 5); // Top 5
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
