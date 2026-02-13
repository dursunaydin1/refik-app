"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Bell, BellRing, BellOff } from "lucide-react";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
      });
    }
  }, []);

  const subscribeToNotifications = async () => {
    if (!registration) {
      console.log("Service worker not registered yet");
      return;
    }

    try {
      if (!PUBLIC_KEY) {
        console.error("VAPID Public Key not found");
        alert("Bildirim anahtarı bulunamadı.");
        return;
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      });

      setSubscription(sub);
      setIsSubscribed(true);

      if (user?.id) {
        await saveSubscription(sub);
      }

      console.log("Web Push Subscribed!", sub);
    } catch (error) {
      console.error("Failed to subscribe user: ", error);
      alert("Bildirim izni alınamadı: " + error);
    }
  };

  const saveSubscription = async (sub: PushSubscription) => {
    if (!user?.id) return;

    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          subscription: sub,
        }),
      });
    } catch (err) {
      console.error("Failed to save subscription to server", err);
    }
  };

  return (
    <div className="p-4 bg-surface border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white font-display">Bildirimler</h3>
          <p className="text-xs text-foreground-muted font-display">
            Günlük okuma hatırlatmaları
          </p>
        </div>
      </div>

      {!isSubscribed ? (
        <button
          onClick={subscribeToNotifications}
          className="w-full bg-surface-lighter hover:bg-surface-hover border border-border text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer font-display flex items-center justify-center gap-2 active:scale-95"
        >
          Bildirimleri Aç
        </button>
      ) : (
        <div className="flex gap-2">
          <div className="grow bg-primary/10 border border-primary/20 text-primary font-bold py-3 px-4 rounded-xl font-display flex items-center justify-center gap-2">
            <BellRing className="w-5 h-5" />
            <span>Açık</span>
          </div>
          <button
            onClick={async () => {
              if (subscription) {
                await subscription.unsubscribe();
                setSubscription(null);
                setIsSubscribed(false);
                // Optional: Notify backend to remove subscription
                // await fetch('/api/notifications/unsubscribe', ...)
              }
            }}
            className="bg-surface-lighter hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-border text-foreground-muted py-3 px-4 rounded-xl transition-all cursor-pointer font-display flex items-center justify-center active:scale-95"
            title="Bildirimleri Kapat"
          >
            <BellOff className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
