// Data structures and interfaces
export interface Event {
  eventId: string;
  activeUsers: string[];
  maxCapacity: number;
}

export interface User {
  socketId: string;
  eventId: string | null;
  selectedSeats: number[];
  reservedSeats: number[];
  reservationTime: number | null;
}

export interface Queue {
  eventId: string;
  waitingUsers: string[];
}

// Data storage
export const events: Event[] = [];
export const users: User[] = [];
export const queues: Queue[] = [];

// Room management helpers
export function getEventRoom(eventId: string): string {
  return `event:${eventId}`;
}

export function getQueueRoom(eventId: string): string {
  return `queue:${eventId}`;
}
