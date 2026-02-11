import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve şifre gereklidir." },
        { status: 400 },
      );
    }

    // Find user by valid token
    const user = await prisma.user.findUnique({
      where: { activationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş davet linki." },
        { status: 400 },
      );
    }

    // Check expiration
    if (user.tokenExpires && user.tokenExpires < new Date()) {
      return NextResponse.json(
        { error: "Davet linkinin süresi dolmuş." },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Activate user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        status: "ACTIVE",
        activationToken: null, // One-time use
        tokenExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Hesabınız başarıyla aktifleştirildi.",
    });
  } catch (error: any) {
    console.error("Activation API Error:", error);
    return NextResponse.json(
      { error: "Aktivasyon sırasında bir hata oluştu." },
      { status: 500 },
    );
  }
}
