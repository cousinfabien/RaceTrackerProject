import { useEffect } from 'react';

import { getMe } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export default function AuthInitializer() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        return;
      }

      try {
        const user = await getMe();

        setUser(user);
      } catch {
        logout();
      }
    };

    initializeAuth();
  }, [token, setUser, logout]);

  return null;
}
