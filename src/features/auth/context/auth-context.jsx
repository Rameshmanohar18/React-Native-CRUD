import { createContext, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { createJwt, readJwtPayload } from '../services/jwt-service';

const STORAGE_KEY = 'admincrud.auth';
const DEFAULT_ADMIN = {
  id: 'admin-1',
  name: 'Store Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'Admin',
};

const AuthContext = createContext(null);

function getStoredAuth() {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
}

function saveStoredAuth(value) {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function AuthProvider({ children }) {
  const storedAuth = getStoredAuth();
  const [admins, setAdmins] = useState(storedAuth?.admins ?? [DEFAULT_ADMIN]);
  const [token, setToken] = useState(storedAuth?.token ?? null);

  const currentAdmin = useMemo(() => {
    if (!token) {
      return null;
    }

    return readJwtPayload(token);
  }, [token]);

  const persist = (nextAdmins, nextToken) => {
    saveStoredAuth({ admins: nextAdmins, token: nextToken });
  };

  const register = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = admins.some((admin) => admin.email.toLowerCase() === normalizedEmail);

    if (emailExists) {
      return { ok: false, error: 'An admin account already exists for this email.' };
    }

    const newAdmin = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'Admin',
    };
    const nextAdmins = [newAdmin, ...admins];
    const nextToken = createJwt(newAdmin);

    setAdmins(nextAdmins);
    setToken(nextToken);
    persist(nextAdmins, nextToken);

    return { ok: true };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const admin = admins.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!admin) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const nextToken = createJwt(admin);

    setToken(nextToken);
    persist(admins, nextToken);

    return { ok: true };
  };

  const logout = () => {
    setToken(null);
    persist(admins, null);
  };

  const value = {
    currentAdmin,
    isAuthenticated: Boolean(token),
    jwtToken: token,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return value;
}
