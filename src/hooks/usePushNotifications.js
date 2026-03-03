import { useEffect, useRef } from 'react';
import { pushAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const usePushNotifications = () => {
  const { user } = useAuth();
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (!user || subscribedRef.current) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (!user.notificationPrefs?.push) return;

    const subscribe = async () => {
      try {
        const { data } = await pushAPI.getVapidKey();
        if (!data.publicKey) return; // VAPID not configured

        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          // Already subscribed — just register with our server (idempotent)
          await pushAPI.subscribe(existing.toJSON()).catch(() => {});
          subscribedRef.current = true;
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });

        await pushAPI.subscribe(subscription.toJSON());
        subscribedRef.current = true;
      } catch (err) {
        console.warn('[Push] subscription failed:', err.message);
      }
    };

    subscribe();
  }, [user]);
};
