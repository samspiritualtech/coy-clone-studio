import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * Mounted once inside the router. Keeps native push listeners alive for the whole
 * app session (token refresh + notification taps) and renders nothing.
 * Inert on the plain web build.
 */
export const PushNotificationManager = () => {
  usePushNotifications();
  return null;
};
