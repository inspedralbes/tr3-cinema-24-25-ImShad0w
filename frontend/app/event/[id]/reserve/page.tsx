"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SeatMap from "@/components/sections/SeatMap";
import { Ticket, ChevronLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
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
  }, [params.id])

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      }
      return [...prev, seat];
    });
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-12 w-full">
              <SeatMap 
                seats={seats} 
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <Ticket className="w-5 h-5 text-[#f97316]" />
                <h2 className="text-lg font-medium text-white">Booking Details</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-20 bg-[#27272a] rounded-lg flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Movie Title</h3>
                    <p className="text-[#71717a] text-sm">VIP Screening</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[#a1a1aa] text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Cinema Hall 1</span>
                </div>
                
                <div className="flex items-center gap-2 text-[#a1a1aa] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Today, 7:30 PM</span>
                </div>
              </div>

              <div className="border-t border-[#27272a] pt-4 mb-4">
                <h3 className="text-white font-medium mb-3">Selected Seats</h3>
                {selectedSeats.length === 0 ? (
                  <p className="text-[#71717a] text-sm">Click on available seats to select them</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <span 
                        key={seat.id}
                        className="bg-[#f97316]/20 text-[#f97316] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {seat.seat_number}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#27272a]">
                <span className="text-[#71717a]">Total</span>
                <span className="text-white font-semibold text-lg">${selectedSeats.length * 12}.00</span>
              </div>

              <button 
                disabled={selectedSeats.length === 0}
                className="w-full bg-[#f97316] hover:bg-orange-600 disabled:bg-[#3f3f46] disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
