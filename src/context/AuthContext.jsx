import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, getStoredToken, setStoredToken } from '../services/api';

const AuthContext = createContext();
const USER_KEY = 'sd_user_data';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => user?.theme || localStorage.getItem('sd-theme') || 'dreamy');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('sd-theme', theme);
  }, [theme]);

  // Verify stored session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest('/api/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
          if (res.user.theme) setTheme(res.user.theme);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        setStoredToken(null);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  async function signup(name, email, password, selectedTheme) {
    try {
      const res = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          theme: selectedTheme,
        }),
      });

      if (res.success && res.token) {
        setStoredToken(res.token);
        setUser(res.user);
        setTheme(res.user.theme || selectedTheme);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Could not complete signup.' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to sign up.' };
    }
  }

  async function login(email, password) {
    try {
      const res = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.token) {
        setStoredToken(res.token);
        setUser(res.user);
        setTheme(res.user.theme || 'dreamy');
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: res.message || "Hmm... those details don't match this diary ♡" };
    } catch (err) {
      return { success: false, message: err.message || "Hmm... those details don't match this diary ♡" };
    }
  }

  function logout() {
    setStoredToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function updateUser(updates) {
    try {
      const res = await apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.user.theme) setTheme(res.user.theme);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.error('Update profile error:', err);
    }
    // Optimistic fallback
    const next = { ...user, ...updates };
    setUser(next);
    if (next.theme) setTheme(next.theme);
    localStorage.setItem(USER_KEY, JSON.stringify(next));
  }

  const changeTheme = async (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem('sd-theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    if (user) {
      await updateUser({ theme: nextTheme });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, theme, setTheme, changeTheme, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
