import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { userId, name, password, currentPassword } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Update Name
    if (name && name.trim() !== "") {
      updateData.name = name;
    }

    // Update Password
    if (password) {
      // If user already has a password, verify current password
      if (user.password && !currentPassword) {
        return NextResponse.json(
          { error: "Mevcut şifrenizi girmelisiniz." },
          { status: 400 },
        );
      }

      if (user.password && currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json(
            { error: "Mevcut şifre hatalı." },
            { status: 400 },
          );
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        hasPassword: !!updatedUser.password,
      },
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
