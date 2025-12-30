// frontend/src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login, register } from '../api/auth.api';
import type { LoginPayload, RegisterPayload } from '../api/auth.api';

export default function useAuth() {
  const context = useContext(AuthContext);

  // If AuthContext doesn't exist yet, return a safe default
  if (!context) {
    console.warn('AuthContext not found. Using default values.');
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({ success: false, message: 'Auth not initialized' }),
      logout: () => {},
      register: async () => ({ success: false, message: 'Auth not initialized' }),
    };
  }

  const { user, loadingMe, setToken, refreshMe, logout } = context;
  const isAuthenticated = !!user;
  const isLoading = loadingMe;

  const loginFunc = async (payload: LoginPayload) => {
    try {
      const res = await login(payload);
      setToken(res.data.token);
      await refreshMe();
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.response?.data?.message || 'Login failed' };
    }
  };

  const registerFunc = async (payload: RegisterPayload) => {
    try {
      const res = await register(payload);
      setToken(res.data.token);
      await refreshMe();
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.response?.data?.message || 'Register failed' };
    }
  };

  return { user, isAuthenticated, isLoading, login: loginFunc, logout, register: registerFunc };
}
