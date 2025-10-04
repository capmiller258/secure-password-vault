// src/app/vault/page.tsx

'use client';

import PasswordGenerator from '@/components/PasswordGenerator';
import VaultDisplay from '@/components/VaultDisplay'; // Import the new component
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VaultPage() {
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // A simple check to redirect if the token disappears
    if (!localStorage.getItem('token')) {
      router.replace('/');
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Vault</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Logout</button>
        </div>
        <p className="mt-2 text-gray-600">Welcome to your secure vault.</p>

        <PasswordGenerator />
        <VaultDisplay />
      </div>
    </div>
  );
}