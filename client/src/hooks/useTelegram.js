import { useEffect, useState } from 'react';

/**
 * useTelegram hook
 * Extracts Telegram user ID and initData from Telegram Web App
 * Falls back to a default ID for testing if not in Telegram context
 */
const useTelegram = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [initData, setInitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Get user object from Telegram (may include id, first_name, last_name, username)
      const tgUser = webApp.initDataUnsafe?.user || null;
      if (tgUser) {
        setUser(tgUser);
        if (tgUser.id) setUserId(tgUser.id);
      }

      // Store init data for server verification
      setInitData(webApp.initData);

      // Notify Telegram that app is ready
      webApp.ready?.();
    } else {
      // Provide a sensible fallback user for local development
      const devUser = {
        id: 12345,
        first_name: 'Dev',
        last_name: 'User',
        username: 'dev_user',
      };
      setUser(devUser);
      setUserId(devUser.id);
      console.warn(
        'Telegram WebApp not available, using fallback user id: 12345',
      );
    }

    setLoading(false);
  }, []);

  return { user, userId, initData, loading };
};

export default useTelegram;
