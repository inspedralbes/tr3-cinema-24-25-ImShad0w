"use client"

import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import SeatMap from "@/components/sections/SeatMap";
import { ChevronLeft, X } from "lucide-react";
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
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      if (socketRef.current) {
        socketRef.current.emit("removeSeat", {
          socket: socketRef.current.id,
          seatId: seat.id,
        });
      }
    } else {
      setSelectedSeats(prev => [...prev, seat]);
      if (socketRef.current) {
        socketRef.current.emit("selectSeat", {
          socket: socketRef.current.id,
          data: seat.id,
        });
      }
    }
  };

  const removeSeat = (seatId: number) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
    if (socketRef.current) {
      socketRef.current.emit("removeSeat", {
        socket: socketRef.current.id,
        data: seatId,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#71717a]">Carregant mapa de seients...</div>
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
        <div className="text-[#71717a]">No hi ha seients disponibles per a aquest esdeveniment</div>
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
          <span>Tornar a l'esdeveniment</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-12">
              <SeatMap
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6">
              <h2 className="text-white font-medium mb-4">Seients Seleccionats</h2>

              {selectedSeats.length === 0 ? (
                <p className="text-[#71717a]">Fes clic als seients per seleccionar-los</p>
              ) : (
                <div className="space-y-2 mb-6">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex items-center justify-between bg-[#27272a] rounded-lg px-4 py-3">
                      <span className="text-white">Seient {seat.seat_number}</span>
                      <button
                        onClick={() => removeSeat(seat.id)}
                        className="text-[#71717a] hover:text-[#ef4444] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedSeats.length > 0 && (
                <div className="space-y-3">
                  <button className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                    Reservar
                  </button>
                  <button className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-medium py-3 px-6 rounded-xl transition-colors">
                    Comprar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
