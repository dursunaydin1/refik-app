import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Login API Route
 *
 * Handles authentication via Name & Phone Number.
 * Now requires PASSWORD for ADMIN role.
 */
export async function POST(request: Request) {
  try {
    const { name, phoneNumber, password } = await request.json();

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

    if (!user && !name) {
      return NextResponse.json(
        { error: "Yeni kullanıcılar için isim gereklidir." },
        { status: 400 },
      );
    }

    // Determine if this attempt is for an Admin role
    const isTargetingAdmin = user ? user.role === "ADMIN" : isAdminByPhone;

    if (isTargetingAdmin) {
      if (!password) {
        return NextResponse.json(
          { error: "Yönetici girişi için şifre gereklidir." },
          { status: 401 },
        );
      }

      const defaultAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

      if (user && user.password) {
        // Verify existing password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
        }
      } else {
        // First time admin or no password set: setup from ENV
        if (password !== defaultAdminPassword) {
          return NextResponse.json(
            { error: "İlk kurulum şifresi hatalı." },
            { status: 401 },
          );
        }
        // Will be hashed and saved below during create or update
      }
    }

    // -------------------------------------------------------------------------
    // GROUP CREATION & ASSIGNMENT LOGIC
    // -------------------------------------------------------------------------
    let defaultGroup = await prisma.group.findFirst();

    // If no group exists and this is an Admin, create the default "Refik Grubu"
    if (!defaultGroup && isTargetingAdmin) {
      // We need a user ID to create a group (as adminId)
      // If user doesn't exist yet, we'll create the user first, then the group.
      // If user exists, we use their ID.
      const adminUserId = user ? user.id : null;

      if (adminUserId) {
        defaultGroup = await prisma.group.create({
          data: {
            name: "Refik Grubu",
            inviteCode: "REFIK2026",
            adminId: adminUserId,
          },
        });
      }
    }

    if (!user) {
      // Create new user
      const hashedPassword = isTargetingAdmin
        ? await bcrypt.hash(password, 10)
        : null;

      user = await prisma.user.create({
        data: {
          name,
          phoneNumber: trimmedPhone,
          role: isAdminByPhone ? "ADMIN" : "USER",
          password: hashedPassword,
          // Assign to group if one exists
          groupId: defaultGroup ? defaultGroup.id : null,
        },
      });

      // Special case: if this was the FIRST admin and we just created them,
      // create the group now that we have their ID.
      if (!defaultGroup && isAdminByPhone) {
        defaultGroup = await prisma.group.create({
          data: {
            name: "Refik Grubu",
            inviteCode: "REFIK2026",
            adminId: user.id,
          },
        });

        // Update user with the newly created group ID
        user = await prisma.user.update({
          where: { id: user.id },
          data: { groupId: defaultGroup.id },
        });
      }
    } else {
      // User exists, update role, password, or group if needed
      const updateData: any = {};
      let needsUpdate = false;

      if (user.role !== "ADMIN" && isAdminByPhone) {
        updateData.role = "ADMIN";
        needsUpdate = true;
      }

      if (isTargetingAdmin && !user.password) {
        updateData.password = await bcrypt.hash(password, 10);
        needsUpdate = true;
      }

      // Important: Assign to group if they don't have one
      if (!user.groupId && defaultGroup) {
        updateData.groupId = defaultGroup.id;
        needsUpdate = true;
      }

      if (name && user.name !== name) {
        updateData.name = name;
        needsUpdate = true;
      }

      if (needsUpdate) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
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
      { error: "Giriş yapılırken bir hata oluştu." },
      { status: 500 },
    );
  }
}
