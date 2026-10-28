// Real JWT authentication.
// - login/register call the backend and store the returned token
// - on page load, an existing token is checked with GET /api/auth/me
// - if the backend rejects the token later (401), the user is logged out
import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/apiClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while we check a saved token, so protected pages do not flash the login page
  const [checking, setChecking] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    if (!tokenStorage.get()) return;
    authService.me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setChecking(false));
  }, []);

  // apiClient fires this event when any request gets a 401.
  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const startSession = ({ token, user: loggedInUser }) => {
    tokenStorage.set(token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const login = async (email, password) => startSession(await authService.login({ email, password }));
  const register = async (data) => startSession(await authService.register(data));

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  const updateProfile = async (changes) => {
    const updated = await authService.updateMe(changes);
    setUser(updated);
    return updated;
  };

  if (checking) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
