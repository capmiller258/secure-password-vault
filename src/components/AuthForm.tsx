// src/components/AuthForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuth(); // Get the login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong!');

      if (isLoginMode) {
        // Use the context's login function
        // It will derive the key and save the token
        login(data.token, password);
        router.push('/vault'); // Redirect to the vault
      } else {
        alert('Signup successful! Please login.');
        setIsLoginMode(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... the rest of the component (toggleMode and JSX) remains the same
  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... all your JSX for the form ... */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
        {isLoginMode ? 'Login' : 'Sign Up'}
      </h2>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
        </button>
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={toggleMode}
          className="font-medium text-sm text-indigo-600 hover:text-indigo-500"
        >
          {isLoginMode
            ? 'Need an account? Sign Up'
            : 'Have an account? Login'}
        </button>
      </div>
    </form>
  );
}