import { useState, useEffect, useCallback } from "react";

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  seats_count: number;
}

const API_BASE_URL = "http://localhost:8000/api";

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/event`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
}

interface UseEventReturn {
  event: Event | null;
  loading: boolean;
  error: string | null;
  fetchEvent: () => Promise<void>;
}

export function useEvent(eventId: string): UseEventReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      setEvent(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, fetchEvent]);

  return {
    event,
    loading,
    error,
    fetchEvent,
  };
}
