import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { action, adminId, groupId, memberId, newName } =
      await request.json();

    if (!adminId || !groupId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify Admin
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { admin: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.adminId !== adminId) {
      return NextResponse.json(
        { error: "Unauthorized: You are not the admin." },
        { status: 403 },
      );
    }

    if (action === "REMOVE_MEMBER") {
      if (!memberId) {
        return NextResponse.json(
          { error: "Member ID required" },
          { status: 400 },
        );
      }

      if (memberId === adminId) {
        return NextResponse.json(
          { error: "Admin cannot remove themselves." },
          { status: 400 },
        );
      }

      // Remove user from group (set groupId to null)
      await prisma.user.update({
        where: { id: memberId },
        data: { groupId: null },
      });

      // Also delete their progress?
      // Strategy: Keep progress for personal stats, but they are out of the group leaderboard.
      // Actually, maybe we should keep them linked but inactive? No, 'remove' usually means kick.

      return NextResponse.json({ success: true, message: "Member removed." });
    }

    if (action === "RENAME_GROUP") {
      if (!newName) {
        return NextResponse.json(
          { error: "New name required" },
          { status: 400 },
        );
      }

      await prisma.group.update({
        where: { id: groupId },
        data: { name: newName },
      });

      return NextResponse.json({ success: true, message: "Group renamed." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Group Manage Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
