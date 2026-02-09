import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Progress API Route
 *
 * Saves a user's reading progress for a specific day/page.
 */
export async function POST(request: Request) {
  try {
    const { userId, pageNumber, dayNumber } = await request.json();

    if (!userId || !pageNumber) {
      return NextResponse.json(
        { error: "Kullanıcı ID ve sayfa numarası gereklidir." },
        { status: 400 },
      );
    }

    // Use upsert to create or update progress for the specific day
    const progress = await prisma.progress.upsert({
      where: {
        userId_day: {
          userId,
          day: dayNumber || 1, // Defaulting to day 1 if not provided
        },
      },
      update: {
        lastReadPage: pageNumber,
        isCompleted: true,
      },
      create: {
        userId,
        day: dayNumber || 1,
        lastReadPage: pageNumber,
        isCompleted: true,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json(
      { error: "İlerleme kaydedilirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
