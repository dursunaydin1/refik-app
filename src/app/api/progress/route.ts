import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Progress API Route
 *
 * Saves or updates the reading progress for a user.
 */
export async function POST(request: Request) {
  try {
    const { userId, day, lastReadPage, isCompleted } = await request.json();

    if (!userId || day === undefined) {
      return NextResponse.json(
        { error: "Kullanıcı ID ve gün bilgisi gereklidir." },
        { status: 400 },
      );
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_day: {
          userId,
          day,
        },
      },
      update: {
        lastReadPage,
        isCompleted,
      },
      create: {
        userId,
        day,
        lastReadPage,
        isCompleted,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress Save Error:", error);
    return NextResponse.json(
      { error: "İlerleme kaydedilirken bir hata oluştu." },
      { status: 500 },
    );
  }
}

/**
 * GET Progress
 * Fetches progress for a specific user and day.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const day = searchParams.get("day");

  if (!userId || !day) {
    return NextResponse.json({ error: "Eksik parametre." }, { status: 400 });
  }

  try {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_day: {
          userId,
          day: parseInt(day),
        },
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}
