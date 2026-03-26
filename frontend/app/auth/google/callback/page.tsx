'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The OAuth callback returns JSON with user and token
        // We need to extract the token from the URL or make a request
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback${window.location.search}`);
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/');
        } else {
          throw new Error('No token received');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#27272a] rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Authentication Error</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#27272a] rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Authenticating...</h2>
          <p className="text-gray-400">Please wait while we complete your sign in.</p>
        </div>
      </div>
    </div>
  );
}