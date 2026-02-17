"use client"

//Only the reserve page should have the socket-io realtime capabilities
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import SeatMap from "@/components/sections/SeatMap";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Socket } from "socket.io-client";

type Seat = {
  id: number;
  seat_number: number;
  status: "available" | "reserved" | "sold";
}

export default function ReservePage() {
  const params = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    async function fetchSeats() {
      try {
        const response = await fetch(`http://localhost:8000/api/event/${params.id}/seats`)
        if (!response.ok) {
          throw new Error("Failed to fetch event")
        }
        const data = await response.json()
        setSeats(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchSeats()
    return () => {
      socketRef.current?.disconnect()
    }
  }, [params.id])

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      }
      return [...prev, seat];
    });
    // Emit to socket
    if (socketRef.current) {
      socketRef.current.emit("message", {
        data: seat.id,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#71717a]">Loading seat map...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#ef4444] bg-[#27272a] px-6 py-4 rounded-lg border border-[#3f3f46]">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!seats.length) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#71717a]">No seats available for this event</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href={`/event/${params.id}`}
          className="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to event</span>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-12">
            <SeatMap
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              disabled={selectedSeats.length === 0}
              className="bg-[#f97316] hover:bg-orange-600 disabled:bg-[#3f3f46] disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl transition-colors"
            >
              Proceed to Checkout ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
