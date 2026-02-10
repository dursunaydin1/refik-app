import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRamadanStatus, getRamadanDay } from "@/lib/ramadanDates";

/**
 * Progress API Route
 *
 * Saves a user's reading progress for a specific day/page.
 * Only allows saves during Ramadan period.
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

    // Block progress saves outside Ramadan
    const status = getRamadanStatus();
    if (status === "before") {
      return NextResponse.json(
        { error: "Ramazan henüz başlamadı. İlerleme kaydedilemez." },
        { status: 403 },
      );
    }

    // Validate day number matches current Ramadan day
    const currentDay = getRamadanDay();
    const targetDay = dayNumber || currentDay;

    // Don't allow saving for future days
    if (targetDay > currentDay && status === "during") {
      return NextResponse.json(
        { error: "Gelecek günler için ilerleme kaydedilemez." },
        { status: 403 },
      );
    }

    // Use upsert to create or update progress for the specific day
    const progress = await prisma.progress.upsert({
      where: {
        userId_day: {
          userId,
          day: targetDay,
        },
      },
      update: {
        lastReadPage: pageNumber,
        isCompleted: true,
      },
      create: {
        userId,
        day: targetDay,
        lastReadPage: pageNumber,
        isCompleted: true,
      },
    });

    // Check for Hatim Completion (30 Days)
    const completedCount = await prisma.progress.count({
      where: {
        userId,
        isCompleted: true,
      },
    });

    const hatimCompleted = completedCount >= 30;

    return NextResponse.json({ success: true, progress, hatimCompleted });
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json(
      { error: "İlerleme kaydedilirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
