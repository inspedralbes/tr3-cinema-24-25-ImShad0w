"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import SeatMap from "@/components/sections/SeatMap";
import { ChevronLeft, X, Timer } from "lucide-react";
import Link from "next/link";
import { useSocket } from "../../../../hooks/useSocket";
import { useEventSeats } from "../../../../hooks/useEventSeats";

type Seat = {
  id: number;
  seat_number: number;
  status: "available" | "reserved" | "sold";
}

export default function ReservePage() {
  const params = useParams();
  const eventId = params.id as string;

  const { seats, loading, error, fetchSeats, updateSeatsFromSocket } = useEventSeats(eventId);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [reservedSeats, setReservedSeats] = useState<Seat[]>([]);
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const handleSeatsUpdated = useCallback((data: any) => {
    updateSeatsFromSocket(data.seatIds, data.status);
    
    if (data.status === "available") {
      setReservedSeats(prev => prev.filter(s => !data.seatIds.includes(s.id)));
      setTimeLeft(null);
    }
  }, [updateSeatsFromSocket]);

  const handleReserveSuccess = useCallback((data: any) => {
    console.log("Reserve success received:", data);
    console.log("Current seats:", seats);
    const reserved = seats.filter(s => data.seatIds.includes(s.id));
    console.log("Filtered reserved seats:", reserved);
    setReservedSeats(reserved);
    setSelectedSeats([]);
    setReserveSuccess(true);
    setReserveError(null);
    setTimeLeft(5 * 60);
  }, [seats]);

  const handleReserveError = useCallback((data: any) => {
    setReserveError(data.message);
    setReserveSuccess(false);
  }, []);

  const handleBuySuccess = useCallback((data: any) => {
    setReservedSeats([]);
    setBuySuccess(true);
    setReserveSuccess(false);
    setTimeLeft(null);
  }, []);

  const handleBuyError = useCallback((data: any) => {
    setReserveError(data.message);
  }, []);

  const handleReservationExpired = useCallback((data: any) => {
    setReservedSeats([]);
    setReserveSuccess(false);
    setReserveError("La teva reserva ha expirat");
    setTimeLeft(null);
  }, []);

  const { selectSeat, removeSeat, reserveSeats, buySeats, isConnected, enterEvent, leaveEvent } = useSocket({
    onSeatsUpdated: handleSeatsUpdated,
    onReserveSuccess: handleReserveSuccess,
    onReserveError: handleReserveError,
    onBuySuccess: handleBuySuccess,
    onBuyError: handleBuyError,
    onReservationExpired: handleReservationExpired,
    onEnterEventSuccess: () => {
      fetchSeats();
    },
    onEnterQueue: () => {},
  });

  const hasCalledEnterEvent = useRef(false);

  useEffect(() => {
    if (isConnected && !hasCalledEnterEvent.current) {
      hasCalledEnterEvent.current = true;
      enterEvent(eventId);
    }
  }, [isConnected, eventId, enterEvent]);

  // Cleanup: leave event when leaving the page
  useEffect(() => {
    return () => {
      if (hasCalledEnterEvent.current) {
        leaveEvent();
      }
    };
  }, [leaveEvent]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === "reserved" || seat.status === "sold") return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      removeSeat(seat.id);
    } else {
      setSelectedSeats(prev => [...prev, seat]);
      selectSeat(seat.id);
    }
  };

  const handleRemoveSeat = (seatId: number) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
    removeSeat(seatId);
  };

  const handleReserve = () => {
    if (selectedSeats.length === 0) return;
    setReserveError(null);
    const seatIds = selectedSeats.map(s => s.id);
    const userId = `user-${Date.now()}`;
    reserveSeats(seatIds, userId);
  };

  const handleBuy = () => {
    if (reservedSeats.length === 0) return;
    setReserveError(null);
    buySeats();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !isConnected) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#71717a]">{isConnected ? "Carregant mapa de seients..." : "Connectant..."}</div>
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
          href={`/event/${eventId}`}
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
                selectedSeats={[...selectedSeats, ...reservedSeats]}
                onSeatSelect={handleSeatSelect}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6">
              <h2 className="text-white font-medium mb-4">Seients</h2>

              {reservedSeats.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#f97316] font-medium">Seients Reservats</span>
                    {timeLeft !== null && (
                      <div className="flex items-center gap-1 text-[#f97316]">
                        <Timer className="w-4 h-4" />
                        <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    {reservedSeats.map(seat => (
                      <div key={seat.id} className="flex items-center justify-between bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg px-4 py-3">
                        <span className="text-white">Seient {seat.seat_number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSeats.length > 0 && (
                <div className="mb-4">
                  <span className="text-[#a1a1aa] font-medium block mb-2">Seients Seleccionats</span>
                  <div className="space-y-2 mb-4">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex items-center justify-between bg-[#27272a] rounded-lg px-4 py-3">
                        <span className="text-white">Seient {seat.seat_number}</span>
                        <button
                          onClick={() => handleRemoveSeat(seat.id)}
                          className="text-[#71717a] hover:text-[#ef4444] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSeats.length === 0 && reservedSeats.length === 0 && (
                <p className="text-[#71717a] mb-4">Fes clic als seients per seleccionar-los</p>
              )}

              {reserveError && (
                <div className="mb-4 p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg">
                  <p className="text-[#ef4444] text-sm">{reserveError}</p>
                </div>
              )}

              {reserveSuccess && !buySuccess && (
                <div className="mb-4 p-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg">
                  <p className="text-[#22c55e] text-sm">Seients reservats! Tens 5 min per comprar.</p>
                </div>
              )}

              {buySuccess && (
                <div className="mb-4 p-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg">
                  <p className="text-[#22c55e] text-sm">Compra realitzada correctament!</p>
                </div>
              )}

              {!isConnected && (
                <div className="mb-4 p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
                  <p className="text-[#f59e0b] text-sm">Connectant...</p>
                </div>
              )}

              {reservedSeats.length > 0 && (
                <div className="space-y-3">
                  <button 
                    onClick={handleBuy}
                    disabled={!isConnected}
                    className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                  >
                    Comprar Ara
                  </button>
                </div>
              )}

              {selectedSeats.length > 0 && reservedSeats.length === 0 && (
                <div className="space-y-3">
                  <button 
                    onClick={handleReserve}
                    disabled={!isConnected}
                    className="w-full bg-[#f97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                  >
                    Reservar
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
