// frontend/src/hooks/useAuth.ts
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

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
  
  return context;
}