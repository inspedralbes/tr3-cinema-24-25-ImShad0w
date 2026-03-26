'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: number;
  name: string;
  email: string;
  ticket_code: string;
  price: number;
  created_at: string;
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
  seat: {
    id: number;
    seat_number: string;
    row: string;
  };
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/tickets?page=${currentPage}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data.data);
        setTotalPages(data.last_page);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to load tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [router, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="text-white">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Tickets</h1>
          <p className="text-gray-400 mt-1">Your ticket purchase history</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-[#27272a] rounded-lg p-8 text-center">
            <p className="text-gray-400">No tickets found</p>
            <a
              href="/event"
              className="mt-4 inline-block text-indigo-400 hover:text-indigo-300"
            >
              Browse events
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-[#27272a] rounded-lg p-6 border border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {ticket.event.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(ticket.event.date).toLocaleDateString()} • {ticket.event.location}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Seat: {ticket.seat.row}{ticket.seat.seat_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      €{ticket.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Code: {ticket.ticket_code}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Purchased: {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#3f3f46] rounded-md hover:bg-[#52525b] disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#3f3f46] rounded-md hover:bg-[#52525b] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}