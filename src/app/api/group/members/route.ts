import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Group ID required" }, { status: 400 });
    }

    const members = await prisma.user.findMany({
      where: { groupId },
      select: {
        id: true,
        name: true,
        role: true,
        phoneNumber: true,
      },
    });

    return NextResponse.json({ members });
  } catch (error: any) {
    console.error("Fetch Members Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
