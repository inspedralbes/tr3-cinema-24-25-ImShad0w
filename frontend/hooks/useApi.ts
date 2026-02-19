import { useState, useCallback } from "react";

const API_BASE_URL = "http://localhost:8000/api";

export function useEvents() {
  const getEvents = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/event`);
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  }, []);

  const getEvent = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`);
    if (!response.ok) throw new Error("Failed to fetch event");
    return response.json();
  }, []);

  const getEventSeats = useCallback(async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/seats`);
    if (!response.ok) throw new Error("Failed to fetch seats");
    return response.json();
  }, []);

  return { getEvents, getEvent, getEventSeats };
}

export function useSeats() {
  const reserveSeats = useCallback(async (seatIds: number[], userId: string) => {
    const response = await fetch(`${API_BASE_URL}/seats/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seat_ids: seatIds, user_id: userId }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to reserve seats");
    }
    return response.json();
  }, []);

  return { reserveSeats };
}
