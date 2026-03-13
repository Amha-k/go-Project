'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company } from '@/types';
import { getAuthToken, removeAuthToken, removeUserType } from '@/lib/utils';

interface AuthContextType {
  user: User | Company | null;
  userType: 'user' | 'company' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | Company | null) => void;
  setUserType: (type: 'user' | 'company' | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | Company | null>(null);
  const [userType, setUserType] = useState<'user' | 'company' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // TODO: Fetch user data from API using token
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setUserType(null);
    removeAuthToken();
    removeUserType();
  };

  const value: AuthContextType = {
    user,
    userType,
    isLoading,
    isAuthenticated: !!user && !!getAuthToken(),
    setUser,
    setUserType,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
