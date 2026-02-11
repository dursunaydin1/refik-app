import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { phoneNumber, password } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Telefon numarası gereklidir." },
        { status: 400 },
      );
    }

    const trimmedPhone = phoneNumber.trim();
    const configuredAdminPhone = process.env.ADMIN_PHONE?.replace(
      /['"]+/g,
      "",
    ).trim();
    const isAdminByPhone = trimmedPhone === configuredAdminPhone;

    // Find User
    let user = await prisma.user.findUnique({
      where: { phoneNumber: trimmedPhone },
    });

    // GATE: If user is not in the system, deny access
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Bu numara kayıtlı değil. Lütfen yöneticinizden davet isteyin.",
        },
        { status: 403 },
      );
    }

    // Handle ACTIVE users (Admin or already activated members)
    if (user.status === "ACTIVE") {
      if (!password) {
        return NextResponse.json(
          { error: "Şifre gereklidir." },
          { status: 401 },
        );
      }

      // Special case: Admin first time or setup from ENV
      const defaultAdminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (isAdminByPhone && !user.password) {
        if (password === defaultAdminPassword) {
          // First time setup: hash and save
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
          });
        } else {
          return NextResponse.json(
            { error: "İlk kurulum şifresi hatalı." },
            { status: 401 },
          );
        }
      } else if (user.password) {
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
        }
      }
    } else if (user.status === "PENDING") {
      return NextResponse.json(
        {
          status: "PENDING",
          message:
            "Hesabınız henüz aktif değil. Lütfen size gönderilen davet linkini kullanın.",
        },
        { status: 403 },
      );
    }

    // Update group assignment if missing
    let defaultGroup = await prisma.group.findFirst();
    if (!defaultGroup && user.role === "ADMIN") {
      defaultGroup = await prisma.group.create({
        data: {
          name: "Refik Grubu",
          inviteCode: "REFIK2026",
          adminId: user.id,
        },
      });
    }

    if (!user.groupId && defaultGroup) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { groupId: defaultGroup.id },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        groupId: user.groupId,
      },
    });
  } catch (error: any) {
    console.error("Login Route Error:", error);
    return NextResponse.json(
      { error: "Giriş yapılırken bir hata oluştu." },
      { status: 500 },
    );
  }
}
