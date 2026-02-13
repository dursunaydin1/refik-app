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

    const normalizePhone = (p: string) => {
      let digits = p.replace(/\D/g, "");
      if (digits.startsWith("90")) digits = digits.slice(2);
      if (digits.startsWith("0")) digits = digits.slice(1);
      return digits;
    };

    const trimmedPhone = phoneNumber.trim();
    const configuredAdminPhone = process.env.ADMIN_PHONE;
    const normalizedInput = normalizePhone(trimmedPhone);
    const normalizedAdmin = configuredAdminPhone
      ? normalizePhone(configuredAdminPhone)
      : "";
    const isAdminByPhone =
      normalizedAdmin !== "" && normalizedInput === normalizedAdmin;

    /*
    console.log("Login Attempt:", {
      normalizedInput,
      normalizedAdmin,
      isAdminByPhone,
    });
    */

    // Find User
    let user = await prisma.user.findUnique({
      where: { phoneNumber: trimmedPhone },
    });

    // Also check by partial match if not found by exact string
    if (!user) {
      user = await prisma.user.findFirst({
        where: { phoneNumber: { contains: normalizedInput } },
      });
    }

    // BOOTSTRAP/UPGRADE: Ensure the configured admin is always ACTIVE and has ADMIN role
    if (isAdminByPhone) {
      if (!user) {
        // console.log("Bootstrapping Admin User...");
        user = await prisma.user.create({
          data: {
            phoneNumber: trimmedPhone,
            name: "Admin",
            role: "ADMIN",
            status: "ACTIVE",
          },
        });
      } else {
        // console.log("Upgrading existing user to Admin...");
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.name === "Misafir" || !user.name ? "Admin" : user.name,
            role: "ADMIN",
            status: "ACTIVE",
          },
        });
      }
    }

    // GATE: If user is not in the system, deny access
    if (!user) {
      // console.log("Access Denied: User not found", trimmedPhone);
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
