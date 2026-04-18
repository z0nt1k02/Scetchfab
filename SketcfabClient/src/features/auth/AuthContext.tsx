import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthUser } from '../../types';

interface AuthContextValue {
  user: AuthUser | null;
  refresh: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function decodeJwt(token: string): AuthUser | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now) return null;
    const id =
      payload.nameid ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const nickname =
      payload.unique_name ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    const role =
      payload.role ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (!id || !nickname) return null;
    return { id: String(id), nickname: String(nickname), role: role ? String(role) : undefined };
  } catch {
    return null;
  }
}

function readUserFromCookie(): AuthUser | null {
  const token = readCookie('token');
  return token ? decodeJwt(token) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUserFromCookie());

  const refresh = () => setUser(readUserFromCookie());

  const logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setUser(null);
  };

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <AuthContext.Provider value={{ user, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
