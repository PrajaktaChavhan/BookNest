import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until we've checked for an existing session

  useEffect(() => {
    // On app load, check if a valid httpOnly cookie already exists from a
    // previous visit - this is how "stay logged in on refresh" works with
    // cookie-based auth instead of localStorage.
    authApi
      .getCurrentUser()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials) {
    const res = await authApi.loginUser(credentials);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(details) {
    const res = await authApi.registerUser(details);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    await authApi.logoutUser();
    setUser(null);
  }

  async function refreshUser() {
    const res = await authApi.getCurrentUser();
    setUser(res.data.user);
    return res.data.user;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
