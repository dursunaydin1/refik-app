import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Login API Route
 *
 * Handles authentication via Name & Phone Number.
 * In MVP, it creates a new user if one doesn't exist.
 */
export async function POST(request: Request) {
  try {
    const { name, phoneNumber } = await request.json();

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: "İsim ve telefon numarası gereklidir." },
        { status: 400 },
      );
    }

    // Find or Create User
    console.log("Login attempt for:", { name, phoneNumber });

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      console.log("User find result:", user);
    } catch (dbError) {
      console.error("Prisma Find Error:", dbError);
      throw new Error("Veritabanına bağlanılamadı.");
    }

    const configuredAdminPhone = process.env.ADMIN_PHONE?.replace(
      /['"]+/g,
      "",
    ).trim();
    const isAdminByPhone = phoneNumber.trim() === configuredAdminPhone;

    if (!user) {
      console.log("Creating new user...");
      try {
        // First, check if any group exists, if not create the default one
        let defaultGroup = await prisma.group.findFirst();

        user = await prisma.user.create({
          data: {
            name,
            phoneNumber,
            role: isAdminByPhone ? "ADMIN" : "USER",
          },
        });

        if (!defaultGroup && isAdminByPhone) {
          console.log("Creating default group for admin...");
          defaultGroup = await prisma.group.create({
            data: {
              name: "Refik Grubu",
              inviteCode: "REFIK2026",
              adminId: user.id,
            },
          });
        }

        if (defaultGroup) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { groupId: defaultGroup.id },
          });
        }
      } catch (createError) {
        console.error("Prisma User/Group Creation Error:", createError);
        throw new Error("Kullanıcı veya grup oluşturulamadı.");
      }
    } else {
      // User exists, check if they need admin upgrade or group joining
      let needsUpdate = false;
      const updateData: any = {};

      if (user.role !== "ADMIN" && isAdminByPhone) {
        updateData.role = "ADMIN";
        needsUpdate = true;
      }

      if (!user.groupId) {
        const defaultGroup = await prisma.group.findFirst();
        if (defaultGroup) {
          updateData.groupId = defaultGroup.id;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    }

    // Update name if different (optional)
    if (user.name !== name) {
      try {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name },
        });
      } catch (updateError) {
        console.error("Prisma Update Error:", updateError);
      }
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
      { error: error.message || "Giriş yapılırken bir hata oluştu." },
      { status: 500 },
    );
  }
}
