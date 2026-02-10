import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Group Invite Code API
 *
 * Returns the invite code for the user's group.
 * Only accessible if the user is an ADMIN.
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { group: true },
    });

    if (!user || user.role !== "ADMIN" || !user.group) {
      return NextResponse.json(
        { error: "Yetkisiz erişim veya grup bulunamadı." },
        { status: 403 },
      );
    }

    return NextResponse.json({ inviteCode: user.group.inviteCode });
  } catch (error) {
    console.error("Invite Code API Error:", error);
    return NextResponse.json(
      { error: "Davet kodu alınırken bir hata oluştu." },
      { status: 500 },
    );
  }
}
