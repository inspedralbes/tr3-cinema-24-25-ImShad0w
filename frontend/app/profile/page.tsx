'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#18181b] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#27272a] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center">
              {user.provider_avatar ? (
                <img
                  src={user.provider_avatar}
                  alt={user.name}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                {user.provider && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2">
                    {user.provider === 'google' ? 'Google' : user.provider}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-600 pt-8">
              <h2 className="text-lg font-medium text-white mb-4">Account Information</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Member since</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Email verified</dt>
                  <dd className="mt-1 text-sm text-white">
                    {user.email_verified_at ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 border-t border-gray-600 pt-8">
              <h2 className="text-lg font-medium text-white mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                  href="/profile/tickets"
                  className="block p-4 border border-gray-600 rounded-lg hover:border-indigo-500 transition-colors"
                >
                  <h3 className="text-sm font-medium text-white">My Tickets</h3>
                  <p className="mt-1 text-sm text-gray-400">View your ticket purchase history</p>
                </a>
                <a
                  href="/event"
                  className="block p-4 border border-gray-600 rounded-lg hover:border-indigo-500 transition-colors"
                >
                  <h3 className="text-sm font-medium text-white">Browse Events</h3>
                  <p className="mt-1 text-sm text-gray-400">Find upcoming events</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}