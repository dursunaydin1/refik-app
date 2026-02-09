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

    if (!user) {
      console.log("Creating new user...");
      try {
        user = await prisma.user.create({
          data: {
            name,
            phoneNumber,
            role: "USER", // Default role
          },
        });
        console.log("User created:", user);
      } catch (createError) {
        console.error("Prisma Create Error:", createError);
        throw new Error("Kullanıcı oluşturulamadı.");
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

    // In a real app, we would set a cookie/session here using Auth.js
    // For now, we return the user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
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
