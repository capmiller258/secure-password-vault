// src/app/page.tsx

import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <AuthForm />
      </div>
    </main>
  );
}