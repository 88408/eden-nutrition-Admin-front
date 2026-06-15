import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: string[];
  setAuth: (token: string, user: User, permissions?: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  permissions: localStorage.getItem('permissions')
    ? JSON.parse(localStorage.getItem('permissions')!)
    : [],
  setAuth: (token, user, permissions = []) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('permissions', JSON.stringify(permissions));
    set({ token, user, permissions });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    set({ token: null, user: null, permissions: [] });
  },
}));
