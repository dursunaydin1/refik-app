import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { name, phoneNumber } = await request.json();

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: "İsim ve telefon numarası gereklidir." },
        { status: 400 },
      );
    }

    const trimmedPhone = phoneNumber.trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: trimmedPhone },
    });

    if (existingUser) {
      if (existingUser.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Bu numara zaten aktif bir üyeye ait." },
          { status: 400 },
        );
      }

      // If user is pending, we can re-generate the token
      const newToken = crypto.randomBytes(32).toString("hex");
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          activationToken: newToken,
          tokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      return NextResponse.json({
        success: true,
        inviteLink: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/activate?token=${newToken}`,
      });
    }

    // Create new user with PENDING status
    const token = crypto.randomBytes(32).toString("hex");
    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber: trimmedPhone,
        status: "PENDING",
        activationToken: token,
        tokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      inviteLink: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/activate?token=${token}`,
    });
  } catch (error: any) {
    console.error("Invite API Error:", error);
    // Return specific error message for easier debugging if possible
    return NextResponse.json(
      {
        error: "Davet oluşturulurken sunucu hatası oluştu.",
        details: error.message || "Bilinmeyen hata",
      },
      { status: 500 },
    );
  }
}
