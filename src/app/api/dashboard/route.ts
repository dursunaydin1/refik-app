import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Dashboard API Route
 *
 * Fetches group progress, user specific progress, and participant list.
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
                progress: true,
              },
            },
          },
        },
        progress: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 },
      );
    }

    // Calculate User Progress
    const userProgress = user.progress.length; // Number of days completed
    const dailyGoalProgress =
      userProgress > 0
        ? (user.progress[user.progress.length - 1].lastReadPage / 603) * 100
        : 0;

    // Calculate Group Stats
    const membersCount = user.group?.members.length || 0;
    const groupProgress =
      user.group?.members.reduce((acc, member) => {
        // Average progress across members
        const memberDays = member.progress.length;
        return acc + (memberDays / 30) * 100;
      }, 0) || 0;

    const stats = {
      userProgressPercentage: Math.round((userProgress / 30) * 100),
      totalGroupProgress: Math.round(groupProgress / (membersCount || 1)),
      dailyGoalProgress: userProgress, // Current day
      remainingPages: 20, // Simplified for MVP
      currentJuz:
        Math.floor(
          (user.progress[user.progress.length - 1]?.lastReadPage || 0) / 20,
        ) + 1,
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
