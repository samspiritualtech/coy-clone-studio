import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type PushPermission = 'unsupported' | 'prompt' | 'granted' | 'denied';

const LAST_TOKEN_KEY = 'ogura_push_token';

/**
 * Native Android/iOS push registration for the Capacitor app.
 * On the plain web build this hook stays inert (`isNative === false`).
 */
export function usePushNotifications() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isNative = Capacitor.isNativePlatform();
  const [permission, setPermission] = useState<PushPermission>(isNative ? 'prompt' : 'unsupported');
  const [token, setToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const listenersBound = useRef(false);

  const saveToken = useCallback(async (fcmToken: string) => {
    const previous = localStorage.getItem(LAST_TOKEN_KEY);
    const { error } = await supabase.functions.invoke('register-device-token', {
      body: {
        token: fcmToken,
        platform: Capacitor.getPlatform(),
        device_info: { platform: Capacitor.getPlatform(), ua: navigator.userAgent },
        previous_tokens: previous && previous !== fcmToken ? [previous] : [],
      },
    });

    if (error) {
      console.error('Failed to register device token:', error);
      return;
    }
    localStorage.setItem(LAST_TOKEN_KEY, fcmToken);
    setToken(fcmToken);
  }, []);

  // Bind native listeners once — they must survive a token refresh and app relaunch.
  useEffect(() => {
    if (!isNative || listenersBound.current) return;
    listenersBound.current = true;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { PushNotifications } = await import('@capacitor/push-notifications');

      const registration = await PushNotifications.addListener('registration', (t) => {
        // Fires on first registration AND whenever FCM rotates the token.
        void saveToken(t.value);
      });

      const registrationError = await PushNotifications.addListener('registrationError', (err) => {
        console.error('Push registration error:', JSON.stringify(err));
      });

      const tapped = await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action) => {
          const path = (action.notification?.data as Record<string, string> | undefined)?.path;
          if (typeof path === 'string' && path.startsWith('/')) {
            navigate(path);
          }
        },
      );

      // Any notification delivered while the app is in the foreground.
      const received = await PushNotifications.addListener('pushNotificationReceived', (n) => {
        console.info('Push received in foreground:', n.title);
      });

      cleanup = () => {
        void registration.remove();
        void registrationError.remove();
        void tapped.remove();
        void received.remove();
      };
    })();

    return () => cleanup?.();
  }, [isNative, navigate, saveToken]);

  /** Requests the Android 13+ POST_NOTIFICATIONS permission and registers with FCM. */
  const enablePush = useCallback(async (): Promise<PushPermission> => {
    if (!isNative) {
      setPermission('unsupported');
      return 'unsupported';
    }
    setIsRegistering(true);
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');

      let status = await PushNotifications.checkPermissions();
      if (status.receive === 'prompt' || status.receive === 'prompt-with-rationale') {
        status = await PushNotifications.requestPermissions();
      }

      if (status.receive !== 'granted') {
        setPermission('denied');
        return 'denied';
      }

      // Channel used by the server payload so notifications show while backgrounded.
      if (Capacitor.getPlatform() === 'android') {
        try {
          await PushNotifications.createChannel({
            id: 'ogura_collections',
            name: 'New Collections',
            description: 'Alerts when OGURA publishes a new collection',
            importance: 5,
            visibility: 1,
          });
        } catch (e) {
          console.warn('Could not create notification channel:', e);
        }
      }

      await PushNotifications.register();
      setPermission('granted');
      return 'granted';
    } catch (e) {
      console.error('enablePush failed:', e);
      setPermission('denied');
      return 'denied';
    } finally {
      setIsRegistering(false);
    }
  }, [isNative]);

  // Auto-register once the user is signed in and has already granted permission,
  // so a refreshed token is always re-persisted for the current account.
  useEffect(() => {
    if (!isNative || !isAuthenticated || !user?.id) return;
    (async () => {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const status = await PushNotifications.checkPermissions();
      if (status.receive === 'granted') {
        setPermission('granted');
        await PushNotifications.register();
      } else {
        setPermission(status.receive === 'denied' ? 'denied' : 'prompt');
      }
    })();
  }, [isNative, isAuthenticated, user?.id]);

  return { isNative, permission, token, isRegistering, enablePush };
}
