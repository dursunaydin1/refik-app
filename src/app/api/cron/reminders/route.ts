import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import webPush from "web-push";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@refikapp.com";

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function GET(request: Request) {
  try {
    // 1. Security Check (Optional: check for Vercel Cron Secret)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    // 2. Identify the current day (Ramazan logic)
    // For simplicity, we can fetch all users and check their today's progress
    // In a real app, you'd calculate the current day since start of Ramazan
    const today = 1; // Placeholder: Real logic would find the current day

    // 3. Find users who haven't completed today's reading
    const nonCompletedUsers = await prisma.user.findMany({
      where: {
        progress: {
          some: {
            day: today,
            isCompleted: false,
          },
        },
      },
      include: {
        subscriptions: true,
      },
    });

    let sentCount = 0;
    const payload = JSON.stringify({
      title: "Okuma Vakti! 📖",
      body: "Ramazan sayfan seni bekliyor. Bugünün okumasını henüz yapmadın.",
    });

    for (const user of nonCompletedUsers) {
      for (const sub of user.subscriptions) {
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
          sentCount++;
        } catch (error: any) {
          if (error.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent: sentCount,
      targetUsers: nonCompletedUsers.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
