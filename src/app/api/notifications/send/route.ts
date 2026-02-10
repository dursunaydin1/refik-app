import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import webPush from "web-push";

// Configure web-push with VAPID keys
// In a real app, these should be loaded from process.env
// For now, we will use placeholders or load them if available
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@refikapp.com";

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST(request: Request) {
  try {
    const { userId, title, body } = await request.json();

    // Verification: Only Admin should be able to trigger this in production
    // For now, we will allow it for testing purposes

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: "VAPID keys not configured" },
        { status: 500 },
      );
    }

    // 1. Get subscriptions for the target user(s)
    let subscriptions;
    if (userId === "all") {
      subscriptions = await prisma.pushSubscription.findMany();
    } else {
      subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });
    }

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { message: "No subscriptions found" },
        { status: 200 },
      );
    }

    // 2. Send notifications
    const payload = JSON.stringify({ title, body });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload,
          );
          return { status: "fulfilled", id: sub.id };
        } catch (error: any) {
          // If 410 Gone, remove subscription
          if (error.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
          throw error;
        }
      }),
    );

    const successCount = results.filter(
      (r: any) => r.status === "fulfilled",
    ).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: subscriptions.length,
    });
  } catch (error: any) {
    console.error("Notification send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
