import { useState, useEffect, useCallback } from "react";

type Seat = {
  id: number;
  seat_number: number;
  status: "available" | "reserved" | "sold";
}

const API_BASE_URL = "http://localhost:8000/api";

interface UseEventSeatsReturn {
  seats: Seat[];
  loading: boolean;
  error: string | null;
  fetchSeats: () => Promise<void>;
  updateSeatsFromSocket: (seatIds: number[], status: Seat["status"]) => void;
}

export function useEventSeats(eventId: string): UseEventSeatsReturn {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/event/${eventId}/seats`);
      if (!response.ok) {
        throw new Error("Failed to fetch seats");
      }
      const data = await response.json();
      setSeats(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const updateSeatsFromSocket = useCallback((seatIds: number[], status: string) => {
    setSeats(prev => 
      prev.map(seat => 
        seatIds.includes(seat.id) 
          ? { ...seat, status: status as Seat["status"] } 
          : seat
      )
    );
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchSeats();
    }
  }, [eventId, fetchSeats]);

  return {
    seats,
    loading,
    error,
    fetchSeats,
    updateSeatsFromSocket,
  };
}
