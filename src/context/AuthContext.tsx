// src/context/AuthContext.tsx

'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { deriveKey } from '@/lib/crypto';

interface AuthContextType {
  token: string | null;
  encryptionKey: string | null;
  login: (token: string, masterPassword: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);

  const login = (newToken: string, masterPassword: string) => {
    // When the user logs in, derive the key and store it along with the token
    const key = deriveKey(masterPassword);
    setToken(newToken);
    setEncryptionKey(key);
    localStorage.setItem('token', newToken); // Also save token for session persistence
  };

  const logout = () => {
    setToken(null);
    setEncryptionKey(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, encryptionKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}