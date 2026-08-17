import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import { getMe } from '@/api/userApi';
export const AuthContext = createContext(null);

const TOKEN_KEY = 'earnhub_token';
const USER_KEY = 'earnhub_user';

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);

    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) return;

    try {
      const res = await getMe(authToken);
      const userData = res.data?.user || res.data;

      if (userData) {
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        await fetchUser(token);
      }

      setLoading(false);
    };

    loadUser();
  }, [token, fetchUser]);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    if (token) {
      return fetchUser(token);
    }

    return Promise.resolve();
  }, [token, fetchUser]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, token, loading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}